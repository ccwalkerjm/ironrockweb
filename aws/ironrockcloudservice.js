// Class definition 
var ironrockcloudservice = (function () {
	//edited July 18, 2016 4:27pm
	//fixed lambda error..
	//edited July 18, 2016 10:14 am
	//added misc..
	'use strict';
	/*jslint nomen: true */
	//private properties and methods
	const IDENTITY_POOL = 'us-east-1:7e05741e-030b-4fa9-8099-a61dcf81d4dc';
	const USER_POOL_ID = 'us-east-1_sXSIoZ4vD';
	const CLIENT_ID = '65qcrqbc1tkru2unrkegerschk';
	const PROVIDER_NAME = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_sXSIoZ4vD';
	const AWS_REGION = 'us-east-1';

	var _creds = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: IDENTITY_POOL
	});

	var _poolData = {
		UserPoolId: USER_POOL_ID,
		ClientId: CLIENT_ID
	};

	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = AWS_REGION; // Region 
	AWS.config.credentials = _creds;

	AWSCognito.config.region = AWS_REGION;
	AWSCognito.config.credentials = _creds;


	var _userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_poolData);
	var _cognitoUser = _userPool.getCurrentUser();

	//get session details
	var _updateSession = function (session) {
		if (session && session.isValid()) {
			_creds.params.Logins = {};
			_creds.params.Logins[PROVIDER_NAME] = session.getIdToken().getJwtToken();
			_creds.expired = true;
			console.log(_creds);
		}
	};




	var _getAuth = function () {
		var auth = {};
		if (_cognitoUser) {
			auth.username = _cognitoUser.username;
			auth.signInUserSession = _cognitoUser.signInUserSession;
			if (_cognitoUser.client &&
				_cognitoUser.client.config &&
				_cognitoUser.client.config.credentials &&
				_cognitoUser.client.config.credentials.params) {
				auth.credentials = _cognitoUser.client.config.credentials.params;
			}
			var profile = localStorage.getItem("ironrockUserProfile");
			if (profile) {
				auth.profile = JSON.parse(profile);
			}
		}
		return auth;
	};

	//constructor
	function ironrockcloudservice(callback) {

		//AWS.config.credentials.get(function (err) {});
		//must run last.  will check if user is valid...
		//this.init = function (callback) {
		var $this = this;
		if (_cognitoUser === null) {
			if (callback && typeof callback == "function") {
				callback(null, $this);
			}
			return;
		}
		_cognitoUser.getSession(function (err, session) {
			if (err) {
				console.log(err);
				_cognitoUser.signOut();
				_cognitoUser = null;
				callback(new Error('Account has been expired!. Please login again!')); //   null, $this);
			} else {
				_updateSession(session);
				if (callback && typeof callback == "function") {
					callback(null, $this);
				}
			}
		});
	}

	ironrockcloudservice.prototype.setCredentials = function (callback) {
		AWS.config.credentials.get(function (err) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				console.log(_creds);
				callback(null, _creds);
			}
		})

	};

	ironrockcloudservice.prototype.getUsername = function () {
		if (_cognitoUser === null || _cognitoUser.signInUserSession === null) {
			return null;
		} else {
			return _cognitoUser.getUsername();
		}

	};


	// Instance methods
	ironrockcloudservice.prototype.signoff = function () {
		if (_cognitoUser !== null) {
			_cognitoUser.signOut();
		}
	};


	ironrockcloudservice.prototype.signup = function (username, password, email, phone_number, given_name, family_name, gender, callback) {
		var attributeList = [];
		var validationData = [];

		attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'email',
			Value: email
		}));
		attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'phone_number',
			Value: '+' + phone_number
		}));

		attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'given_name',
			Value: given_name
		}));

		attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'family_name',
			Value: family_name
		}));

		attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'gender',
			Value: gender
		}));

		//send validation data
		validationData.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'admin',
			Value: _cognitoUser ? _cognitoUser.username : null
		}));
		validationData.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
			Name: 'password',
			Value: password
		}));
		//using attributeList for null...
		_userPool.signUp(username, password, attributeList, validationData, function (err, result) {
			if (err) {
				console.log(err);
				callback(err);
			}
			if (result) {
				_cognitoUser = result.user;
				callback(null, result);
			}
		});
	};


	ironrockcloudservice.prototype.confirmSignup = function (username, verificationCode, callback) {
		var userData = {
			Username: username,
			Pool: _userPool
		};
		_cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		_cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
			callback(err, result);
		});
	};


	ironrockcloudservice.prototype.signin = function (username, password, callback) {
		var $this = this;
		console.log(_creds);
		var authenticationData = {
			Username: username,
			Password: password
		};
		var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

		var userData = {
			Username: username,
			Pool: _userPool
		};
		_cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		_cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function (result) {
				_updateSession(result);
				if (callback && typeof callback == "function") {
					//callback();
					callback(null, $this);
				}
			},
			onFailure: function (err) {
				if (callback && typeof callback == "function") {
					callback(err, $this);
				}
			}
		});
	};


	//change password for logon user
	ironrockcloudservice.prototype.changePassword = function (oldPassword, newPassword, callback) {
		_cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
			console.log('call result: ' + result);
			callback(err);
		});
	};


	//forgot password 
	ironrockcloudservice.prototype.forgotPassword = function (username, callback) {
		var userData = {
			Username: username,
			Pool: _userPool
		};
		_cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
		_cognitoUser.forgotPassword({
			onSuccess: function (result) {
				callback(null, false, result);
			},
			onFailure: function (err) {
				callback(err);
			},
			inputVerificationCode() {
				callback(null, true, this);
				/*var verificationCode = prompt('Please input verification code ', '');
				var newPassword = prompt('Enter new password ', '');
				cognitoUser.confirmPassword(verificationCode, newPassword, this);*/
			}
		});
	};

	//confirm-- forgot password 
	ironrockcloudservice.prototype.confirmPassword = function (verificationCode, newPassword, $this) {
		_cognitoUser.confirmPassword(verificationCode, newPassword, $this);
	};


	//admin only
	ironrockcloudservice.prototype.listUsers = function (role, broker, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'listUsers',
			'data': {
				'broker': broker,
				'role': role
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//get user
	ironrockcloudservice.prototype.getUser = function (username, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'getUser',
			'data': {
				'username': username
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//list roles
	ironrockcloudservice.prototype.listRoles = function (callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'listRoles'
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//update user
	//link user to Role
	ironrockcloudservice.prototype.updateUser = function (username, role, broker, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'updateUser',
			'data': {
				'username': username,
				'role': role,
				'broker': broker
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};



	//list brokers
	ironrockcloudservice.prototype.listBrokers = function (callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'listBrokers'
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//get broker
	ironrockcloudservice.prototype.getBroker = function (code, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'getBroker',
			'data': {
				'code': code
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};


	//create broker
	ironrockcloudservice.prototype.createBroker = function (brokerCode, BrokerName, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'createBroker',
			'data': {
				'code': brokerCode,
				'name': BrokerName
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//modify broker
	ironrockcloudservice.prototype.modifyBroker = function (brokerCode, BrokerName, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'modifyBroker',
			'data': {
				'code': brokerCode,
				'name': BrokerName
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//modify broker
	ironrockcloudservice.prototype.deleteBroker = function (brokerCode, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'deleteBroker',
			'data': {
				'code': brokerCode
			}
		};
		jsonRequest.auth = _getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc:2',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results);
		});
	};

	//all registered users	
	//submit quote
	ironrockcloudservice.prototype.submitQuote = function (data, callback) {
		var payload = {
			"formData": JSON.parse(data),
			"auth": _getAuth()
		};
		var params = {
			FunctionName: 'ironrockquote:3',
			Payload: JSON.stringify(payload)
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var payload = JSON.parse(results.Payload);
				if (payload == null) {
					callback();
				} else if (payload.errorMessage) {
					callback(new Error(payload.errorMessage));
				} else {
					callback(null, payload);
				}
			}
		});
	};


	//search for quote
	ironrockcloudservice.prototype.searchQuotes = function (data, callback) {
		var payload = JSON.parse(data);
		payload.auth = _getAuth();
		var params = {
			FunctionName: 'ironrockQuoteSearch:2',
			Payload: JSON.stringify(payload)
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var payload = JSON.parse(results.Payload);
				if (payload === null) {
					callback();
				} else if (payload.errorMessage) {
					callback(new Error(payload.errorMessage));
				} else {
					callback(null, payload);
				}
			}
		});
	};


	//get quote
	ironrockcloudservice.prototype.getQuote = function (id, callback) {
		var params = {
			FunctionName: 'ironrockGetQuote:1',
			Payload: id
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var payload = JSON.parse(results.Payload);
				if (payload === null) {
					callback();
				} else if (payload.errorMessage) {
					callback(new Error(payload.errorMessage));
				} else {
					callback(null, payload);
				}
			}
		});
	};


	//get Licence No
	ironrockcloudservice.prototype.getDriverLicenseDetails = function (id, callback) {
		var payload = {
			"id": id
		};
		var params = {
			FunctionName: 'IronRockDriverLicense:2',
			Payload: JSON.stringify(payload)
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var payload = JSON.parse(results.Payload);
				if (payload === null) {
					callback();
				} else if (payload.errorMessage) {
					callback(new Error(payload.errorMessage));
				} else {
					callback(null, payload);
				}
			}
		});
	};


	//get Vehicle Details
	ironrockcloudservice.prototype.getVehicleDetails = function (plateNo, chassisNo, callback) {
		var payload = {
			"plateno": plateNo,
			"chassisno": chassisNo
		};
		var params = {
			FunctionName: 'IronRockVehicle:2',
			Payload: JSON.stringify(payload)
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var payload = JSON.parse(results.Payload);
				if (payload === null) {
					callback();
				} else if (payload.errorMessage) {
					callback(new Error(payload.errorMessage));
				} else {
					callback(null, payload);
				}
			}
		});
	};

	//get misc
	ironrockcloudservice.prototype.getMiscOptions = function (callback) {
		var params = {
			FunctionName: 'ironrock-misc:2',
			Payload: null
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var payload = JSON.parse(results.Payload);
				if (payload === null) {
					callback();
				} else if (payload.errorMessage) {
					callback(new Error(payload.errorMessage));
				} else {
					callback(null, payload);
				}
			}
		});
	};




	//get upload policy
	ironrockcloudservice.prototype.getUploadPolicy = function (quoteNo, callback) {
		var payload = {
			"quoteNo": quoteNo,
			"auth": _getAuth()
		};
		var params = {
			FunctionName: 'ironrockS3uploadPolicy',
			Payload: JSON.stringify(payload)
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else {
				var policy = JSON.parse(results.Payload);
				if (policy === null) {
					callback();
				} else if (policy.errorMessage) {
					callback(new Error(policy.errorMessage));
				} else {
					callback(null, policy);
				}
			}
		});
	};


	//upload document to S#
	ironrockcloudservice.prototype.uploadToS3 = function (quoteNo, file, name, callback) {
		if (file.type != 'application/pdf') {
			callback(new Error("Only PDF documents allowed"));
			return;
		}
		var newFilename = this.generateRandomCode(8, 4);
		newFilename = newFilename.replace(/[^A-Z0-9]/ig, "_");
		var profile = JSON.parse(localStorage.getItem("ironrockUserProfile"));
		var params = {
			Key: 'quotes/' + newFilename + ".pdf",
			ContentType: file.type,
			Body: file,
			ACL: 'private',
			Metadata: {
				"quoteNo": quoteNo,
				"broker": profile.broker,
				"agent": profile.username,
				"document_name": name,
				"original_filename": file.name,
			},
		};
		var _s3 = new AWS.S3({
			params: {
				Bucket: 'ironrockdocuments.courserv.com'
			}
		});
		_s3.putObject(params, function (err, results) {
			callback(err);
		});
	};


	//get object in S3
	ironrockcloudservice.prototype.getPdfDocument = function (key, callback) {
		var params = {
			Key: key
		};
		var _s3 = new AWS.S3({
			params: {
				Bucket: 'ironrockdocuments.courserv.com'
			}
		});
		_s3.getObject(params, function (err, results) {
			if (err) {
				callback(err);

			} else {
				if (results.Body) {
					callback(err, results.Body);
				} else {
					callback();
				}
			}
		});
	};



	//get document list
	ironrockcloudservice.prototype.getDocumentList = function (quoteNo, callback) {
		var dynamodb = new AWS.DynamoDB({
			apiVersion: '2012-08-10'
		});
		dynamodb.query({
			TableName: 'ironRockS3Documents',
			KeyConditions: {
				"quoteNo": {
					"AttributeValueList": [
						{
							"N": quoteNo.toString()
                            }
                            ],
					"ComparisonOperator": "EQ"
				}
			},
		}, function (err, data) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				var ReturnedList = [];

				for (var i = 0; i < data.Items.length; i++) {
					var item = {};
					item.quoteNo = data.Items[i].quoteNo.N;
					item.key = data.Items[i].key.S;
					item.name = data.Items[i].name.S;
					item.fileName = data.Items[i].originalFilename.S;
					item.key = data.Items[i].key.S;
					ReturnedList.push(item);
				}
				callback(null, ReturnedList);
			}
		});

	};









	//generate random code
	ironrockcloudservice.prototype.generateRandomCode = function (numLc, numUc, numDigits, numSpecial) {
		numLc = numLc || 4;
		numUc = numUc || 4;
		numDigits = numDigits || 4;
		numSpecial = numSpecial || 2;


		var lcLetters = 'abcdefghijklmnopqrstuvwxyz';
		var ucLetters = lcLetters.toUpperCase();
		var numbers = '0123456789';
		var special = '!?=#*$@+-.';

		var getRand = function (values) {
			return values.charAt(Math.floor(Math.random() * values.length));
		};

		//+ Jonas Raoni Soares Silva
		//@ http://jsfromhell.com/array/shuffle [v1.0]
		function shuffle(o) { //v1.0
			for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
			return o;
		}

		var pass = [];
		for (var i = 0; i < numLc; ++i) {
			pass.push(getRand(lcLetters));
		}
		for (var i = 0; i < numUc; ++i) {
			pass.push(getRand(ucLetters));
		}
		for (var i = 0; i < numDigits; ++i) {
			pass.push(getRand(numbers));
		}
		for (var i = 0; i < numSpecial; ++i) {
			pass.push(getRand(special));
		}

		return shuffle(pass).join('');
	}





	return ironrockcloudservice;
}());