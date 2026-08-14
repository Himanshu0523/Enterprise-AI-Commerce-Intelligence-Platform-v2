from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import random

app = FastAPI(title="Visual Search Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VisualProductMatch(BaseModel):
    productId: str
    name: str
    similarityScore: float
    image: str

class VisualSearchResponse(BaseModel):
    queryImageFilename: str
    matches: List[VisualProductMatch]

MOCK_CATALOG = [
    {"productId": "p101", "name": "Classic Leather Jacket", "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5"},
    {"productId": "p102", "name": "Minimalist Sneaker", "image": "https://images.unsplash.com/photo-1549298916-b41d501d3772"},
    {"productId": "p103", "name": "Denim Overcoat", "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0"},
]

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "visual-search-service"}

@app.post("/api/visual-search/upload", response_model=VisualSearchResponse)
async def visual_search(file: UploadFile = File(...)):
    matches = []
    for item in MOCK_CATALOG:
        score = round(random.uniform(0.78, 0.98), 3)
        matches.append(VisualProductMatch(
            productId=item["productId"],
            name=item["name"],
            similarityScore=score,
            image=item["image"]
        ))

    matches.sort(key=lambda x: x.similarityScore, reverse=True)
    return VisualSearchResponse(queryImageFilename=file.filename or "uploaded_image.jpg", matches=matches)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8005, reload=True)
