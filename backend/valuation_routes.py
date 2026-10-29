
import json

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service import generate_json

router = APIRouter(
    prefix="/api/valuation",
    tags=["Property Valuation"],
)


class ValuationRequest(BaseModel):
    property_type: str = Field(min_length=2, max_length=100)
    area_sqft: float = Field(gt=0, le=1000000)
    location: str = Field(min_length=2, max_length=150)
    property_age_years: int = Field(ge=0, le=300)
    condition: str = Field(min_length=2, max_length=50)
    purchase_price_inr: float | None = Field(
        default=None,
        gt=0,
        le=100000000000,
    )


@router.post("/estimate")
async def estimate_property(request: ValuationRequest):
    property_details = request.model_dump()

    output_instructions = """
Return one valid JSON object with exactly these fields:

{
  "property_summary": "Brief description of the property",
  "estimated_property_value_inr": 0,
  "estimated_price_per_sqft_inr": 0,
  "estimated_monthly_rent_inr": 0,
  "estimated_annual_rent_inr": 0,
  "estimated_gross_rental_yield_percent": 0,
  "estimated_roi_percent": null,
  "roi_basis": "Explain the basis used for ROI",
  "appreciation": {
    "annual_appreciation_percent": 0,
    "estimated_value_after_5_years_inr": 0,
    "assumptions": "Explain the appreciation assumptions"
  },
  "valuation_assumptions": [
    "List important assumptions and limitations"
  ]
}

Requirements:
- All monetary values must be in Indian rupees (INR).
- Estimate property value and price per square foot consistently.
- Estimated annual rent should equal monthly rent multiplied by 12.
- Gross rental yield is annual rent divided by estimated property value,
  multiplied by 100.
- If purchase_price_inr is provided, estimate ROI relative to that
  purchase price and explain that this is an indicative rental-based
  return, not a guaranteed total investment return.
- If purchase_price_inr is null, set estimated_roi_percent to null
  and explain that a purchase price is required to estimate ROI.
- Estimate five-year future value using the stated annual appreciation
  assumption and compound annual growth.
- Use the property location, type, size, age, and condition.
- Do not claim to have accessed live market data, verified comparable
  sales, or current rental listings.
- Clearly state that results are indicative estimates, not a certified
  valuation or guaranteed investment return.
- Return valid JSON only, without Markdown fences.
"""

    try:
        result = await generate_json(
            feature="Property Valuation",
            user_input=json.dumps(property_details),
            output_instructions=output_instructions,
        )
        return result

    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="Property valuation failed. Please try again.",
        ) from exc
