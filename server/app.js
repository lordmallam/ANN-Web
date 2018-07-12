/**
 * Main application file
 */
'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import HTTPStatus from 'http-status';
import validator from 'express-validator';
import cors from 'cors';
import logger from 'morgan';
import config from './config/environment';
import ums from '@ehealthafrica/express-couchdb-ums-apis';
import routes from './routes';


// Setup server
var app = express();
if(config.env === 'development') {
  app.use(logger('dev'));
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '3mb' }));
app.use(validator());


const { authService } = ums(app, undefined,
  {
    dbUrl: config.couchdb.url,
    appDBName: config.couchdb.dbName,
    secret: config.secrets.session,
    emailConfig: {},
    sendEmails: false
  });

app.use('/api', routes(authService));

app.use('/api', (err, req, res, next) => {
  err.status = err.status || HTTPStatus.INTERNAL_SERVER_ERROR; // eslint-disable-line
  res.status(err.status)
    .json({ message: err.message, error: err.error || {} });
  if (err.status > 499) console.log(err); // eslint-disable-line
  next();
});

// Expose app
export default { app, authService };
