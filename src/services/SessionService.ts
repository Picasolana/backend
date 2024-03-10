import ContestEntry from '@src/models/Contest';
import Session from '@src/models/Session';

async function exists(sessionId: string): Promise<boolean> {
  return (await Session.exists({ sessionId })) ? true : false;
}

async function deleteOldSessions() {
  const oldSessions = await Session.find({
    isSaved: false,
    createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 1) }, // 1 hour
  }).select({ sessionId: true });

  const sessionIds = oldSessions.map((s) => s.sessionId);
  await ContestEntry.deleteMany({
    sessionId: { $in: sessionIds },
  });
  await Session.deleteMany({
    sessionId: { $in: sessionIds },
  });
}

export default { exists, deleteOldSessions };
