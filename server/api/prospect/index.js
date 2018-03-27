'use strict';

var express = require('express');
var controller = require('./prospect.controller');

function route(auth) {
  const router = express.Router();
  router.get('/', controller.index);
  router.get('/approve/:id', controller.approve);
  return router;
}

export default route;
