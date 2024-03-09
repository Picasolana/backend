import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import ContestRoutes from './ContestRoutes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// **** Session **** //

apiRouter.post(Paths.Session.New);

apiRouter.post(
  Paths.Session.Save,
  validate(['sessionId', 'number', 'body'], ['email', 'string', 'body'])
  // TODO
);

// **** Contest **** //
// Leaderboard
apiRouter.get(
  Paths.Contest.Leaderboard
  // TODO
);

// Submit
apiRouter.post(
  Paths.Contest.Submit,
  validate(['prompt', 'string', 'body'], ['sessionId', 'number', 'body']),
  ContestRoutes.submitPrompt
);

// Image
apiRouter.get(Paths.Contest.Target, ContestRoutes.getImage);

// Mint
apiRouter.post(
  Paths.Contest.Mint
  // TODO
);

export default apiRouter;
