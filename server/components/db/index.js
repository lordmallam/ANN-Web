import PouchDB from 'pouchdb';
import { omit } from 'lodash';
import config from '../../config/environment';
import { NotFoundError, ConflictError } from '../../utils/errors';

export const db = new PouchDB(`${config.couchdb.url}/${config.couchdb.dbName}`);

const fetchView = (...params) => {
  const [view, key, include_docs, startkey, endkey, attachments] = params; // eslint-disable-line camelcase
  const options = { key, include_docs, startkey, endkey, attachments };
  return db.query(view, options);
};

const getDocById = id =>
  new Promise((resolve, reject) => {
    const err = new NotFoundError(`Document with ID ${id} does not exist`);
    db.get(id)
      .then(resolve)
      .catch(() => {
        reject(err);
      });
  });

const addDateStamp = doc => {
  const date = new Date().toJSON();
  const docObj = doc;
  if(docObj.createdOn) {
    docObj.modifiedOn = date;
  } else {
    docObj.createdOn = date;
  }
  return docObj;
};

const saveDoc = (doc, usePost = false) => {
  const datedDoc = addDateStamp(doc);
  const method = usePost ? 'post' : 'put';
  return  db[method](datedDoc)
    .then(res => getDocById(res.id))
    .catch(err => {
      throw new Error(err.message);
    });
};

const createDoc = doc => {
  const err = new ConflictError(`Document with ID ${doc._id} already exists`);
  return new Promise((resolve, reject) => {
    db.get(doc._id)
    .then(foundDoc => {
      if(foundDoc.deleted) {
        return resolve(saveDoc(Object.assign(doc, { _rev: foundDoc._rev, deleted: false })));
      }
      return reject(err);
    })
    .catch(() => {
      resolve(saveDoc(doc));
    });
  });
};

const createBulkDoc = docList => {
  const datedDocList = docList.map(doc => addDateStamp(doc));
  return db.bulkDocs(datedDocList)
    .then(res => res);
};

const updateDoc = (doc, updatedDoc, ...propsToDelete) => {
  const finalDoc = Object.assign(doc, updatedDoc);
  finalDoc.modifiedOn = new Date().toJSON();
  return saveDoc(omit(finalDoc, propsToDelete));
};

const deleteDoc = (id, rev) => db.remove(id, rev).then(res => res);

const getView = (view, key, includeDocs = true) =>
  fetchView(view, key, includeDocs)
    .then(res => res.rows);

const getViewByKeys = (view, startKey, endKey, includeDocs = true) =>
  fetchView(view, undefined, includeDocs, startKey, endKey)
    .then(res => res.rows);

const getViewWithAttachments = (view, key, includeDocs = true, attachments = false) =>
  fetchView(view, key, includeDocs, undefined, undefined, attachments)
    .then(res => res.rows);

const docsByView = view => getView(view)
  .then(result => result.map(row => row.doc));


export {
  getView,
  saveDoc,
  createDoc,
  updateDoc,
  getDocById,
  deleteDoc,
  createBulkDoc,
  getViewByKeys,
  docsByView,
  getViewWithAttachments
};
