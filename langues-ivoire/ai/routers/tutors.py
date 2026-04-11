from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.llm_service import generate_tutor_response

router = APIRouter()


class ChatRequest(BaseModel):
    tutorId: str
    languageCode: str
    message: str
    categorie: Optional[str] = None
    userId: Optional[str] = None
    personalite: Optional[str] = None
    conversationHistory: Optional[list] = None


class ChatResponse(BaseModel):
    reply: str
    audioUrl: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
async def chat_with_tutor(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message vide")

    try:
        reply = await generate_tutor_response(
            language_code=req.languageCode,
            message=req.message,
            categorie=req.categorie,
            personalite=req.personalite,
            conversation_history=req.conversationHistory,
        )
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Service IA indisponible : {str(e)}")
