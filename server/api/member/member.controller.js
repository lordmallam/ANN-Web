/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/members              ->  index
 */

'use strict';

import {
  newMember,
  resendActivationMail,
  getByActivationCode,
  confirmMember,
  getById,
  newAgentMember,
  allMembers,
  updateProfile,
  getByEmail,
  getImageById
} from './member.model';

// Gets a list of Members
export function index(req, res, next) {
  allMembers()
    .then(res.json.bind(res))
    .catch(next);
}

export const register = (req, res, next) => {
  const payload = req.body;
  newMember(payload)
    .then(res.json.bind(res))
    .catch(next);
};

export const agentRegister = (req, res, next) => {
  const payload = req.body;
  newAgentMember(payload)
    .then(res.json.bind(res))
    .catch(next);
};

export const sendActivationMail = (req, res, next) => {
  const id = req.params.id;
  resendActivationMail(id)
    .then(res.json.bind(res))
    .catch(next);
};

export const byActivationCode = (req, res, next) => {
  const ac = req.params.ac;
  getByActivationCode(ac)
    .then(res.json.bind(res))
    .catch(next);
}; 

export const confirmation = (req, res, next) => {
  const payload = req.body;
  const ac = req.params.ac;
  confirmMember(payload, ac)
    .then(res.json.bind(res))
    .catch(next);
};

export const update = (req, res, next) => {
  const payload = req.body;
  const id = req.params.id;
  updateProfile(payload, id)
    .then(res.json.bind(res))
    .catch(next);
};

export const me = (req, res, next) => {
  const id = req.params.id;
  getById(id)
    .then(res.json.bind(res))
    .catch(next);
};

export const byEmail = (req, res, next) => {
  const email = req.params.email;
  getByEmail(email)
    .then(res.json.bind(res))
    .catch(next);
};

export const getImage = (req, res, next) => {
  const id = req.params.id;
  getImageById(id)
    .then(res.json.bind(res))
    .catch(next);
};

