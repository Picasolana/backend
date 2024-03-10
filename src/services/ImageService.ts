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
    cfg_scale: 5,
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
  const imagePath = path.join(__dirname, '../public/images/picasso.jpg');
  return fs.readFileSync(imagePath).toString('base64');
}

async function scoreImage(userImage: string, targetImage: string) {
  const response = await fetch('http://127.0.0.1:8000/getScore', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      userImage,
      targetImage,
    }),
  });

  if (!response.ok) {
    throw new Error(`Non-200 response: ${await response.text()}`);
  }
  const responseJSON = (await response.json()) as unknown;

  if (
    responseJSON &&
    typeof responseJSON === 'object' &&
    'score' in responseJSON &&
    typeof responseJSON.score === 'number' &&
    'status' in responseJSON
  ) {
    return responseJSON.score;
  }

  throw new Error('No response');
}

// **** Export default **** //

export default {
  generateImage,
  scoreImage,
  targetImage,
};
