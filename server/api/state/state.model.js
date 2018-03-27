'use strict';

import { createBulkDoc, getView, getDocById } from '../../components/db';
import { DOC_TYPES, DB_VIEWS } from '../../components/db/constants';

const bulkCreate = states => {
  const statesWithDocTypes = states.map(state => (Object.assign(state, { doc_type: DOC_TYPES.state })));
  return createBulkDoc(statesWithDocTypes);
};

const stateByName = name => (getView(DB_VIEWS.state.byName, name));

const stateById = id => (getDocById(id));

const getAll = () => (getView(DB_VIEWS.state.all));

export {
  bulkCreate,
  stateByName,
  getAll,
  stateById
};
