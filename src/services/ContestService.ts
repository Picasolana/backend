import ContestEntry from '@src/models/Contest';

async function getBestEntry(sessionId: string) {
  const entries = await ContestEntry.find({ sessionId }).sort({
    score: -1,
  });
  return entries[0];
}

export default { getBestEntry };
