import PouchDB from 'pouchdb';
import _ from 'lodash';
import config from '../../config/environment';
import { BadRequestError, NotFoundError } from '../../utils/errors';

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

const allAgents = () => {
  return db.allDocs({ include_docs: true });
};


export {
  registerUser,
  registerAgent,
  allAgents
};
