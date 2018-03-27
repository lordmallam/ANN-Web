'use strict';
import _ from 'lodash';

import { registerUser, registerAgent, allAgents } from './user.model';

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
    .then(agentRows => {
      let agents = agentRows.rows.filter(rec => (rec.doc.type === 'user' && rec.doc.roles.includes('ums_role_agent') && !rec.deleted)).map(rec => {
        const r = _.omit(rec.doc, ['salt', 'password_scheme', 'iterations', 'derived_key'])
        return r
      });
      res.send(agents)
    })
    .catch(next);
};

export { index, register, registerA, getAllAgents };
