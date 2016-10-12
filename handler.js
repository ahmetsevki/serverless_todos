'use strict';

// Your first function handler
module.exports.hello = (event, context, cb) => {
  /** cb is function (err,data)  */
    cb(null, { message: 'Hello World', event, context });
};

// You can add more handlers here, and reference them in serverless.yml
