import jsonfile from 'jsonfile';

import { IUser } from '@src/models/User';
import { IContestEntry } from '@src/models/Contest';

// **** Variables **** //

const DB_FILE_NAME = 'database.json';

// **** Types **** //

interface IDb {
  users: IUser[];
  contest: Record<number, IContestEntry[]>; // map from user id to contest entry
}

// **** Functions **** //

/**
 * Fetch the json from the file.
 */
function openDb(): Promise<IDb> {
  return jsonfile.readFile(__dirname + '/' + DB_FILE_NAME) as Promise<IDb>;
}

/**
 * Update the file.
 */
function saveDb(db: IDb): Promise<void> {
  return jsonfile.writeFile(__dirname + '/' + DB_FILE_NAME, db);
}

// **** Export default **** //

export default {
  openDb,
  saveDb,
} as const;
