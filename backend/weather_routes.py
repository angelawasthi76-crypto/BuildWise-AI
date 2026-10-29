
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service import generate_json

router = APIRouter(prefix="/api/weather", tags=["Weather Advisory"])


class WeatherAdvisoryRequest(BaseModel):
    location: str = Field(min_length=2, max_length=120)
    activity: str = Field(min_length=3, max_length=300)


@router.post("/advisory")
async def weather_advisory(request: WeatherAdvisoryRequest):
    """Fetch forecast data and assess construction work risks."""

    # Find the location's coordinates.
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            geo_response = await client.get(
                "https://geocoding-api.open-meteo.com/v1/search",
                params={
                    "name": request.location,
                    "count": 1,
                    "language": "en",
                    "format": "json",
                },
            )
            geo_response.raise_for_status()
            geo_data = geo_response.json()

            locations = geo_data.get("results", [])
            if not locations:
                raise HTTPException(
                    status_code=404,
                    detail="Location not found. Try a city or town name.",
                )

            place = locations[0]
            latitude = place["latitude"]
            longitude = place["longitude"]

            # Retrieve current conditions and the next day's forecast.
            weather_response = await client.get(
                "https://api.open-meteo.com/v1/forecast",
                params={
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": (
                        "temperature_2m,relative_humidity_2m,"
                        "precipitation,rain,showers,snowfall,"
                        "wind_speed_10m,wind_gusts_10m"
                    ),
                    "hourly": (
                        "precipitation_probability,precipitation,"
                        "wind_speed_10m,wind_gusts_10m,"
                        "temperature_2m"
                    ),
                    "forecast_days": 1,
                    "timezone": "auto",
                },
            )
            weather_response.raise_for_status()
            weather_data = weather_response.json()

    except HTTPException:
        raise
    except httpx.HTTPError as exc:
        print(f"Weather provider error: {type(exc).__name__}: {exc}")
        raise HTTPException(
            status_code=502,
            detail="Weather data is temporarily unavailable.",
        ) from exc

    weather_input = {
        "location": {
            "name": place.get("name"),
            "country": place.get("country"),
            "latitude": latitude,
            "longitude": longitude,
        },
        "planned_construction_activity": request.activity,
        "weather": weather_data,
    }

    instructions = """
Return these JSON fields:
{
  "decision": "GO, CAUTION, or NO-GO",
  "summary": "short explanation",
  "weather_conditions": [
    {
      "condition": "condition name",
      "observed_value": "value with units",
      "construction_risk": "explanation"
    }
  ],
  "safety_recommendations": ["recommendation"],
  "reasons": ["reason"],
  "limitations": ["limitation"]
}

Base the advisory on the supplied weather data and the specific activity.
Do not invent weather observations, thresholds, or local rules.
Use CAUTION when information is insufficient or risk needs verification.
Recommend NO-GO only when supplied conditions indicate a substantial
immediate risk for the specified activity.
Explain that this is a preliminary AI advisory, not an official
weather warning or a substitute for the site safety officer.
"""

    try:
        result = await generate_json(
            feature="Weather-Aware Construction GO/NO-GO Advisory",
            user_input=weather_input,
            output_instructions=instructions,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail="The AI advisory could not be generated. Please try again.",
        ) from exc

    result["location"] = place.get("name")
    result["forecast_timezone"] = weather_data.get("timezone")
    result["weather_source"] = "Open-Meteo"
    return result
