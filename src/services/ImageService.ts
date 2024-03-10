import env from '@src/constants/EnvVars';
import path from 'path';
import fs from 'fs';

/**
 * Generate image off of prompt
 */
async function generateImage(prompt: string) {
  const path =
    'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.StabilityAI.apiKey}`,
  };

  const body = {
    steps: 40,
    width: 1024,
    height: 1024,
    seed: 0,
    cfg_scale: 35,
    samples: 1,
    text_prompts: [
      {
        text: prompt,
        weight: 1,
      },
    ],
  };

  const response = await fetch(path, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }

  const responseJSON = (await response.json()) as {
    artifacts: { seed: number; base64: string }[];
  } | null;

  if (responseJSON) {
    return responseJSON.artifacts[0].base64;
  }
  throw new Error('No response');
}

function targetImage() {
  const todayJsonPath = path.join(__dirname, '../public/today.json');
  const todayJson = JSON.parse(fs.readFileSync(todayJsonPath, 'utf8')) as {
    generatedImage: string;
  };

  return todayJson.generatedImage;
}

function maxSimilarFeatures() {
  const todayJsonPath = path.join(__dirname, '../public/today.json');
  const todayJson = JSON.parse(fs.readFileSync(todayJsonPath, 'utf8')) as {
    score: { maxSimilarFeatures: number };
  };

  return todayJson.score.maxSimilarFeatures;
}

async function scoreImage(
  userImage: string,
  targetImage: string,
  maxSimilarFeatures?: number
) {
  const response = await fetch('http://127.0.0.1:8000/getScore', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      userImage,
      targetImage,
      maxSimilarFeatures,
    }),
  });

  const responseJSON = (await response.json()) as unknown;

  if (
    responseJSON &&
    typeof responseJSON === 'object' &&
    'score' in responseJSON &&
    typeof responseJSON.score === 'number' &&
    'maxSimilarFeatures' in responseJSON &&
    typeof responseJSON.maxSimilarFeatures === 'number'
  ) {
    return {
      score: responseJSON.score * 100,
      maxSimilarFeatures: responseJSON.maxSimilarFeatures,
    };
  }

  throw new Error('Error scoring image ');
}

// **** Export default **** //

export default {
  generateImage,
  scoreImage,
  targetImage,
  maxSimilarFeatures,
};
