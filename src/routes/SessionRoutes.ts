import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import Session from '@src/models/Session';
import { v4 as uuidv4 } from 'uuid';
import User from '@src/models/User';
import ContestService from '@src/services/ContestService';
import { generateUsername } from 'unique-username-generator';

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
  const sessionId = uuidv4();
  await Session.create({ sessionId });
  return res.status(HttpStatusCodes.OK).json({ sessionId });
}

async function saveSession(
  req: IReq<{
    sessionId: string;
    email?: string;
    telegramHandle?: string;
    solanaAddress?: string;
  }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, email, telegramHandle, solanaAddress } = req.body;
  const session = await Session.findOne({ sessionId });
  if (!session || session.isSaved) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Invalid session' });
  }
  if (!telegramHandle && !email && !solanaAddress) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Email, telegram or solana address required' });
  }

  const user = await User.findOne({ email, telegramHandle });
  if (!user) {
    const bestEntry = await ContestService.getBestEntry(sessionId);
    const userName = generateUsername(' ', 0, 20);
    await User.create({
      sessionId,
      bestContestEntryIndex: bestEntry.index,
      bestScore: bestEntry.score,
      name: userName,
      email,
      telegramHandle,
      solanaAddress,
    });
    await session.updateOne({ isSaved: true });
    return res.status(HttpStatusCodes.OK).end();
  }
  return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ error: 'Email or handle already in use' });
}

async function getSessionIdFromTelegram(
  req: IReq<{ telegramHandle: string }>,
  res: IRes
): Promise<IRes> {
  const { telegramHandle } = req.params;
  const user = await User.findOne({ telegramHandle });
  if (!user) {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'User not found' });
  }
  return res
    .status(HttpStatusCodes.OK)
    .json({ sessionId: user.sessionId, userName: user.name });
}

async function getSessionIdFromEmail(
  req: IReq<{ email: string }>,
  res: IRes
): Promise<IRes> {
  const { email } = req.params;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .json({ error: 'User not found' });
  }
  return res
    .status(HttpStatusCodes.OK)
    .json({ sessionId: user.sessionId, userName: user.name });
}

export default {
  createSession,
  saveSession,
  getSessionIdFromTelegram,
  getSessionIdFromEmail,
};
