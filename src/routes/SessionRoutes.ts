import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import Session from '@src/models/Session';
import { v4 as uuidv4 } from 'uuid';
import User from '@src/models/User';

async function createSession(req: IReq, res: IRes): Promise<IRes> {
  const id = uuidv4();
  const session = await Session.create({ id });
  if (!session) {
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to create session' });
  }
  return res.status(HttpStatusCodes.OK).json({ sessionId: id });
}

async function saveSession(
  req: IReq<{ sessionId: string; email: string }>,
  res: IRes
): Promise<IRes> {
  const { sessionId, email } = req.body;
  const session = await Session.findOne({ id: sessionId });
  if (!session) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: 'Session does not exist' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    await User.create({ currentSessionId: sessionId, email });
    return res.status(HttpStatusCodes.OK).end();
  }

  return res
    .status(HttpStatusCodes.BAD_REQUEST)
    .json({ error: 'User already exists' });
}

export default { createSession, saveSession };
