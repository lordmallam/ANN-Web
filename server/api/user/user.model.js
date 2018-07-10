import PouchDB from 'pouchdb';
import _ from 'lodash';
import config from '../../config/environment';
import { BadRequestError, NotFoundError } from '../../utils/errors';
import { DB_VIEWS } from '../../components/db/constants';
import { Promise } from 'q';

const db = new PouchDB(`${config.couchdb.url}/_users`);

const stripSensitiveData = userObject => _.omit(userObject, ['type', 'roles', 'password_scheme', 'derived_key', 'salt', 'iterations']);

const retrieveUserQueryValues = qValues => qValues.map(row => stripSensitiveData(row.doc));

const isValidUserRequest = user => (user && user.email && user.firstname && user.surname && user.password);
let id = `org.couchdb.user:`;

const createNewUser = (user, role) => {
  const finalRoles = ['user', 'ums_role_member'];
  if (role && !finalRoles.includes(role)) {
    finalRoles.push(role);
  }
  const nUser = {
    email: user.email,
    type: 'user',
    roles: finalRoles,
    name: user.email,
    _id: id,
    firstname: user.firstname,
    surname: user.surname,
    password: user.password,
    member: user.member
  };
  return db.put(nUser);
};

const registerUser = payload => {
  id = `org.couchdb.user:${payload.email}`;
  return db.get(id)
    .then(res => (new BadRequestError('User exists with provided username')))
    .catch(err => {
      if (err.name && err.name === 'not_found') {
        if (isValidUserRequest(payload)) {
          return createNewUser(payload);
        } else {
          throw new BadRequestError('Invalid user object');
        }        
      }
      throw new BadRequestError(err);
    });
};

const registerAgent = payload => {
  id = `org.couchdb.user:${payload.email}`;
  return db.get(id)
    .then(res => (new BadRequestError('User exists with provided username')))
    .catch(err => {
      if (err.name && err.name === 'not_found') {
        if (isValidUserRequest(payload)) {
          return createNewUser(payload, 'ums_role_agent');
        } else {
          throw new BadRequestError('Invalid user object');
        }
      }
      throw new BadRequestError(err);
    });
};

const allAgents = () => (new Promise((resolve, reject) => {
  db.allDocs({ include_docs: true })
    .then(res => {
      const agents = res.rows.filter(rec => (rec.doc.type === 'user' && rec.doc.roles.includes('ums_role_agent') && !rec.deleted)).map(rec => {
        const r = _.omit(rec.doc, ['salt', 'password_scheme', 'iterations', 'derived_key'])
        return r
      })
      resolve(agents)
    })
    .catch(err => reject(err))
}));

const getByMemberId = (id, internal) => {
  return new Promise((resolve, reject) => {
    db.query(DB_VIEWS.user.byMemberId, { key: id, include_docs: true })
      .then(res => {
        if (res.rows.length) {
          if (internal)
            resolve(_.first(res.rows.map(r => (r.doc))))
          else
            resolve(_.omit(_.first(res.rows.map(r => (r.doc))), ['password_scheme', 'salt', 'iterations', 'derived_key']))
        }
        else
          reject(new NotFoundError('No user with assigned the supplied member id', 'Not Found', 404))
      })
      .catch(err => reject(err))
  });  
};

const assignAgent = memberid => (new Promise((resolve, reject) => {
  getByMemberId(memberid, true)
    .then(res => {
      if (res.roles.includes('ums_role_agent'))
        reject(new BadRequestError('User is already an agent', 'Bad Request', 400))
      else {
        res.roles.push('ums_role_agent')
        db.put(res)
          .then(() => {
            resolve(allAgents())
          })
          .catch(err => reject(err))
      }
    })
    .catch(err => reject(err));
}));

const removeAgent = memberid => (new Promise((resolve, reject) => {
  getByMemberId(memberid, true)
    .then(res => {
      if (!res.roles.includes('ums_role_agent'))
        reject(new BadRequestError('User is not an agent', 'Bad Request', 400))
      else {
        if (res.roles.includes('ums_role_admin'))
          reject(new BadRequestError('User is an admin and cannot be removed', 'Bad Request', 400))
        else {
          const index = res.roles.indexOf('ums_role_agent')
          if (index > -1) {
            res.roles.splice(index, 1);
          }
          db.put(res)
            .then(() => {
              resolve(allAgents())
            })
            .catch(err => reject(err))
        }
      }
    })
    .catch(err => reject(err));
}));


export {
  registerUser,
  registerAgent,
  allAgents,
  getByMemberId,
  assignAgent,
  removeAgent
};
