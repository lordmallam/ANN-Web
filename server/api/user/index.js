'use strict';

import express from 'express';
import { index, register, registerA, getAllAgents } from './user.controller';

var router = express.Router();

router.get('/', index);
router.post('/register', register);
router.post('/register/agent', registerA);
router.get('/agents', getAllAgents);

module.exports = router;
