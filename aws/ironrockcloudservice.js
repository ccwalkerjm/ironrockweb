// Class definition / constructor
//'use strict';
/*jslint nomen: true */
function ironrockcloudservice() {
	// Initialization

	var g_identityPool = 'us-east-1:7e05741e-030b-4fa9-8099-a61dcf81d4dc',
		g_userPoolId = 'us-east-1_sXSIoZ4vD',
		g_clientId = '65qcrqbc1tkru2unrkegerschk',
		g_providerName = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_sXSIoZ4vD',
		g_aws_region = 'us-east-1';
	//


	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = g_aws_region; // Region 

	var _creds = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: g_identityPool
	});

	AWS.config.credentials = _creds;

	AWSCognito.config.region = g_aws_region;
	AWSCognito.config.credentials = _creds;

	//AWS.config.credentials.get(function (err) {});


	var _poolData = {
		UserPoolId: g_userPoolId,
		ClientId: g_clientId
	};
	var _userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(_poolData);


	var _cognitoUser = _userPool.getCurrentUser();


	var _updateSession = function (session) {
		if (session) {
			_creds.params.Logins = {};
			_creds.params.Logins[g_providerName] = session.getIdToken().getJwtToken();
			_creds.expired = true;
			console.log(_creds);
		}
	};

	function getAuth() {
		var auth = {};
		if (_cognitoUser) {
			auth.username = _cognitoUser.username;
			auth.signInUserSession = _cognitoUser.signInUserSession;
			if (_cognitoUser.client && _cognitoUser.client.config && _cognitoUser.client.config.credentials && _cognitoUser.client.config.credentials.params) {
				auth.credentials = _cognitoUser.client.config.credentials.params;
			}
		}
		return auth;
	}

	//must run last.  will check if user is valid...
	this.init = function (callback) {
		if (_cognitoUser !== null) {
			_cognitoUser.getSession(function (err, result) {
				if (err) {
					console.log(err);
					_cognitoUser.signOut();
					_cognitoUser = null;
					callback();
				} else {
					_updateSession(result);
					callback();
				}
			});
		} else {
			//re-init           
			AWS.config.region = g_aws_region; // Region 
			AWS.config.credentials = _creds;
			AWSCognito.config.region = g_aws_region;
			AWSCognito.config.credentials = _creds;
			callback();
		}
	}


	this.getUsername = function () {
		if (_cognitoUser == null || _cognitoUser.signInUserSession == null) {
			return null;
		} else {
			return _cognitoUser.getUsername();
		}

	}


	// Instance methods
	this.signoff = function () {
		if (_cognitoUser != null) {
			_cognitoUser.signOut();
		}
	}


	this.signup = function (username, password, email, phone_number, given_name, family_name, gender, callback) {
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
	}


	this.confirmSignup = function (username, verificationCode, callback) {
		var userData = {
			Username: username,
			Pool: _userPool
		};
		_cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

		_cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
			callback(err, result);
		});
	}


	this.signin = function (username, password, callback) {
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
				callback(null);
			},
			onFailure: function (err) {
				callback(err);
			}
		});
	}


	//change password for logon user
	this.changePassword = function (oldPassword, newPassword, callback) {
		_cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
			console.log('call result: ' + result);
			callback(err);
		});
	}


	//forgot password 
	this.forgotPassword = function (username, callback) {
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
	}

	//confirm-- forgot password 
	this.confirmPassword = function (verificationCode, newPassword, $this) {
		_cognitoUser.confirmPassword(verificationCode, newPassword, $this);
	}


	//admin only
	this.listUsers = function (role, broker, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'listUsers',
			'data': {
				'broker': broker,
				'role': role
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//get user
	this.getUser = function (username, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'getUser',
			'data': {
				'username': username
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//list roles
	this.listRoles = function (callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'listRoles'
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//update user
	//link user to Role
	this.updateUser = function (username, role, broker, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'updateUser',
			'data': {
				'username': username,
				'role': role,
				'broker': broker
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}



	//list brokers
	this.listBrokers = function (callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'listBrokers'
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//get broker
	this.getBroker = function (code, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'getBroker',
			'data': {
				'code': code
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}


	//create broker
	this.createBroker = function (brokerCode, BrokerName, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'createBroker',
			'data': {
				'code': brokerCode,
				'name': BrokerName
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//modify broker
	this.modifyBroker = function (brokerCode, BrokerName, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'modifyBroker',
			'data': {
				'code': brokerCode,
				'name': BrokerName
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//modify broker
	this.deleteBroker = function (brokerCode, callback) {
		var jsonRequest = {};
		jsonRequest.request = {
			'cmd': 'deleteBroker',
			'data': {
				'code': brokerCode
			}
		};
		jsonRequest.auth = getAuth();
		var requestSerialized = JSON.stringify(jsonRequest);
		var params = {
			FunctionName: 'ironrockAdminFunc',
			Payload: requestSerialized
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			callback(err, results)
		});
	}

	//all registered users	
	//submit quote
	this.submitQuote = function (data, callback) {
		var params = {
			FunctionName: 'ironrockquote',
			Payload: data
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else
				callback(null, results.Payload);
		});
	}


	//search for quote
	this.searchQuotes = function (data, callback) {
		var params = {
			FunctionName: 'ironrockQuoteSearch',
			Payload: data
		};
		var _lambda = new AWS.Lambda();
		_lambda.invoke(params, function (err, results) {
			if (err)
				callback(err);
			else
				callback(null, results.Payload);
		});
	}


	//get quote
	this.getQuote = function (id, callback) {
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
	}



}