import Session from '@src/models/Session';

async function exists(sessionId: string): Promise<boolean> {
  return (await Session.exists({ id: sessionId })) ? true : false;
}

async function deleteOldSessions() {
  await Session.deleteMany({
    isSaved: false,
    createdAt: { $lt: new Date(Date.now() - 1000 * 60 * 60 * 1) }, // 1 hour
  });
}

export default { exists, deleteOldSessions };
