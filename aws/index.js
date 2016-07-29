// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
////////////outside functions




//$(document).on("mobileinit", function () {
//    $.mobile.autoInitializePage = false;
//});

//global variables and functions
//global object

var g_ironrock_service; // = new ironrockcloudservice()
var g_quote_wizard_html;
//
var $validator;
var _apiBaseUrl = "https://api.courserv.com/ironrock"; //localhost:58633/api/";
var _contentBaseUrl = "https://cdn.courserv.com/ironrock";
var _IronRockPreliminaryData = "IronRockPreliminaryData";
var CaptionBaseVehicleRegistrationNo = 'vehicleRegistrationNo';
var CaptionBaseVehicleChassisNo = 'vehicleChassisNo';
var CaptionBaseVehicleMake = 'vehicleMake';
var CaptionBaseVehicleModel = 'vehicleModel';
var CaptionBaseVehicleYear = 'vehicleYear';
var CaptionBaseVehicleEngineNo = 'vehicleEngineType';
var CaptionBaseVehicleBody = 'vehicleBody';
var CaptionBaseVehicleType = 'vehicleType';
var CaptionBaseVehicleColour = 'vehicleColour';
var CaptionBaseVehicleStatus = 'vehicleStatus';
var CaptionBaseVehicleValue = 'vehicleValue';

var verificationFormText = '<div class="row">  ' +
	'<div class="col-md-12"> ' +
	'<form class="form-horizontal"> ' +
	'<div class="form-group"> ' +
	'<label class="col-md-4 control-label" for="verificationCode">Code</label> ' +
	'<div class="col-md-4"> ' +
	'<input id="verificationCode" name="verificationCode" type="text" placeholder="Verification Code" class="form-control input-md" required> ' +
	'<span class="help-block">Verification Code</span> </div> ' +
	'</div> ' +
	'<div class="form-group"> ' +
	'<label class="col-md-4 control-label" for="password">Password</label> ' +
	'<div class="col-md-4"> ' +
	'<input id="password" name="password" type="password" placeholder="New Password" class="form-control input-md" required> ' +
	'<span class="help-block">Your New Password</span> </div> ' +
	'</div> ' +
	'<div class="form-group"> ' +
	'<label class="col-md-4 control-label" for="confirmPassword">Confirm Password</label> ' +
	'<div class="col-md-4"> ' +
	'<input id="confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" class="form-control input-md" required> ' +
	'<span class="help-block">Confirm Password</span> </div> ' +
	'</div> ' +
	'</form> </div>  </div>';


//loader
function setLoadingState(loadingState) {
	if (loadingState)
		$("body").addClass("loading");
	else
		$("body").removeClass("loading");
}

//convert to json without error
function ConvertToJson(r) {
	try {
		r = JSON.parse(r);
		r = JSON.parse(r);
		r = JSON.parse(r);
	} catch (e) {
		// not json
	}
	return r;
}

///quote
/////////////////////////////////////////Quote Forms//////////////////////////
function setQuoteWizard(insuranceType, callback) {
	if (!g_quote_wizard_html) {
		g_quote_wizard_html = $('#quote-section').html();
	}
	$('#quote-section').html(g_quote_wizard_html);

	setLoadingState(true);
	//$.get('quoteWizard.html', function (pageData) {
	//	$('#quote-section').prepend(pageData);

	var wizardTabs = $('.stepwizard-row');

	var finalStepNo = 0;
	if (insuranceType == 'motor') {
		$('.page-header').html('<h1>Create Motor Vehicle Proposal</h1>');

		var particularStep = $('<div/>').addClass('stepwizard-step');
		particularStep.append('<a href="#vehicle-particulars-page" type="button" class="btn btn-default btn-circle" disabled>4</a>');
		particularStep.append('<p>Particulars</p>');
		particularStep.appendTo(wizardTabs);
		//
		var coverageStep = $('<div/>').addClass('stepwizard-step');
		coverageStep.append('<a href="#vehicle-insurance-coverage-page" type="button" class="btn btn-default btn-circle" disabled>5</a>');
		coverageStep.append('<p>Coverage</p>');
		coverageStep.appendTo(wizardTabs);
		//
		var driverStep = $('<div/>').addClass('stepwizard-step');
		driverStep.append('<a href="#vehicle-driver-details-page" type="button" class="btn btn-default btn-circle" disabled>6</a>');
		driverStep.append('<p>Driver</p>');
		driverStep.appendTo(wizardTabs);
		//
		var accidentStep = $('<div/>').addClass('stepwizard-step');
		accidentStep.append('<a href="#vehicle-accidents-page" type="button" class="btn btn-default btn-circle" disabled>7</a>');
		accidentStep.append('<p>Accidents</p>');
		accidentStep.appendTo(wizardTabs);
		//
		var conditionStep = $('<div/>').addClass('stepwizard-step');
		conditionStep.append('<a href="#vehicle-medical-history-page" type="button" class="btn btn-default btn-circle" disabled>8</a>');
		conditionStep.append('<p>Conditions</p>');
		conditionStep.appendTo(wizardTabs);
		finalStepNo = 9;
	} else {
		$('.page-header').html('<h1>Create Home Property Proposal</h1>');

		var homeParticularStep = $('<div/>').addClass('stepwizard-step');
		homeParticularStep.append('<a href="#home-particulars-page" type="button" class="btn btn-default btn-circle" disabled>4</a>');
		homeParticularStep.append('<p>Particulars-1</p>');
		homeParticularStep.appendTo(wizardTabs);
		//
		var homeParticular2Step = $('<div/>').addClass('stepwizard-step');
		homeParticular2Step.append('<a href="#home-particulars-continued-page" type="button" class="btn btn-default btn-circle" disabled>5</a>');
		homeParticular2Step.append('<p>Particulars-2</p>');
		homeParticular2Step.appendTo(wizardTabs);
		//
		var detailStep = $('<div/>').addClass('stepwizard-step');
		detailStep.append('<a href="#home-property-details-page" type="button" class="btn btn-default btn-circle" disabled>6</a>');
		detailStep.append('<p>Details</p>');
		detailStep.appendTo(wizardTabs);
		//
		var riskStep = $('<div/>').addClass('stepwizard-step');
		riskStep.append('<a href="#home-all-risk-insurance-page" type="button" class="btn btn-default btn-circle" disabled>7</a>');
		riskStep.append('<p>Risks</p>');
		riskStep.appendTo(wizardTabs);
		finalStepNo = 8;
	}
	var completeStep = $('<div/>').addClass('stepwizard-step');
	completeStep.append('<a href="#final-page" type="button" class="btn btn-default btn-circle" disabled>' + finalStepNo + '</a>');
	completeStep.append('<p>Final</p>');
	completeStep.appendTo(wizardTabs);

	cleanUpPages(insuranceType);
	runWizard();
	//setBootstrapWizard(insuranceType);
	LoadSettings(insuranceType, function (err) {
		setLoadingState(false);
		callback(err);
	});

}


function cleanUpPages(insuranceType) {
	if (insuranceType == 'motor') {
		$('#quote-section #home-particulars-page').remove();
		$('#quote-section #home-particulars-continued-page').remove();
		$('#quote-section #home-property-details-page').remove();
		$('#quote-section #home-all-risk-insurance-page').remove();
	} else {
		$('#quote-section #vehicle-particulars-page').remove();
		$('#quote-section #vehicle-insurance-coverage-page').remove();
		$('#quote-section #vehicle-driver-details-page').remove();
		$('#quote-section #vehicle-accidents-page').remove();
		$('#quote-section #vehicle-medical-history-page').remove();
	}
}




//do wizard and load settings
function LoadSettings(insuranceType, callback) {
	//     $('#quote-wizard').bootstrapWizard();
	var prelimData = localStorage.getItem(_IronRockPreliminaryData);
	if (prelimData && prelimData != "null") {
		doMiscellaneous();
		//doPrimaryFunctions();
		loadCountriesOptions();
		loadOccupations(insuranceType == "motor");
		if (insuranceType != "motor") {
			loadRoofWallsTypes();
		}
		callback();
	} else {
		setLoadingState(true);
		g_ironrock_service.getMiscOptions(function (err, r) {
			setLoadingState(false);
			if (err) {
				callback(err);
			} else {
				var jsondata = ConvertToJson(r);
				if (jsondata.success == undefined) jsondata.success = true;
				if (jsondata.success) {
					localStorage.setItem(_IronRockPreliminaryData, JSON.stringify(jsondata));
					doMiscellaneous();
					//doPrimaryFunctions();
					loadCountriesOptions();
					loadOccupations(insuranceType == "motor");
					if (insuranceType != "motor")
						loadRoofWallsTypes();
					callback();
				} else {
					callback(new Error(jsondata.error_message));
				}
			}
		});
	}
}

function runWizard() {
	var navListItems = $('div.setup-panel div a'),
		allWells = $('.setup-content'),
		allNextBtn = $('.nextBtn'),
		allPrevBtn = $('.prevBtn');

	allWells.hide();

	navListItems.click(function (e) {
		e.preventDefault();
		var $target = $($(this).attr('href')),
			$item = $(this);

		if (!$item.hasClass('disabled')) {
			navListItems.removeClass('btn-primary').addClass('btn-default');
			$item.addClass('btn-primary');
			allWells.hide();
			$target.show();
			$target.find('input:eq(0)').focus();
		}
	});

	allNextBtn.click(function () {
		var curStep = $(this).closest(".setup-content"),
			curStepBtn = curStep.attr("id"),
			nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
			curInputs = curStep.find("input[type='text'],input[type='date'],input[type='url'],input[type='number'],input[type='email']"),
			isValid = true;

		$(".form-group").removeClass("has-error");
		for (var i = 0; i < curInputs.length; i++) {
			if (!curInputs[i].validity.valid) {
				console.log(curInputs[i]);
				isValid = false;
				$(curInputs[i]).closest(".form-group").addClass("has-error");
			}
		}
		//custom 
		isValid = getSpecificValidation(curStep, isValid);
		if (isValid)
			nextStepWizard.removeAttr('disabled').trigger('click');
		else {
			$('#warning').fadeIn().delay(5000).fadeOut();
			window.scrollTo(0, 0);
		}

	});

	allPrevBtn.click(function () {
		var curStep = $(this).closest(".setup-content"),
			curStepBtn = curStep.attr("id"),
			prevStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a");
		$(".form-group").removeClass("has-error");
		prevStepWizard.removeAttr('disabled').trigger('click');
	});

	$('div.setup-panel div a.btn-primary').trigger('click');
}





function getSpecificValidation($curStep, $valid) {
	var id = $curStep.attr('id');
	switch (id) {
	case 'personal-main-page':
		if ($('#getTRNDetails').is(":visible")) {
			$valid = false;
			$('#applicantTRN').closest(".form-group").addClass("has-error");
		}
		break;
	case 'vehicle-particulars-page':
		if ($valid && $('#vehiclesToBeInsured tbody tr').length == 0)
			$valid = false;
		break;
	case 'vehicle-insurance-coverage-page':
		break;
	case 'vehicle-driver-details-page':
		break;
	case 'vehicle-accidents-page':
		break;
	case 'vehicle-medical-history-page':
		break;
	case 'home-particulars-page':
		break;
	case 'home-particulars-continued-page':
		break;
	case 'home-property-details-page':
		break;
	case 'home-all-risk-insurance-page':
		break;
	}
	return $valid;
}

//////////////////////////////////////////////////////////////////////end quote


//insert vehicle

function insertVehicle(r) {
	var cnt = parseInt($('#vehicleCnt').val()) + 1;
	$('#vehicleCnt').val(cnt);
	//  $('#vehiclesToBeInsured .vehicle').length;

	var htmlValues = '<span>' + r.plateNo + '</span>' +
		'<input type="hidden" class="ValueVehicleRegistrationNo" id="' + CaptionBaseVehicleRegistrationNo + cnt + '" name="' + CaptionBaseVehicleRegistrationNo + cnt + '" value="' + $.trim(r.plateNo) + '" />' +
		'<input type="hidden" class="ValueVehicleChassisNo" id="' + CaptionBaseVehicleChassisNo + cnt + '" name="' + CaptionBaseVehicleChassisNo + cnt + '" value="' + $.trim(r.chassisNo) + '" />' +
		'<input type="hidden" class="ValueVehicleMake" id="' + CaptionBaseVehicleMake + cnt + '" name="' + CaptionBaseVehicleMake + cnt + '" value="' + $.trim(r.make) + '" />' +
		'<input type="hidden" class="ValueVehicleModel" id="' + CaptionBaseVehicleModel + cnt + '" name="' + CaptionBaseVehicleModel + cnt + '" value="' + $.trim(r.model) + '" />' +
		'<input type="hidden" class="ValueVehicleYear" id="' + CaptionBaseVehicleYear + cnt + '" name="' + CaptionBaseVehicleYear + cnt + '" value="' + $.trim(r.year) + '" />' +
		'<input type="hidden" class="ValueVehicleBody" id="' + CaptionBaseVehicleBody + cnt + '" name="' + CaptionBaseVehicleBody + cnt + '" value="' + $.trim(r.vehicleBodyType) + '" />' +
		'<input type="hidden" class="ValueVehicleType" id="' + CaptionBaseVehicleType + cnt + '" name="' + CaptionBaseVehicleType + cnt + '" value="' + $.trim(r.vehicleType) + '" />' +
		'<input type="hidden" class="ValueVehicleEngineNo" id="' + CaptionBaseVehicleEngineNo + cnt + '" name="' + CaptionBaseVehicleEngineNo + cnt + '" value="' + $.trim(r.engineNo) + '" />' +
		'<input type="hidden" class="ValueVehicleColour" id="' + CaptionBaseVehicleColour + cnt + '" name="' + CaptionBaseVehicleColour + cnt + '" value="' + $.trim(r.colour) + '" />' +
		'<input type="hidden" class="ValueVehicleValue" id="' + CaptionBaseVehicleValue + cnt + '" name="' + CaptionBaseVehicleValue + cnt + '" value="' + $.trim(r.sumInsured) + '" />' +
		'<input type="hidden" class="ValueVehicleStatus" id="' + CaptionBaseVehicleStatus + cnt + '" name="' + CaptionBaseVehicleStatus + cnt + '" value="' + $.trim(r.vehicleStatus) + '" />';


	var tableRow = $('<tr/>');
	tableRow.addClass('vehicle').attr('data-id', r.chassisNo);
	var registrationCell = $('<td/>');
	registrationCell.html(htmlValues);
	registrationCell.appendTo(tableRow);
	//
	var makeModelCell = $('<td/>');
	makeModelCell.html(r.make + ' ' + r.model);
	makeModelCell.appendTo(tableRow);
	//
	var detailsCell = $('<td/>');
	detailsCell.html(r.year + ' ' + r.vehicleBodyType + ' ' + r.colour);
	detailsCell.appendTo(tableRow);
	//            
	var chassisCell = $('<td/>');
	chassisCell.html(r.chassisNo + '/' + r.engineNo);
	chassisCell.appendTo(tableRow);
	//
	var sumInsuredCell = $('<td/>');
	sumInsuredCell.html('<input type="text" style="margin-left:auto; margin-right:0;" value="' + accounting.formatMoney(r.sumInsured) + '" disabled/>');
	sumInsuredCell.appendTo(tableRow);
	//
	var deleteCell = $('<td/>');
	deleteCell.html('<button type="button" class="btn btn-link deleteVehicleRow">Delete Vehicle</button>');
	deleteCell.appendTo(tableRow);

	//
	if (IsDuplicateVehicle(r.chassisNo)) {
		bootbox.alert('Duplicate!');
	} else {
		tableRow.appendTo($('#vehiclesToBeInsured'));
		$('#taxOfficeVehicleRefresh tbody').show();
	}
	reIndexVehicles();
}

//check duplicate
function IsDuplicateVehicle(val) {
	var returnVal = false;
	$('#vehiclesToBeInsured tr').each(function (index, element) {
		var rowVal = $(this).attr('data-id');
		if (rowVal == val) {
			returnVal = true;
			return false;
		}
	});
	return returnVal;
}

//need to index vehicles
function reIndexVehicles() {
	var sumInsured = 0;
	$('#vehiclesToBeInsured tbody tr').each(function (index, element) {
		var TableRow = $(element);
		TableRow.find('.ValueVehicleRegistrationNo').attr("id", CaptionBaseVehicleRegistrationNo + index).attr("name", CaptionBaseVehicleRegistrationNo + index);
		TableRow.find('.ValueVehicleChassisNo').attr("id", CaptionBaseVehicleChassisNo + index).attr("name", CaptionBaseVehicleChassisNo + index);
		TableRow.find('.ValueVehicleMake').attr("id", CaptionBaseVehicleMake + index).attr("name", CaptionBaseVehicleMake + index);
		TableRow.find('.ValueVehicleModel').attr("id", CaptionBaseVehicleModel + index).attr("name", CaptionBaseVehicleModel + index);
		TableRow.find('.ValueVehicleYear').attr("id", CaptionBaseVehicleYear + index).attr("name", CaptionBaseVehicleYear + index);
		TableRow.find('.ValueVehicleBody').attr("id", CaptionBaseVehicleBody + index).attr("name", CaptionBaseVehicleBody + index);
		TableRow.find('.ValueVehicleType').attr("id", CaptionBaseVehicleType + index).attr("name", CaptionBaseVehicleType + index);
		TableRow.find('.ValueVehicleEngineNo').attr("id", CaptionBaseVehicleEngineNo + index).attr("name", CaptionBaseVehicleEngineNo + index);
		TableRow.find('.ValueVehicleColour').attr("id", CaptionBaseVehicleColour + index).attr("name", CaptionBaseVehicleColour + index);
		TableRow.find('.ValueVehicleValue').attr("id", CaptionBaseVehicleValue + index).attr("name", CaptionBaseVehicleValue + index);
		TableRow.find('.ValueVehicleStatus').attr("id", CaptionBaseVehicleStatus + index).attr("name", CaptionBaseVehicleStatus + index);
		sumInsured = sumInsured + parseFloat(TableRow.find('.ValueVehicleValue').val());
	});
	if (sumInsured < 2000000) {
		$("#lessthan2mill").show();
		$("#2millandgreater").hide();
	} else {
		$("#lessthan2mill").hide();
		$("#2millandgreater").show();
	}
	$('#vehicleCnt').val($('#vehiclesToBeInsured tbody tr').length);
}


function loadQuotation($container, limitData) {
	$container.append('<h4>Note the Policy Limits</h4>');
	var table = $('<table/>'); //data-role="table" class="ui-responsive"
	// table.attr('data-role', "table");
	table.addClass('table');
	table.append('<tr><th class="col-md-2" style="text-align: right;">Quotation No:</th><td class="col-md-2" style="text-align: right;">' + limitData.quotation_number + '</td></tr>');
	table.append('<tr><th style="text-align: right;">Net Premium:</th><td style="text-align: right;">' + accounting.formatMoney(limitData.premium_calculation.net_premium) + '</td></tr>');
	table.append('<tr><th style="text-align: right;">Stamp Duty:</th><td style="text-align: right;">' + accounting.formatMoney(limitData.premium_calculation.stamp_duty) + '</td></tr>');
	table.append('<tr><th style="text-align: right;">Tax:</th><td style="text-align: right;">' + accounting.formatMoney(limitData.premium_calculation.tax) + '</td></tr>');
	table.append('<tr><th style="text-align: right;">Total Premium:</th><td style="text-align: right;">' + accounting.formatMoney(limitData.premium_calculation.total_premium) + '</td></tr>');
	table.appendTo($container);
	if (limitData.limits.length > 0) {
		var limitHeader = $('<h4/>').text('Limits');
		limitHeader.appendTo($container);
		var limittable = $('<table/>').addClass('table table-striped').html('<tr><th>Code</th><th>Heading</th><th  style="text-align:right">Limit</th><th>Description</th></tr>');

		$.each(limitData.limits, function (i, item) {
			limittable.append('<tr><td>' + item.code + '</td><td>' + item.heading + '</td><td style="text-align:right">' + accounting.formatMoney(item.limit) + '</td><td>' + item.description + '</td></tr>');
		});
		limittable.appendTo($container);
	}
}

function populateApplicant(r) {
	//id        
	var egovDrivers = JSON.stringify(r);
	$('#egovDriversLicenseDetails').val(egovDrivers);
	$('#applicantIDnumber').val(r.driversLicenceNo);
	$('#dateFirstIssued').val(r.dateFirstIssued);
	$('#applicationIDExpirationDate').val(r.expiryDate);
	//address
	$('#applicantSurname').val(r.lastName);
	$('#applicantFirstName').val(r.firstName);
	//$('#FirstName').val(r.firstName);
	$('#applicantMiddleName').val(r.middleName);
	$('#applicantDateOfBirth').val(r.dateOfBirth.substring(0, 10));
	$('#applicantTitle').val(r.gender == 'M' ? 'Mr.' : 'Ms.');
	//$('#applicantHomeCountry').val(r.CountryCode.toLowerCase()=='jamaica'?'JM':).trigger("change");
	//        $('#applicantHomeCountry option[value=' + r.CountryCode + ']').prop('selected', 'selected');
	//        $('#applicantHomeParish option[value=' + r.ParishCode + ']').prop('selected', 'selected');
	$('#applicantHomeStreetName').val(r.AddressMark + ', ' + r.AddressStreetNumber + ' ' + r.AddressStreetName);
	//
	$("#applicantPhoto").attr('src', 'data:image/png;base64,' + r.photograph);
	SetTRnDetails(true);
}

function SetTRnDetails(state) {
	$("#applicantTRN").attr("readonly", state);
	if (state) {
		$('#getTRNDetails').hide();
		$('#clearTRNDetails').show();
	} else {
		$('#getTRNDetails').show();
		$('#clearTRNDetails').hide();
	}
}



function orderSelectList($element) {
	var options = $element.find('option'),
		n_options = options.length,
		temp = [],
		parts,
		i;

	for (i = n_options; i--;) {
		temp[i] = options[i].text + "," + options[i].value;
	}

	temp.sort();

	for (i = n_options; i--;) {
		parts = temp[i].split(',');

		options[i].text = parts[0];
		options[i].value = parts[1];
	}
}


function loadVehicleColours() {
	$('#QueryVehicleColour').empty();
	$.each(_colours, function (key, value) {
		//<option value="1" style="background:red">Apple</option>
		$('#QueryVehicleColour').append('<option value="' + value.name + '" style="background:' + value.hex + '">' + value.name + '</option>');
	});
}

//make/model
function loadVehicleMakes() {
	var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
	$('#QueryVehicleMake').empty();
	$.each(options.makeModels.data, function (key, value) {
		$('#QueryVehicleMake').append('<option value="' + value.make + '">' + value.make + '</option>');
	});
}

function loadBodyTypes() {
	var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
	$('#QueryVehicleBodyType').empty();
	$.each(options.makeModels.data, function (key, value) {
		$.each(value.models, function (key, value) {
			if ($('#QueryVehicleBodyType option[value="' + value.body_type + '"]').length == 0) {
				$('#QueryVehicleBodyType').append('<option value="' + value.body_type + '">' + value.body_type + '</option>');
			}
		});
	});
	orderSelectList($('#QueryVehicleBodyType'));
}

function loadVehicleModels() {
	var options = JSON.parse(localStorage.getItem(_IronRockPreliminaryData));
	var models = [];
	var make = $('#QueryVehicleMake').val();
	$('#QueryVehicleModel').empty();
	$.each(options.makeModels.data, function (key, value) {
		if (make == value.make) {
			$.each(value.models, function (key, value) {
				if ($('#QueryVehicleModel option[value="' + value.model + '"]').length == 0) {
					$('#QueryVehicleModel').append('<option value="' + value.model + '">' + value.model + '</option>');
				}
			});
			return;
		}
	});
}


///create first driver from applicant details
function createFirstDriver() {
	if (!$('#regularDriversId').is(":visible") && $('#applicantIDType').val() == 'driverLicense') {
		//var occupation = $('#applicantOccupation').val();
		var occupationIndex = $("#applicantOccupation option:selected").index()
		var elel = $('.regularDriversCls:last .occupation select');
		elel.eq(occupationIndex).prop('selected', true);

		$('#regularDriversId').show();
		$('.regularDriversCls:last .name input').val($('#applicantFirstName').val() + ' ' + $('#applicantSurname').val());
		//$('.regularDriversCls:last .occupation select').val(occupation);
		//$('#regularDriversOccupation0').val(occupation);
		$('.regularDriversCls:last .DateOfBirth input').val($('#applicantDateOfBirth').val());
		$('.regularDriversCls:last .DriversDL input').val($('#applicantIDnumber').val());
		$('.regularDriversCls:last .DriversDLExpirationDate input').val($('#applicationIDExpirationDate').val());
		$('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val($('#dateFirstIssued').val());
	}
}


//add driver
function GetDriverLicense($this, id, callback) {
	setLoadingState(true);
	g_ironrock_service.getDriverLicenseDetails(id, function (err, r) {
		setLoadingState(false);
		if (err) {
			callback(err);
		} else {
			//var json = JSON.parse(r);
			var r = ConvertToJson(r);
			if (r.error_message) {
				err = new Error('Invalid ID!');
				callback(err);
			} else if (r.Message) {
				err = new Error('Invalid ID!');
				callback(err);
			} else {
				callback(null, r);
			}
		}
	});
}



//return count
/*function GetCount() {
    var i = 0;
    $('#vehiclesToBeInsured .ui-grid-d').each(function (index, element) {
        var rowVal = $(this).attr('data-id');
        if (rowVal == val) {
            returnVal = true;
            return false;
        }
    });
    return returnVal;
}*/

//display message
function display(message, err) {
	if (err) {
		$('.message').removeClass().addClass('alert alert-warning').html('<strong>Error:</strong>' + message).fadeIn().delay(10000).fadeOut();
		return;
	}
	$('.message').removeClass().addClass('alert alert-info').html('<strong>Info:</strong>' + message).fadeIn().delay(10000).fadeOut();
}

//$(document).ready(function (e) {
function doPrimaryFunctions(callback) {
	//new wizard  july 21, 2016

	///////////////////admin functions///////////////////////////////////////


	//spinning loader
	$(document).on({
		ajaxStart: function () {
			$("body").addClass("loading");
		},
		ajaxStop: function () {
			$("body").removeClass("loading");
		}
	});
	setLoadingState(true);



	g_ironrock_service = new ironrockcloudservice(function (err, $this) {
		setLoadingState(false);
		if (err) {
			g_ironrock_service.signoff();
			location.assign('/index.html');
			return;
		}
		var sideBarAnchor = $("<div/>").addClass('page-sidebar navbar-collapse collapse');
		var sideBarMenu = $('<ul/>').addClass('page-sidebar-menu');
		var sidebarmenuToggler = $('<li/>').addClass('sidebar-toggler-wrapper').html('<div class="sidebar-toggler hidden-phone"></div>');
		sidebarmenuToggler.appendTo(sideBarMenu);
		var HomeMenuOption = $('<li/>').addClass('start');
		var HomeMenoOptionLink = $('<a/>').html('<i class="fa fa-home"></i>');
		var HomeMenuTitle = $('<span/>').addClass('title');
		//
		var UserMenuOption = $('<li/>');
		var UserMenoOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-user"></i>');
		var UserMenuTitle = $('<span/>').addClass('title');
		var UserSubMenu = $('<ul/>').addClass('sub-menu');
		//
		var InsuranceMenuOption = $('<li/>');
		var InsuranceMenoOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-briefcase"></i>');
		var InsuranceMenuTitle = $('<span/>').addClass('title').text('Policies/Quotes');
		var InsuranceSubMenu = $('<ul/>').addClass('sub-menu');
		//
		var adminMenuOption = $('<li/>');
		var adminMenoOptionLink = $('<a/>').attr('href', '#').html('<i class="fa fa-cogs"></i>');
		var adminMenuTitle = $('<span/>').addClass('title').text('Admin');
		var adminSubMenu = $('<ul/>').addClass('sub-menu').html('<li><a href="/Admin/manage_brokers.html">Brokers</a><li><a href="/Admin/manage_users.html">Agents</a>');


		var valid_page = false;
		if ($this.getUsername()) {
			valid_page = true;

			//Home Option
			HomeMenoOptionLink.attr('href', '/dashboard.html');
			HomeMenuTitle.text('Dashboard').appendTo(HomeMenoOptionLink);
			HomeMenoOptionLink.appendTo(HomeMenuOption);

			sideBarMenu.append(HomeMenuOption);


			//Insurance Option
			InsuranceMenoOptionLink.append(InsuranceMenuTitle).append('<span class="arrow "></span>');
			InsuranceMenuOption.append(InsuranceMenoOptionLink);
			InsuranceMenuOption.append('<ul class="sub-menu"><li><a href="/Insurance/quotes.html#createQuote">Create Proposal</a><li><a href="/Insurance/quotes.html">Query Quotes</a></ul>');

			sideBarMenu.append(InsuranceMenuOption);


			//User 
			UserMenuTitle.text($this.getUsername());
			UserSubMenu.html('<li><a href="/profile.html">View Profile</a><li><a href="/changePassword.html">Change Password</a><li><a href="#"id="logout">Logout</a>')

			UserMenoOptionLink.append(UserMenuTitle).append('<span class="arrow "></span>');
			UserMenuOption.append(UserMenoOptionLink).append(UserSubMenu);

			sideBarMenu.append(UserMenuOption);

			//admin
			var profile = localStorage.getItem("ironrockUserProfile");

			if (profile) {
				var item = JSON.parse(profile);
				if (item.role == 'Admin' || item.role == 'Staff') {
					adminMenoOptionLink.append(adminMenuTitle).append('<span class="arrow "></span>');
					adminMenuOption.append(adminMenoOptionLink).append(adminSubMenu);
					sideBarMenu.append(adminMenuOption);
				}
			}

		} else if (location.pathname == '/index.html' ||
			location.pathname == '/login.html' ||
			location.pathname == '/forgotPassword.html' ||
			location.pathname == '/confirmAccount.html') {

			valid_page = true;
			//Home Option
			HomeMenoOptionLink.attr('href', '/home.html');
			HomeMenuTitle.text('Home').appendTo(HomeMenoOptionLink);
			HomeMenoOptionLink.appendTo(HomeMenuOption);

			sideBarMenu.append(HomeMenuOption);
			//User		
			UserSubMenu.html('<li><a href="/login.html">Login</a><li><a href="/forgotPassword.html">Forgot Password</a>')

			UserMenoOptionLink.append(UserMenuTitle.text('User Login')).append('<span class="arrow "></span>');
			UserMenuOption.append(UserMenoOptionLink).append(UserSubMenu);

			sideBarMenu.append(UserMenuOption);
		}
		if (valid_page == true) {
			$('#sidebar').append(sideBarAnchor.append(sideBarMenu));
			App.init();
			if (callback && typeof callback == "function") {
				callback(null, $this);
			}
		} else {
			location.assign('/index.html');
		}
	});


	$('#sidebar').on('click', '#logout', function () {
		g_ironrock_service.signoff();
		location.assign('/index.html');
	})


	///login
	$("#login_submit").click(function (e) {
		setLoadingState(true);
		g_ironrock_service = new ironrockcloudservice(function (err, obj) {
			if (err) {
				setLoadingState(false);
				display(err.message, true);
			} else {
				obj.signoff();
				obj.signin($('#login_username').val(), $('#login_password').val(), function (err, obj) {
					setLoadingState(false);
					if (err) {
						display(err.message, true);
					} else {
						var username = obj.getUsername();
						obj.getUser(username, function (err, data) {
							if (err) {
								display(err.message, true);
							} else {
								localStorage.setItem("ironrockUserProfile", data.Payload);
								location.assign('/dashboard.html');
							}
						});
					}
				});
			}

		});
	});

	//confirm account
	$("#confirm_account_submit").click(function (e) {
		var email_code = $('#email_code').val();
		var username = $('#username').val();
		g_ironrock_service.confirmSignup(username, email_code, function (err, data) {
			if (err) {
				display(err.message, true);
			} else {
				display(data, false);
			}
		});
	});

	//change password
	$("#change_password_submit").click(function (e) {
		var oldPassword = $('#oldPassword').val(),
			newPassword = $("#newPassword").val(),
			confirmPassword = $("#confirmPassword").val();
		if (oldPassword && newPassword && newPassword == confirmPassword && newPassword != oldPassword) {
			setLoadingState(true);
			g_ironrock_service.changePassword($('#oldPassword').val(), $('#newPassword').val(), function (err) {
				setLoadingState(false);
				if (err) {
					display(err.message, true);
				} else {
					location.assign('/dashboard.html');
					//location.reload();
				}
			});
		} else {
			display("Invalid Entries", true);
		}
	});

	///forgot password
	$("#forgot_submit").click(function (e) {
		setLoadingState(true);
		g_ironrock_service.forgotPassword($('#login_username').val(), function (err, doVerification, obj) {
			setLoadingState(false);
			if (err) {
				display(err.message, true);
			} else {
				if (doVerification) {
					bootbox.dialog({
						title: "Confirm Password",
						message: verificationFormText,
						buttons: {
							success: {
								label: "Confirm",
								className: "btn-success",
								callback: function () {
									var verificationCode = $('#verificationCode').val();
									var newPassword = $('#password').val();
									var confirmPassword = $('#confirmPassword').val();
									if (!verificationCode || !newPassword || newPassword != confirmPassword)
										return false;
									else
										g_ironrock_service.confirmPassword(verificationCode, newPassword, obj);
								}
							}
						}
					});
				} else {
					display("Your password has been set. You can now login.", false);
				}
			}
		});
	});

	///////////////////////quote create and update
	$('#quote-section').on('change', '#acceptDisclaimer', function () {
		$('#submit-btn').prop("disabled", !$(this).is(':checked'));
	});

	$('#quote-section').on('click', '#reset-btn', function () {
		location.reload();
	});

	////submit
	$('#quote-section').on('click', '#submit-btn', function () {
		//get signature data       
		//var formData = $('form').serialize();
		var jsonForm = $('form').serializeObject();
		var formData = JSON.stringify(jsonForm);
		setLoadingState(true);
		g_ironrock_service.submitQuote(formData, function (err, r) {
			setLoadingState(false);
			if (err) {
				alert("error: " + err.message);
				return;
			}
			var r = ConvertToJson(r);
			if (r.errorMessage) {
				alert("error: " + r.errorMessage);
				return;
			}
			if (!r.success) {
				console.log(r);
				alert(r.error_message ? r.error_message : '' + r.Message ? r.Message : '');
			} else {
				$('#disclaimerContainer').hide();
				$('#submit-btn').hide();
				$('#quotation_number').val(r.quotation_number);
				var $container = $('#quotation');
				loadQuotation($container, r);
				$('.button-previous').prop('disabled', true);
				$('.button-next').prop('disabled', true);
			}
		});

	});
	///////

	//regular driver
	$('#quote-section').on('click', '#regularDriversBtns .Add', function () {
		var $this = $('#regularDriversBtns .Add');
		var id = $('#regularDriverQueryID').val();
		GetDriverLicense($this, id, function (err, r) {
			if (err) {
				alert("error: " + err.message);
			}
			if (!err) {
				$('#regularDriverQueryID').val('');
				var elementGroup = $('.regularDriversCls:last');
				if ($('#regularDriversId').is(':visible')) {
					elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
					resetRegularDriver();
				} else {
					$('#regularDriversId').show();
				}
				$('.regularDriversCls:last .name input').val(r.firstName + ' ' + r.lastName);
				$('.regularDriversCls:last .occupation input').val('');
				$('.regularDriversCls:last .DateOfBirth input').val(r.dateOfBirth.substring(0, 10));
				$('.regularDriversCls:last .DriversDL input').val(id);

				$('.regularDriversCls:last .DriversDLExpirationDate input').val('2020-06-22');
				$('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val('2000-06-22');
			}
		});
	});

	$('#quote-section').on('click', '#regularDriversBtns .Reset', function () {
		$('.regularDriversCls').not('.regularDriversCls:first').remove();
		$('.regularDriversCls').find('input:text').val('');
		$('#regularDriversId').hide()
		resetRegularDriver();
	});



	///
	///////


	$('#quote-section').on('click', '#getTRNDetails', function () {
		var licenseNo = $('#applicantTRN').val();
		GetDriverLicense(null, licenseNo, function (err, data) {
			if (err) {
				alert(err);
				return;
			}
			data.id = licenseNo;
			populateApplicant(data);
			createFirstDriver();
		});
	});



	$('#quote-section').on('click', '#clearTRNDetails', function () {
		SetTRnDetails(false);
		var imageSrc = "/images/dummy.jpg";
		$('#applicantPhoto').attr('src', imageSrc); //
		$('#applicantTRNDetails input').val('');
		$('#applicantTRN').val('');
		$('#applicantIDnumber').val('');
		$('#dateFirstIssued').val('');
		$('#applicationIDExpirationDate').val('');
		$('#applicantHomeStreetName').val('');
	});


	////////////////////////////////////////
	$.fn.serializeObject = function () {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	//clear signature
	$('#quote-section').on('click', '#clear-canvas', function () {
		$('#signature').jSignature('clear');
	});


	//////////////////////////////////Insert vehicle
	$('#quote-section').on("click", '#taxOfficeVehicleRefresh', function () {
		$('#vehiclesToBeInsured .vehicle').remove();
		$('#taxOfficeVehicleRefresh').hide();
	});

	//check whether new
	$('#quote-section').on("change", 'input[type=radio][name=isNewVehicle]', function () {
		var select_value = $(this).val();
		if (select_value == 'yes') {
			$('#taxOfficeVehicleDialog .chassis').hide();
			$('#taxOfficeVehicleDialog .registration').show();
		} else {
			$('#taxOfficeVehicleDialog .chassis').show();
			$('#taxOfficeVehicleDialog .registration').hide();
		}
	});

	//get vehicle modal
	$('#quote-section').on("click", '#GetTaxOfficeVehicleDialog', function () {
		$('#queryVehicleAdd').hide();
		$('#queryVehicleSearch').show();
		$('#taxOfficeQueryManualEntry').hide();
		$('#QueryVehicleRegistrationNo').val('');
		$('#QueryVehicleChassisNo').val('');
		$('#QueryVehicleYear').val('');
		//r.vehicleType = "Sedan";
		$('#QueryVehicleEngineNo').val('');
		//$('#QueryVehicleColour').val('');
		$('#QueryVehicleSumInsured').val('');
		$('#taxOfficeVehicleDialog').modal('show');
	});



	$('#quote-section').on("change", '#QueryVehicleMake', function () {
		loadVehicleModels();
	});


	//manual entry
	$('#quote-section').on("click", "#queryVehicleAdd", function () {
		var r = {};

		r.plateNo = $('#QueryVehicleRegistrationNo').val().replace(/ /g, '').toUpperCase();
		r.chassisNo = $('#QueryVehicleChassisNo').val();
		r.make = $('#QueryVehicleMake').val();
		r.model = $('#QueryVehicleModel').val();
		r.year = $('#QueryVehicleYear').val();
		r.vehicleBodyType = $('#QueryVehicleBodyType').val();
		//r.vehicleType = "Sedan";
		r.engineNo = $('#QueryVehicleEngineNo').val();
		r.colour = $('#QueryVehicleColour').val();
		r.vehicleStatus = "";
		r.sumInsured = $('#QueryVehicleSumInsured').val();

		if (r.sumInsured < 1000) {
			alert('Invalid Sum Insured!');
			return;
		}

		if (!r.chassisNo || !r.engineNo) {
			alert('Invalid Entries!');
			return;
		}

		var mostRecentYear = new Date().getFullYear() + 1;
		if (r.year > mostRecentYear || r.year < mostRecentYear - 100) {
			alert('Invalid Year!');
			return;
		}

		insertVehicle(r);
	});


	$('#quote-section').on("click", "#queryVehicleSearch", function () {
		var plateno = $('#QueryVehicleRegistrationNo').val().replace(/ /g, '').toUpperCase();
		var chassisno = $('#QueryVehicleChassisNo').val();

		if (!plateno && !chassisno) {
			alert("Registration No and Chassis No cannot be blank");
			return;
		}

		if ($('#QueryVehicleSumInsured').val() < 1000) {
			alert('Invalid Sum Insured!');
			return;
		}

		setLoadingState(true);
		g_ironrock_service.getVehicleDetails(plateno, chassisno, function (err, r) {
			setLoadingState(false);
			if (err) {
				alert("Err:" + err.message);
				return;
			}
			r = ConvertToJson(r);
			if (r.error_message || r.Message) {
				bootbox.confirm("Chassis/Plate Number Not Found! Press OK to enter the details manually?", function (ans) {
					if (ans) {
						$('#queryVehicleAdd').show();
						$('#queryVehicleSearch').hide();
						$('#taxOfficeQueryManualEntry').show();
						loadVehicleMakes();
						loadVehicleModels();
						loadBodyTypes();
						loadVehicleColours();
					}
				});
			} else {
				r.sumInsured = $('#QueryVehicleSumInsured').val();
				insertVehicle(r);
				$('#taxOfficeVehicleDialog').modal('hide');
			}

		});

	});


	$('#quote-section').on('click', '#vehiclesToBeInsured .deleteVehicleRow', function () {
		var tr = $(this).closest('tr');
		tr.remove();
		reIndexVehicles();
	});

}

//);