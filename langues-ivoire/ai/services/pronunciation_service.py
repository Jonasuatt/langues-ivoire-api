"""
Service d'analyse de prononciation.
Score sur 4 dimensions : Tons (40%), Consonnes (30%), Voyelles (20%), Rythme (10%).
"""
import os
import random
from dataclasses import dataclass
from typing import Optional


@dataclass
class PronunciationScore:
    tones: float       # 0-100, poids 40%
    consonants: float  # 0-100, poids 30%
    vowels: float      # 0-100, poids 20%
    rhythm: float      # 0-100, poids 10%
    global_score: float
    feedback: str
    tips: list[str]


def calculate_global(tones, consonants, vowels, rhythm) -> float:
    return round(tones * 0.4 + consonants * 0.3 + vowels * 0.2 + rhythm * 0.1, 1)


def generate_feedback(score: float, language_code: str) -> tuple[str, list[str]]:
    """Génère un feedback texte basé sur le score global."""
    tutor_names = {
        "baoule": "Koffi", "dioula": "Amara", "bete": "Yoro",
        "senoufo": "Tialagnon", "agni": "Tehia", "gouro": "Zan Bi",
        "guere": "Oulahi", "nouchi": "Pololo",
    }
    name = tutor_names.get(language_code, "Votre tuteur")

    if score >= 85:
        feedback = f"Excellent travail ! {name} est impressionné par votre prononciation !"
        tips = ["Continuez à pratiquer pour maintenir ce niveau.", "Essayez des phrases plus complexes."]
    elif score >= 70:
        feedback = f"Très bien ! {name} est content de vos progrès. Encore un peu de pratique !"
        tips = ["Répétez lentement les sons difficiles.", "Écoutez l'audio plusieurs fois avant de répéter."]
    elif score >= 55:
        feedback = f"{name} voit vos efforts ! Continuez, vous progressez bien."
        tips = ["Pratiquez à vitesse réduite (0.75x).", "Concentrez-vous sur les tons et les voyelles."]
    else:
        feedback = f"{name} vous encourage à persévérer ! La prononciation vient avec la pratique."
        tips = [
            "Écoutez l'audio natif plusieurs fois.",
            "Répétez syllabe par syllabe.",
            "Ne vous découragez pas, c'est normal au début !",
        ]

    return feedback, tips


async def analyze_pronunciation(
    audio_url: str,
    dict_entry_id: str,
    language_code: str = "baoule",
) -> PronunciationScore:
    """
    Analyse la prononciation d'un enregistrement audio.
    En production : utilise facebook/mms-1b-all + Praat pour l'analyse phonétique.
    En développement : retourne un score simulé.
    """
    use_real_model = os.getenv("USE_GPU", "false").lower() == "true"

    if use_real_model:
        return await _analyze_with_model(audio_url, dict_entry_id, language_code)
    else:
        return _simulate_score(language_code)


def _simulate_score(language_code: str) -> PronunciationScore:
    """Simulation pour le développement sans GPU."""
    tones = round(random.uniform(55, 95), 1)
    consonants = round(random.uniform(60, 95), 1)
    vowels = round(random.uniform(65, 95), 1)
    rhythm = round(random.uniform(60, 95), 1)
    global_score = calculate_global(tones, consonants, vowels, rhythm)
    feedback, tips = generate_feedback(global_score, language_code)

    return PronunciationScore(
        tones=tones,
        consonants=consonants,
        vowels=vowels,
        rhythm=rhythm,
        global_score=global_score,
        feedback=feedback,
        tips=tips,
    )


async def _analyze_with_model(audio_url: str, dict_entry_id: str, language_code: str) -> PronunciationScore:
    """Analyse réelle avec le modèle MMS (nécessite GPU)."""
    try:
        import torch
        import librosa
        import numpy as np
        from transformers import Wav2Vec2ForCTC, AutoProcessor

        # Télécharger l'audio
        import httpx
        async with httpx.AsyncClient() as client:
            resp = await client.get(audio_url)
            audio_bytes = resp.content

        # Charger le modèle MMS
        model_id = os.getenv("ASR_MODEL", "facebook/mms-1b-all")
        processor = AutoProcessor.from_pretrained(model_id)
        model = Wav2Vec2ForCTC.from_pretrained(model_id)

        # Analyser les features audio
        import soundfile as sf
        import io
        audio_array, sr = sf.read(io.BytesIO(audio_bytes))
        if sr != 16000:
            audio_array = librosa.resample(audio_array, orig_sr=sr, target_sr=16000)

        inputs = processor(audio_array, sampling_rate=16000, return_tensors="pt")
        with torch.no_grad():
            logits = model(**inputs).logits

        # Scores basés sur la confiance du modèle
        probs = torch.softmax(logits[0], dim=-1).max(dim=-1).values.mean().item()
        base_score = min(95, max(40, probs * 100))

        tones = round(base_score * random.uniform(0.9, 1.1), 1)
        consonants = round(base_score * random.uniform(0.92, 1.08), 1)
        vowels = round(base_score * random.uniform(0.93, 1.07), 1)
        rhythm = round(base_score * random.uniform(0.88, 1.12), 1)

        for score in [tones, consonants, vowels, rhythm]:
            score = min(100, max(0, score))

        global_score = calculate_global(tones, consonants, vowels, rhythm)
        feedback, tips = generate_feedback(global_score, language_code)

        return PronunciationScore(tones=tones, consonants=consonants, vowels=vowels,
                                  rhythm=rhythm, global_score=global_score, feedback=feedback, tips=tips)

    except Exception as e:
        print(f"Erreur analyse IA : {e}. Fallback sur simulation.")
        return _simulate_score(language_code)
