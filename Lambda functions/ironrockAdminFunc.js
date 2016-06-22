'use strict';
var AWS = require('aws-sdk');

var provider = new AWS.CognitoIdentityServiceProvider();
var dynamodb = new AWS.DynamoDB();
var userPool = 'us-east-1_sXSIoZ4vD';
console.log('Loading function');
var roleAdmin = 'Admin';
var roleStaff = 'Staff';
var roleBroker = 'Broker';


exports.handler = (event, context, callback) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log(JSON.stringify(event));


    //verify  user
    getUser(event.auth.username, function (err, credential) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            switch (event.request.cmd) {
            case 'listUsers':
                console.log("I am here in listusers");
                var role = event.request.data.role;
                var broker = event.request.data.broker;
                console.log(credential);
                if (credential.role == roleAdmin || credential.role == roleStaff) {
                    var correctUsers = [];
                    listUsers(function (err, users) {
                        console.log("users");
                        console.log(users);
                        for (var j = 0; j < users.length; j++) {
                            if ((role === null || users[j].role == role) &&
                                (broker === null || users[j].broker == broker)) {
                                correctUsers.push(users[j]);
                            }
                        }
                        callback(null, correctUsers);
                    });

                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'getUser':
                if (credential.role == roleAdmin || credential.role == roleStaff) {
                    getUser(event.request.data.username, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'listRoles':
                var listRoles = [roleAdmin, roleStaff, roleBroker];
                callback(null, listRoles);
                break;
            case 'updateUser':
                if (credential.role == roleAdmin) {
                    updateUser(event.request.data.username, event.request.data.role, event.request.data.broker, function (err, data) {
                        callback(err, data);
                    })
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'listBrokers':
                if (credential.role == roleAdmin || credential.role == roleStaff) {
                    listBrokers(function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'getBroker':
                if (credential.role == roleAdmin || credential.role == roleStaff) {
                    getBroker(event.request.data.code, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'createBroker':
                if (credential.role == roleAdmin || credential.role == roleStaff) {
                    createBroker(event.request.data.code, event.request.data.name, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'modifyBroker':
                if (credential.role == roleAdmin || credential.role == roleStaff) {
                    updateBroker(event.request.data.code, event.request.data.name, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            case 'deleteBroker':
                if (credential.role == roleAdmin) {
                    deleteBroker(event.request.data.code, function (err, data) {
                        callback(err, data);
                    });
                } else {
                    callback(new Error('Unauthorized;'));
                }
                break;
            default:
                callback(new Error('Invalid Function;'));
                break;
            }
            ///
        }
    });
};


function listUsers(callback) {
    ////if(username=='ccwalkerjm'){
    var params = {
        UserPoolId: userPool,
        Limit: 60,
        //PaginationToken: 'STRING_VALUE',
        //UserStatus: 'CONFIRMED'
    };
    provider.listUsers(params, function (err, data) {
        if (err) {
            callback(err);
        } else {
            var userList = [];
            console.log("data");
            console.log(data);
            for (var i = 0; i < data.Users.length; i++) {
                var i_user = data.Users[i];
                console.log("i_user");
                console.log(i_user);
                var normalized_user = {};
                normalized_user.username = i_user.Username;
                normalized_user.role = "";
                normalized_user.broker = "";
                for (var j = 0; j < i_user.Attributes.length; j++) {
                    var attribute = i_user.Attributes[j];
                    normalized_user[attribute.Name] = attribute.Value;
                }
                console.log(normalized_user);
                var username = normalized_user.username;

                if (normalized_user.username == 'ccwalkerjm' && normalized_user.role != roleAdmin) {
                    normalized_user.role = roleAdmin;
                }
                userList.push(normalized_user);
            }
            getpriviledgedUsers(function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    for (var i = 0; i < userList.length; i++) {
                        for (var j = 0; j < data.Items.length; j++) {
                            if (userList[i].username == data.Items[j].username.S) {
                                userList[i].role = data.Items[j].role.S;
                                userList[i].broker = data.Items[j].broker.S;
                            }
                        }
                    }
                    callback(null, userList);
                }
            });
        }
    });
}


function getpriviledgedUsers(callback) {
    var params = {
        TableName: 'ironRockUsers'
    };
    dynamodb.scan(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            callback(null, data);
        }
    });
}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}



function getUser(username, callback) {
    ////if(username=='ccwalkerjm'){
    var params = {
        UserPoolId: userPool,
        Username: username
    };
    provider.adminGetUser(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            var user = {};
            user.username = data.Username;
            for (var i = 0; i < data.UserAttributes.length; i++) {
                var attribute = data.UserAttributes[i];
                user[attribute.Name] = attribute.Value;
            }

            getUserCredentials(username, function (err, data) {
                if (err) callback(err);
                else {
                    user.role = data.role;
                    user.broker = data.broker;
                    if (user.username == 'ccwalkerjm' && user.role != roleAdmin) user.role = roleAdmin;
                    callback(null, user);
                }
            });
        }
    });
}




function getUserCredentials(username, callback) {
    var params = {
        TableName: 'ironRockUsers',
        Key: {
            'username': {
                'S': username
            }
        },
        AttributesToGet: ['role', 'broker'],
        ConsistentRead: false, // optional (true | false)
        ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
    };
    dynamodb.getItem(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            var role = null,
                broker = null;

            try {
                role = data.Item.role.S;
            } catch (err) {
                role = null;
            }
            try {
                broker = data.Item.broker.S;
            } catch (err) {
                broker = null;
            }
            var credentials = {
                'role': role,
                'broker': broker
            };
            callback(null, credentials);
        }
    });
}


//update user
function updateUser(username, role, broker, callback) {
    var params = {
        TableName: 'ironRockUsers',
        Item: {
            username: {
                S: username
            },
            role: {
                S: role
            },
            broker: {
                S: broker
            }
        },
    };
    dynamodb.putItem(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            callback(null, data);
        }
    });
}


function listBrokers(callback) {
    var params = {
        TableName: 'IronRockBrokers'
    };
    dynamodb.scan(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            var list = [];
            for (var i = 0; i < data.Items.length; i++) {
                var result = {};
                result.code = data.Items[i].code.S;
                result.name = data.Items[i].name.S;
                list.push(result);
            }
            callback(null, list);
        }
    });
}



function createBroker(code, name, callback) {
    var params = {
        TableName: 'IronRockBrokers',
        Item: {
            code: {
                S: code
            },
            name: {
                S: name
            }
        },
    };
    dynamodb.putItem(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    });
}

function getBroker(code, callback) {
    var params = {
        TableName: 'IronRockBrokers',
        Key: {
            code: {
                S: code
            }
        }
    };
    dynamodb.getItem(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            var result = {};
            if (data.Item) {
                result.code = data.Item.code.S;
                result.name = data.Item.name.S;
            }
            console.log(result);
            callback(null, result);

        }
    });
}



function updateBroker(code, name, callback) {
    var params = {
        TableName: 'IronRockBrokers',
        Key: {
            code: {
                S: code
            }
        },
        AttributeUpdates: { // The attributes to update (map of attribute name to AttributeValueUpdate)

            name: {
                Action: 'PUT',
                Value: {
                    S: name
                }
            },
        }
    };
    dynamodb.updateItem(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    });
}


function deleteBroker(code, callback) {
    var params = {
        TableName: 'IronRockBrokers',
        Key: {
            code: {
                S: code
            }
        }
    };
    dynamodb.deleteItem(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null);
        }
    });
}