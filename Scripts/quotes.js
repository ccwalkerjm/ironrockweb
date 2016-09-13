var currentQuote;
var _IronRockPreliminaryData = "IronRockPreliminaryData";





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
        currentQuote = $('form').serializeObject();
        if (!parseInt(currentQuote.quotation_number))
            delete currentQuote.quotation_number;
        var formData = JSON.stringify(currentQuote);
        console.log(formData);
        setLoadingState(true);
        g_ironrock_service.submitQuote2(formData, function(err, r) {
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
                currentQuote.quoteLimits = r;
                currentQuote.quotation_number = r.quotation_number;
                currentQuote.applicantQuoteNo = r.quotation_number;
                $('#quotation_number').val(r.quotation_number);

                var $container = $('#quotation');
                loadQuotationLimits($container, r);
                $container.addClass("returntoQuotes");
                $('#quoteLimitsModal').modal('show');

                //$('#disclaimerContainer').hide();
                //$('#submit-btn').hide();
                //$('.button-previous').prop('disabled', true);
                //$('.button-next').prop('disabled', true);
            }
        });
    });

    //trigger returntoQuotes if modal has class returntoQuotes
    $('#quoteLimitsModal').on('hide.bs.modal', function() {
        var $container = $('#quotation');
        if ($container.hasClass("returntoQuotes")) $(".returntoQuotes").trigger('click');
    });
    ///////

    //regular driver
    $('#quote-section').on('click', '#regularDriversBtns .Add', function() {
        var count = $('#regularDriversId').find(".regularDriversCls").length;
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
                    cloneElement(elementGroup);
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

    $('#regularDriversId').on('click', '.Delete', function() {
        var elementGroup = $(this).closest('.regularDriversCls');
        var allElements = $('#regularDriversId').find('.regularDriversCls');
        if (allElements.length == 1) {
            elementGroup.find('input:text').val('');
            $('#regularDriversId').hide();
        } else {
            elementGroup.remove();
            resetRegularDriver();
        }
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
        $('#add-vehicle-seperator').show();
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
        r.motorVehicleID = "";
        r.sumInsured = $('#QueryVehicleSumInsured').val();

        // if (r.sumInsured < 1000) {
        //     alert('Invalid Sum Insured!');
        //     return;
        // }

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
        $('#taxOfficeVehicleDialog').modal('hide');
    });


    //query vehicle
    $('#quote-section').on("click", "#queryVehicleSearch", function() {
        var plateno = $('#QueryVehicleRegistrationNo').val().replace(/ /g, '').toUpperCase();
        var chassisno = $('#QueryVehicleChassisNo').val();

        if (!plateno && !chassisno) {
            alert("Registration No and Chassis No cannot be blank");
            return;
        }

        // if ($('#QueryVehicleSumInsured').val() < 1000) {
        //     alert('Invalid Sum Insured!');
        //     return;
        // }

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
                        $('#add-vehicle-seperator').hide();
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
        bootbox.confirm("Are you sure?", function(ans) {
            if (ans) {
                tr.remove();
                reIndexVehicles();
            }
        });
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


    $('.parish').change(function() {
        var parishValue = $(this).val();
        var parishId = $(this).attr("id");
        setTown(parishId, parishValue);
    });



    $('#insuranceCoverage').change(function() {
        var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
        var usages;
        switch ($(this).val()) {
            case "mpc":
                usages = options.usagelist_mpc;
                break;
            case "mptft":
                usages = options.usagelist_mptft;
                break;
            case "mpt":
                usages = options.usagelist_mpt;
                break;
        }
        var $select = $('#vehicleUsedAs').empty();
        $.each(usages.data, function(idx, value) {
            $select.append('<option value="' + value.code + '">' + value.description + '</option>');
        });
    });

    //vehicle Used As
    $('#vehicleUsedAs').change(function() {
        var select_value = $(this).val();
        setVehicleUsedAs(select_value);
    });


    $('#vehicle-all-accidents').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.vehicle-accident-block');
        cloneElement(elementGroup);
        resetAllAccident();
    });

    $('#vehicle-all-accidents').on('click', '.Delete', function() {
        var count = $('#vehicle-all-accidents').find(".vehicle-accident-block").length;
        if (count == 1) { //clear
            $(".vehicle-accident-block").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.vehicle-accident-block');
            elementGroup.remove();
        }
        resetAllAccident();
    });


    $('input[type=radio]').change(function() {
        setRadioDisplay($(this).attr('name'), this.value);
    });



    //resetHomeAllRiskArticles
    $('#HomeAllRiskInsured').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.HomeAllRiskArticles');
        cloneElement(elementGroup);
        resetHomeAllRiskArticles();
        SetHomeAllRiskInsuredValue();
    });

    $('#HomeAllRiskInsured').on('click', '.Delete', function() {
        var count = $('#HomeAllRiskInsured').find(".HomeAllRiskArticles").length;
        if (count == 1) { //clear
            $(".HomeAllRiskArticles").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.HomeAllRiskArticles');
            elementGroup.remove();
        }
        resetHomeAllRiskArticles();
        SetHomeAllRiskInsuredValue();
    });

    $('#HomeAllRiskInsured').on('keyup', '.article-value input', function() {
        SetHomeAllRiskInsuredValue();
    });


    //HomeInsurance
    $('#homeInsuranceProperty').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.homeInsurancePropertyItems');
        cloneElement(elementGroup);
        resetHomeInsuranceProperty();
        SetHomeInsuranceValue();
    });

    $('#homeInsuranceProperty').on('click', '.Delete', function() {
        var count = $('#homeInsuranceProperty').find(".homeInsurancePropertyItems").length;
        if (count == 1) { //clear
            $(".homeInsurancePropertyItems").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.homeInsurancePropertyItems');
            elementGroup.remove();
        }
        resetHomeInsuranceProperty();
        SetHomeInsuranceValue();
    });


    $('#homeInsuranceProperty').on('keyup', '.article-value input', function() {
        SetHomeInsuranceValue();
    });


    $('#HomeInsuranceContent .article-value').on('keyup', 'input', function() {
        SetContentTotalAmount();
    });





    $('#publicofficerelation').on('click', '.Add', function() {
        var elementGroup = $(this).closest('.publicofficerelations');
        cloneElement(elementGroup);
        resetApplicantRelativeInPublicOffice();
    });

    $('#publicofficerelation').on('click', '.Delete', function() {
        var count = $('#publicofficerelation').find(".publicofficerelations").length;
        if (count == 1) { //clear
            $(".publicofficerelations").find("input[type=text],input[type=number],textarea").val("");
        } else {
            //delete
            var elementGroup = $(this).closest('.publicofficerelations');
            elementGroup.remove();
        }
        resetApplicantRelativeInPublicOffice();
    });



    $('#applicantHomeCountry').change(function() {
        var select_value = $(this).val();
        if (select_value == "Jamaica") {
            $('#homeAddress .jamaica').show();
            $('#homeAddress .international').hide();
        } else {
            $('#homeAddress .jamaica').hide();
            $('#homeAddress .international').show();
        }
    });


    $('#applicantMailCountry').change(function() {
        var select_value = $(this).val();
        if (select_value == "Jamaica") {
            $('#mailingAddress').find('.jamaica').show();
            $('#mailingAddress').find('.international').hide();
        } else {
            $('#mailingAddress').find('.jamaica').hide();
            $('#mailingAddress').find('.international').show();
        }
    });


    $('#employerNationality').change(function() {
        var select_value = $(this).val();
        if (select_value == "Jamaica") {
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


function LoadSettings(insuranceType, callback) {
    var timeInDay = 1000 * 60 * 60 * 24;
    var d = new Date();
    var currentTimeStamp = d.getTime();

    //     $('#quote-wizard').bootstrapWizard();
    var prelimData = sessionStorage.getItem(_IronRockPreliminaryData);

    if (prelimData) {
        prelimData = ConvertToJson(prelimData);
        var lastStored = parseInt(prelimData.timeUpdated) || 0;
        if (lastStored + timeInDay > currentTimeStamp) {
            setSettings(insuranceType);
            return callback();
        }
    }
    setLoadingState(true);
    g_ironrock_service.getMiscOptions(function(err, r) {
        setLoadingState(false);
        if (err) {
            return callback(err);
        }
        var jsondata = ConvertToJson(r);
        if (jsondata.errorMessage) return callback(new Error(jsondata.errorMessage));
        jsondata.timeUpdated = currentTimeStamp;
        sessionStorage.setItem(_IronRockPreliminaryData, JSON.stringify(jsondata));
        setSettings(insuranceType);
        return callback();
    });
}

//do wizard and load settings
function setSettings(insuranceType) {
    setVehicleUsedAs("SocialDomesticPleasure");
    $('#insuranceCoverage').trigger("select");
    //vehicle-all-accidents
    setAllAccidentsYears();
    //set Last Three Years of Ownership()
    setLastThreeYearsOwnership();
    //load countries
    loadCountriesOptions();
    loadParishes();

    setTown('employerParish', $('#employerParish').val());
    setTown('applicantHomeParish', $('#applicantHomeParish').val());
    setTown('applicantMailParish', $('#applicantMailParish').val());
    if (insuranceType != "motor")
        setTown('homeRiskAddressParish', $('#homeRiskAddressParish').val());
    loadOccupations(insuranceType == "motor");

    if (insuranceType != "motor") {
        loadRoofWallsTypes();
    }
    loadFinanceCodes(insuranceType);
}

function loadFinanceCodes(insuranceType) {
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
    var $selectIdString = insuranceType == "motor" ? "motorFinancialInstitutionCode" : "homeFinancialInstitutionCode";
    var $select = $('#' + $selectIdString).html('<option value="">None</Option>');
    $.each(options.mortgagees.mortgagees, function(idx, company) {
        $select.append('<option value="' + company.global_name_id + '">' + company.name + '</option>');
    });
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
        case 'personal-contact-page':
            if (!$('#applicantHomeParish').val()) {
                $valid = false;
            }
            if ($('#mailingAddress').is(":visible")) {
                if (!$('#applicantMailParish').val()) {
                    $valid = false;
                }
                if (!$('#applicantMailTown').val()) {
                    $valid = false;
                }
                if (!$('#applicantMailStreetName').val()) {
                    $valid = false;
                }
            }
            break;
        case 'personal-employer-details-page':
            if (!$('#applicantOccupation').val()) {
                $valid = false;
            }
            break;
        case 'vehicle-particulars-page':
            if ($valid && $('#vehiclesToBeInsured tbody tr').length === 0)
                $valid = false;
            break;
        case 'vehicle-insurance-coverage-page':
            switch ($('#insuranceCoverage').val()) {
                case "mpt":
                    break;
                default:
                    $('#vehiclesToBeInsured .ValueVehicleValue').each(function(i, obj) {
                        var vehValue = parseFloat($(this).val());
                        if (!vehValue || vehValue <= 0) {
                            $valid = false;
                        }
                    });
                    break;
            }
            break;
        case 'vehicle-driver-details-page':
            break;
        case 'vehicle-accidents-page':
            break;
        case 'vehicle-medical-history-page':
            break;
        case 'home-particulars-page':
            if (!$('#homeRiskAddressParish').val()) {
                $valid = false;
            }
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
function insertVehicle(r, rowIndex) {
    var tbl = $('#vehiclesToBeInsured tbody');
    var rows = $('tr', tbl);

    if (typeof rowIndex === "undefined") {
        rowIndex = rows.length;
    }

    if (IsDuplicateVehicle(r.chassisNo, rowIndex)) {
        bootbox.alert('Duplicate Vehicle!');
        return;
    }

    var xRow;
    if (rowIndex == rows.length) {
        xRow = $('<tr/>').appendTo(tbl);
    } else {
        xRow = rows.eq(rowIndex).html('');
    }

    //motorVehicleID

    var htmlValues = '<span>' + r.plateNo + '</span>' +
        '<input type="hidden" class="ValueVehicleRegistrationNo" value="' + $.trim(r.plateNo) + '" />' +
        '<input type="hidden" class="ValueVehicleChassisNo" value="' + $.trim(r.chassisNo) + '" />' +
        '<input type="hidden" class="ValueVehicleMake" value="' + $.trim(r.make) + '" />' +
        '<input type="hidden" class="ValueVehicleModel" value="' + $.trim(r.model) + '" />' +
        '<input type="hidden" class="ValueVehicleYear" value="' + $.trim(r.year) + '" />' +
        '<input type="hidden" class="ValueVehicleBody" value="' + $.trim(r.vehicleBodyType) + '" />' +
        '<input type="hidden" class="ValueVehicleType" value="' + $.trim(r.vehicleType) + '" />' +
        '<input type="hidden" class="ValueVehicleEngineNo" value="' + $.trim(r.engineNo) + '" />' +
        '<input type="hidden" class="ValueVehicleColour" value="' + $.trim(r.colour) + '" />' +
        '<input type="hidden" class="ValueVehicleValue" value="' + $.trim(r.sumInsured) + '" />' +
        '<input type="hidden" class="ValueVehicleID" value="' + $.trim(r.motorVehicleID) + '" />';

    xRow.addClass('vehicle').attr('data-id', r.chassisNo);
    var registrationCell = $('<td/>');
    registrationCell.html(htmlValues);
    registrationCell.appendTo(xRow);
    //
    var makeModelCell = $('<td/>');
    makeModelCell.html(r.make + ' ' + r.model);
    makeModelCell.appendTo(xRow);
    //
    var detailsCell = $('<td/>');
    detailsCell.html(r.year + ' ' + r.vehicleBodyType + ' ' + r.colour);
    detailsCell.appendTo(xRow);
    //
    var chassisCell = $('<td/>');
    chassisCell.html(r.chassisNo + '/' + r.engineNo);
    chassisCell.appendTo(xRow);
    //
    var sumInsuredCell = $('<td/>');
    var sumInsuredHtml = '<div class="input-group"><input type="text" class="form-control" value="' + accounting.formatMoney(r.sumInsured) + '" disabled><span class="input-group-btn"><button class="btn btn-default adjust" type="button">Chg</button></span></div>';
    sumInsuredCell.html(sumInsuredHtml);
    sumInsuredCell.appendTo(xRow);
    //
    var deleteCell = $('<td/>');
    deleteCell.html('<button type="button" class="btn btn-link deleteVehicleRow">Delete</button>');
    deleteCell.appendTo(xRow);

    //
    reIndexVehicles();
}


$('#vehiclesToBeInsured tbody').on("click", "button.adjust", function() {
    var selectedRow = $(this).closest("tr");
    var rowIndex = $("#vehiclesToBeInsured tbody tr").index(selectedRow);
    var r = {};
    r.plateNo = selectedRow.find('.ValueVehicleRegistrationNo').val();
    r.chassisNo = selectedRow.find('.ValueVehicleChassisNo').val();
    r.make = selectedRow.find('.ValueVehicleMake').val();
    r.model = selectedRow.find('.ValueVehicleModel').val();
    r.year = selectedRow.find('.ValueVehicleYear').val();
    r.vehicleBodyType = selectedRow.find('.ValueVehicleBody').val();
    r.engineNo = selectedRow.find('.ValueVehicleEngineNo').val();
    r.colour = selectedRow.find('.ValueVehicleColour').val();
    bootbox.prompt("New Value of Vehicle?", function(result) {
        if (result) {
            r.sumInsured = accounting.unformat(result);
            insertVehicle(r, rowIndex);
        }
    });
});

//check duplicate
function IsDuplicateVehicle(chassisNo, idx) {
    var returnVal = false;
    $('#vehiclesToBeInsured tbody tr').each(function(xIndex, element) {
        var xChassisNo = $(this).attr('data-id');
        if (xChassisNo && chassisNo.trim() == xChassisNo.trim() && idx != xIndex) {
            returnVal = true;
            return false;
        }
    });
    return returnVal;
}

//need to index vehicles
function reIndexVehicles() {
    var CaptionBaseVehicleRegistrationNo = 'vehicleRegistrationNo';
    var CaptionBaseVehicleChassisNo = 'vehicleChassisNo';
    var CaptionBaseVehicleMake = 'vehicleMake';
    var CaptionBaseVehicleModel = 'vehicleModel';
    var CaptionBaseVehicleYear = 'vehicleYear';
    var CaptionBaseVehicleEngineNo = 'vehicleEngineType';
    var CaptionBaseVehicleBody = 'vehicleBody';
    var CaptionBaseVehicleType = 'vehicleType';
    var CaptionBaseVehicleColour = 'vehicleColour';
    var CaptionBaseVehicleID = 'motorVehicleID';
    var CaptionBaseVehicleValue = 'vehicleValue';
    var sumInsured = 0;
    $('#vehiclesToBeInsured tbody tr').each(function(index, element) {
        var xRow = $(element);
        xRow.find('.ValueVehicleRegistrationNo').attr("id", CaptionBaseVehicleRegistrationNo + index).attr("name", CaptionBaseVehicleRegistrationNo + index);
        xRow.find('.ValueVehicleChassisNo').attr("id", CaptionBaseVehicleChassisNo + index).attr("name", CaptionBaseVehicleChassisNo + index);
        xRow.find('.ValueVehicleMake').attr("id", CaptionBaseVehicleMake + index).attr("name", CaptionBaseVehicleMake + index);
        xRow.find('.ValueVehicleModel').attr("id", CaptionBaseVehicleModel + index).attr("name", CaptionBaseVehicleModel + index);
        xRow.find('.ValueVehicleYear').attr("id", CaptionBaseVehicleYear + index).attr("name", CaptionBaseVehicleYear + index);
        xRow.find('.ValueVehicleBody').attr("id", CaptionBaseVehicleBody + index).attr("name", CaptionBaseVehicleBody + index);
        xRow.find('.ValueVehicleType').attr("id", CaptionBaseVehicleType + index).attr("name", CaptionBaseVehicleType + index);
        xRow.find('.ValueVehicleEngineNo').attr("id", CaptionBaseVehicleEngineNo + index).attr("name", CaptionBaseVehicleEngineNo + index);
        xRow.find('.ValueVehicleColour').attr("id", CaptionBaseVehicleColour + index).attr("name", CaptionBaseVehicleColour + index);
        xRow.find('.ValueVehicleValue').attr("id", CaptionBaseVehicleValue + index).attr("name", CaptionBaseVehicleValue + index);
        xRow.find('.ValueVehicleID').attr("id", CaptionBaseVehicleID + index).attr("name", CaptionBaseVehicleID + index);
        sumInsured = sumInsured + parseFloat(xRow.find('.ValueVehicleValue').val());
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
}


function loadQuotationLimits($container, limitData) {
    $container.html('');
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
        var limitHeader = $('<h4/>').text('Your Coverage');
        limitHeader.appendTo($container);
        var limittable = $('<table/>').addClass('table table-striped').html('<tr><th>Heading</th><th  style="text-align:right">Limit</th><th>Description</th></tr>');

        $.each(limitData.limits, function(i, item) {
            limittable.append('<tr><td>' + item.heading + '</td><td style="text-align:right">' + accounting.formatMoney(item.limit) + '</td><td>' + item.description + '</td></tr>');
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
    //$('#applicantHomeCountry').val(r.CountryCode.toLowerCase()=='jamaica'?'Jamaica':).trigger("change");
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
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
    $('#QueryVehicleMake').empty();
    $.each(options.makeModels.data, function(key, value) {
        $('#QueryVehicleMake').append('<option value="' + value.make + '">' + value.make + '</option>');
    });
}

function loadBodyTypes() {
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
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
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
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

//set towns
function setTown(parishId, parishValue) {
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
    var towns;
    var townId;
    switch (parishId) {
        case 'applicantMailParish':
            townId = 'applicantMailTown';
            break;
        case 'employerParish':
            townId = 'employerTown';
            break;
        case 'homeRiskAddressParish':
            townId = 'homeRiskAddressTown';
            break;
        case 'applicantHomeParish':
            townId = 'applicantHomeTown';
            break;
    }
    $.each(options.ParishTowns.data, function(i, json) {
        if (parishValue == json.parish) {
            towns = json.towns;
        }
    });
    if (towns) {
        var $select = $('#' + townId).empty();
        $.each(towns, function(idx, value) {
            $select.append('<option value="' + value + '">' + value + '</option>');
        });
    }
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

//set home insurance values
function SetContentTotalAmount() {
    var valList = [];
    $('#HomeInsuranceContent .article-value').find('input').each(function(index, element) {
        valList.push($(element).val());
    });
    $('#HomeInsuranceContentTotalAmount').val(GetTotal(valList));
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
    resetObjects(objectList, elementClass, "Add", "Delete", "Accident", true);
}


//Used As
function setVehicleUsedAs(select_value) {
    //hide and uncheck all inexperinecd driver elements
    //$('#InexperiencedDriverBlock input').prop('checked', false); // Unchecks it
    //$('#InexperiencedDriverBlock label, #InexperiencedDriverBlock input').hide();
    //$('label[for=a], input#a').hide();
    //show relevant inputs
    $('#21YearsPrivateCars').show();
    $('#24MonthsPrivateLicense').show();
    $('#25yearsOldGeneral').hide();
    $('#5YearsGeneralPublicCommercial').hide();
    $('#23YearsOldPrivateCommercial').hide();
    $('#36MonthGeneralLicense').hide();
    // switch (select_value) {
    //     case "CarriageOwnGoods": //private commercial
    //     case "CarriagePassengersNotHire": //private commercial
    //     case "CarriagePassengersHire": //private commercial
    //         $('#23YearsOldPrivateCommercial').show();
    //         $('#36MonthGeneralLicense').show();
    //         $('#25yearsOldGeneral').hide();
    //         $('#5YearsGeneralPublicCommercial').hide();
    //         $('#21YearsPrivateCars').hide();
    //         $('#24MonthsPrivateLicense').hide();
    //         break;
    //     case "GeneralCartage": //General Cartage
    //         $('#25yearsOldGeneral').show();
    //         $('#5YearsGeneralPublicCommercial').show();
    //         $('#23YearsOldPrivateCommercial').hide();
    //         $('#36MonthGeneralLicense').hide();
    //         $('#21YearsPrivateCars').hide();
    //         $('#24MonthsPrivateLicense').hide();
    //         break;
    //     case "CommercialTravelling": //private commercial
    //     case "SocialDomesticPleasure": //private car
    //     case "SocialDomesticPleasureBusiness": //private car
    //         $('#21YearsPrivateCars').show();
    //         $('#24MonthsPrivateLicense').show();
    //         $('#25yearsOldGeneral').hide();
    //         $('#5YearsGeneralPublicCommercial').hide();
    //         $('#23YearsOldPrivateCommercial').hide();
    //         $('#36MonthGeneralLicense').hide();
    //         break;
    // }
}




//load occupations
function loadOccupations(isMotor) {
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
    $('#applicantOccupation').html('<option value=""></option>');
    if (isMotor) {
        $('#regularDriversOccupation0').html('<option value=""></option>');
    }
    $.each(options.occupations.data, function(key, value) {
        $('#applicantOccupation').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        if (isMotor) {
            $('#regularDriversOccupation0').append('<option value="' + value.occupation.trim() + '">' + value.occupation + '</option>');
        }
    });
}

//load roof and wall types
function loadRoofWallsTypes() {
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
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
    resetObjects(objectList, elementClass, "Add", "Delete", "Article", true);
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
    resetObjects(objectList, elementClass, "Add", "Delete", "Building", true);
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

    resetObjects(objectList, elementClass, "Add", "Delete", "Driver", true);
}


function resetApplicantRelativeInPublicOffice() {

    var objectList = [{
        "class": "office",
        "name": "applicantRelativePublicOffice"
    }, {
        "class": "address",
        "name": "applicantRelativePublicAddress"
    }, {
        "class": "relation",
        "name": "applicantRelativePublicRelation"
    }, {
        "class": "name",
        "name": "applicantRelativePublicName"
    }];
    var elementClass = $('.publicofficerelations');

    resetObjects(objectList, elementClass, "Add", "Delete", "Relative", true);
}

//
//set display of text based on Radio Button selection
function setRadioDisplay(RadioName, RadioValue) {
    var radioBtn = $('input[name=' + RadioName + '][value=' + RadioValue + ']');
    var displayElement = getDisplayElement(RadioName);

    if (!displayElement.defaultValue) return;

    var $element;
    if (displayElement.id) {
        $element = $('#' + displayElement.id);
    } else {
        $element = $('.' + displayElement.class);
    }

    if (RadioValue == displayElement.defaultValue) {
        $element.find('input[type=text],input[type=number],textarea').val('');
        removeElementsExceptFirst(RadioName);
        $element.hide();
    } else {
        $element.show();
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
            // case 'proposerEntitledToNOClaimDiscount':
            //     returnValue.defaultValue = "no";
            //     returnValue.id = "proposerEntitledToNOClaimDiscountProof";
            //     break;
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
            returnValue.id = "divDriverSufferFromDefectiveHearingOrVisionDetails";
            break;
        case 'driverSufferFromDiabetesEpilepsyHeartDisease':
            returnValue.defaultValue = "no";
            returnValue.id = "divDriverSufferFromDiabetesEpilepsyHeartDiseaseDetails";
            break;
        case 'driverSufferFromPhysicalMentalInfirmity':
            returnValue.defaultValue = "no";
            returnValue.id = "divDriverSufferFromPhysicalMentalInfirmityDetails";
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
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
    var countryElements = $('#quote-section .countries');
    countryElements.each(function(index, item) {
        var selectObj = $(this);
        selectObj.html('');
        $.each(options.countries.data, function(i, country) {
            if (country == 'Jamaica') {
                selectObj.append('<option value="' + country + '" selected="selected">' + country + '</option>');
            } else {
                selectObj.append('<option value="' + country + '">' + country + '</option>');
            }
        });
    });
}

//load parishes in select options
function loadParishes() {
    var options = ConvertToJson(sessionStorage.getItem(_IronRockPreliminaryData));
    var parishElements = $('.parish');
    parishElements.each(function(index, item) {
        var selectObj = $(this);
        selectObj.html('');
        $.each(options.ParishTowns.data, function(i, json) {
            selectObj.append('<option value="' + json.parish + '">' + json.parish + '</option>');
        });
    });
}


//clone element
function cloneElement(elementGroup) {
    var clone = elementGroup.clone().insertAfter(elementGroup);
    clone.find("input[type=text],input[type=number],textarea").val("");
    clone.show();
}

//default Elements
function removeElementsExceptFirst(RadioName) {
    switch (RadioName) {
        case 'applicantRelativeInPublicOffice':
            $('.publicofficerelations').not(':first').remove();
            resetApplicantRelativeInPublicOffice();
            break;
        case 'involvedInAccident':
            $('.vehicle-accident-block').not(':first').remove();
            resetAllAccident();
            break;
        default:
            break;
    }
}

//reset objects
function resetObjects(objectList, elementClass, addBtnName, delBtnName, elementTitle, showDeleteButtonOnFirstPage) {
    var firstElement = elementClass.first();
    var lastElement = elementClass.last();

    var noOfItems = elementClass.length;
    var maxItems = 5;

    elementClass.each(function(i, e) {
        var element = $(this);
        //change ids and names
        $.each(objectList, function(j, item) {
            element.find('.' + item.class + ' :input').attr('id', item.name + i).attr('name', item.name + i);
            element.find('.' + item.class + ' textarea').attr('id', item.name + i).attr('name', item.name + i);
            element.find('.' + item.class + ' label').attr('for', item.name + i);
        });

        //set controls
        //delete button
        if (delBtnName) {
            var xDelBtnElement = element.find('.' + delBtnName);
            if (element.is(firstElement) && !showDeleteButtonOnFirstPage) {
                xDelBtnElement.hide();
            } else {
                xDelBtnElement.show();
            }
        }
        //add button
        if (addBtnName) {
            var xAddBtnElement = element.find('.' + addBtnName);
            if (element.is(lastElement) && noOfItems < maxItems) {
                xAddBtnElement.show();
            } else {
                xAddBtnElement.hide();
            }
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


var _colours = [{
    "hex": "#F5F5DC",
    "name": "Beige",
    "rgb": "(245,245,220)"
}, {
    "hex": "#000000",
    "name": "Black",
    "rgb": "(0,0,0)"
}, {
    "hex": "#1F75FE",
    "name": "Blue",
    "rgb": "(31, 117, 254)"
}, {
    "hex": "#B4674D",
    "name": "Brown",
    "rgb": "(180, 103, 77)"
}, {
    "hex": "#800020",
    "name": "Burgundy",
    "rgb": ""
}, {
    "hex": "#F7E7CE",
    "name": "Champagne",
    "rgb": ""
}, {
    "hex": "#E7C697",
    "name": "Gold",
    "rgb": "(231, 198, 151)"
}, {
    "hex": "#95918C",
    "name": "Gray",
    "rgb": "(149, 145, 140)"
}, {
    "hex": "#1CAC78",
    "name": "Green",
    "rgb": "(28, 172, 120)"
}, {
    "hex": "#1CA9C9",
    "name": "Pacific Blue Pearl",
    "rgb": "(28, 169, 201)"
}, {
    "hex": "#8E4585",
    "name": "Plum Mist Metallic",
    "rgb": "(142, 69, 133)"
}, {
    "hex": "#EE204D",
    "name": "Red",
    "rgb": "(238,32 ,77 )"
}, {
    "hex": "#CDC5C2",
    "name": "Silver",
    "rgb": "(205, 197, 194)"
}, {
    "hex": "#18A7B5",
    "name": "Teal Mist Metallic",
    "rgb": "(24, 167, 181)"
}, {
    "hex": "#FFFFFF",
    "name": "White",
    "rgb": "(255, 255, 255)"
}];
