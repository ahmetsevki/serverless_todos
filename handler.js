var uuid = require('node-uuid');
var AWS = require('aws-sdk');
var db = new AWS.DynamoDB();

'use strict';

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
module.exports.postUser = ( event, context, cb ) => {
    console.log("postUser", JSON.stringify(event))
    var uid = uuid.v4()
    var params = {
	"Item": {
	    "uid": { "S": uid},
	    "email": { "S" : event.body.email },
	    "phone": { "S" : event.body.phone }
	},
	"TableName": "todo-user",
	"ConditionExpression": "attribute_not_exists(uid)"
    };
    console.log("params", JSON.stringify(params));
    db.putItem( params, function(err){
	if (err){
	    cb(err);
	}else{
	    cb(null, {
		"headers": {
		    "uid":uid
		},
		"body": {
		    "uid": params.Item.uid.S,
		    "email": params.Item.email.S,
		    "phone": params.Item.phone.S
		}
	    });
	}
    });
}
// You can add more handlers here, and reference them in serverless.yml

