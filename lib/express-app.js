'use strict';

const express = require('express');
const ShutdownHandler = require('graceful-shutdown-handler');


module.exports = (() => {

  function initHandlers(config, server, app) {
    if(config.onExit){
      const handler = config.onExit;
      if(require('util').isFunction(handler)){
        const shutdownHandler = new ShutdownHandler(config.logger, server);
        shutdownHandler.onExit(handler);
      }
    }
  }
  class ExpressApp {

    constructor(config={}) {
      if(config.createNew && !config.app){
        this.app = express();
      }else if (config.app) {
        this.app = config.app;
      }else{
        throw new Error('Must supply a valid expressjs app instance')
      }
    }

    start(config={}) {
      if(!config.port){
        throw new Error('Listening port must be specified');
      }
      const serverPort = config.port;
      const host = config.host || 'localhost';

      let server = this.app.listen(serverPort, () => {
          console.log(`Listening on http://${host}:${serverPort}`);
      });

      initHandlers(config, server, this.app);
    }

  }

  return ExpressApp;

})();