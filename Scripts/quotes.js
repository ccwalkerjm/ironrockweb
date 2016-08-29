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


//formerly doPrimaryFunctions(callback)
function runQuoteEvents() {
    ///////////////////////quote create and update
    $('#quote-section').on('change', '#acceptDisclaimer', function() {
        $('#submit-btn').prop("disabled", !$(this).is(':checked'));
    });

    $('#quote-section').on('click', '#reset-btn', function() {
        location.reload();
    });

    ////submit
    $('#quote-section').on('click', '#submit-btn', function() {
        //get signature data
        var jsonForm = $('form').serializeObject();
        if (!parseInt(jsonForm.quotation_number))
            delete jsonForm.quotation_number;
        var formData = JSON.stringify(jsonForm);
        setLoadingState(true);
        g_ironrock_service.submitQuote(formData, function(err, r) {
            setLoadingState(false);
            if (err) {
                alert("error: " + err.message);
                return;
            }
            r = ConvertToJson(r);
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
    $('#quote-section').on('click', '#regularDriversBtns .Add', function() {
        var $this = $('#regularDriversBtns .Add');
        var id = $('#regularDriverQueryID').val();
        GetDriverLicense($this, id, function(err, r) {
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

    $('#quote-section').on('click', '#regularDriversBtns .Reset', function() {
        $('.regularDriversCls').not('.regularDriversCls:first').remove();
        $('.regularDriversCls').find('input:text').val('');
        $('#regularDriversId').hide();
        resetRegularDriver();
    });


    $('#quote-section').on('click', '#getTRNDetails', function() {
        var licenseNo = $('#applicantTRN').val();
        GetDriverLicense(null, licenseNo, function(err, data) {
            if (err) {
                alert(err);
                return;
            }
            data.id = licenseNo;
            populateApplicant(data);
            createFirstDriver();
        });
    });



    $('#quote-section').on('click', '#clearTRNDetails', function() {
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


    //clear signature
    $('#quote-section').on('click', '#clear-canvas', function() {
        $('#signature').jSignature('clear');
    });


    //////////////////////////////////Insert vehicle
    $('#quote-section').on("click", '#taxOfficeVehicleRefresh', function() {
        $('#vehiclesToBeInsured .vehicle').remove();
        $('#taxOfficeVehicleRefresh').hide();
    });

    //check whether new
    $('#quote-section').on("change", 'input[type=radio][name=isNewVehicle]', function() {
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
    $('#quote-section').on("click", '#GetTaxOfficeVehicleDialog', function() {
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



    $('#quote-section').on("change", '#QueryVehicleMake', function() {
        loadVehicleModels();
    });


    //manual entry
    $('#quote-section').on("click", "#queryVehicleAdd", function() {
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


    //query vehicle
    $('#quote-section').on("click", "#queryVehicleSearch", function() {
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
        g_ironrock_service.getVehicleDetails(plateno, chassisno, function(err, r) {
            setLoadingState(false);
            if (err) {
                alert("Err:" + err.message);
                return;
            }
            r = ConvertToJson(r);
            if (r.error_message || r.Message) {
                bootbox.confirm("Chassis/Plate Number Not Found! Press OK to enter the details manually?", function(ans) {
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

    //delete vehicle
    $('#quote-section').on('click', '#vehiclesToBeInsured .deleteVehicleRow', function() {
        var tr = $(this).closest('tr');
        tr.remove();
        reIndexVehicles();
    });


    //foermerly doMiscellaneous() {
    //change applicantOccupation
    $('#quote-section').on('change', '#applicantOccupation', function() {
        if ($('#applicantIDnumber').val() == $('.regularDriversCls:last .DriversDL input').val()) {
            var applicantOccupation = $("#applicantOccupation option:selected");
            var occupationIndex = applicantOccupation.index();
            var occupationValue = applicantOccupation.val();
            //$('.selDiv option:eq(1)').prop('selected', true)
            var driverOccupation = $('#quote-section').find('.regularDriversCls:last .occupation');
            driverOccupation.find('option').eq(occupationIndex).prop('selected', true);

        }
    });

    //vehicle Used As
    $('#vehicleUsedAs').change(function() {
        var select_value = $(this).val();
        setVehicleUsedAs(select_value);
    });


    $('#vehicle-all-accidents').on('click', '.Add', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input').val('');
        resetAllAccident();
    });

    $('#vehicle-all-accidents').on('click', '.Delete', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetAllAccident();
    });


    $('input[type=radio]').change(function() {
        setRadioDisplay($(this).attr('name'), this.value);
    });



    //resetHomeAllRiskArticles
    $('#HomeAllRiskInsured').on('click', '.Add', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input').val('');
        resetHomeAllRiskArticles();
        SetHomeAllRiskInsuredValue();
    });

    $('#HomeAllRiskInsured').on('click', '.Delete', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetHomeAllRiskArticles();
        SetHomeAllRiskInsuredValue();
    });

    $('#HomeAllRiskInsured').on('keyup', '.article-value input', function() {
        SetHomeAllRiskInsuredValue();
    });


    //HomeInsurance
    $('#homeInsuranceProperty').on('click', '.Add', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input').val('');
        resetHomeInsuranceProperty();
        SetHomeInsuranceValue();
    });

    $('#homeInsuranceProperty').on('click', '.Delete', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetHomeInsuranceProperty();
        SetHomeInsuranceValue();
    });


    $('#homeInsuranceProperty').on('keyup', '.article-value input', function() {
        SetHomeInsuranceValue();
    });


    $('#HomeInsuranceContent .article-value').on('keyup', 'input', function() {
        var valList = [];
        $('#HomeInsuranceContent .article-value').find('input').each(function(index, element) {
            valList.push($(element).val());
        });
        $('#HomeInsuranceContentTotalAmount').val(GetTotal(valList));
    });





    $('#publicofficerelation').on('click', '.Add', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
        resetApplicantRelativeInPublicOffice();
    });

    $('#publicofficerelation').on('click', '.Delete', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetApplicantRelativeInPublicOffice();
    });





    $('#vehicleToBeInsuredCtrl').on('click', '.Add', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.clone().insertAfter(elementGroup).show().find('input:text').val('');
        resetVehiclesToBeInsured();
    });

    $('#vehicleToBeInsuredCtrl').on('click', '.Delete', function() {
        var elementGroup = $(this).parent().parent().parent();
        elementGroup.remove();
        resetVehiclesToBeInsured();
    });




    $('#applicantHomeCountry').change(function() {
        var select_value = $(this).val();
        if (select_value == "JM") {
            $('#homeAddress .jamaica').show();
            $('#homeAddress .international').hide();
        } else {
            $('#homeAddress .jamaica').hide();
            $('#homeAddress .international').show();
        }
    });


    $('#applicantMailCountry').change(function() {
        var select_value = $(this).val();
        if (select_value == "JM") {
            $('#mailingAddress').find('.jamaica').show();
            $('#mailingAddress').find('.international').hide();
        } else {
            $('#mailingAddress').find('.jamaica').hide();
            $('#mailingAddress').find('.international').show();
        }
    });


    $('#employerNationality').change(function() {
        var select_value = $(this).val();
        if (select_value == "JM") {
            $('#employer').find('.jamaica').show();
            $('#employer').find('.international').hide();
        } else {
            $('#employer').find('.jamaica').hide();
            $('#employer').find('.international').show();
        }
    });


}

///quote
/////////////////////////////////////////Quote Forms//////////////////////////
function setQuoteWizard(insuranceType, callback) {
    /////////////////////////////
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
    LoadSettings(insuranceType, function(err) {
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
				setVehicleUsedAs("SocialDomesticPleasure");
				//vehicle-all-accidents
				setAllAccidentsYears();
				//set Last Three Years of Ownership()
				setLastThreeYearsOwnership();
        //load countries
        loadCountriesOptions();
        loadOccupations(insuranceType == "motor");
        if (insuranceType != "motor") {
            loadRoofWallsTypes();
        }
        callback();
    } else {
        setLoadingState(true);
        g_ironrock_service.getMiscOptions(function(err, r) {
            setLoadingState(false);
            if (err) {
                callback(err);
            } else {
                var jsondata = ConvertToJson(r);
                if (!jsondata.success) jsondata.success = true;
                if (jsondata.success) {
                    localStorage.setItem(_IronRockPreliminaryData, JSON.stringify(jsondata));
        						setVehicleUsedAs("SocialDomesticPleasure");
										//vehicle-all-accidents
										setAllAccidentsYears();
										//set Last Three Years of Ownership()
										setLastThreeYearsOwnership();
                    //doPrimaryFunctions();
										//load countries
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

    navListItems.click(function(e) {
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

    allNextBtn.click(function() {
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

    allPrevBtn.click(function() {
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
            if ($valid && $('#vehiclesToBeInsured tbody tr').length === 0)
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
    $('#vehiclesToBeInsured tr').each(function(index, element) {
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
    $('#vehiclesToBeInsured tbody tr').each(function(index, element) {
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
    var thirdPartyLimit = $('#thirdPartyLimit').empty();
    if (sumInsured < 2000000) {
        thirdPartyLimit.append('<option value="standard1">Standard Limits-$3M/$5M/$5M</option>');
        thirdPartyLimit.append('<option value="increased1Option1">Increased Limits-$5M/$7.5M/$5M</option>');
        thirdPartyLimit.append('<option value="increased1Option2">Increased Limits-$5M/10M/$5M</option>');
        thirdPartyLimit.append('<option value="increased1Option3">Increased Limits-$10M/$10M/$10M</option>');
    } else {
        thirdPartyLimit.append('<option value="standard2">Standard Limits-$5M/$10M/$5M</option>');
        thirdPartyLimit.append('<option value="increased2Option1">Increased Limits-$10M/$10M/$10M</option>');
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
    if (limitData.limits && limitData.limits.length > 0) {
        var limitHeader = $('<h4/>').text('Limits');
        limitHeader.appendTo($container);
        var limittable = $('<table/>').addClass('table table-striped').html('<tr><th>Code</th><th>Heading</th><th  style="text-align:right">Limit</th><th>Description</th></tr>');

        $.each(limitData.limits, function(i, item) {
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
    $.each(_colours, function(key, value) {
        //<option value="1" style="background:red">Apple</option>
        $('#QueryVehicleColour').append('<option value="' + value.name + '" style="background:' + value.hex + '">' + value.name + '</option>');
    });
}

//make/model
function loadVehicleMakes() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    $('#QueryVehicleMake').empty();
    $.each(options.makeModels.data, function(key, value) {
        $('#QueryVehicleMake').append('<option value="' + value.make + '">' + value.make + '</option>');
    });
}

function loadBodyTypes() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    $('#QueryVehicleBodyType').empty();
    $.each(options.makeModels.data, function(key, value) {
        $.each(value.models, function(key, value) {
            if ($('#QueryVehicleBodyType option[value="' + value.body_type + '"]').length === 0) {
                $('#QueryVehicleBodyType').append('<option value="' + value.body_type + '">' + value.body_type + '</option>');
            }
        });
    });
    orderSelectList($('#QueryVehicleBodyType'));
}

function loadVehicleModels() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    var models = [];
    var make = $('#QueryVehicleMake').val();
    $('#QueryVehicleModel').empty();
    $.each(options.makeModels.data, function(key, value) {
        if (make == value.make) {
            $.each(value.models, function(key, value) {
                if ($('#QueryVehicleModel option[value="' + value.model + '"]').length === 0) {
                    $('#QueryVehicleModel').append('<option value="' + value.model + '">' + value.model + '</option>');
                }
            });
            return;
        }
    });
}


///create first driver from applicant details
function createFirstDriver() {
    if (!$('#regularDriversId').is(":visible") && $('#applicantIDType').val().toLowerCase() == 'trn') {
        //var occupation = $('#applicantOccupation').val();
        var occupationIndex = $("#applicantOccupation option:selected").index();
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
    g_ironrock_service.getDriverLicenseDetails(id, function(err, r) {
        setLoadingState(false);
        if (err) {
            callback(err);
        } else {
            r = ConvertToJson(r);
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


//display message
function display(message, err) {
    _$message.removeAttr('class');
    if (err) {
        _$message.addClass('alert alert-warning');
        message = '<strong>Error:</strong>' + message;
    } else {
        _$message.addClass('alert alert-info');
        message = '<strong>Message:</strong>' + message;
    }
    _$message.html(message).fadeIn().delay(10000).fadeOut();
}



////miscellaneous functions
function SetHomeAllRiskInsuredValue() {
    var valList = [];
    $('#HomeAllRiskInsured .article-value').find('input').each(function(index, element) {
        valList.push($(element).val());
    });
    $('#HomeAllRiskTotalAmount').val(GetTotal(valList));
}

//set home insurance values
function SetHomeInsuranceValue() {
    var valList = [];
    $('#homeInsuranceProperty .article-value').find('input').each(function(index, element) {
        valList.push($(element).val());
    });
    $('#homeInsurancePropertySum').val(GetTotal(valList));
}

//set accident years
function setAllAccidentsYears() {
    var currentYear = new Date().getFullYear();
    for (var i = 0; i < 4; i++) {
        var option = $('<option/>');
        option.val(currentYear - i);
        option.text(currentYear - i);
        option.appendTo($('#accidentYear0'));
    }
}

//reset all accidents
function resetAllAccident() {
    var objectList = [{
        "class": "year",
        "name": "accidentYear"
    }, {
        "class": "cost",
        "name": "accidentCost"
    }, {
        "class": "month",
        "name": "accidentMonth"
    }, {
        "class": "driver",
        "name": "accidentDriver"
    }, {
        "class": "brief",
        "name": "accidentBrief"
    }];
    var elementClass = $('.vehicle-accident-block');
    resetObjects(objectList, elementClass, "Add", "Delete", "Accident");
}

//Used As
function setVehicleUsedAs(select_value) {
    //hide and uncheck all inexperinecd driver elements
    //$('#InexperiencedDriverBlock input').prop('checked', false); // Unchecks it
    //$('#InexperiencedDriverBlock label, #InexperiencedDriverBlock input').hide();
    //$('label[for=a], input#a').hide();
    //show relevant inputs
    switch (select_value) {
        case "CarriageOwnGoods": //private commercial
        case "CarriagePassengersNotHire": //private commercial
        case "CarriagePassengersHire": //private commercial
        case "CommercialTravelling": //private commercial
            $('#23YearsOldPrivateCommercial').show();
            $('#36MonthGeneralLicense').show();
            $('#25yearsOldGeneral').hide();
            $('#5YearsGeneralPublicCommercial').hide();
            $('#21YearsPrivateCars').hide();
            $('#24MonthsPrivateLicense').hide();
            break;
        case "GeneralCartage": //General Cartage
            $('#25yearsOldGeneral').show();
            $('#5YearsGeneralPublicCommercial').show();
            $('#23YearsOldPrivateCommercial').hide();
            $('#36MonthGeneralLicense').hide();
            $('#21YearsPrivateCars').hide();
            $('#24MonthsPrivateLicense').hide();
            break;
        case "SocialDomesticPleasure": //private car
        case "SocialDomesticPleasureBusiness": //private car
            $('#21YearsPrivateCars').show();
            $('#24MonthsPrivateLicense').show();
            $('#25yearsOldGeneral').hide();
            $('#5YearsGeneralPublicCommercial').hide();
            $('#23YearsOldPrivateCommercial').hide();
            $('#36MonthGeneralLicense').hide();
            break;
    }
}




//load occupations
function loadOccupations(isMotor) {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    $.each(options.occupations.data, function(key, value) {
        $('#applicantOccupation').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        if (isMotor) {
            $('#regularDriversOccupation0').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        }
    });
}

//load roof and wall types
function loadRoofWallsTypes() {
    var options = ConvertToJson(localStorage.getItem(_IronRockPreliminaryData));
    //wall
    $.each(options.wallTypes.data, function(key, value) {
        $('#constructionExternalWalls').append('<option value="' + value + '">' + value + '</option>');
    });

    //roof
    $.each(options.roofTypes.data, function(key, value) {
        $('#constructionRoof').append('<option value="' + value + '">' + value + '</option>');
    });
}




//miscellaneous functions
function GetTotal(InputArray) {
    var sum = 0;
    $.each(InputArray, function(index, val) {
        sum = sum + Number(val ? val : 0);
    });
    return '$' + sum.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

function resetHomeAllRiskArticles() {
    var objectList = [{
        "class": "article-name",
        "name": "HomeAllRiskArticleDescription"
    }, {
        "class": "article-value",
        "name": "HomeAllRiskArticleValue"
    }];
    var elementClass = $('.HomeAllRiskArticles');
    resetObjects(objectList, elementClass, "Add", "Delete", "Article");
}

function resetHomeInsuranceProperty() {
    var objectList = [{
        "class": "article-name",
        "name": "homeInsurancePropertyItem"
    }, {
        "class": "article-value",
        "name": "homeInsurancePropertyItemValue"
    }];
    var elementClass = $('.homeInsurancePropertyItems');
    resetObjects(objectList, elementClass, "Add", "Delete", "Building");
}


//
function resetInexperiencedDriver() {

    var objectList = [{
        "class": "name",
        "name": "inexperiencedDriversName"
    }, {
        "class": "occupation",
        "name": "inexperiencedDriversOccupation"
    }, {
        "class": "DateOfBirth",
        "name": "inexperiencedDriversDateOfBirth"
    }, {
        "class": "DriversDL",
        "name": "inexperiencedDriversDL"
    }, {
        "class": "DriversDLOriginalDateOfIssue",
        "name": "inexperiencedDriversDLOriginalDateOfIssue"
    }, {
        "class": "DriversRelationshipToProposer",
        "name": "inexperiencedDriversRelationshipToProposer"
    }];
    var elementClass = $('.inexperiencedDriversCls');

    resetObjects(objectList, elementClass, "Add", "Delete", "Driver");
}

//regular drivers
function resetRegularDriver() {

    var objectList = [{
        "class": "name",
        "name": "regularDriversName"
    }, {
        "class": "occupation",
        "name": "regularDriversOccupation"
    }, {
        "class": "DateOfBirth",
        "name": "regularDriversDateOfBirth"
    }, {
        "class": "DriversDL",
        "name": "regularDriversDL"
    }, {
        "class": "DriversDLExpirationDate",
        "name": "regularDriversDLExpirationDate"
    }, {
        "class": "DriversDLOriginalDateOfIssue",
        "name": "regularDriversDLOriginalDateOfIssue"
    }, {
        "class": "DriversRelationshipToProposer",
        "name": "regularDriversRelationshipToProposer"
    }];
    var elementClass = $('.regularDriversCls');

    resetObjects(objectList, elementClass, "Add", "Delete", "Driver");
}


function resetApplicantRelativeInPublicOffice() {

    var objectList = [{
        "class": "office",
        "name": "applicantRelativeTypePublicOffice"
    }, {
        "class": "address",
        "name": "applicantRelativeTypePublicAddress"
    }, {
        "class": "relation",
        "name": "applicantRelativeTypePublicRelation"
    }, {
        "class": "name",
        "name": "applicantRelativeInPublicOfficeName"
    }];
    var elementClass = $('.publicofficerelations');

    resetObjects(objectList, elementClass, "Add", "Delete", "Relative");
}


function resetVehiclesToBeInsured() {
    var objectList = [{
        "class": "registration",
        "name": "vehicleRegistrationNo"
    }, {
        "class": "make",
        "name": "vehicleMake"
    }, {
        "class": "model",
        "name": "vehicleModel"
    }, {
        "class": "engine",
        "name": "vehicleEngineNo"
    }, {
        "class": "chassis",
        "name": "vehicleChassisNo"
    }, {
        "class": "year",
        "name": "vehicleYearOfMake"
    }, {
        "class": "rating",
        "name": "vehicleCcRating"
    }, {
        "class": "seating",
        "name": "vehicleSeating"
    }, {
        "class": "body",
        "name": "vehicleTypeOfBody"
    }, {
        "class": "insured",
        "name": "vehicleSumInsured"
    }, {
        "class": "trailer",
        "name": "vehicleTrailerUsed"
    }];
    var elementClass = $('.vehicleToBeInsured');
    resetObjects(objectList, elementClass, "Add", "Delete", "Vehicle");
}




//
//set display of text based on Radio Button selection
function setRadioDisplay(RadioName, RadioValue) {
    var radioBtn = $('input[name=' + RadioName + '][value=' + RadioValue + ']');
    if (radioBtn.attr('class') == 'medicalCondition')
        setMedicalDisplay();
    else {
        var displayElement = getDisplayElement(RadioName);
        if (!displayElement.defaultValue) return;
        if (RadioValue == displayElement.defaultValue) {
            if (displayElement.id) {
                $('#' + displayElement.id).hide();
            } else {
                $('.' + displayElement.class).hide();
            }
        } else {
            if (displayElement.id) {
                $('#' + displayElement.id).show();
            } else {
                $('.' + displayElement.class).show();
            }
        }
    }
}

//set medical display
function setMedicalDisplay() {
    var isCheckedYes = false;
    $('.medicalCondition').each(function(index, element) {
        if ($(element).is(':checked') && $(element).val() == 'yes') {
            isCheckedYes = true;
            return true;
        }
    });
    if (isCheckedYes) {
        $('#medicalConditionDetails').show();
    } else {
        $('#medicalConditionDetails').hide();
    }
}


//set radio button
function setRadioButton(buttonName, xvalue) {
    var buttonElement = 'input[name=' + buttonName + '][value=' + xvalue + ']';
    $(buttonElement).prop('checked', true).trigger('click');
    setRadioDisplay(buttonName, xvalue);
}

//get display element
function getDisplayElement(RadioName) {
    var returnValue = {};
    switch (RadioName) {
      case 'vehicleKeptInSecureArea':
          returnValue.defaultValue = "yes";
          returnValue.id = "vehicleLocationDetailsClass";
          break;
        case 'mailingAddressSame':
            returnValue.defaultValue = "yes";
            returnValue.id = "mailingAddress";
            break;
        case 'applicantRelativeInPublicOffice':
            returnValue.defaultValue = "no";
            returnValue.id = "publicofficerelation";
            break;
        case 'isOwnerOfVehicle':
            returnValue.defaultValue = "yes";
            returnValue.class = "vehicleNameAddressOfOwner";
            break;
        case 'lienHolder':
            returnValue.defaultValue = "no";
            returnValue.class = "lienHolderClass";
            break;
        case 'vehicleAntiTheftDevice':
            returnValue.defaultValue = "no";
            returnValue.class = "VehicleAntiTheftDeviceProviderClass";
            break;
        case 'vehicleRegularCustody':
            returnValue.defaultValue = "yes";
            returnValue.class = "vehicleRegularCustodyDetailsClass";
            break;
        case 'vehicleGaragedAtProposersHome':
            returnValue.defaultValue = "yes";
            returnValue.class = "vehicleGaragedAtProposersHomeDetailsClass";
            break;
        case 'proposerInsured':
            returnValue.defaultValue = "no";
            returnValue.class = "proposerInsuranceDetailsClass";
            break;
        case 'proposerEntitledToNOClaimDiscount':
            returnValue.defaultValue = "no";
            returnValue.id = "proposerEntitledToNOClaimDiscountProof";
            break;
        case 'applicantOtherInsurer':
            returnValue.defaultValue = "no";
            returnValue.class = "applicantOtherInsurerTypeClass";
            break;
        case 'applicantPreviouslyInsured':
            returnValue.defaultValue = "no";
            returnValue.class = "ApplicantPreviouslyInsuredClass";
            break;
        case 'involvedInAccident':
            returnValue.defaultValue = "no";
            returnValue.class = "involvedInAccidentClass";
            break;
        case 'driverSufferFromDefectiveHearingOrVision':
            returnValue.defaultValue = "no";
            returnValue.id = "medicalConditionDetails";
            break;
        case 'driverSufferFromDiabetesEpilepsyHeartDisease':
            returnValue.defaultValue = "no";
            returnValue.id = "medicalConditionDetails";
            break;
        case 'driverSufferFromPhysicalMentalInfirmity':
            returnValue.defaultValue = "no";
            returnValue.id = "medicalConditionDetails";
            break;
        case 'vehicleModified':
            returnValue.defaultValue = "no";
            returnValue.class = "vehicleModifiedDetailsClass";
            break;
        case 'driverTrafficTicket':
            returnValue.defaultValue = "no";
            returnValue.id = "driverTrafficTicketDetailGroup";
            break;
        case 'vehicleModified':
            returnValue.defaultValue = "no";
            returnValue.class = "vehicleModifiedDetailsClass";
            break;
        case 'garageOutBuildingExists':
            returnValue.defaultValue = "no";
            returnValue.class = "garageOutBuildingClass";
            break;
        case 'homeInGoodState':
            returnValue.defaultValue = "yes";
            returnValue.id = "divhomeInGoodStateDetails";
            break;
        case 'homeOccupiedByApplicantFamily':
            returnValue.defaultValue = "yes";
            returnValue.id = "divhomeOccupiedByApplicantFamily";
            break;
        case 'homeUsedForIncomeActivity':
            returnValue.defaultValue = "no";
            returnValue.id = "divhomeUsedForIncomeActivity";
            break;
        case 'homeHaveInterestFromIndividual':
            returnValue.defaultValue = "no";
            returnValue.id = "divhomeHaveInterestFromIndividual";
            break;
        case 'homeHasWatersideStructure':
            returnValue.defaultValue = "no";
            returnValue.id = "divhomeHasWatersideStructure";
            break;
        case 'currentPolicyWithCompanyOrInsurer':
            returnValue.defaultValue = "no";
            returnValue.id = "divcurrentPolicyWithCompanyOrInsurerDetails";
            break;
        case 'HomeInsuranceDeclined':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceDeclined";
            break;
        case 'HomeInsuranceRequiredSpecialTerm':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceRequiredSpecialTermDetails";
            break;
        case 'HomeInsuranceCancelled':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceCancelledDetails";
            break;
        case 'HomeInsuranceIncreasedPremium':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceIncreasedPremiumDetails";
            break;
        case 'HomeInsurancePerilsSuffer':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsurancePerilsSufferDetails";
            break;
        case 'HomeInsuranceSufferLoss':
            returnValue.defaultValue = "no";
            returnValue.id = "divHomeInsuranceSufferLossDetails";
            break;
    }
    return returnValue;
}



//load countries in select options
function loadCountriesOptions() {
    var countryElements = $('#quote-section .countries');
    countryElements.each(function(index, item) {
        var selectObj = $(this);
        selectObj.html('');
        $.each(_countries, function(i, json) {
            if (json.code == 'JM') {
                selectObj.append('<option value="' + json.code + '" selected="selected">' + json.name + '</option>');
            } else {
                selectObj.append('<option value="' + json.code + '">' + json.name + '</option>');
            }
        });
    });
}




//reset objects
function resetObjects(objectList, elementClass, addBtnName, delBtnName, elementTitle) {
    var firstElement = elementClass.first();
    var lastElement = elementClass.last();
    //var i = 0;

    elementClass.each(function(i, e) {
        var element = $(this);
        //change ids and names
        $.each(objectList, function(j, item) {
            element.find('.' + item.class + ' :input').attr('id', item.name + i).attr('name', item.name + i);
            element.find('.' + item.class + ' label').attr('for', item.name + i);
        });

        //set controls
        if (element.is(firstElement) && element.is(lastElement)) {
            firstElement.find('.' + delBtnName).hide();
            lastElement.find('.' + addBtnName).show();
        } else if (element.is(firstElement)) {
            element.find('.' + delBtnName).hide();
            element.find('.' + addBtnName).hide();
        } else if (element.is(lastElement)) {
            element.find('.' + delBtnName).show();
            element.find('.' + addBtnName).show();
        } else {
            element.find('.' + delBtnName).hide();
            element.find('.' + addBtnName).hide();
        }
        //change title
        element.find('h4').text(elementTitle + ' ' + (i + 1).toString());
    });
}


function setLastThreeYearsOwnership() {
    var currentYear = new Date().getFullYear();
    for (i = 1; i < 4; i++) {
        var previousYear = currentYear - i;
        var YearName = 'numberOfVehiclesOwned' + previousYear;
        var YearHtml = $('<div/>');
        YearHtml.addClass('ui-field-contain');
        var YearLabel = $('<label/>');
        YearLabel.attr('for', YearName);
        YearLabel.text(previousYear + ':Number of vehicles owned:');
        YearLabel.appendTo(YearHtml);
        var yearText = $('<input/>');
        yearText.attr('type', 'number');
        yearText.attr('name', YearName);
        yearText.attr('id', YearName);
        yearText.appendTo(YearHtml);
        YearHtml.appendTo($('#numberOfVehiclesOwned'));
    }
}




//country functions
var _countries = [

    {
        "name": 'Afghanistan',
        "code": 'AF'
    }, {
        "name": 'Åland Islands',
        "code": 'AX'
    }, {
        "name": 'Albania',
        "code": 'AL'
    }, {
        "name": 'Algeria',
        "code": 'DZ'
    }, {
        "name": 'American Samoa',
        "code": 'AS'
    }, {
        "name": 'AndorrA',
        "code": 'AD'
    }, {
        "name": 'Angola',
        "code": 'AO'
    }, {
        "name": 'Anguilla',
        "code": 'AI'
    }, {
        "name": 'Antarctica',
        "code": 'AQ'
    }, {
        "name": 'Antigua and Barbuda',
        "code": 'AG'
    }, {
        "name": 'Argentina',
        "code": 'AR'
    }, {
        "name": 'Armenia',
        "code": 'AM'
    }, {
        "name": 'Aruba',
        "code": 'AW'
    }, {
        "name": 'Australia',
        "code": 'AU'
    }, {
        "name": 'Austria',
        "code": 'AT'
    }, {
        "name": 'Azerbaijan',
        "code": 'AZ'
    }, {
        "name": 'Bahamas',
        "code": 'BS'
    }, {
        "name": 'Bahrain',
        "code": 'BH'
    }, {
        "name": 'Bangladesh',
        "code": 'BD'
    }, {
        "name": 'Barbados',
        "code": 'BB'
    }, {
        "name": 'Belarus',
        "code": 'BY'
    }, {
        "name": 'Belgium',
        "code": 'BE'
    }, {
        "name": 'Belize',
        "code": 'BZ'
    }, {
        "name": 'Benin',
        "code": 'BJ'
    }, {
        "name": 'Bermuda',
        "code": 'BM'
    }, {
        "name": 'Bhutan',
        "code": 'BT'
    }, {
        "name": 'Bolivia',
        "code": 'BO'
    }, {
        "name": 'Bosnia and Herzegovina',
        "code": 'BA'
    }, {
        "name": 'Botswana',
        "code": 'BW'
    }, {
        "name": 'Bouvet Island',
        "code": 'BV'
    }, {
        "name": 'Brazil',
        "code": 'BR'
    }, {
        "name": 'British Indian Ocean Territory',
        "code": 'IO'
    }, {
        "name": 'Brunei Darussalam',
        "code": 'BN'
    }, {
        "name": 'Bulgaria',
        "code": 'BG'
    }, {
        "name": 'Burkina Faso',
        "code": 'BF'
    }, {
        "name": 'Burundi',
        "code": 'BI'
    }, {
        "name": 'Cambodia',
        "code": 'KH'
    }, {
        "name": 'Cameroon',
        "code": 'CM'
    }, {
        "name": 'Canada',
        "code": 'CA'
    }, {
        "name": 'Cape Verde',
        "code": 'CV'
    }, {
        "name": 'Cayman Islands',
        "code": 'KY'
    }, {
        "name": 'Central African Republic',
        "code": 'CF'
    }, {
        "name": 'Chad',
        "code": 'TD'
    }, {
        "name": 'Chile',
        "code": 'CL'
    }, {
        "name": 'China',
        "code": 'CN'
    }, {
        "name": 'Christmas Island',
        "code": 'CX'
    }, {
        "name": 'Cocos (Keeling) Islands',
        "code": 'CC'
    }, {
        "name": 'Colombia',
        "code": 'CO'
    }, {
        "name": 'Comoros',
        "code": 'KM'
    }, {
        "name": 'Congo',
        "code": 'CG'
    }, {
        "name": 'Congo, The Democratic Republic of the',
        "code": 'CD'
    }, {
        "name": 'Cook Islands',
        "code": 'CK'
    }, {
        "name": 'Costa Rica',
        "code": 'CR'
    }, {
        "name": 'Cote D\'Ivoire',
        "code": 'CI'
    }, {
        "name": 'Croatia',
        "code": 'HR'
    }, {
        "name": 'Cuba',
        "code": 'CU'
    }, {
        "name": 'Cyprus',
        "code": 'CY'
    }, {
        "name": 'Czech Republic',
        "code": 'CZ'
    }, {
        "name": 'Denmark',
        "code": 'DK'
    }, {
        "name": 'Djibouti',
        "code": 'DJ'
    }, {
        "name": 'Dominica',
        "code": 'DM'
    }, {
        "name": 'Dominican Republic',
        "code": 'DO'
    }, {
        "name": 'Ecuador',
        "code": 'EC'
    }, {
        "name": 'Egypt',
        "code": 'EG'
    }, {
        "name": 'El Salvador',
        "code": 'SV'
    }, {
        "name": 'Equatorial Guinea',
        "code": 'GQ'
    }, {
        "name": 'Eritrea',
        "code": 'ER'
    }, {
        "name": 'Estonia',
        "code": 'EE'
    }, {
        "name": 'Ethiopia',
        "code": 'ET'
    }, {
        "name": 'Falkland Islands (Malvinas)',
        "code": 'FK'
    }, {
        "name": 'Faroe Islands',
        "code": 'FO'
    }, {
        "name": 'Fiji',
        "code": 'FJ'
    }, {
        "name": 'Finland',
        "code": 'FI'
    }, {
        "name": 'France',
        "code": 'FR'
    }, {
        "name": 'French Guiana',
        "code": 'GF'
    }, {
        "name": 'French Polynesia',
        "code": 'PF'
    }, {
        "name": 'French Southern Territories',
        "code": 'TF'
    }, {
        "name": 'Gabon',
        "code": 'GA'
    }, {
        "name": 'Gambia',
        "code": 'GM'
    }, {
        "name": 'Georgia',
        "code": 'GE'
    }, {
        "name": 'Germany',
        "code": 'DE'
    }, {
        "name": 'Ghana',
        "code": 'GH'
    }, {
        "name": 'Gibraltar',
        "code": 'GI'
    }, {
        "name": 'Greece',
        "code": 'GR'
    }, {
        "name": 'Greenland',
        "code": 'GL'
    }, {
        "name": 'Grenada',
        "code": 'GD'
    }, {
        "name": 'Guadeloupe',
        "code": 'GP'
    }, {
        "name": 'Guam',
        "code": 'GU'
    }, {
        "name": 'Guatemala',
        "code": 'GT'
    }, {
        "name": 'Guernsey',
        "code": 'GG'
    }, {
        "name": 'Guinea',
        "code": 'GN'
    }, {
        "name": 'Guinea-Bissau',
        "code": 'GW'
    }, {
        "name": 'Guyana',
        "code": 'GY'
    }, {
        "name": 'Haiti',
        "code": 'HT'
    }, {
        "name": 'Heard Island and Mcdonald Islands',
        "code": 'HM'
    }, {
        "name": 'Holy See (Vatican City State)',
        "code": 'VA'
    }, {
        "name": 'Honduras',
        "code": 'HN'
    }, {
        "name": 'Hong Kong',
        "code": 'HK'
    }, {
        "name": 'Hungary',
        "code": 'HU'
    }, {
        "name": 'Iceland',
        "code": 'IS'
    }, {
        "name": 'India',
        "code": 'IN'
    }, {
        "name": 'Indonesia',
        "code": 'ID'
    }, {
        "name": 'Iran, Islamic Republic Of',
        "code": 'IR'
    }, {
        "name": 'Iraq',
        "code": 'IQ'
    }, {
        "name": 'Ireland',
        "code": 'IE'
    }, {
        "name": 'Isle of Man',
        "code": 'IM'
    }, {
        "name": 'Israel',
        "code": 'IL'
    }, {
        "name": 'Italy',
        "code": 'IT'
    }, {
        "name": 'Jamaica',
        "code": 'JM'
    }, {
        "name": 'Japan',
        "code": 'JP'
    }, {
        "name": 'Jersey',
        "code": 'JE'
    }, {
        "name": 'Jordan',
        "code": 'JO'
    }, {
        "name": 'Kazakhstan',
        "code": 'KZ'
    }, {
        "name": 'Kenya',
        "code": 'KE'
    }, {
        "name": 'Kiribati',
        "code": 'KI'
    }, {
        "name": 'Korea, Democratic People\'S Republic of',
        "code": 'KP'
    }, {
        "name": 'Korea, Republic of',
        "code": 'KR'
    }, {
        "name": 'Kuwait',
        "code": 'KW'
    }, {
        "name": 'Kyrgyzstan',
        "code": 'KG'
    }, {
        "name": 'Lao People\'S Democratic Republic',
        "code": 'LA'
    }, {
        "name": 'Latvia',
        "code": 'LV'
    }, {
        "name": 'Lebanon',
        "code": 'LB'
    }, {
        "name": 'Lesotho',
        "code": 'LS'
    }, {
        "name": 'Liberia',
        "code": 'LR'
    }, {
        "name": 'Libyan Arab Jamahiriya',
        "code": 'LY'
    }, {
        "name": 'Liechtenstein',
        "code": 'LI'
    }, {
        "name": 'Lithuania',
        "code": 'LT'
    }, {
        "name": 'Luxembourg',
        "code": 'LU'
    }, {
        "name": 'Macao',
        "code": 'MO'
    }, {
        "name": 'Macedonia, The Former Yugoslav Republic of',
        "code": 'MK'
    }, {
        "name": 'Madagascar',
        "code": 'MG'
    }, {
        "name": 'Malawi',
        "code": 'MW'
    }, {
        "name": 'Malaysia',
        "code": 'MY'
    }, {
        "name": 'Maldives',
        "code": 'MV'
    }, {
        "name": 'Mali',
        "code": 'ML'
    }, {
        "name": 'Malta',
        "code": 'MT'
    }, {
        "name": 'Marshall Islands',
        "code": 'MH'
    }, {
        "name": 'Martinique',
        "code": 'MQ'
    }, {
        "name": 'Mauritania',
        "code": 'MR'
    }, {
        "name": 'Mauritius',
        "code": 'MU'
    }, {
        "name": 'Mayotte',
        "code": 'YT'
    }, {
        "name": 'Mexico',
        "code": 'MX'
    }, {
        "name": 'Micronesia, Federated States of',
        "code": 'FM'
    }, {
        "name": 'Moldova, Republic of',
        "code": 'MD'
    }, {
        "name": 'Monaco',
        "code": 'MC'
    }, {
        "name": 'Mongolia',
        "code": 'MN'
    }, {
        "name": 'Montserrat',
        "code": 'MS'
    }, {
        "name": 'Morocco',
        "code": 'MA'
    }, {
        "name": 'Mozambique',
        "code": 'MZ'
    }, {
        "name": 'Myanmar',
        "code": 'MM'
    }, {
        "name": 'Namibia',
        "code": 'NA'
    }, {
        "name": 'Nauru',
        "code": 'NR'
    }, {
        "name": 'Nepal',
        "code": 'NP'
    }, {
        "name": 'Netherlands',
        "code": 'NL'
    }, {
        "name": 'Netherlands Antilles',
        "code": 'AN'
    }, {
        "name": 'New Caledonia',
        "code": 'NC'
    }, {
        "name": 'New Zealand',
        "code": 'NZ'
    }, {
        "name": 'Nicaragua',
        "code": 'NI'
    }, {
        "name": 'Niger',
        "code": 'NE'
    }, {
        "name": 'Nigeria',
        "code": 'NG'
    }, {
        "name": 'Niue',
        "code": 'NU'
    }, {
        "name": 'Norfolk Island',
        "code": 'NF'
    }, {
        "name": 'Northern Mariana Islands',
        "code": 'MP'
    }, {
        "name": 'Norway',
        "code": 'NO'
    }, {
        "name": 'Oman',
        "code": 'OM'
    }, {
        "name": 'Pakistan',
        "code": 'PK'
    }, {
        "name": 'Palau',
        "code": 'PW'
    }, {
        "name": 'Palestinian Territory, Occupied',
        "code": 'PS'
    }, {
        "name": 'Panama',
        "code": 'PA'
    }, {
        "name": 'Papua New Guinea',
        "code": 'PG'
    }, {
        "name": 'Paraguay',
        "code": 'PY'
    }, {
        "name": 'Peru',
        "code": 'PE'
    }, {
        "name": 'Philippines',
        "code": 'PH'
    }, {
        "name": 'Pitcairn',
        "code": 'PN'
    }, {
        "name": 'Poland',
        "code": 'PL'
    }, {
        "name": 'Portugal',
        "code": 'PT'
    }, {
        "name": 'Puerto Rico',
        "code": 'PR'
    }, {
        "name": 'Qatar',
        "code": 'QA'
    }, {
        "name": 'Reunion',
        "code": 'RE'
    }, {
        "name": 'Romania',
        "code": 'RO'
    }, {
        "name": 'Russian Federation',
        "code": 'RU'
    }, {
        "name": 'RWANDA',
        "code": 'RW'
    }, {
        "name": 'Saint Helena',
        "code": 'SH'
    }, {
        "name": 'Saint Kitts and Nevis',
        "code": 'KN'
    }, {
        "name": 'Saint Lucia',
        "code": 'LC'
    }, {
        "name": 'Saint Pierre and Miquelon',
        "code": 'PM'
    }, {
        "name": 'Saint Vincent and the Grenadines',
        "code": 'VC'
    }, {
        "name": 'Samoa',
        "code": 'WS'
    }, {
        "name": 'San Marino',
        "code": 'SM'
    }, {
        "name": 'Sao Tome and Principe',
        "code": 'ST'
    }, {
        "name": 'Saudi Arabia',
        "code": 'SA'
    }, {
        "name": 'Senegal',
        "code": 'SN'
    }, {
        "name": 'Serbia and Montenegro',
        "code": 'CS'
    }, {
        "name": 'Seychelles',
        "code": 'SC'
    }, {
        "name": 'Sierra Leone',
        "code": 'SL'
    }, {
        "name": 'Singapore',
        "code": 'SG'
    }, {
        "name": 'Slovakia',
        "code": 'SK'
    }, {
        "name": 'Slovenia',
        "code": 'SI'
    }, {
        "name": 'Solomon Islands',
        "code": 'SB'
    }, {
        "name": 'Somalia',
        "code": 'SO'
    }, {
        "name": 'South Africa',
        "code": 'ZA'
    }, {
        "name": 'South Georgia and the South Sandwich Islands',
        "code": 'GS'
    }, {
        "name": 'Spain',
        "code": 'ES'
    }, {
        "name": 'Sri Lanka',
        "code": 'LK'
    }, {
        "name": 'Sudan',
        "code": 'SD'
    }, {
        "name": 'Suriname',
        "code": 'SR'
    }, {
        "name": 'Svalbard and Jan Mayen',
        "code": 'SJ'
    }, {
        "name": 'Swaziland',
        "code": 'SZ'
    }, {
        "name": 'Sweden',
        "code": 'SE'
    }, {
        "name": 'Switzerland',
        "code": 'CH'
    }, {
        "name": 'Syrian Arab Republic',
        "code": 'SY'
    }, {
        "name": 'Taiwan, Province of China',
        "code": 'TW'
    }, {
        "name": 'Tajikistan',
        "code": 'TJ'
    }, {
        "name": 'Tanzania, United Republic of',
        "code": 'TZ'
    }, {
        "name": 'Thailand',
        "code": 'TH'
    }, {
        "name": 'Timor-Leste',
        "code": 'TL'
    }, {
        "name": 'Togo',
        "code": 'TG'
    }, {
        "name": 'Tokelau',
        "code": 'TK'
    }, {
        "name": 'Tonga',
        "code": 'TO'
    }, {
        "name": 'Trinidad and Tobago',
        "code": 'TT'
    }, {
        "name": 'Tunisia',
        "code": 'TN'
    }, {
        "name": 'Turkey',
        "code": 'TR'
    }, {
        "name": 'Turkmenistan',
        "code": 'TM'
    }, {
        "name": 'Turks and Caicos Islands',
        "code": 'TC'
    }, {
        "name": 'Tuvalu',
        "code": 'TV'
    }, {
        "name": 'Uganda',
        "code": 'UG'
    }, {
        "name": 'Ukraine',
        "code": 'UA'
    }, {
        "name": 'United Arab Emirates',
        "code": 'AE'
    }, {
        "name": 'United Kingdom',
        "code": 'GB'
    }, {
        "name": 'United States',
        "code": 'US'
    }, {
        "name": 'United States Minor Outlying Islands',
        "code": 'UM'
    }, {
        "name": 'Uruguay',
        "code": 'UY'
    }, {
        "name": 'Uzbekistan',
        "code": 'UZ'
    }, {
        "name": 'Vanuatu',
        "code": 'VU'
    }, {
        "name": 'Venezuela',
        "code": 'VE'
    }, {
        "name": 'Viet Nam',
        "code": 'VN'
    }, {
        "name": 'Virgin Islands, British',
        "code": 'VG'
    }, {
        "name": 'Virgin Islands, U.S.',
        "code": 'VI'
    }, {
        "name": 'Wallis and Futuna',
        "code": 'WF'
    }, {
        "name": 'Western Sahara',
        "code": 'EH'
    }, {
        "name": 'Yemen',
        "code": 'YE'
    }, {
        "name": 'Zambia',
        "code": 'ZM'
    }, {
        "name": 'Zimbabwe',
        "code": 'ZW'
    }
];


var _colours = [{
    "hex": "#EFDECD",
    "name": "Almond",
    "rgb": "(239, 222, 205)"
}, {
    "hex": "#CD9575",
    "name": "Antique Brass",
    "rgb": "(205, 149, 117)"
}, {
    "hex": "#FDD9B5",
    "name": "Apricot",
    "rgb": "(253, 217, 181)"
}, {
    "hex": "#78DBE2",
    "name": "Aquamarine",
    "rgb": "(120, 219, 226)"
}, {
    "hex": "#87A96B",
    "name": "Asparagus",
    "rgb": "(135, 169, 107)"
}, {
    "hex": "#FFA474",
    "name": "Atomic Tangerine",
    "rgb": "(255, 164, 116)"
}, {
    "hex": "#FAE7B5",
    "name": "Banana Mania",
    "rgb": "(250, 231, 181)"
}, {
    "hex": "#9F8170",
    "name": "Beaver",
    "rgb": "(159, 129, 112)"
}, {
    "hex": "#FD7C6E",
    "name": "Bittersweet",
    "rgb": "(253, 124, 110)"
}, {
    "hex": "#000000",
    "name": "Black",
    "rgb": "(0,0,0)"
}, {
    "hex": "#ACE5EE",
    "name": "Blizzard Blue",
    "rgb": "(172, 229, 238)"
}, {
    "hex": "#1F75FE",
    "name": "Blue",
    "rgb": "(31, 117, 254)"
}, {
    "hex": "#A2A2D0",
    "name": "Blue Bell",
    "rgb": "(162, 162, 208)"
}, {
    "hex": "#6699CC",
    "name": "Blue Gray",
    "rgb": "(102, 153, 204)"
}, {
    "hex": "#0D98BA",
    "name": "Blue Green",
    "rgb": "(13, 152, 186)"
}, {
    "hex": "#7366BD",
    "name": "Blue Violet",
    "rgb": "(115, 102, 189)"
}, {
    "hex": "#DE5D83",
    "name": "Blush",
    "rgb": "(222, 93, 131)"
}, {
    "hex": "#CB4154",
    "name": "Brick Red",
    "rgb": "(203, 65, 84)"
}, {
    "hex": "#B4674D",
    "name": "Brown",
    "rgb": "(180, 103, 77)"
}, {
    "hex": "#FF7F49",
    "name": "Burnt Orange",
    "rgb": "(255, 127, 73)"
}, {
    "hex": "#EA7E5D",
    "name": "Burnt Sienna",
    "rgb": "(234, 126, 93)"
}, {
    "hex": "#B0B7C6",
    "name": "Cadet Blue",
    "rgb": "(176, 183, 198)"
}, {
    "hex": "#FFFF99",
    "name": "Canary",
    "rgb": "(255, 255, 153)"
}, {
    "hex": "#1CD3A2",
    "name": "Caribbean Green",
    "rgb": "(28, 211, 162)"
}, {
    "hex": "#FFAACC",
    "name": "Carnation Pink",
    "rgb": "(255, 170, 204)"
}, {
    "hex": "#DD4492",
    "name": "Cerise",
    "rgb": "(221, 68, 146)"
}, {
    "hex": "#1DACD6",
    "name": "Cerulean",
    "rgb": "(29, 172, 214)"
}, {
    "hex": "#BC5D58",
    "name": "Chestnut",
    "rgb": "(188, 93, 88)"
}, {
    "hex": "#DD9475",
    "name": "Copper",
    "rgb": "(221, 148, 117)"
}, {
    "hex": "#9ACEEB",
    "name": "Cornflower",
    "rgb": "(154, 206, 235)"
}, {
    "hex": "#FFBCD9",
    "name": "Cotton Candy",
    "rgb": "(255, 188, 217)"
}, {
    "hex": "#FDDB6D",
    "name": "Dandelion",
    "rgb": "(253, 219, 109)"
}, {
    "hex": "#2B6CC4",
    "name": "Denim",
    "rgb": "(43, 108, 196)"
}, {
    "hex": "#EFCDB8",
    "name": "Desert Sand",
    "rgb": "(239, 205, 184)"
}, {
    "hex": "#6E5160",
    "name": "Eggplant",
    "rgb": "(110, 81, 96)"
}, {
    "hex": "#CEFF1D",
    "name": "Electric Lime",
    "rgb": "(206, 255, 29)"
}, {
    "hex": "#71BC78",
    "name": "Fern",
    "rgb": "(113, 188, 120)"
}, {
    "hex": "#6DAE81",
    "name": "Forest Green",
    "rgb": "(109, 174, 129)"
}, {
    "hex": "#C364C5",
    "name": "Fuchsia",
    "rgb": "(195, 100, 197)"
}, {
    "hex": "#CC6666",
    "name": "Fuzzy Wuzzy",
    "rgb": "(204, 102, 102)"
}, {
    "hex": "#E7C697",
    "name": "Gold",
    "rgb": "(231, 198, 151)"
}, {
    "hex": "#FCD975",
    "name": "Goldenrod",
    "rgb": "(252, 217, 117)"
}, {
    "hex": "#A8E4A0",
    "name": "Granny Smith Apple",
    "rgb": "(168, 228, 160)"
}, {
    "hex": "#95918C",
    "name": "Gray",
    "rgb": "(149, 145, 140)"
}, {
    "hex": "#1CAC78",
    "name": "Green",
    "rgb": "(28, 172, 120)"
}, {
    "hex": "#1164B4",
    "name": "Green Blue",
    "rgb": "(17, 100, 180)"
}, {
    "hex": "#F0E891",
    "name": "Green Yellow",
    "rgb": "(240, 232, 145)"
}, {
    "hex": "#FF1DCE",
    "name": "Hot Magenta",
    "rgb": "(255, 29, 206)"
}, {
    "hex": "#B2EC5D",
    "name": "Inchworm",
    "rgb": "(178, 236, 93)"
}, {
    "hex": "#5D76CB",
    "name": "Indigo",
    "rgb": "(93, 118, 203)"
}, {
    "hex": "#CA3767",
    "name": "Jazzberry Jam",
    "rgb": "(202, 55, 103)"
}, {
    "hex": "#3BB08F",
    "name": "Jungle Green",
    "rgb": "(59, 176, 143)"
}, {
    "hex": "#FEFE22",
    "name": "Laser Lemon",
    "rgb": "(254, 254, 34)"
}, {
    "hex": "#FCB4D5",
    "name": "Lavender",
    "rgb": "(252, 180, 213)"
}, {
    "hex": "#FFF44F",
    "name": "Lemon Yellow",
    "rgb": "(255, 244, 79)"
}, {
    "hex": "#FFBD88",
    "name": "Macaroni and Cheese",
    "rgb": "(255, 189, 136)"
}, {
    "hex": "#F664AF",
    "name": "Magenta",
    "rgb": "(246, 100, 175)"
}, {
    "hex": "#AAF0D1",
    "name": "Magic Mint",
    "rgb": "(170, 240, 209)"
}, {
    "hex": "#CD4A4C",
    "name": "Mahogany",
    "rgb": "(205, 74, 76)"
}, {
    "hex": "#EDD19C",
    "name": "Maize",
    "rgb": "(237, 209, 156)"
}, {
    "hex": "#979AAA",
    "name": "Manatee",
    "rgb": "(151, 154, 170)"
}, {
    "hex": "#FF8243",
    "name": "Mango Tango",
    "rgb": "(255, 130, 67)"
}, {
    "hex": "#C8385A",
    "name": "Maroon",
    "rgb": "(200, 56, 90)"
}, {
    "hex": "#EF98AA",
    "name": "Mauvelous",
    "rgb": "(239, 152, 170)"
}, {
    "hex": "#FDBCB4",
    "name": "Melon",
    "rgb": "(253, 188, 180)"
}, {
    "hex": "#1A4876",
    "name": "Midnight Blue",
    "rgb": "(26, 72, 118)"
}, {
    "hex": "#30BA8F",
    "name": "Mountain Meadow",
    "rgb": "(48, 186, 143)"
}, {
    "hex": "#C54B8C",
    "name": "Mulberry",
    "rgb": "(197, 75, 140)"
}, {
    "hex": "#1974D2",
    "name": "Navy Blue",
    "rgb": "(25, 116, 210)"
}, {
    "hex": "#FFA343",
    "name": "Neon Carrot",
    "rgb": "(255, 163, 67)"
}, {
    "hex": "#BAB86C",
    "name": "Olive Green",
    "rgb": "(186, 184, 108)"
}, {
    "hex": "#FF7538",
    "name": "Orange",
    "rgb": "(255, 117, 56)"
}, {
    "hex": "#FF2B2B",
    "name": "Orange Red",
    "rgb": "(255, 43, 43)"
}, {
    "hex": "#F8D568",
    "name": "Orange Yellow",
    "rgb": "(248, 213, 104)"
}, {
    "hex": "#E6A8D7",
    "name": "Orchid",
    "rgb": "(230, 168, 215)"
}, {
    "hex": "#414A4C",
    "name": "Outer Space",
    "rgb": "(65, 74, 76)"
}, {
    "hex": "#FF6E4A",
    "name": "Outrageous Orange",
    "rgb": "(255, 110, 74)"
}, {
    "hex": "#1CA9C9",
    "name": "Pacific Blue",
    "rgb": "(28, 169, 201)"
}, {
    "hex": "#FFCFAB",
    "name": "Peach",
    "rgb": "(255, 207, 171)"
}, {
    "hex": "#C5D0E6",
    "name": "Periwinkle",
    "rgb": "(197, 208, 230)"
}, {
    "hex": "#FDDDE6",
    "name": "Piggy Pink",
    "rgb": "(253, 221, 230)"
}, {
    "hex": "#158078",
    "name": "Pine Green",
    "rgb": "(21, 128, 120)"
}, {
    "hex": "#FC74FD",
    "name": "Pink Flamingo",
    "rgb": "(252, 116, 253)"
}, {
    "hex": "#F78FA7",
    "name": "Pink Sherbet",
    "rgb": "(247, 143, 167)"
}, {
    "hex": "#8E4585",
    "name": "Plum",
    "rgb": "(142, 69, 133)"
}, {
    "hex": "#7442C8",
    "name": "Purple Heart",
    "rgb": "(116, 66, 200)"
}, {
    "hex": "#9D81BA",
    "name": "Purple Mountain's Majesty",
    "rgb": "(157, 129, 186)"
}, {
    "hex": "#FE4EDA",
    "name": "Purple Pizzazz",
    "rgb": "(254, 78, 218)"
}, {
    "hex": "#FF496C",
    "name": "Radical Red",
    "rgb": "(255, 73, 108)"
}, {
    "hex": "#D68A59",
    "name": "Raw Sienna",
    "rgb": "(214, 138, 89)"
}, {
    "hex": "#714B23",
    "name": "Raw Umber",
    "rgb": "(113, 75, 35)"
}, {
    "hex": "#FF48D0",
    "name": "Razzle Dazzle Rose",
    "rgb": "(255, 72, 208)"
}, {
    "hex": "#E3256B",
    "name": "Razzmatazz",
    "rgb": "(227, 37, 107)"
}, {
    "hex": "#EE204D",
    "name": "Red",
    "rgb": "(238,32 ,77 )"
}, {
    "hex": "#FF5349",
    "name": "Red Orange",
    "rgb": "(255, 83, 73)"
}, {
    "hex": "#C0448F",
    "name": "Red Violet",
    "rgb": "(192, 68, 143)"
}, {
    "hex": "#1FCECB",
    "name": "Robin's Egg Blue",
    "rgb": "(31, 206, 203)"
}, {
    "hex": "#7851A9",
    "name": "Royal Purple",
    "rgb": "(120, 81, 169)"
}, {
    "hex": "#FF9BAA",
    "name": "Salmon",
    "rgb": "(255, 155, 170)"
}, {
    "hex": "#FC2847",
    "name": "Scarlet",
    "rgb": "(252, 40, 71)"
}, {
    "hex": "#76FF7A",
    "name": "Screamin' Green",
    "rgb": "(118, 255, 122)"
}, {
    "hex": "#9FE2BF",
    "name": "Sea Green",
    "rgb": "(159, 226, 191)"
}, {
    "hex": "#A5694F",
    "name": "Sepia",
    "rgb": "(165, 105, 79)"
}, {
    "hex": "#8A795D",
    "name": "Shadow",
    "rgb": "(138, 121, 93)"
}, {
    "hex": "#45CEA2",
    "name": "Shamrock",
    "rgb": "(69, 206, 162)"
}, {
    "hex": "#FB7EFD",
    "name": "Shocking Pink",
    "rgb": "(251, 126, 253)"
}, {
    "hex": "#CDC5C2",
    "name": "Silver",
    "rgb": "(205, 197, 194)"
}, {
    "hex": "#80DAEB",
    "name": "Sky Blue",
    "rgb": "(128, 218, 235)"
}, {
    "hex": "#ECEABE",
    "name": "Spring Green",
    "rgb": "(236, 234, 190)"
}, {
    "hex": "#FFCF48",
    "name": "Sunglow",
    "rgb": "(255, 207, 72)"
}, {
    "hex": "#FD5E53",
    "name": "Sunset Orange",
    "rgb": "(253, 94, 83)"
}, {
    "hex": "#FAA76C",
    "name": "Tan",
    "rgb": "(250, 167, 108)"
}, {
    "hex": "#18A7B5",
    "name": "Teal Blue",
    "rgb": "(24, 167, 181)"
}, {
    "hex": "#EBC7DF",
    "name": "Thistle",
    "rgb": "(235, 199, 223)"
}, {
    "hex": "#FC89AC",
    "name": "Tickle Me Pink",
    "rgb": "(252, 137, 172)"
}, {
    "hex": "#DBD7D2",
    "name": "Timberwolf",
    "rgb": "(219, 215, 210)"
}, {
    "hex": "#17806D",
    "name": "Tropical Rain Forest",
    "rgb": "(23, 128, 109)"
}, {
    "hex": "#DEAA88",
    "name": "Tumbleweed",
    "rgb": "(222, 170, 136)"
}, {
    "hex": "#77DDE7",
    "name": "Turquoise Blue",
    "rgb": "(119, 221, 231)"
}, {
    "hex": "#FFFF66",
    "name": "Unmellow Yellow",
    "rgb": "(255, 255, 102)"
}, {
    "hex": "#926EAE",
    "name": "Violet (Purple)",
    "rgb": "(146, 110, 174)"
}, {
    "hex": "#324AB2",
    "name": "Violet Blue",
    "rgb": "(50, 74, 178)"
}, {
    "hex": "#F75394",
    "name": "Violet Red",
    "rgb": "(247, 83, 148)"
}, {
    "hex": "#FFA089",
    "name": "Vivid Tangerine",
    "rgb": "(255, 160, 137)"
}, {
    "hex": "#8F509D",
    "name": "Vivid Violet",
    "rgb": "(143, 80, 157)"
}, {
    "hex": "#FFFFFF",
    "name": "White",
    "rgb": "(255, 255, 255)"
}, {
    "hex": "#A2ADD0",
    "name": "Wild Blue Yonder",
    "rgb": "(162, 173, 208)"
}, {
    "hex": "#FF43A4",
    "name": "Wild Strawberry",
    "rgb": "(255, 67, 164)"
}, {
    "hex": "#FC6C85",
    "name": "Wild Watermelon",
    "rgb": "(252, 108, 133)"
}, {
    "hex": "#CDA4DE",
    "name": "Wisteria",
    "rgb": "(205, 164, 222)"
}, {
    "hex": "#FCE883",
    "name": "Yellow",
    "rgb": "(252, 232, 131)"
}, {
    "hex": "#C5E384",
    "name": "Yellow Green",
    "rgb": "(197, 227, 132)"
}, {
    "hex": "#FFAE42",
    "name": "Yellow Orange",
    "rgb": "(255, 174, 66)"
}];
