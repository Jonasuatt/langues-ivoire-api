from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import io

router = APIRouter()


class ASRResult(BaseModel):
    transcript: str
    language: str
    confidence: float


@router.post("/transcribe", response_model=ASRResult)
async def transcribe(
    audio: UploadFile = File(...),
    language_code: str = Form("baoule"),
):
    """Transcription audio → texte avec facebook/mms-1b-all."""
    audio_bytes = await audio.read()
    use_gpu = os.getenv("USE_GPU", "false").lower() == "true"

    if use_gpu:
        return await _transcribe_with_mms(audio_bytes, language_code)
    else:
        return ASRResult(
            transcript="[Transcription simulée - mode développement]",
            language=language_code,
            confidence=0.85,
        )


async def _transcribe_with_mms(audio_bytes: bytes, language_code: str) -> ASRResult:
    """Transcription réelle avec MMS."""
    LANG_CODES = {
        "baoule": "bci", "dioula": "dyu", "bete": "bet",
        "senoufo": "sen", "agni": "any", "gouro": "goa",
        "guere": "gxx", "nouchi": "fra",
    }
    mms_code = LANG_CODES.get(language_code, "fra")

    try:
        import torch
        import librosa
        import soundfile as sf
        from transformers import Wav2Vec2ForCTC, AutoProcessor

        model_id = os.getenv("ASR_MODEL", "facebook/mms-1b-all")
        processor = AutoProcessor.from_pretrained(model_id)
        processor.tokenizer.set_target_lang(mms_code)
        model = Wav2Vec2ForCTC.from_pretrained(model_id)
        model.load_adapter(mms_code)

        audio_array, sr = sf.read(io.BytesIO(audio_bytes))
        if sr != 16000:
            audio_array = librosa.resample(audio_array, orig_sr=sr, target_sr=16000)

        inputs = processor(audio_array, sampling_rate=16000, return_tensors="pt")
        with torch.no_grad():
            logits = model(**inputs).logits

        ids = torch.argmax(logits, dim=-1)[0]
        transcript = processor.decode(ids)
        confidence = float(torch.softmax(logits[0], dim=-1).max(dim=-1).values.mean())

        return ASRResult(transcript=transcript, language=language_code, confidence=round(confidence, 3))

    except Exception as e:
        print(f"Erreur ASR : {e}")
        raise HTTPException(status_code=503, detail=f"Service ASR indisponible : {str(e)}")
