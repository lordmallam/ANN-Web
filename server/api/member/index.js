'use strict';

var express = require('express');
var controller = require('./member.controller');

function route(auth) {
  const router = express.Router();
  router.get('/', controller.index);
  router.post('/register', controller.register);
  router.post('/agent/register', controller.agentRegister);
  router.get('/register/resend/:id', controller.sendActivationMail);
  router.get('/register/activation/:ac', controller.byActivationCode);
  router.put('/register/activation/:ac', controller.confirmation);
  router.get('/:id', auth.isAuthenticated(), controller.me);
  router.put('/:id', auth.isAuthenticated(), controller.update);
  router.get('/by-email/:email', controller.byEmail);
  router.get('/image/:id', controller.getImage);
  return router;
}

export default route;
