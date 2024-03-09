import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import ContestRoutes from './ContestRoutes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

const contestRouter = Router();
const sessionRouter = Router();

// **** Session **** //

sessionRouter.post(Paths.Session.New);

apiRouter.post(
  Paths.Session.Save,
  validate(['sessionId', 'number', 'body'], ['email', 'string', 'body'])
  // TODO
);

contestRouter.get(
  Paths.Contest.Submission,
  validate(['sessionId', 'number', 'params'], ['index', 'number', 'params']),
  ContestRoutes.getSubmission
);

// **** Contest **** //
// Leaderboard
contestRouter.get(
  Paths.Contest.Leaderboard
  // TODO
);

// Submit
contestRouter.post(
  Paths.Contest.Submit,
  validate(['prompt', 'string', 'body'], ['sessionId', 'number', 'body']),
  ContestRoutes.submitPrompt
);

// Image
contestRouter.get(Paths.Contest.Target, ContestRoutes.getTargetImage);

// Mint
contestRouter.post(
  Paths.Contest.Mint
  // TODO
);

apiRouter.use(Paths.Contest.Base, contestRouter);
apiRouter.use(Paths.Session.Base, sessionRouter);

export default apiRouter;
