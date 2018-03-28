import PouchDB from 'pouchdb';
import _ from 'lodash';
import config from '../../config/environment';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { createRandomString, sendActivationMail, isEmpty, sendMemberMail } from '../../utils/helper';
import { getView, saveDoc, getDocById, updateDoc, getViewWithAttachments } from '../../components/db';
import { DB_VIEWS, DOC_TYPES } from '../../components/db/constants'
import { registerUser } from '../user/user.model';

const { url, dbName} = config.couchdb;

const db = new PouchDB(`${url}/${dbName}`);

const allMembers = () => (new Promise((resolve, reject) => {
  getView(DB_VIEWS.member.byId)
    .then(res => resolve(res))
    .catch(err => reject(err))
}));
  


const newMember = user => (new Promise((resolve, reject) => {
  if (validateUser(user)) {
    getView(DB_VIEWS.member.byEmail, user.email)
      .then(res => {
        if (res.length) {
          const r = _.first(res).doc;
          if (r.status === 'started') {
            if (r.isMobile) {
              sendActivationMail(r.email, r.firstname, r.activationCode, true);
            } else {
              sendActivationMail(r.email, r.firstname, r.activationCode);
            }
            reject(new BadRequestError('This email is already in use but not active, an email has been sent to your mailbox. Follow the link to active your account'))
          } else {
            reject(new BadRequestError('A member is already registered with the provided email'))
          }
        } else {
          const memberDoc = user;
          memberDoc.doc_type = DOC_TYPES.member;
          memberDoc.status = 'started';
          memberDoc.activationCode = createRandomString(64);
          saveDoc(memberDoc, true)
            .then(res => {
              if (memberDoc.isMobile) {
                sendActivationMail(memberDoc.email, memberDoc.firstname, memberDoc.activationCode, true);
              } else {
                sendActivationMail(memberDoc.email, memberDoc.firstname, memberDoc.activationCode);
              }
              resolve(res);
            })
            .catch(err => reject(err));
        }
      })
      .catch(err => {
        reject(err);
      });
  } else {
    reject(new BadRequestError('Invalid member object'));
  }
}));


const newAgentMember = user => (new Promise((resolve, reject) => {
  if (validateUserAgent(user)) {
    user.email = user.email || null;
    getView(DB_VIEWS.member.byEmail, user.email)
      .then(res => {
        if (res.length) {
          reject(new BadRequestError('A member is already registered with the provided email'))
        } else {
          getView(DB_VIEWS.prospect.byEmail, user.email)
            .then(rPros => {
              if (rPros.length) {
                reject(new BadRequestError('A member is already registered with the provided email'))
              }
              else {
                const memberDoc = user;
                memberDoc.doc_type = DOC_TYPES.prospect;
                memberDoc.status = 'started';
                memberDoc.activationCode = createRandomString(64);
                saveDoc(memberDoc, true)
                  .then(res => {
                    if (memberDoc.email) {
                      sendMemberMail(memberDoc.email, memberDoc.firstname, memberDoc.activationCode);
                    }
                    resolve(res);
                  })
                  .catch(err => reject(err));
              }
            })
            .catch(err => reject(err))          
        }
      })
      .catch(err => {
        reject(err);
      });
  } else {
    reject(new BadRequestError('Invalid member object'));
  }
}));


const validateUserAgent = user => {
  if (!user) {
    return false;
  }
  if (!user.firstname || !user.surname || !user.password) {
    return false;
  }
  return true;
};

const validateUser = user => {
  if (!user) {
    return false;
  }
  if (!user.email || !user.firstname || !user.surname || !user.password) {
    return false;
  }
  return true;
};

const resendActivationMail = id => (new Promise((resolve, reject) => {
  getDocById(id)
    .then(res => {
      if (res.email) {
        res.activationCode = createRandomString(64);
        updateDoc(res)
          .then(uRes => {
            sendActivationMail(res.email, res.firstname, res.activationCode);
            resolve(`Activation email sent to ${res.email}`);
          })
          .catch(err => reject(err));
      } else {
        reject('Not a valid member record');
      }
    })
    .catch(err => reject(err));
}));

const getByActivationCode = activationCode => (new Promise((resolve, reject) => {
  getViewWithAttachments(DB_VIEWS.member.byActivationCode, activationCode, true, true)
    .then(res => {
      if (res.length) {
        resolve(_.omit(_.first(res).doc, 'password'));
      } else {
        reject(new NotFoundError('Invalid registration link. Please follow the link sent to your email address'));
      }
    })
    .catch(err => reject(err));
}));

const getById = id => (new Promise((resolve, reject) => {
  getViewWithAttachments(DB_VIEWS.member.byId, id, true, true)
    .then(res => {
      if (res.length) {
        resolve(_.first(res).doc);
      } else {
        reject(new NotFoundError('No such member registered'));
      }
    })
    .catch(err => reject(err));
}));


const getByEmail = email => (new Promise((resolve, reject) => {
  getView(DB_VIEWS.member.byEmail, email)
    .then(res => {
      if (res.length) {
        resolve(_.first(res).doc);
      } else {
        reject(new NotFoundError('No such member registered'));
      }
    })
    .catch(err => reject(err));
}));

const confirmMember = (member, ac) => (new Promise((resolve, reject) => {
  if (!isValidMemberObj(member)) {
    reject(new BadRequestError('Fill all complusary fields correctly'));
  } else {
    getViewWithAttachments(DB_VIEWS.member.byActivationCode, ac, true, true)
      .then(m_doc => {
        var m = m_doc[0].doc;
        var user = {
          name: m.email,
          email: m.email,
          type: 'user',
          password: m.password,
          firstname: member.firstname,
          surname: member.surname,
          roles: ['ums_role_member'],
          member: m._id
        };
        registerUser(user)
          .then(r => {
            member = _.omit(member, ['email', '_id', '_rev']);
            member.status = 'completed';
            m = _.omit(m, 'password');
            m.activationCode = createRandomString(64);
              updateDoc(m, member)
                .then(update => resolve(update))
                .catch(err => reject(err));
          })
          .catch(err => reject(err));
      })
      .catch(err => reject(err));

  }
}));

const updateProfile = (member, id) => (new Promise((resolve, reject) => {
  if (!isValidMemberObj(member)) {
    reject(new BadRequestError('Fill all complusary fields correctly'));
  } else {
    getViewWithAttachments(DB_VIEWS.member.byId, id, true, true)
      .then(m_doc => {
        member.activationCode = createRandomString(64);
        updateDoc(m_doc, member)
          .then(update => resolve(update))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  }
}));

const getImageById = id => (new Promise((resolve, reject) => {
  getById(id)
  .then(res => {
    resolve({image:
      res._attachments && res._attachments['profile-pic.png'] && res._attachments['profile-pic.png'].data})
  })
  .catch(err => reject(err))
}));

const isValidMemberObj = member => (
  !isEmpty(member.firstname) && !isEmpty(member.surname) && !isEmpty(member.dateOfBirth) && !isEmpty(member.sex)
  && !isEmpty(member.phone) && !isEmpty(member.email) && !isEmpty(member.state) && !isEmpty(member.lga) &&
  !isEmpty(member.residenceAddress) && member.nok !== {});

export {
  newMember,
  resendActivationMail,
  getByActivationCode,
  confirmMember,
  getById,
  newAgentMember,
  allMembers,
  updateProfile,
  getByEmail,
  getImageById
};
