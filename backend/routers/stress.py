from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date

import models
from database import get_db
from authorization.oauth2 import get_current_user
from schema import (
    StressContributorInput,
    StressContributorsRequest,
    StressContributorOutput,
    StressContributorsResponse,
)

router = APIRouter(prefix="/stress", tags=["Stress"])


@router.post("/contributors", response_model=StressContributorsResponse)
def calculate_stress_contributors(request: StressContributorsRequest, current_user: models.User = Depends(get_current_user)):
    today = date.today()
    
    # ----------------------------
    # Step 1: Calculate base stress scores for each deadline
    # ----------------------------
    scored_deadlines = []
    
    for deadline in request.deadlines:
        days_until_due = max((deadline.due_date - today).days, 0)
        
        # Urgency: closer deadline = higher stress
        urgency_score = max(0, 30 - days_until_due)
        
        # Effort: more hours = higher stress
        effort_score = min(deadline.estimated_effort * 3, 40)
        
        # Importance mapping
        importance_map = {
            "low": 10,
            "medium": 20,
            "high": 30,
        }
        importance_score = importance_map.get(
            deadline.importance_level.lower(), 20
        )
        
        total_score = urgency_score + effort_score + importance_score
        
        scored_deadlines.append({
            "deadline": deadline,
            "score": total_score,
        })
    
    # Calculate total for percentage distribution
    total_stress = sum(d["score"] for d in scored_deadlines)
    
    # If no stress at all, return empty
    if total_stress == 0:
        return StressContributorsResponse(
            contributors=[],
            max_contribution=0
        )
    
    # ----------------------------
    # Step 2: Convert to percentages
    # ----------------------------
    contributors_with_percentage = []
    
    for item in scored_deadlines:
        contribution_percentage = round((item["score"] / total_stress) * 100)
        
        contributors_with_percentage.append({
            "deadline": item["deadline"],
            "contribution": contribution_percentage,
        })
    
    # Sort by contribution (highest first)
    contributors_with_percentage.sort(
        key=lambda x: x["contribution"], 
        reverse=True
    )
    
    # ----------------------------
    # Step 3: Build response
    # ----------------------------
    contributors = [
        StressContributorOutput(
            id=item["deadline"].id,
            title=item["deadline"].title,
            contribution=item["contribution"],
            due_date=item["deadline"].due_date,
        )
        for item in contributors_with_percentage
    ]
    
    max_contribution = max(
        (c.contribution for c in contributors), 
        default=0
    )
    
    return StressContributorsResponse(
        contributors=contributors,
        max_contribution=max_contribution
    )