
from fastapi import APIRouter, File, HTTPException, UploadFile
from groq import AsyncGroq
import base64
import json
import os

from ai_service import MODEL

router = APIRouter(prefix="/api/cracks", tags=["Crack Detection"])

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024


@router.post("/analyze")
async def analyze_crack(image: UploadFile = File(...)):
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
You are an assistant for preliminary visual crack assessment
in buildings and other construction structures.

Analyze only what is visible in the image. Do not claim that a
crack is structural or diagnose its cause with certainty from
a photograph alone.

Return one valid JSON object with these fields:
{
  "crack_type": "visible pattern or uncertain",
  "apparent_severity": "Low|Medium|High|Uncertain",
  "observations": ["visible characteristics"],
  "possible_causes": ["possible cause, clearly presented as uncertain"],
  "recommended_actions": ["practical next step"],
  "professional_inspection_required": true,
  "limitations": ["uncertainty and inspection disclaimer"]
}

If there is no visible crack or the image is unclear, say so.
Recommend prompt assessment by a qualified structural engineer
if there are wide or growing cracks, displacement, sagging,
or other signs that could indicate a serious structural issue.
Do not declare a structure safe based on a photograph.
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
                            "text": "Assess the visible cracks in this image.",
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
            "crack_type",
            "apparent_severity",
            "observations",
            "possible_causes",
            "recommended_actions",
            "professional_inspection_required",
            "limitations",
        }

        if not required_fields.issubset(result):
            raise ValueError("The AI response is missing required fields.")

        return result

    except Exception as exc:
        print(f"Crack analysis error: {type(exc).__name__}")
        raise HTTPException(
            status_code=502,
            detail="Crack analysis failed. Please try again.",
        ) from exc
