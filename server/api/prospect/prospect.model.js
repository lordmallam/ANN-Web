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
      const prospect = _.first(res.map(rec => (rec.doc)));
      newMember(prospect)
        .then(res => {
          prospect.is_deleted = true;
          prospect.approvedOn = new Date();
          updateDoc(prospect, prospect)
            .catch(err => console.log(err));
          resolve(res);
        })
        .catch(err => reject(err))
    })
    .catch(err => reject(err))
}));

export { allProspects, approveProspect };
