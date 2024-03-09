// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

export enum UserRoles {
  Standard,
  Admin,
}


// **** Types **** //

export interface Score {
  similarityScore: number
  // need a property for each seperate score weight we will consider
  // need a property for score weights
}

// **** Functions **** //

/**
 * Get similarity score
 */
export function getSimilarityScore(
  userImage: ImageBitmap,
  objective: ImageBitmap,
): number {
    var score = 0;
  return score;
}

// **** Export default **** //

