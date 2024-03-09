import Session from '@src/models/Session';

async function exists(sessionId: string): Promise<boolean> {
  return (await Session.exists({ id: sessionId })) ? true : false;
}

export default { exists };
