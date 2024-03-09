import { IUser } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';
import ImageService from './ImageService';
import ContestRepo from '@src/repos/ContestRepo';
import { IContestEntry } from '@src/models/Contest';

/**
 * Run one round of the game. Generate and score image off of a prompt
 */
async function submitPrompt(user: IUser, prompt: string) {
  if (!UserRepo.persists(user.id)) {
    UserRepo.add(user);
  }
  const image = await ImageService.generateImage(prompt);
  const targetImage = ImageService.targetImage();
  const score = ImageService.scoreImage(image, targetImage);
  const entry: IContestEntry = { image, prompt, score };
  ContestRepo.addEntry(user, entry);
  return entry;
}

async function isEligible(user: IUser) {
  const entriesCount = await ContestRepo.getEntryCount(user);

  return entriesCount < 5;
}

export default {
  submitPrompt,
  isEligible,
} as const;
