from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import os
import io

router = APIRouter()

LANG_TO_MMS_CODE = {
    "baoule": "bci",
    "dioula": "dyu",
    "bete":   "bet",
    "senoufo": "sen",
    "agni":   "any",
    "gouro":  "goa",
    "guere":  "gxx",
    "nouchi":  "fra",  # Nouchi → français comme pivot
}


class TTSRequest(BaseModel):
    text: str
    languageCode: str
    speed: Optional[float] = 1.0


@router.post("/synthesize")
async def synthesize(req: TTSRequest):
    """Synthèse vocale pour une langue ivoirienne."""
    mms_lang = LANG_TO_MMS_CODE.get(req.languageCode, "fra")
    use_gpu = os.getenv("USE_GPU", "false").lower() == "true"

    if use_gpu:
        audio_bytes = await _synthesize_with_mms(req.text, mms_lang, req.speed)
    else:
        audio_bytes = _generate_silence()  # Placeholder en mode dev

    return StreamingResponse(
        io.BytesIO(audio_bytes),
        media_type="audio/wav",
        headers={"Content-Disposition": "attachment; filename=tts.wav"},
    )


async def _synthesize_with_mms(text: str, lang_code: str, speed: float) -> bytes:
    """Synthèse avec facebook/mms-tts."""
    try:
        from transformers import VitsModel, AutoTokenizer
        import torch
        import soundfile as sf
        import io

        model_id = f"facebook/mms-tts-{lang_code}"
        tokenizer = AutoTokenizer.from_pretrained(model_id)
        model = VitsModel.from_pretrained(model_id)

        inputs = tokenizer(text, return_tensors="pt")
        with torch.no_grad():
            output = model(**inputs).waveform

        audio_array = output.squeeze().numpy()

        if speed != 1.0:
            import librosa
            audio_array = librosa.effects.time_stretch(audio_array, rate=speed)

        buf = io.BytesIO()
        sf.write(buf, audio_array, samplerate=model.config.sampling_rate, format="WAV")
        return buf.getvalue()

    except Exception as e:
        print(f"Erreur TTS : {e}. Retour silence.")
        return _generate_silence()


def _generate_silence(duration_ms: int = 1000) -> bytes:
    """Génère un fichier WAV silencieux (placeholder dev)."""
    import struct
    import math

    sample_rate = 22050
    num_samples = int(sample_rate * duration_ms / 1000)
    audio_data = b'\x00\x00' * num_samples  # 16-bit silence

    # En-tête WAV minimal
    header = struct.pack('<4sI4s4sIHHIIHH4sI',
        b'RIFF', 36 + len(audio_data), b'WAVE',
        b'fmt ', 16, 1, 1, sample_rate, sample_rate * 2, 2, 16,
        b'data', len(audio_data))
    return header + audio_data
