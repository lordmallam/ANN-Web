'use strict';
import _ from 'lodash';

import { registerUser, registerAgent, allAgents, getByMemberId, assignAgent, removeAgent } from './user.model';

// Gets a list of Users
const index = (req, res) => {
  res.json([]);
};

const register = (req, res, next) => {
  const payload = req.body;
  registerUser(payload)
    .then(res.json.bind(res))
    .catch(next);
};

const registerA = (req, res, next) => {
  const payload = req.body;
  registerAgent(payload)
    .then(res.json.bind(res))
    .catch(next);
};

const getAllAgents = (req, res, next) => {
  allAgents()
    .then(res.json.bind(res))
    .catch(next);
};

const getMemberId = (req, res, next) => {
  const id = req.params.id;
  getByMemberId(id)
    .then(res.json.bind(res))
    .catch(next);
};

const getAssignAgent = (req, res, next) => {
  const id = req.params.id;
  assignAgent(id)
    .then(res.json.bind(res))
    .catch(next);
};

const getRemoveAgent = (req, res, next) => {
  const id = req.params.id;
  removeAgent(id)
    .then(res.json.bind(res))
    .catch(next);
};

export { index, register, registerA, getAllAgents, getMemberId, getAssignAgent, getRemoveAgent };
