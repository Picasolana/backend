import ImageService from './ImageService';
import ContestEntry, { IContestEntry } from '@src/models/Contest';

/**
 * Run one round of the game. Generate and score image off of a prompt
 */
async function submitPrompt(userId: number, prompt: string) {
  const image = await ImageService.generateImage(prompt);
  const targetImage = ImageService.targetImage();
  const score = ImageService.scoreImage(image, targetImage);
  const entry: IContestEntry = { image, prompt, score };
  return entry;
}

async function isEligible(userId: number) {
  const entriesCount = await ContestEntry.countDocuments({ userId });
  return entriesCount < 5;
}

export default {
  submitPrompt,
  isEligible,
} as const;
