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
  getImageById,
  getByMemberId,
  memberDelete
} from './member.model';
import config from '../../config/environment';
import { sendResetMail } from '../../utils/helper';

import axios from 'axios'

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

export const byMemberId = (req, res, next) => {
  const id = req.params.id;
  getByMemberId(id)
    .then(res.json.bind(res))
    .catch(next);
};

export const deleteMember = (req, res, next) => {
  const id = req.params.id;
  memberDelete(id)
    .then(res.json.bind(res))
    .catch(next);
};

export const requestPasswordReset = (req, res, next) => {
  const id = req.body.id;
  axios.post(`${config.clientURL}ums/users/request-password-reset`, {id})
    .then(r => {
      sendResetMail(id, r.data.id)
      res.send(`Password reset email sent to ${id}`)
    })
    .catch(err => {
      next(err)
    })
}

export const passwordReset = (req, res, next) => {
  const token = req.body.token;
  const password = req.body.password;
  axios.post(`${config.clientURL}ums/users/reset-password`, {token, password})
    .then(r => {
      res.send(`Password reset for ${r.name}`)
    })
    .catch(err => {
      res.status(500).send(err.response.data)
    })
}
