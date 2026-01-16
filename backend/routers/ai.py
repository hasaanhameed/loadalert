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

from groq import Groq
from datetime import date

GROQ_KEY = os.getenv("GROQ_KEY")
if not GROQ_KEY:
    raise RuntimeError("GROQ_KEY not found in environment variables")

client = Groq(api_key=GROQ_KEY)
router = APIRouter(prefix="/ai", tags=["AI"])


# ----------------------------
# DETERMINISTIC STRESS CALCULATION
# ----------------------------

def calculate_daily_stress(hours: int, deadlines: int, max_hours: int = 12) -> int:
    """
    Deterministically calculate stress for a single day.
    
    Args:
        hours: Work hours scheduled for the day
        deadlines: Number of deadlines on that day
        max_hours: Maximum reasonable work hours per day
    
    Returns:
        Stress score from 0-100
    """
    if hours == 0 and deadlines == 0:
        return 0
    
    # Hours contribute up to 60 points (normalized by max_hours)
    hours_stress = min((hours / max_hours) * 60, 60)
    
    # Each deadline adds 10 points, up to 40 points max
    deadline_stress = min(deadlines * 10, 40)
    
    total_stress = hours_stress + deadline_stress
    
    return int(min(total_stress, 100))


def calculate_weekly_stress_score(daily_stress_values: list[int]) -> int:
    """
    Calculate overall weekly stress from daily values.
    Uses weighted average favoring peak stress days.
    
    Args:
        daily_stress_values: List of daily stress scores (0-100)
    
    Returns:
        Weekly stress score from 0-100
    """
    if not daily_stress_values or all(s == 0 for s in daily_stress_values):
        return 0
    
    # Sort to get top stress days
    sorted_stress = sorted(daily_stress_values, reverse=True)
    
    # Weighted calculation: top 3 days matter most
    if len(sorted_stress) >= 3:
        # Top day: 50%, 2nd: 30%, 3rd: 20%
        weighted_score = (
            sorted_stress[0] * 0.5 +
            sorted_stress[1] * 0.3 +
            sorted_stress[2] * 0.2
        )
    elif len(sorted_stress) == 2:
        weighted_score = (
            sorted_stress[0] * 0.6 +
            sorted_stress[1] * 0.4
        )
    else:
        weighted_score = sorted_stress[0]
    
    return int(min(weighted_score, 100))


def calculate_risk_level(weekly_stress_score: int) -> str:
    """
    Deterministically map weekly stress score to risk level.
    
    Args:
        weekly_stress_score: Score from 0-100
    
    Returns:
        "low", "medium", or "high"
    """
    if weekly_stress_score <= 35:
        return "low"
    elif weekly_stress_score <= 65:
        return "medium"
    else:
        return "high"


def find_peak_stress_day(daily_stress: list[dict]) -> str:
    """
    Find the day with highest stress.
    
    Args:
        daily_stress: List of dicts with 'day' and 'stressLevel' keys
    
    Returns:
        Day name (e.g., "Mon")
    """
    if not daily_stress:
        return "N/A"
    
    peak_day = max(daily_stress, key=lambda x: x['stressLevel'])
    return peak_day['day']


# ----------------------------
# STRESS PREDICTION ENDPOINT
# ----------------------------

@router.post("/stress-prediction", response_model=StressPredictionResponse)
def predict_stress(request: StressPredictionRequest, current_user: models.User = Depends(get_current_user)):
    
    # ----------------------------
    # Step 1: DETERMINISTIC calculation
    # ----------------------------
    
    daily_stress_raw = []
    for day_data in request.weekly_load:
        stress = calculate_daily_stress(day_data.hours, day_data.deadlines)
        daily_stress_raw.append({
            'day': day_data.day,
            'stressLevel': stress
        })
    
    # Calculate weekly score from daily values
    daily_values = [d['stressLevel'] for d in daily_stress_raw]
    weekly_stress_score = calculate_weekly_stress_score(daily_values)
    
    # Calculate risk level
    risk_level = calculate_risk_level(weekly_stress_score)
    
    # Find peak stress day
    peak_stress_day = find_peak_stress_day(daily_stress_raw)
    
    # Convert to percentage distribution for visualization
    total_stress = sum(daily_values)
    if total_stress > 0:
        daily_stress = [
            StressPredictionDayOutput(
                day=d['day'],
                stressLevel=round((d['stressLevel'] / total_stress) * 100)
            )
            for d in daily_stress_raw
        ]
    else:
        daily_stress = [
            StressPredictionDayOutput(
                day=d['day'],
                stressLevel=0
            )
            for d in daily_stress_raw
        ]
    
    # ----------------------------
    # Step 2: LLM for explanations
    # ----------------------------
    
    prompt_payload = {
        "weekly_load": [
            {
                "day": d.day,
                "hours": d.hours,
                "deadlines": d.deadlines,
            }
            for d in request.weekly_load
        ],
        "computed_metrics": {
            "weekly_stress_score": weekly_stress_score,
            "risk_level": risk_level,
            "peak_stress_day": peak_stress_day,
        }
    }

    prompt = f"""
        You are an assistant that explains workload stress patterns.

        The following stress metrics have already been computed:
        - Weekly stress score: {weekly_stress_score}/100
        - Risk level: {risk_level}
        - Peak stress day: {peak_stress_day}

        Based on the workload data below, provide a brief, human-readable explanation (maximum 3 sentences) of why the week has this stress pattern.

        IMPORTANT:
        - Do NOT mention specific numeric stress scores or percentages
        - Describe stress comparatively (e.g., "higher workload", "most demanding day")
        - Focus on workload factors like hours and deadlines
        - Be concise and natural

        Return ONLY a JSON object in this format:
        {{
        "explanation": "Your 2-3 sentence explanation here"
        }}

        Workload data:
        {json.dumps(prompt_payload, indent=2)}
        """

    explanation = "Your workload is distributed across the week."  # Default fallback
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",  # You can also use "mixtral-8x7b-32768" or other models
            temperature=0.7,
            max_tokens=500,
        )
        
        raw_text = chat_completion.choices[0].message.content.strip()

        # Strip markdown code blocks if present
        if raw_text.startswith("```"):
            raw_text = raw_text.strip("`")
            raw_text = raw_text.replace("json", "", 1).strip()

        data = json.loads(raw_text)
        explanation = data.get("explanation", explanation)

    except Exception as e:
        # LLM failure should not break the endpoint
        # We already have all the important data
        print(f"Warning: LLM explanation failed: {str(e)}")
        # Use fallback explanation
    
    # ----------------------------
    # Step 3: Return response
    # ----------------------------
    
    return StressPredictionResponse(
        daily_stress=daily_stress,
        weekly_stress_score=weekly_stress_score,
        risk_level=risk_level,
        peak_stress_day=peak_stress_day,
        explanation=explanation,
    )


# ----------------------------
# PRIORITIES ENDPOINT
# ----------------------------

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
    # Step 2: Ask Groq for reasons
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
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            max_tokens=1000,
        )
        
        raw_text = chat_completion.choices[0].message.content
        start = raw_text.find("{")
        end = raw_text.rfind("}") + 1
        data = json.loads(raw_text[start:end])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Groq priorities explanation failed: {str(e)}"
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