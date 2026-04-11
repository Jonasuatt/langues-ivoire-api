from dotenv import load_dotenv
load_dotenv()  # ← DOIT être appelé AVANT tous les autres imports

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routers import tutors, pronunciation, tts, asr

app = FastAPI(
    title="Langues Ivoire — Service IA",
    description="Backend IA pour les Tuteurs Ethniques Virtuels (TEV) et l'analyse de prononciation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(tutors.router, prefix="/tutors", tags=["Tuteurs"])
app.include_router(pronunciation.router, prefix="/pronunciation", tags=["Prononciation"])
app.include_router(tts.router, prefix="/tts", tags=["Synthèse vocale"])
app.include_router(asr.router, prefix="/asr", tags=["Reconnaissance vocale"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "Langues Ivoire AI"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
