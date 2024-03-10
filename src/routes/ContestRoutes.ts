import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import ImageService from '@src/services/ImageService';
import ContestEntry from '@src/models/Contest';
import Session from '@src/models/Session';
import User from '@src/models/User';
import ContestService from '@src/services/ContestService';

function getTargetImage(_req: IReq, res: IRes): IRes {
  const targetImage = ImageService.targetImage();
  if (targetImage) {
    return res.status(HttpStatusCodes.OK).json({
      image: 'data:image/jpeg;base64,' + targetImage,
    });
  }

  return res
    .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Could not read image' });
}

async function submitPrompt(
  req: IReq<{ prompt: string; sessionId: string }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, prompt } = req.body;
  const session = await Session.findOne({ id: sessionId });
  if (!session || session.isSaved) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid session' });
  }

  const entries = await ContestEntry.countDocuments({ sessionId });
  if (entries > 4) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Too many tries' });
  }
  const image = await ImageService.generateImage(prompt);
  const targetImage = ImageService.targetImage();
  const score = ImageService.scoreImage(image, targetImage);

  await ContestEntry.create({
    index: entries,
    sessionId,
    prompt,
    image,
    score,
  });

  return res.status(HttpStatusCodes.OK).json({ image, index: entries, score });
}

async function getSubmission(
  req: IReq<{ sessionId: string; index: number }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, index } = req.params;
  const numericIndex = parseInt(index);

  const entry = await ContestEntry.findOne({
    sessionId,
    index: numericIndex,
  });
  if (!entry) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Not Found' });
  }
  return res.status(HttpStatusCodes.OK).json(entry);
}

async function getLeaderboard(_req: IReq, res: IRes): Promise<IRes> {
  const users = await User.find()
    .sort({ bestScore: -1 })
    .select({
      name: true,
      bestScore: true,
      bestContestEntryIndex: true,
      sessionId: true,
    })
    .limit(20);
  return res.status(HttpStatusCodes.OK).json(users);
}

async function getBestContestEntry(
  req: IReq<{ sessionId: string }>,
  res: IRes
): Promise<IRes> {
  const { sessionId } = req.params;
  const bestEntry = await ContestService.getBestEntry(sessionId);
  if (!bestEntry) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({ error: 'Not Found' });
  }
  return res.status(HttpStatusCodes.OK).json(bestEntry);
}

export default {
  getTargetImage,
  submitPrompt,
  getSubmission,
  getLeaderboard,
  getBestContestEntry,
} as const;
