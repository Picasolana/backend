/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';
import cors from 'cors';
import { schedule as cronSchedule } from 'node-cron';

import mongoose from 'mongoose';
import SessionService from './services/SessionService';
import ContestService from './services/ContestService';

// **** Variables **** //

const app = express();

// **** Setup **** //
// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
ContestService.init('Solana blockchain painted by Picasso.');

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
cronSchedule('*/60 * * * *', SessionService.deleteOldSessions);

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

// Add error handler
app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
      logger.err(err, true);
    }
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

mongoose
  .connect(EnvVars.Mongo.Uri)
  .then(() => logger.info('MongoDB connected...'))
  .catch((err) => {
    logger.err('MongoDB connection error', true);
    console.error(err);
  });

mongoose.connection.on('error', (err) => {
  logger.err('MongoDB error: ' + err, true);
});

export default app;
