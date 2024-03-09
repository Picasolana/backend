import UserRepo from '@src/repos/UserRepo';
import { IUser } from '@src/models/User';
import { Score, getSimilarityScore } from '@src/models/Score';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';



// **** Variables **** //


// **** Functions **** //

/**
 * Run one round of the game. Generate and score image off of a prompt
 */
function playRound(user: IUser, prompt: String, ): Promise<void> {
    return UserRepo.add(user);
}

/**
 * Generate image off of prompt
 */
function generateImage(prompt: string): Promise<void> {
    //Call the stability API to generate an image based off a prompt
    
}

function scoreImage(userImage: ImageBitmap, objectiveImage: ImageBitmap): Promise<Score> {
    //Compare the user and objective image and return a score
    var score :Score= {similarityScore: getSimilarityScore(userImage, objectiveImage)}

    return score;
}

// **** Export default **** //

// export default {
//   getAll,
//   addOne,
//   updateOne,
//   delete: _delete,
// } as const;
