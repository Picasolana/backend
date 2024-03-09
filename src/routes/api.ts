import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import ContestRoutes from './ContestRoutes';
import SessionRoutes from './SessionRoutes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

const contestRouter = Router();
const sessionRouter = Router();

// **** Session **** //

sessionRouter.post(Paths.Session.New, SessionRoutes.createSession);

sessionRouter.post(
  Paths.Session.Save,
  validate(['sessionId', 'string', 'body'], ['email', 'string', 'body']),
  SessionRoutes.saveSession
);

contestRouter.get(
  Paths.Contest.Submission,
  validate(['sessionId', 'string', 'params'], ['index', 'number', 'params']),
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
  validate(['prompt', 'string', 'body'], ['sessionId', 'string', 'body']),
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
