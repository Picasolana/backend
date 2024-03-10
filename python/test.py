import requests
import json
from image import imageGeneratoroffPrompt
from pathlib import Path
import base64

URL = "http://localhost:8000/getScore/"
PROMPT = "circle next to a sqaure"
CWD = Path.cwd()
IMAGE_DIR = CWD / "images"
# objImg = imageGeneratoroffPrompt(PROMPT)
# usrImg = imageGeneratoroffPrompt(PROMPT)
image1 = "txt2img_circle next to a sqaure_1883391401.png"
image2 = "txt2img_circle next to a sqaure_1773196312.png"

with open(IMAGE_DIR / image1, 'rb') as f:
    objImg = base64.b64encode(f.read())

with open(IMAGE_DIR / image2, 'rb') as f:
    usrImg = base64.b64encode(f.read())

images = {
  "targetImage": objImg.decode('utf-8'),
  "userImage": usrImg.decode('utf-8'),
  "maxSimilarFeatures": -1
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