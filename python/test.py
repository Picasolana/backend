import requests
import json
from image import imageGeneratoroffPrompt
from pathlib import Path
import base64

URL = "http://localhost:8000/getScore/"
PROMPT = "circle next to a sqaure"
CWD = Path.cwd()
IMAGE_DIR = CWD / "images"
objImg = imageGeneratoroffPrompt(PROMPT)
usrImg = imageGeneratoroffPrompt(PROMPT)
# image1 = "txt2img_308028419.txt"
# image2 = "txt2img_308028419.txt"

# with open(IMAGE_DIR / image1, 'rb') as f:
#     objImg = base64.b64encode(f.read())

# with open(IMAGE_DIR / image1, 'rb') as f:
#     usrImg = base64.b64encode(f.read())

images = {
  "objectiveImage": objImg,
  "userImage": usrImg,
}

# with open('testjson.json', 'r') as j:
#     images = dict(json.loads(j.read()))

print("Sending request")
response = requests.post(
    URL,
    json=images
)
print("Done")

print(response.json())
#print(dict(response.json())['detail'][0]["msg"])