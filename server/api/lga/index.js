'use strict';

var express = require('express');
var controller = require('./lga.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/by-id/:id', controller.getById);
router.post('/bulk', controller.createBulk);

module.exports = router;
