
from fastapi import APIRouter, File, HTTPException, UploadFile
from groq import AsyncGroq
import base64
import json
import os

from ai_service import MODEL

router = APIRouter(prefix="/api/safety", tags=["Construction Safety"])

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post("/analyze")
async def analyze_safety(image: UploadFile = File(...)):
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Upload a JPG, PNG, or WEBP image.",
        )

    image_bytes = await image.read(MAX_FILE_SIZE + 1)

    if not image_bytes:
        raise HTTPException(status_code=400, detail="The image is empty.")

    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image must be 10 MB or smaller.",
        )

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    system_prompt = """
You are a construction-site safety analysis assistant.
Analyze only visible evidence in the supplied image.
Do not claim that a person, hazard, or PPE item is definitely present
when the image is unclear.
Identify visible hazards, PPE observations, risk severity,
and practical corrective actions.
Do not present this as a certified safety inspection.
Return one valid JSON object with these fields:
{
  "hazards": [{"hazard": "description", "severity": "Low|Medium|High|Critical"}],
  "ppe_observations": ["observation"],
  "overall_risk": "Low|Medium|High|Critical",
  "corrective_actions": ["action"],
  "limitations": ["uncertainty or inspection disclaimer"]
}
"""

    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this construction-site image for safety.",
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": (
                                    f"data:{image.content_type};base64,"
                                    f"{encoded_image}"
                                )
                            },
                        },
                    ],
                },
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("The AI returned an empty response.")

        result = json.loads(content)

        required_fields = {
            "hazards",
            "ppe_observations",
            "overall_risk",
            "corrective_actions",
            "limitations",
        }

        if not required_fields.issubset(result):
            raise ValueError("The AI response is missing required fields.")

        return result

    except Exception as exc:
        print(f"Safety analysis error: {type(exc).__name__}")
        raise HTTPException(
            status_code=502,
            detail=(
                "Safety analysis failed. Check that the configured Groq "
                "model supports image input and try again."
            ),
        ) from exc
