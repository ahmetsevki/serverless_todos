'use strict';
const todo = require('./todo.js');


// Your first function handler
module.exports.hellos = (event, context, cb) => {
    console.log("hellos", JSON.stringify(event))
  /** cb is function (err,data)  */
    cb(null, { message: 'Hellos To Everyone', event, context });
};

module.exports.postHello = (event, context, cb) => {
    console.log("postHello", JSON.stringify(event))
    cb(null, { message: 'Hello '.concat(event.body.username), event, context });
};

module.exports.getHello = (event, context, cb) => {
    console.log("getHello", JSON.stringify(event))
    cb(null, { message: 'Hello '.concat(event.path.username), event, context });
};

// users
module.exports.postUser = ( event, context, cb ) => 
	todo.postUser({body: event.body}, cb);


module.exports.getUsers = (event, context, cb) => todo.getUsers({
	    "parameters": {
	    	"limit": event.query.limit,
	    	"next": event.query.next /** optional */
	    }
	}, cb);

// You can add more handlers here, and reference them in serverless.yml

