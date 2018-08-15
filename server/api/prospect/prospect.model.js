import PouchDB from 'pouchdb';
import _ from 'lodash';
import config from '../../config/environment';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { createRandomString, sendActivationMail, isEmpty, sendMemberMail } from '../../utils/helper';
import { getView, saveDoc, getDocById, updateDoc, getViewWithAttachments } from '../../components/db';
import { DB_VIEWS, DOC_TYPES } from '../../components/db/constants';
import { newMember } from '../member/member.model';

const { url, dbName } = config.couchdb;

const db = new PouchDB(`${url}/${dbName}`);

const allProspects = () => (new Promise((resolve, reject) => {
  getView(DB_VIEWS.prospect.byId)
    .then(res => resolve(res))
    .catch(err => reject(err))
}));

const approveProspect = Id => (new Promise((resolve, reject) => {
  getViewWithAttachments(DB_VIEWS.prospect.byId, Id, true, true)
    .then(res => {
      let prospect = _.first(res.map(rec => (rec.doc)));
      newMember(prospect)
        .then(res => {
          const newValues = {
            is_deleted: true,
            approvedOn: new Date(),
            status: 'approved'
          }
          updateDoc(prospect, newValues)
            .then(res => resolve(allProspects()))
            .catch(err => console.log(err));
        })
        .catch(err => reject(err))
    })
    .catch(err => reject(err))
}));


const declineProspect = Id => (new Promise((resolve, reject) => {
  getView(DB_VIEWS.prospect.byId, Id)
    .then(res => {
      let prospect = _.first(res.map(rec => (rec.doc)));
      const newValues = {
        is_deleted: true,
        declinedOn: new Date(),
        status: 'declined'
      }
      updateDoc(prospect, newValues)
        .then(res => resolve(allProspects()))
        .catch(err => console.log(err));
    })
    .catch(err => reject(err))
}));

const newProspect = user => (new Promise((resolve, reject) => {
  if (validateUser(user)) {
    getView(DB_VIEWS.prospect.byEmail, user.email)
      .then(res => {
        if (res.length) {
          reject(new BadRequestError('A member has already applied with the provided email'))
        } else {
          let memberDoc = user;
          memberDoc.doc_type = DOC_TYPES.prospect;
          saveDoc(memberDoc, true)
            .then(res => {
              resolve(res);
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => {
        reject(err);
      });
  } else {
    reject(new BadRequestError('Invalid member information'));
  }
}));

const getById = id => (new Promise((resolve, reject) => {
  getViewWithAttachments(DB_VIEWS.prospect.byId, id, true, true)
    .then(res => {
      if (res.length) {
        resolve(_.first(res).doc);
      } else {
        reject(new NotFoundError('No such member registered'));
      }
    })
    .catch(err => reject(err));
}));

const validateUser = user => {
  if (!user) {
    return false;
  }
  if (!user.email || !user.firstname || !user.surname) {
    return false;
  }
  return true;
};

export { allProspects, approveProspect, declineProspect, newProspect, getById };
