from fastapi import APIRouter, Depends, HTTPException
import os
import json

import models
from authorization.oauth2 import get_current_user
from schema import (
    StressPredictionRequest,
    StressPredictionResponse,
    StressPredictionDayOutput,
    PrioritiesRequest,
    PrioritiesResponse,
    PriorityTaskOutput,
)

import google.generativeai as genai
from datetime import date

GEMINI_KEY = os.getenv("GEMINI_KEY")
if not GEMINI_KEY:
    raise RuntimeError("GEMINI_KEY not found in environment variables")

genai.configure(api_key=GEMINI_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")
router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/stress-prediction", response_model=StressPredictionResponse)
def predict_stress(request: StressPredictionRequest, current_user: models.User = Depends(get_current_user)):
    prompt_payload = {
        "weekly_load": [
            {
                "day": d.day,
                "hours": d.hours,
                "deadlines": d.deadlines,
            }
            for d in request.weekly_load
        ],
        "rules": {
            "stress_scale": "0-100",
            "available_hours_per_day": 8,
        },
    }

    prompt = f"""
You are an assistant that predicts perceived human stress.

Given the following workload data, estimate perceived stress per day on a scale of 0 to 100.

Return STRICT JSON ONLY in the following format:

{{
  "daily_stress": [
    {{ "day": "Mon", "stressLevel": 42 }}
  ],
  "weekly_stress_score": 55,
  "peak_stress_day": "Mon",
  "explanation": "Short human-readable explanation"
}}

IMPORTANT: Do NOT include "risk_level" in your response. The system will calculate it automatically.

Workload data:
{json.dumps(prompt_payload, indent=2)}
"""

    # ----------------------------
    # Call Gemini
    # ----------------------------

    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Gemini sometimes wraps JSON in ```json ... ```
        if raw_text.startswith("```"):
            raw_text = raw_text.strip("`")
            raw_text = raw_text.replace("json", "", 1).strip()

        data = json.loads(raw_text)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini stress prediction failed: {str(e)}"
        )

    # ----------------------------
    # Validate & normalize output
    # ----------------------------

    try:
        # Create a mapping of day to workload for validation
        workload_by_day = {d.day: d for d in request.weekly_load}
        
        # First pass: get raw stress levels
        raw_stress_levels = []
        for d in data["daily_stress"]:
            # If there are no deadlines or hours, stress must be 0
            if (workload_by_day.get(d["day"]) and 
                workload_by_day[d["day"]].deadlines == 0 and 
                workload_by_day[d["day"]].hours == 0):
                stress_level = 0
            else:
                stress_level = max(0, min(int(d["stressLevel"]), 100))
            
            raw_stress_levels.append({
                "day": d["day"],
                "stressLevel": stress_level
            })
        
        # Calculate total stress to compute percentages
        total_stress = sum(d["stressLevel"] for d in raw_stress_levels)
        
        # Second pass: convert to percentages (distribution)
        if total_stress > 0:
            daily_stress = [
                StressPredictionDayOutput(
                    day=d["day"],
                    # Convert to percentage of total weekly stress
                    stressLevel=round((d["stressLevel"] / total_stress) * 100)
                )
                for d in raw_stress_levels
            ]
        else:
            # If no stress at all, distribute evenly (or all 0s)
            daily_stress = [
                StressPredictionDayOutput(
                    day=d["day"],
                    stressLevel=0
                )
                for d in raw_stress_levels
            ]

        weekly_stress_score = max(
            0, min(int(data["weekly_stress_score"]), 100)
        )

        # Calculate risk level strictly from weekly stress score
        if weekly_stress_score <= 30:
            risk_level = "low"
        elif weekly_stress_score <= 60:
            risk_level = "medium"
        else:
            risk_level = "high"

        peak_stress_day = data["peak_stress_day"]
        explanation = data["explanation"]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid Gemini response format: {str(e)}"
        )

    return StressPredictionResponse(
        daily_stress=daily_stress,
        weekly_stress_score=weekly_stress_score,
        risk_level=risk_level,
        peak_stress_day=peak_stress_day,
        explanation=explanation,
    )

@router.post("/priorities", response_model=PrioritiesResponse)
def generate_priorities(request: PrioritiesRequest, current_user: models.User = Depends(get_current_user)):
    today = date.today()

    # ----------------------------
    # Step 1: Deterministic scoring
    # ----------------------------
    scored_tasks = []

    for task in request.tasks:
        days_until_due = max((task.due_date - today).days, 0)

        urgency_score = max(0, 30 - days_until_due)  # closer deadline → higher score
        effort_score = min(task.estimated_effort * 2, 20)

        importance_map = {
            "low": 5,
            "medium": 10,
            "high": 20,
        }
        importance_score = importance_map.get(
            task.importance_level.lower(), 10
        )

        total_score = urgency_score + effort_score + importance_score

        scored_tasks.append({
            "task": task,
            "score": total_score,
        })

    scored_tasks.sort(key=lambda x: x["score"], reverse=True)

    # ----------------------------
    # Step 2: Ask Gemini for reasons
    # ----------------------------
    prompt_payload = [
        {
            "title": t["task"].title,
            "due_date": str(t["task"].due_date),
            "estimated_effort": t["task"].estimated_effort,
            "importance": t["task"].importance_level,
            "rank": idx + 1,
        }
        for idx, t in enumerate(scored_tasks)
    ]

    prompt = f"""
            You are an assistant that explains task prioritization.

            Given the ranked list of tasks below, explain briefly (1 sentence each)
            why each task is placed at its rank.

            Return STRICT JSON ONLY in this format:

            {{
            "priorities": [
                {{ "rank": 1, "reason": "..." }}
            ]
            }}

            Tasks:
            {json.dumps(prompt_payload, indent=2)}
            """

    try:
        response = model.generate_content(prompt)
        raw_text = response.text
        start = raw_text.find("{")
        end = raw_text.rfind("}") + 1
        data = json.loads(raw_text[start:end])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Gemini priorities explanation failed: {str(e)}"
        )

    # ----------------------------
    # Step 3: Build response
    # ----------------------------
    priorities = []
    for idx, item in enumerate(scored_tasks):
        priorities.append(
            PriorityTaskOutput(
                id=item["task"].id,
                title=item["task"].title,
                rank=idx + 1,
                reason=data["priorities"][idx]["reason"],
                estimated_effort=item["task"].estimated_effort,
                due_date=item["task"].due_date,
            )
        )

    return PrioritiesResponse(priorities=priorities)