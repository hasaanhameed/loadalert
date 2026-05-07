import json
from datetime import date
from groq import Groq
from app.core.config import settings
from app.schemas.ai import (
    StressPredictionDayOutput, StressPredictionResponse,
    PriorityTaskOutput, PrioritiesResponse,
    StressContributorOutput, StressContributorsResponse
)
from fastapi import HTTPException

class AIService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_KEY)

    @staticmethod
    def calculate_daily_stress(hours: int, deadlines: int, max_hours: int = 12) -> int:
        if hours == 0 and deadlines == 0:
            return 0
        hours_stress = min((hours / max_hours) * 60, 60)
        deadline_stress = min(deadlines * 10, 40)
        return int(min(hours_stress + deadline_stress, 100))

    @staticmethod
    def calculate_weekly_stress_score(daily_stress_values: list[int]) -> int:
        if not daily_stress_values or all(s == 0 for s in daily_stress_values):
            return 0
        sorted_stress = sorted(daily_stress_values, reverse=True)
        if len(sorted_stress) >= 3:
            weighted_score = (sorted_stress[0] * 0.5 + sorted_stress[1] * 0.3 + sorted_stress[2] * 0.2)
        elif len(sorted_stress) == 2:
            weighted_score = (sorted_stress[0] * 0.6 + sorted_stress[1] * 0.4)
        else:
            weighted_score = sorted_stress[0]
        return int(min(weighted_score, 100))

    @staticmethod
    def calculate_risk_level(weekly_stress_score: int) -> str:
        if weekly_stress_score <= 35: return "low"
        elif weekly_stress_score <= 65: return "medium"
        else: return "high"

    @staticmethod
    def find_peak_stress_day(daily_stress: list[dict]) -> str:
        if not daily_stress: return "N/A"
        peak_day = max(daily_stress, key=lambda x: x['stressLevel'])
        return peak_day['day']

    def predict_stress(self, request):
        daily_stress_raw = []
        for day_data in request.weekly_load:
            stress = self.calculate_daily_stress(day_data.hours, day_data.deadlines)
            daily_stress_raw.append({'day': day_data.day, 'stressLevel': stress})
        
        daily_values = [d['stressLevel'] for d in daily_stress_raw]
        weekly_stress_score = self.calculate_weekly_stress_score(daily_values)
        risk_level = self.calculate_risk_level(weekly_stress_score)
        peak_stress_day = self.find_peak_stress_day(daily_stress_raw)
        
        total_stress = sum(daily_values)
        if total_stress > 0:
            daily_stress = [
                StressPredictionDayOutput(
                    day=d['day'],
                    stressLevel=round((d['stressLevel'] / total_stress) * 100)
                ) for d in daily_stress_raw
            ]
        else:
            daily_stress = [StressPredictionDayOutput(day=d['day'], stressLevel=0) for d in daily_stress_raw]
        
        prompt_payload = {
            "weekly_load": [{"day": d.day, "hours": d.hours, "deadlines": d.deadlines} for d in request.weekly_load],
            "computed_metrics": {"weekly_stress_score": weekly_stress_score, "risk_level": risk_level, "peak_stress_day": peak_stress_day}
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
            {{ "explanation": "Your 2-3 sentence explanation here" }}
            Workload data: {json.dumps(prompt_payload, indent=2)}
        """
        explanation = "Your workload is distributed across the week."
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=500,
            )
            raw_text = chat_completion.choices[0].message.content.strip()
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`").replace("json", "", 1).strip()
            data = json.loads(raw_text)
            explanation = data.get("explanation", explanation)
        except Exception as e:
            print(f"Warning: LLM explanation failed: {str(e)}")
        
        return StressPredictionResponse(
            daily_stress=daily_stress,
            weekly_stress_score=weekly_stress_score,
            risk_level=risk_level,
            peak_stress_day=peak_stress_day,
            explanation=explanation,
        )

    def generate_priorities(self, request):
        today = date.today()
        scored_tasks = []
        for task in request.tasks:
            days_until_due = max((task.due_date - today).days, 0)
            urgency_score = max(0, 30 - days_until_due)
            effort_score = min(task.estimated_effort * 2, 20)
            importance_map = {"low": 5, "medium": 10, "high": 20}
            importance_score = importance_map.get(task.importance_level.lower(), 10)
            total_score = urgency_score + effort_score + importance_score
            scored_tasks.append({"task": task, "score": total_score})
        
        scored_tasks.sort(key=lambda x: x["score"], reverse=True)
        prompt_payload = [
            {"title": t["task"].title, "due_date": str(t["task"].due_date), "estimated_effort": t["task"].estimated_effort, "importance": t["task"].importance_level, "rank": idx + 1}
            for idx, t in enumerate(scored_tasks)
        ]
        prompt = f"""
            You are an assistant that explains task prioritization.
            Given the ranked list of tasks below, explain briefly (1 sentence each) why each task is placed at its rank.
            Return STRICT JSON ONLY in this format:
            {{ "priorities": [ {{ "rank": 1, "reason": "..." }} ] }}
            Tasks: {json.dumps(prompt_payload, indent=2)}
        """
        try:
            chat_completion = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="llama-3.3-70b-versatile",
                temperature=0.7,
                max_tokens=1000,
            )
            raw_text = chat_completion.choices[0].message.content
            start = raw_text.find("{")
            end = raw_text.rfind("}") + 1
            data = json.loads(raw_text[start:end])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Groq priorities explanation failed: {str(e)}")

        priorities = [
            PriorityTaskOutput(
                id=item["task"].id, title=item["task"].title, rank=idx + 1,
                reason=data["priorities"][idx]["reason"], estimated_effort=item["task"].estimated_effort,
                due_date=item["task"].due_date
            ) for idx, item in enumerate(scored_tasks)
        ]
        return PrioritiesResponse(priorities=priorities)

    @staticmethod
    def calculate_contributors(request):
        today = date.today()
        scored_deadlines = []
        for deadline in request.deadlines:
            days_until_due = max((deadline.due_date - today).days, 0)
            urgency_score = max(0, 30 - days_until_due)
            effort_score = min(deadline.estimated_effort * 3, 40)
            importance_map = {"low": 10, "medium": 20, "high": 30}
            importance_score = importance_map.get(deadline.importance_level.lower(), 20)
            total_score = urgency_score + effort_score + importance_score
            scored_deadlines.append({"deadline": deadline, "score": total_score})
        
        total_stress = sum(d["score"] for d in scored_deadlines)
        if total_stress == 0:
            return StressContributorsResponse(contributors=[], max_contribution=0)
        
        contributors_with_percentage = []
        for item in scored_deadlines:
            contribution_percentage = round((item["score"] / total_stress) * 100)
            contributors_with_percentage.append({"deadline": item["deadline"], "contribution": contribution_percentage})
        
        contributors_with_percentage.sort(key=lambda x: x["contribution"], reverse=True)
        contributors = [
            StressContributorOutput(
                id=item["deadline"].id, title=item["deadline"].title,
                contribution=item["contribution"], due_date=item["deadline"].due_date
            ) for item in contributors_with_percentage
        ]
        max_contribution = max((c.contribution for c in contributors), default=0)
        return StressContributorsResponse(contributors=contributors, max_contribution=max_contribution)
