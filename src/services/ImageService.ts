import { Score } from '@src/models/Contest';
import env from '@src/constants/EnvVars';

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
}

function scoreImage(
  userImage: ImageBitmap,
  objectiveImage: ImageBitmap
): Score {
  //Compare the user and objective image and return a score
  const score: Score = {
    similarityScore: 0, // TODO
  };

  return score;
}

// **** Export default **** //

export default {
  generateImage,
  scoreImage,
};
