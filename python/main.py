from fastapi import FastAPI
from image import getScore
import base64
from pydantic import BaseModel
import json

app = FastAPI()

class Score(BaseModel):
    objectiveImage: str
    userImage: str 

@app.post("/getScore/")
async def generateScore(score: Score):
    print("getting score")
    userImage = score.userImage
    objectiveImage = score.objectiveImage
    return json.dumps({
        "status": 200,
        "error": None,
        "score": getScore(userImage, objectiveImage),
        "msg": None
    })

