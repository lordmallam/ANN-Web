/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/lgas              ->  index
 */

'use strict';

import { bulkCreate, getAll, lgaById } from './lga.model';

// Gets a list of Lgas
export function index(req, res, next) {
  getAll()
    .then(res.json.bind(res))
    .catch(next);
}

export const createBulk = (req, res, next) => {
  const payload = req.body;
  bulkCreate(payload)
    .then(res.json.bind(res))
    .catch(next);
};

export const getById = (req, res, next) => {
  const id = req.params.id;
  lgaById(id)
    .then(res.json.bind(res))
    .catch(next);
};
