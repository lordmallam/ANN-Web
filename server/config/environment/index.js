'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

/*function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}*/

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

  // Browser-sync port
  browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,

  // Server port
  port: process.env.PORT || 9001,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'ann-web-secret'
  },

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },
  couchdb: {
    //url: 'http://admin:Password1@localhost:5984/',
    url: 'http://ann.westeurope.cloudapp.azure.com:5984/',
    dbName: 'ann_db',
    dbUser: '_users'
  },
  
  SMTP: {
    host: 'smtp.office365.com',
    port: 587,
    username: 'ncas@nigerianbar.org.ng',
    password: 'CERT@nba2017'
  },
  clientURL: 'http://localhost:9000/'
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./shared'),
  require(`./${process.env.NODE_ENV || 'production'}.js`) || {});
