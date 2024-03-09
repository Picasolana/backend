import { IContestEntry } from '@src/models/Contest';
import { IUser } from '@src/models/User';
import orm from './MockOrm';

async function addEntry(
  user: IUser,
  contestEntry: IContestEntry
): Promise<void> {
  const db = await orm.openDb();
  if (!db.contest[user.id]) {
    db.contest[user.id] = [];
  }
  db.contest[user.id].push(contestEntry);
  return orm.saveDb(db);
}

async function getAllEntries(user: IUser): Promise<IContestEntry[]> {
  const db = await orm.openDb();
  return db.contest[user.id] || [];
}

async function getEntryCount(user: IUser): Promise<number> {
  const db = await orm.openDb();
  return (db.contest[user.id] || []).length;
}

export default {
  addEntry,
  getAllEntries,
  getEntryCount,
};
