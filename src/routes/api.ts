import { Router } from 'express';
import jetValidator from 'jet-validator';

import Paths from '../constants/Paths';
import User from '@src/models/User';
import UserRoutes from './UserRoutes';
import ContestRoutes from './ContestRoutes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Get, UserRoutes.getAll);

// Add one user
userRouter.post(
  Paths.Users.Add,
  validate(['user', User.isUser]),
  UserRoutes.add
);

// Update one user
userRouter.put(
  Paths.Users.Update,
  validate(['user', User.isUser]),
  UserRoutes.update
);

// Delete one user
userRouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserRoutes.delete
);

const contestRouter = Router();

// Leaderboard
contestRouter.get(
  Paths.Contest.Leaderboard
  // TODO
);

// Submit
contestRouter.post(
  Paths.Contest.Submit,
  validate(['prompt', 'string', 'body'], ['user', User.isUser, 'body']),
  ContestRoutes.submitPrompt
);

// Image
contestRouter.get(Paths.Contest.Image, ContestRoutes.getImage);

// Mint
contestRouter.post(
  Paths.Contest.Mint
  // TODO
);

// Add UserRouter
apiRouter.use(Paths.Users.Base, userRouter);
apiRouter.use(Paths.Contest.Base, contestRouter);

// **** Export default **** //

export default apiRouter;
