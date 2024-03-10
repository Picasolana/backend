from fastapi import FastAPI
from image import getScore
import base64
from pydantic import BaseModel
from typing import Optional
import json

app = FastAPI()

class Score(BaseModel):
    targetImage: str
    userImage: str 
    maxSimilarFeatures: Optional[int] = None

@app.post("/getScore/")
async def generateScore(score: Score):
    try:
        print("getting score")
        userImage = score.userImage
        targetImage = score.targetImage
        maxSimilarFeatures = score.maxSimilarFeatures
        score, return_maxFeatures = getScore(
            targetImage=targetImage, userImage=userImage, maxSimilarFeatures=maxSimilarFeatures
        )
        return {
            "status": 200,
            "error": None,
            "score": score,
            "maxSimilarFeatures": return_maxFeatures,
            "msg": None
        }
    except Exception as e:
        return {
            "status": 404,
            "error": str(e),
            "score": None,
            "maxSimilarFeatures": None,
            "msg": "An error occurred"
        }

