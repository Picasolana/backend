import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import Session from '@src/models/Session';
import { v4 as uuidv4 } from 'uuid';
import User from '@src/models/User';
import ContestService from '@src/services/ContestService';

async function createSession(
  req: IReq<{ telegramHandle?: string }>,
  res: IRes
): Promise<IRes> {
  if (req.body.telegramHandle) {
    const user = await User.findOne({
      telegramHandle: req.body.telegramHandle,
    });
    if (user) {
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ error: 'Telegram handle already in use' });
    }
  }
  const id = uuidv4();
  await Session.create({ id });
  return res.status(HttpStatusCodes.OK).json({ sessionId: id });
}

async function saveSession(
  req: IReq<{ sessionId: string; email: string }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, email } = req.body;
  const session = await Session.findOne({ id: sessionId });
  if (!session || session.isSaved) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid session' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    await session.updateOne({ isSaved: true });
    const bestEntry = await ContestService.getBestEntry(sessionId);
    await User.create({
      currentSessionId: sessionId,
      bestContentEntryIndex: bestEntry.index,
      email,
    });
    return res.status(HttpStatusCodes.OK).end();
  }
  return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ error: 'Email already in use' });
}

export default { createSession, saveSession };
