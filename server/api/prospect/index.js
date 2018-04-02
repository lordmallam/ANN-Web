'use strict';

var express = require('express');
var controller = require('./prospect.controller');

function route(auth) {
  const router = express.Router();
  router.get('/', controller.index);
  router.get('/approve/:id', auth.permit('can_edit_prospect'), controller.approve);
  router.get('/decline/:id', auth.permit('can_delete_prospect'), controller.decline);
  return router;
}

export default route;
