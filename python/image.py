import base64
import requests
import os
from pathlib import Path
import numpy as np
import cv2 as cv
import matplotlib.pyplot as plt
from skimage.metrics import structural_similarity
from dotenv import load_dotenv
load_dotenv()
import json

CWD = Path.cwd()
IMAGE_DIR = CWD / "images"
WEIGHTS = [0.5, 0.5]

def imageGeneratoroffPrompt(prompt):
    url = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"

    body = {
    "steps": 40,
    "width": 1024,
    "height": 1024,
    "seed": 0,
    "cfg_scale": 5,
    "samples": 1,
    "text_prompts": [
        {
        "text": prompt,
        "weight": 1
        },
        {
        "text": "blurry, bad",
        "weight": -1
        }
    ],
    }

    headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": f"Bearer {os.environ.get('STABILITY_API_KEY')}",
    }

    response = requests.post(
        url,
        headers=headers,
        json=body,
        )

    if response.status_code != 200:
        raise Exception("Non-200 response: " + str(response.text))

    data = response.json()

    # make sure the out directory exists
    if not Path.exists(IMAGE_DIR):
        os.makedirs(IMAGE_DIR)

    for i, image in enumerate(data["artifacts"]):
        with open(IMAGE_DIR / f'txt2img_{prompt}_{image["seed"]}.png', "wb") as f:
            f.write(base64.b64decode(image["base64"]))
        
        with open(IMAGE_DIR / f'txt2img_{prompt}_{image["seed"]}.txt', "wb") as f:
            f.write(base64.b64decode(image["base64"]))
        
        return image['base64']

def imageComparisonSIFTLocal(userImage, objectiveImage):
    img1 = cv.imread(str(userImage),cv.IMREAD_GRAYSCALE)          # queryImage
    img2 = cv.imread(str(objectiveImage),cv.IMREAD_GRAYSCALE)     # trainImage
    img2 = cv.resize(img2, (img1.shape[1], img1.shape[0]), interpolation = cv.INTER_AREA)
    # Initiate ORB detector
    orb = cv.ORB_create()
    
    # Initiate SIFT detector
    sift = cv.SIFT_create()

    # find the keypoints and descriptors with ORB
    kp1, des1 = sift.detectAndCompute(img1,None)
    kp2, des2 = sift.detectAndCompute(img2,None)
    # create BFMatcher object
    # bf = cv.BFMatcher(cv.NORM_HAMMING, crossCheck=True)
    bf = cv.BFMatcher()
    
    # Match descriptors.
    #matches = bf.match(des1,des2)
    #matches = bf.match(des1,des2)
    matches = bf.knnMatch(des1,des2,k=2)
 
    # Apply ratio test
    good = []
    for m,n in matches:
        if m.distance < 0.75*n.distance:
            good.append(m)
    
    # cv.drawMatchesKnn expects list of lists as matches.
    img3 = cv.drawMatchesKnn(img1,kp1,img2,kp2,good,None,flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
    # # Sort them in the order of their distance.
    #matches = sorted(matches, key = lambda x:x.distance)
    print("Number of matches:", len(good))
    # # Draw first 10 matches.
    #img3 = cv.drawMatches(img1,kp1,img2,kp2,matches[:10],None,flags=cv.DrawMatchesFlags_NOT_DRAW_SINGLE_POINTS)
    #print(len(matches))
    #plt.imshow(img3),plt.show()
    return len(good)

def imageComparisonSIFT(targetImage, userImage, maxSimilarFeatures=None):
    """Both the target and user images are base64 encoded strings"""
    img1 = base64.b64decode(targetImage)
    img2 = base64.b64decode(userImage)
    npimg1 = np.frombuffer(img1, dtype=np.uint8)
    npimg2 = np.frombuffer(img2, dtype=np.uint8)
    img1 = cv.imdecode(npimg1, 1)          # targetImage
    img2 = cv.imdecode(npimg2, 1)     # userImage
    sift = cv.SIFT_create()

    # find the keypoints and descriptors with ORB
    kp1, des1 = sift.detectAndCompute(img1,None)
    kp2, des2 = sift.detectAndCompute(img2,None)
    
    # create BFMatcher object
    bf = cv.BFMatcher()
    
    # Match descriptors.
    matches = bf.knnMatch(des1,des2,k=2)
 
    # Apply ratio test
    good = []
    for m,n in matches:
        if m.distance < 0.75*n.distance:
            good.append(m)
    
    # # Sort them in the order of their distance.
    good = sorted(good, key = lambda x:x.distance)
    sum_dist_features = sum([x.distance for x in good[:10]])/10    
    print("Best 10 distances", [x.distance for x in good[:10]])
    print("Number of matches:", len(good))
    print("Average distance of first 10 features:", sum_dist_features)
    margin_coeff = 20
    if maxSimilarFeatures:
        len_good = margin_coeff * len(good) if (margin_coeff * len(good)) < maxSimilarFeatures else maxSimilarFeatures
        return len_good/maxSimilarFeatures, maxSimilarFeatures
    else:
        return 1, len(good)

def imageComparisonSSIMLocal(userImage, objectiveImage):
    img1 = cv.imread(str(userImage),cv.IMREAD_GRAYSCALE)          # queryImage
    img2 = cv.imread(str(objectiveImage),cv.IMREAD_GRAYSCALE)     # trainImage
    img2 = cv.resize(img2, (img1.shape[1], img1.shape[0]), interpolation = cv.INTER_AREA)
    ss = structural_similarity(img1, img2)

    print("Structural Similarity:", ss)
    return ss

def imageComparisonSSIM(targetImage, userImage, **kwargs):
    """Both the target and user images are base64 encoded strings"""
    img1 = base64.b64decode(targetImage)
    img2 = base64.b64decode(userImage)
    npimg1 = np.frombuffer(img1, dtype=np.uint8)
    npimg2 = np.frombuffer(img2, dtype=np.uint8)
    img1 = cv.imdecode(npimg1, 1)          # queryImage
    img2 = cv.imdecode(npimg2, 1)     # trainImage
    print("image1 shape: ", img1.shape)
    print("image2 shape: ", img2.shape)
    #img2 = cv.resize(img2, (img1.shape[1], img1.shape[0]), interpolation = cv.INTER_AREA)
    ss = structural_similarity(img1, img2, channel_axis=-1)

    print("Structural Similarity:", ss)
    return ss

def imageComparisonPrompt():
    ## run image through prompt
    ## compare keywords using sentiment analysis or bag of words
    return

def getScore(targetImage, userImage, maxSimilarFeatures=None):
    score = 0
    FUNCTIONS = [imageComparisonSSIM, imageComparisonSIFT]

    for i, func in enumerate(FUNCTIONS):
        int_score = func(
            targetImage=targetImage, 
            userImage=userImage, 
            maxSimilarFeatures=maxSimilarFeatures
        )
        print(int_score)
        
        if isinstance(int_score, tuple):
            maxSimilarFeatures = int_score[1]
            score += int_score[0]*WEIGHTS[i]
        else:
            score += int_score*WEIGHTS[i]

    return score, maxSimilarFeatures

if __name__ == "__main__":
    images= {
        'objectiveImage' :Path('txt2img_circle next to a sqaure_247168195.png'),
        '2' :Path('txt2img_circle next to a sqaure_1773196312.png'),
        '3' :Path('txt2img_circle next to a sqaure_1883391401.png'),
        '4' :Path('txt2img_circle next to a sqaure_4119905347.png'),
        '5' :Path('txt2img_circle next to a sqaure_4267077306.png'),
    }
    # with open('testjson.json', 'r') as j:
    #     images = dict(json.loads(j.read()))
    
    # imageComparisonSIFT(userImage, skyline)
    # imageComparisonSSIM(userImage, skyline)
    print(images.keys())
    for i,j in enumerate(images):
        print("Comparison of objectImage and ", j)
        with open(IMAGE_DIR / images["objectiveImage"], 'rb') as f:
            objImg = base64.b64encode(f.read())

        with open(IMAGE_DIR / images[j], 'rb') as f:
            usrImg = base64.b64encode(f.read())
        print("Similarity score: ", getScore(objImg, usrImg, 100))
        print('-------------------------')
        print()