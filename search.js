'use strict';
let https = require('https');
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB({
	apiVersion: '2012-08-10'
});
/**
 * Pass the data to send as `event.data`, and the request options as
 * `event.options`. For more information see the HTTPS module documentation
 * at https://nodejs.org/api/https.html.
 *
 * Will succeed with the response body.
 */
console.log("starting");
exports.handler = (event, context, callback) => {

	var broker = event.auth.profile.broker;
	var agent = event.auth.profile.username;
	var role = event.auth.profile.role;

	console.log(event);


	if (role != 'Broker2')
		dynamodb.scan({
			TableName: 'IronRockQuotes'
		}, function (err, data) {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback(null, retunrList(event, data.Items));
			}
		});
	else
		dynamodb.query({
			TableName: 'IronRockQuotes',
			IndexName: 'broker-timeUpdated-index',
			KeyConditions: {
				"broker": {
					"AttributeValueList": [
						{
							"S": broker
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
				callback(null, retunrList(event, data.Items));
			}
		});
};




function retunrList(event, items) {
	var searchQuoteNo = event.quoteNo;
	var searchIdNum = event.IdNum;
	var searchFirstName = event.firstName.toLowerCase();
	var searchLastName = event.lastName.toLowerCase();
	//new Date('2012.08.10').getTime() / 1000
	var searchDateFrom = new Date(event.dateFr).getTime() / 1000;
	var searchDateTo = new Date(event.dateTo).getTime() / 1000;
	var searchType = event.type;

	var ReturnedList = [];

	for (var i = 0; i < items.length; i++) {
		try {
			var jsonObj = {};
			jsonObj.id = items[i].id.N;
			jsonObj.request = JSON.parse(items[i].request.S);
			jsonObj.broker = items[i].broker == null ? '' : items[i].broker.S;
			//console.log(jsonObj.request);
			var startDate = new Date(jsonObj.request.startDate).getTime() / 1000;
			var firstName = (jsonObj.request.FirstName ? jsonObj.request.FirstName.toLowerCase() : '');
			var lastName = (jsonObj.request.applicantSurname ? jsonObj.request.applicantSurname.toLowerCase() : '');
			var IdNum = jsonObj.request.applicantIDnumber;
			//console.log("f"+firstName);
			//console.log("l"+lastName);
			//console.log("id"+IdNum);
			var isValid = false;
			if (searchQuoteNo.length > 0 && searchQuoteNo == jsonObj.id) {
				isValid = true;
			} else if (searchQuoteNo.length > 0) {
				isValid = false;
			} else if (searchIdNum.length > 0 && searchIdNum == IdNum) {
				isValid = true;
			} else if (searchIdNum.length > 0) {
				isValid = false;
			} else if ((searchFirstName.length > 0 && searchFirstName == firstName && searchLastName.length > 0 && searchLastName == lastName) ||
				(searchFirstName.length > 0 && searchFirstName == firstName && searchLastName.length === 0) ||
				(searchLastName.length > 0 && searchLastName == lastName && searchFirstName.length === 0) ||
				(searchLastName.length === 0 && searchFirstName.length === 0)) {
				isValid = true;
			}

			if (isValid === true && (searchType.length === 0 || searchType == jsonObj.request.insuranceType) && startDate >= searchDateFrom && startDate <= searchDateTo) {
				ReturnedList.push(jsonObj);
			}
		} catch (err) {
			console.log(err);
			return null;
		}
	}
	return ReturnedList;
}