// Class definition / constructor
//'use strict';
/*jslint nomen: true */
function ironrockcloudservice(callback) {
	// Initialization

	this._identityPool = 'us-east-1:7e05741e-030b-4fa9-8099-a61dcf81d4dc';
	this._userPoolId = 'us-east-1_sXSIoZ4vD';
	this._clientId = '65qcrqbc1tkru2unrkegerschk';
	this._providerName = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_sXSIoZ4vD';
	this._aws_region = 'us-east-1';

	// Initialize the Amazon Cognito credentials provider
	AWS.config.region = this._aws_region; // Region 

	this._creds = new AWS.CognitoIdentityCredentials({
		IdentityPoolId: this._identityPool
	});

	AWS.config.credentials = this._creds;

	AWSCognito.config.region = this._aws_region;
	AWSCognito.config.credentials = this._creds;

	//AWS.config.credentials.get(function (err) {});


	this._poolData = {
		UserPoolId: this._userPoolId,
		ClientId: this._clientId
	};
	this._userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this._poolData);


	this._cognitoUser = this._userPool.getCurrentUser();


	this._updateSession = function (session) {
		if (session) {
			this._creds.params.Logins = {};
			this._creds.params.Logins[this._providerName] = session.getIdToken().getJwtToken();
			this._creds.expired = true;
			console.log(this._creds);
		}
	};

	this._getAuth = function () {
		var auth = {};
		if (this._cognitoUser) {
			auth.username = this._cognitoUser.username;
			auth.signInUserSession = this._cognitoUser.signInUserSession;
			if (this._cognitoUser.client &&
				this._cognitoUser.client.config &&
				this._cognitoUser.client.config.credentials &&
				this._cognitoUser.client.config.credentials.params) {
				auth.credentials = this._cognitoUser.client.config.credentials.params;
			}
		}
		return auth;
	}

	//must run last.  will check if user is valid...
	//this.init = function (callback) {
	var $this = this;
	if (this._cognitoUser !== null) {
		this._cognitoUser.getSession(function (err, result) {
			if (err) {
				console.log(err);
				$this._cognitoUser.signOut();
				$this._cognitoUser = null;
				callback(null, $this);
			} else {
				$this._updateSession(result);
				if (callback && typeof callback == "function") {
					callback(null, $this);
				}

			}
		});
	} else {
		//re-init           
		AWS.config.region = $this._aws_region; // Region 
		AWS.config.credentials = $this._creds;
		AWSCognito.config.region = $this._aws_region;
		AWSCognito.config.credentials = $this._creds;
		if (callback && typeof callback == "function") {
			callback(null, this);
		}
	}
}



ironrockcloudservice.prototype.getUsername = function () {
	if (this._cognitoUser == null || this._cognitoUser.signInUserSession == null) {
		return null;
	} else {
		return this._cognitoUser.getUsername();
	}

}


// Instance methods
ironrockcloudservice.prototype.signoff = function () {
	if (this._cognitoUser != null) {
		this._cognitoUser.signOut();
	}
}


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
		Value: this._cognitoUser ? this._cognitoUser.username : null
	}));
	validationData.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute({
		Name: 'password',
		Value: password
	}));
	//using attributeList for null...
	this._userPool.signUp(username, password, attributeList, validationData, function (err, result) {
		if (err) {
			callback(err);
		}
		if (result) {
			this._cognitoUser = result.user;
			callback(null, result);
		}
	});
}


ironrockcloudservice.prototype.confirmSignup = function (username, verificationCode, callback) {
	var userData = {
		Username: username,
		Pool: this._userPool
	};
	this._cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	this._cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
		callback(err, result);
	});
}


ironrockcloudservice.prototype.signin = function (username, password, callback) {
	var $this = this;
	console.log(this._creds);
	var authenticationData = {
		Username: username,
		Password: password
	};
	var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

	var userData = {
		Username: username,
		Pool: this._userPool
	};
	this._cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

	this._cognitoUser.authenticateUser(authenticationDetails, {
		onSuccess: function (result) {
			$this._updateSession(result);
			if (callback && typeof callback == "function") {
				//callback();
				callback(null, this);
			}
		},
		onFailure: function (err) {
			if (callback && typeof callback == "function") {
				callback(err, this);
			}
		}
	});
}


//change password for logon user
ironrockcloudservice.prototype.changePassword = function (oldPassword, newPassword, callback) {
	this._cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
		console.log('call result: ' + result);
		callback(err);
	});
}


//forgot password 
ironrockcloudservice.prototype.forgotPassword = function (username, callback) {
	var userData = {
		Username: username,
		Pool: this._userPool
	};
	this._cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
	this._cognitoUser.forgotPassword({
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
ironrockcloudservice.prototype.confirmPassword = function (verificationCode, newPassword, $this) {
	this._cognitoUser.confirmPassword(verificationCode, newPassword, $this);
}


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
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

//get user
ironrockcloudservice.prototype.getUser = function (username, callback) {
	var jsonRequest = {};
	jsonRequest.request = {
		'cmd': 'getUser',
		'data': {
			'username': username
		}
	};
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

//list roles
ironrockcloudservice.prototype.listRoles = function (callback) {
	var jsonRequest = {};
	jsonRequest.request = {
		'cmd': 'listRoles'
	};
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

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
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}



//list brokers
ironrockcloudservice.prototype.listBrokers = function (callback) {
	var jsonRequest = {};
	jsonRequest.request = {
		'cmd': 'listBrokers'
	};
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

//get broker
ironrockcloudservice.prototype.getBroker = function (code, callback) {
	var jsonRequest = {};
	jsonRequest.request = {
		'cmd': 'getBroker',
		'data': {
			'code': code
		}
	};
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}


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
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

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
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

//modify broker
ironrockcloudservice.prototype.deleteBroker = function (brokerCode, callback) {
	var jsonRequest = {};
	jsonRequest.request = {
		'cmd': 'deleteBroker',
		'data': {
			'code': brokerCode
		}
	};
	jsonRequest.auth = this._getAuth();
	var requestSerialized = JSON.stringify(jsonRequest);
	var params = {
		FunctionName: 'ironrockAdminFunc:1',
		Payload: requestSerialized
	};
	var _lambda = new AWS.Lambda();
	_lambda.invoke(params, function (err, results) {
		callback(err, results)
	});
}

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
}


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
}


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
}


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
}


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
}