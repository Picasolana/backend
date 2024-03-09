import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import { IReq, IRes } from './types/express/misc';
import Session from '@src/models/Session';
import { v4 as uuidv4 } from 'uuid';

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

export default { createSession };
