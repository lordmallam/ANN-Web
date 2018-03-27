/**
 * Main application routes
 */

'use strict';

import express from 'express';
import openRoutes from './api/open/open.route';
import userRoutes from './api/user';
import memberRoutes from './api/member';
import stateRoutes from './api/state';
import lgasRoutes from './api/lga';
import prospectsRoute from './api/prospect';

export default function routes(auth) {
  const router = express.Router();
  router.use('/', openRoutes);
  router.use('/users', userRoutes);
  router.use('/members', memberRoutes(auth));
  router.use('/states', stateRoutes);
  router.use('/lgas', lgasRoutes);
  router.use('/prospects', prospectsRoute(auth));
  router.use((req, res, next) => {
    console.log('%s %s %s', req.method, req.url, req.path); // eslint-disable-line no-console
    next();
  });
  return router;
}
