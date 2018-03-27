/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/states              ->  index
 */

'use strict';

import { bulkCreate, stateByName, getAll, stateById } from './state.model';

// Gets a list of States
export const index = (req, res, next) => {
  getAll()
    .then(res.json.bind(res))
    .catch(next);
};

export const createBulk = (req, res, next) => {
  const payload = req.body;
  bulkCreate(payload)
    .then(res.json.bind(res))
    .catch(next);
};

export const getByName = (req, res, next) => {
  const name = req.params.name;
  stateByName(name)
    .then(res.json.bind(res))
    .catch(next);
};

export const getById = (req, res, next) => {
  const id = req.params.id;
  stateById(id)
    .then(res.json.bind(res))
    .catch(next);
};
