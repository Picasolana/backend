import { Score } from '@src/models/Score';

// **** Variables **** //

// **** Functions **** //

/**
 * Generate image off of prompt
 */
function generateImage(prompt: string): Promise<void> {
  // TODO Call the stability API to generate an image based off a prompt
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
