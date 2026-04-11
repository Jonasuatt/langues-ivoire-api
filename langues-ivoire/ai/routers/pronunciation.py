from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
import httpx
import os
from services.pronunciation_service import analyze_pronunciation

router = APIRouter()


class PronunciationRequest(BaseModel):
    requestId: str
    audioUrl: str
    dictEntryId: str
    languageCode: Optional[str] = "baoule"


class PronunciationResult(BaseModel):
    requestId: str
    scoreTones: float
    scoreConsonants: float
    scoreVowels: float
    scoreRhythm: float
    scoreGlobal: float
    feedback: str
    tips: list[str]


async def _update_api(request_id: str, result: PronunciationResult):
    """Envoie le résultat au backend Node.js."""
    api_url = os.getenv("API_URL", "http://localhost:3000/api")
    try:
        async with httpx.AsyncClient() as client:
            await client.patch(
                f"{api_url}/pronunciation/{request_id}",
                json={
                    "scoreTones": result.scoreTones,
                    "scoreConsonants": result.scoreConsonants,
                    "scoreVowels": result.scoreVowels,
                    "scoreRythm": result.scoreRhythm,
                    "scoreGlobal": result.scoreGlobal,
                    "feedbackAvatar": {
                        "feedback": result.feedback,
                        "tips": result.tips,
                    },
                },
                timeout=10,
            )
    except Exception as e:
        print(f"Erreur mise à jour API : {e}")


@router.post("/analyze")
async def analyze(req: PronunciationRequest, background_tasks: BackgroundTasks):
    """Lance l'analyse en tâche de fond et retourne immédiatement."""
    background_tasks.add_task(_run_analysis, req)
    return {"message": "Analyse lancée", "requestId": req.requestId}


async def _run_analysis(req: PronunciationRequest):
    try:
        score = await analyze_pronunciation(
            audio_url=req.audioUrl,
            dict_entry_id=req.dictEntryId,
            language_code=req.languageCode,
        )
        result = PronunciationResult(
            requestId=req.requestId,
            scoreTones=score.tones,
            scoreConsonants=score.consonants,
            scoreVowels=score.vowels,
            scoreRhythm=score.rhythm,
            scoreGlobal=score.global_score,
            feedback=score.feedback,
            tips=score.tips,
        )
        await _update_api(req.requestId, result)
    except Exception as e:
        print(f"Erreur analyse prononciation : {e}")


@router.post("/analyze/sync", response_model=PronunciationResult)
async def analyze_sync(req: PronunciationRequest):
    """Version synchrone pour les tests."""
    score = await analyze_pronunciation(
        audio_url=req.audioUrl,
        dict_entry_id=req.dictEntryId,
        language_code=req.languageCode,
    )
    return PronunciationResult(
        requestId=req.requestId,
        scoreTones=score.tones,
        scoreConsonants=score.consonants,
        scoreVowels=score.vowels,
        scoreRhythm=score.rhythm,
        scoreGlobal=score.global_score,
        feedback=score.feedback,
        tips=score.tips,
    )
