'use strict';

var express = require('express');
var controller = require('./state.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/by-name/:name', controller.getByName);
router.get('/by-id/:id', controller.getById);
router.post('/bulk', controller.createBulk);

module.exports = router;
