
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service import generate_json

router = APIRouter(
    prefix="/api/planning",
    tags=["Project Planning"],
)


class PlanningRequest(BaseModel):
    project_type: str = Field(
        min_length=2,
        max_length=100,
        description="Type of construction, such as residential house",
    )
    area_sqft: float = Field(gt=0, le=1000000)
    floors: int = Field(ge=1, le=100)
    finish_quality: str = Field(
        min_length=2,
        max_length=50,
    )
    location: str = Field(
        min_length=2,
        max_length=150,
    )


@router.post("/estimate")
async def estimate_project(request: PlanningRequest):
    project_details = request.model_dump()

    output_instructions = """
Return one valid JSON object with exactly these fields:

{
  "project_summary": "Brief summary of the proposed project",
  "estimated_materials": [
    {
      "material": "Material name",
      "quantity": 0,
      "unit": "kg, bags, cubic metres, or another suitable unit",
      "notes": "Assumptions or explanation"
    }
  ],
  "estimated_costs": {
    "materials_inr": 0,
    "labour_inr": 0,
    "other_costs_inr": 0,
    "total_estimated_inr": 0,
    "cost_assumptions": ["Explanation of cost assumptions"]
  },
  "project_schedule": [
    {
      "phase": "Construction phase",
      "estimated_duration_days": 0,
      "description": "Brief phase description"
    }
  ],
  "conceptual_visualization": "Text description of the proposed building",
  "assumptions_and_limitations": [
    "Important assumptions and limitations"
  ]
}

Requirements:
- Use Indian rupees (INR) for all costs.
- Treat the supplied floor area as the total built-up area across all floors.
- Use the project type, location, number of floors, and finish quality.
- Provide realistic preliminary estimates, not guaranteed quantities or prices.
- Explain that actual costs depend on local rates, design, soil conditions,
  specifications, and site conditions.
- Do not invent verified supplier quotations or claim to have checked
  current market prices.
- Include only relevant materials and clearly state quantity assumptions.
- Keep the schedule indicative; phases may overlap.
- The conceptual visualization must be a written description, not a claim
  that an actual image was generated.
- State that a qualified professional must verify quantities, costs,
  structural design, and construction schedules before use.
- Return valid JSON only, without Markdown fences.
"""

    try:
        result = await generate_json(
            feature="Construction Project Planning",
            user_input=json.dumps(project_details),
            output_instructions=output_instructions,
        )
        return result

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Project planning failed. Please try again.",
        ) from exc
