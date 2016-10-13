'use strict';

var uuid = require('node-uuid');
var AWS = require('aws-sdk');
var db = new AWS.DynamoDB();

function mapUserItem(item) {
  return {
    "uid": item.uid.S,
    "email": item.email.S,
    "phone": item.phone.S
  };
}
/** event should contain body attribute */
module.exports.postUser = function postUser(event,cb){
    console.log("postUser", JSON.stringify(event));
    var uid = uuid.v4();
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
};

/** all parameters are in event.parameters */
module.exports.getUsers = function getUsers(event, cb) {
    console.log("getUsers", JSON.stringify(event));
    var params = {
    	"TableName": "todo-user",
    	"Limit" : event.parameters.limit || 5	
    };
    if(event.parameters.next !== undefined){
    	params.ExclusiveStartKey = {
    		"uid": {
    			"S": event.parameters.next
    		}
    	};
    }
    db.scan(params, function(err, data){
    	if (err){
    		cb(err);
    	}else{
    		var res = {"body": data.Items.map(mapUserItem)};
    		if (data.LastEvaluatedKey !== undefined) {
        		res.headers = {"next": data.LastEvaluatedKey.uid.S};
      		}
    		cb(null, res);
    	}
    });
};

module.exports.deleteUser = function deleteUser(event, cb){
    console.log("deleteUser", JSON.stringify(event));
    var params = {
        "TableName": "todo-user",
        "Key": {
            "uid": {
                "S": event.parameters.userId
            }
        }
    };
    db.deleteItem(params, function(err){
        if (err){
            cb(err);
        }else{
            cb();
        }
    });
};


module.exports.getUser = function getUser(event, cb){
    console.log("getUser", JSON.stringify(event));
    var params = {
        "TableName": "todo-user",
        "Key": {
            "uid": {
                "S": event.parameters.userId
            }
        }
    };
   
    db.getItem(params, function(err, data){
        if (err){
            cb(err);
        }else if(data.Item){
                cb(null, {body: mapUserItem(data.Item)});
            }else{
                cb(new Error('User not found'));        
            }   
        });
};

