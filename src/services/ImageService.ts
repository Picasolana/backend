import env from '@src/constants/EnvVars';
import path from 'path';
import fs from 'fs';
import { randomInt } from 'crypto';

// **** Variables **** //

// **** Functions **** //

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
      {
        text: 'blurry, bad',
        weight: -1,
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

function scoreImage(userImage: string, targetImage: string): number {
  // TODO implement actual comparing logic
  return randomInt(0, 100);
}

// **** Export default **** //

export default {
  generateImage,
  scoreImage,
  targetImage,
};
