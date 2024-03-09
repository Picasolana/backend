// **** Variables **** //

export enum UserRoles {
  Standard,
  Admin,
}

// **** Types **** //

export interface Score {
  similarityScore: number;
  // need a property for each seperate score weight we will consider
  // need a property for score weights
}

// **** Export default **** //
