/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/prospects              ->  index
 */

'use strict';

import {
  allProspects,
  approveProspect
} from './prospect.model';

// Gets a list of Prospects
export function index(req, res, next) {
  allProspects()
    .then(res.json.bind(res))
    .catch(next);
}

export function approve(req, res, next) {
  const id = req.params.id;
  approveProspect(id)
    .then(res.json.bind(res))
    .catch(next);
}
