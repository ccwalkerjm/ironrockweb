// Class definition 
var ironrockcloudservice = (function () {
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
		}
		return auth;
	};

	//constructor
	function ironrockcloudservice(callback) {

		//AWS.config.credentials.get(function (err) {});
		//must run last.  will check if user is valid...
		//this.init = function (callback) {
		var $this = this;
		//AWS.config.credentials.get(function (err) {
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
			FunctionName: 'ironrockAdminFunc:1',
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
		var params = {
			FunctionName: 'ironrockquote:1',
			Payload: data
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else
				callback(null, results.Payload);
		});
	};


	//search for quote
	ironrockcloudservice.prototype.searchQuotes = function (data, callback) {
		var params = {
			FunctionName: 'ironrockQuoteSearch:1',
			Payload: data
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else
				callback(null, results.Payload);
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
			else
				callback(null, results.Payload);
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
			else
				callback(null, results.Payload);
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
			else
				callback(null, results.Payload);
		});
	};

	return ironrockcloudservice;
}());