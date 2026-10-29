
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service import generate_json

router = APIRouter(prefix="/api/ai", tags=["AI Features"])


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


@router.post("/chat")
async def construction_chat(request: ChatRequest):
    try:
        result = await generate_json(
            feature="construction_chatbot",
            user_input=request.message,
            output_instructions="""
Return a JSON object with these fields:
- answer: a helpful construction-related answer
- safety_note: a relevant safety caution, or an empty string
""",
        )
        return result

    except RuntimeError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc
