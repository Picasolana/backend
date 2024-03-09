import { IUser } from '@src/models/User';
import UserRepo from '@src/repos/UserRepo';

/**
 * Run one round of the game. Generate and score image off of a prompt
 */
function submitPrompt(user: IUser, prompt: string) {
  return UserRepo.add(user);

  // generate image
  // score image
  //   return image + score
}
