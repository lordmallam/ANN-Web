'use strict';

import { createBulkDoc, getView, getDocById } from '../../components/db';
import { DOC_TYPES, DB_VIEWS } from '../../components/db/constants';

const bulkCreate = lgas => {
  const lgasWithDocTypes = lgas.map(lga => (Object.assign(lga, { doc_type: DOC_TYPES.lga })));
  return createBulkDoc(lgasWithDocTypes);
};

const getAll = () => (getView(DB_VIEWS.lga.all));

const lgaById = id => (getDocById(id));

export {
  bulkCreate,
  getAll,
  lgaById
};
