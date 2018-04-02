'use strict';

import express from 'express';
import { index, register, registerA, getAllAgents, getMemberId, getAssignAgent, getRemoveAgent } from './user.controller';



const route = auth => {
  var router = express.Router();
  router.get('/', index);
  router.post('/register', register);
  router.post('/register/agent', registerA);
  router.get('/agents', auth.permit('can_delete_user'), getAllAgents);
  router.get('/assign-agent/:id', auth.permit('can_delete_user'), getAssignAgent);
  router.get('/remove-agent/:id', auth.permit('can_delete_user'), getRemoveAgent);
  return router;
};



export default route;
