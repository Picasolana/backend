from fastapi import FastAPI
from image import getScore
import base64
from pydantic import BaseModel
import json

app = FastAPI()

class Score(BaseModel):
    targetImage: str
    userImage: str 

@app.post("/getScore/")
async def generateScore(score: Score):
    print("getting score")
    userImage = score.userImage
    targetImage = score.targetImage
    return json.dumps({
        "status": 200,
        "error": None,
        "score": getScore(targetImage=targetImage, userImage=userImage),
        "msg": None
    })

