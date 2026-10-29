
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service import generate_json

router = APIRouter(
    prefix="/api/site-assistant",
    tags=["Daily Site Assistant"],
)


class SiteAssistantRequest(BaseModel):
    project_name: str = Field(min_length=2, max_length=150)
    location: str = Field(min_length=2, max_length=150)
    construction_stage: str = Field(min_length=2, max_length=150)
    planned_activities: str = Field(min_length=5, max_length=3000)
    workforce_count: int = Field(ge=1, le=10000)
    working_hours: float = Field(gt=0, le=24)


@router.post("/plan")
async def generate_site_plan(request: SiteAssistantRequest):
    user_input = request.model_dump()

    output_instructions = """
    Create a practical daily construction site plan using the supplied details.

    Return a JSON object with exactly these fields:

    {
      "daily_summary": "string",
      "tasks": [
        {
          "task": "string",
          "priority": "High, Medium, or Low",
          "suggested_duration_hours": 1,
          "instructions": "string"
        }
      ],
      "required_materials": [
        {
          "material": "string",
          "estimated_quantity": "string",
          "purpose": "string"
        }
      ],
      "required_equipment": [
        {
          "equipment": "string",
          "purpose": "string"
        }
      ],
      "safety_checks": ["string"],
      "potential_risks": [
        {
          "risk": "string",
          "severity": "High, Medium, or Low",
          "preventive_action": "string"
        }
      ],
      "end_of_day_checklist": ["string"]
    }

    Rules:
    - Return valid JSON only, with no Markdown or extra text.
    - Use the project details and planned activities provided by the user.
    - Keep tasks practical for the stated workforce and working hours.
    - Suggested task durations must be positive numbers and must not
      exceed the available working hours for an individual task.
    - Estimate material quantities only when reasonably possible.
      Clearly label uncertain quantities as preliminary estimates.
    - Include relevant construction safety checks and preventive actions.
    - Do not invent site inspections, measurements, or completed work.
    - Do not claim that the plan replaces professional supervision,
      approved construction drawings, or site safety procedures.
    """

    try:
        result = await generate_json(
            feature="daily_site_assistant",
            user_input=user_input,
            output_instructions=output_instructions,
        )

        if not isinstance(result, dict):
            raise ValueError("The AI returned an invalid response format.")

        return result

    except Exception as exc:
        print(f"Daily Site Assistant error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Could not generate the daily site plan. Please try again.",
        ) from exc
