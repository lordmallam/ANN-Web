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

export { allProspects, approveProspect, declineProspect };
