import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import ImageService from '@src/services/ImageService';
import ContestEntry from '@src/models/Contest';

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
  req: IReq<{ prompt: string; sessionId: number }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, prompt } = req.body;
  const isEligible = (await ContestEntry.countDocuments({ sessionId })) < 5;
  if (!isEligible) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'User is not eligible' });
  }
  const image = await ImageService.generateImage(prompt);
  const targetImage = ImageService.targetImage();
  const score = ImageService.scoreImage(image, targetImage);

  await ContestEntry.create({ sessionId, prompt, image, score });

  return res.status(HttpStatusCodes.OK).json({ score });
}

async function getSubmission(
  req: IReq<{ sessionId: number; index: number }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, index } = req.params;
  const numericSessionId = parseInt(sessionId);
  const numericIndex = parseInt(index);

  // TODO Optimize this query
  const entries = await ContestEntry.find({
    sessionId: numericSessionId,
  }).sort({
    createdAt: -1,
  });

  if (entries.length == 0 || entries.length <= numericIndex) {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'Invalid index' });
  }

  return res.status(HttpStatusCodes.OK).json(entries[numericIndex]);
}

// async function getLeaderboard(_req: IReq, res: IRes): Promise<IRes> {
//   // Select sessions with e-mail
//   const usersWithEmail = await User.find({ email: { $exists: true } });
//   const leaderboard = await ContestEntry.find({
//     sessionId: usersWithEmail.map((user) => user.id),
//   });
//   return res.status(HttpStatusCodes.OK).json({ leaderboard });
// }

export default {
  getTargetImage,
  submitPrompt,
  getSubmission,
} as const;
