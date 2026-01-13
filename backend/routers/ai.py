from fastapi import APIRouter, Depends, HTTPException
import os
import json

import models
from authorization.oauth2 import get_current_user
from schema import (
    StressPredictionRequest,
    StressPredictionResponse,
    StressPredictionDayOutput
)

import google.generativeai as genai

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
        
        daily_stress = [
            StressPredictionDayOutput(
                day=d["day"],
                # If there are no deadlines or hours, stress must be 0
                stressLevel=0 if (
                    workload_by_day.get(d["day"]) and 
                    workload_by_day[d["day"]].deadlines == 0 and 
                    workload_by_day[d["day"]].hours == 0
                ) else max(0, min(int(d["stressLevel"]), 100)),
            )
            for d in data["daily_stress"]
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