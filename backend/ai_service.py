
import json
import os

from dotenv import load_dotenv
from groq import AsyncGroq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError(
        "GROQ_API_KEY is missing. Check backend/.env."
    )

client = AsyncGroq(api_key=api_key)

MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile",
)


async def generate_json(
    feature: str,
    user_input: str,
    output_instructions: str,
) -> dict:
    """Generate a structured JSON response for a construction feature."""

    system_prompt = f"""
You are the AI assistant for a construction intelligence platform.

The active feature is: {feature}

Provide practical, construction-specific guidance.
Do not invent facts or claim that estimates are verified.
State uncertainty when information is insufficient.
For safety and structural questions, distinguish observations
from assumptions and recommend qualified professional inspection
when necessary.

Return one valid JSON object only.
Follow these output instructions:
{output_instructions}
"""

    try:
        response = await client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": json.dumps(user_input, ensure_ascii=False)
                },
            ],
            response_format={"type": "json_object"},
            temperature=0.2,
        )

        content = response.choices[0].message.content

        if not content:
            raise ValueError("The AI returned an empty response.")

        result = json.loads(content)

        if not isinstance(result, dict):
            raise ValueError("The AI response must be a JSON object.")

        return result

    except Exception as exc:
        # Log the technical error on the backend, not in the API response.
        print(f"AI service error ({feature}): {type(exc).__name__}: {exc}")
        raise RuntimeError(
            "The AI service could not complete this request."
        ) from exc
