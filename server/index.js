'use strict';

import server from './app';
import config from './config/environment';

// Set default node environment to development
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const { app } = server;

if(env === 'development' || env === 'test') {
  // Register the Babel require hook
  require('babel-register');
}

if(!module.parent) {
  app.listen(config.port, config.ip, () => {
    console.log(`started app on port ${config.port}/api on ${env} environment`); // eslint-disable-line no-console
  });
}

export default app;
