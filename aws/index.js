// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
////////////outside functions




//$(document).on("mobileinit", function () {
//    $.mobile.autoInitializePage = false;
//});

var _apiBaseUrl = "https://api.courserv.com/ironrock"; //localhost:58633/api/";
var _contentBaseUrl = "https://cdn.courserv.com/ironrock";
var _IronRockPreliminaryData = "IronRockPreliminaryData";

function ConvertToJson(r) {
    try {
        r = JSON.parse(r);
    } catch (e) {
        // not json
    }
    return r;
}


function loadQuotation(r) {
    $('#signatureContainer').hide();
    $('#quotation-number').val(r.quotation_number);
    var container = $('#quotation');
    container.append('<h4>Note the Policy Limits</h4>');
    var table = $('<table/>'); //data-role="table" class="ui-responsive"
    table.attr('data-role', "table");
    table.addClass('ui-responsive');
    table.append('<tr><th>Quotation No:</th><td>' + r.quotation_number + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Net Premium:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.net_premium) + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Stamp Duty:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.stamp_duty) + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Tax:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.tax) + '</td></tr>');
    table.append('<tr><th style="text-align: right;">Total Premium:</th><td style="text-align: right;">' + accounting.formatMoney(r.premium_calculation.total_premium) + '</td></tr>');
    table.appendTo(container);
    if (r.limits.length > 0) {
        var limitHeader = $('<h4/>').text('Limits');
        limitHeader.appendTo(container);
        var limittable = $('<table/>').attr('data-role', "table").addClass('ui-responsive').html('<tr><th>Code</th><th>Heading</th><th  style="text-align:right">Limit</th><th>Description</th></tr>');

        $.each(r.limits, function (i, item) {
            limittable.append('<tr><td>' + item.code + '</td><td>' + item.heading + '</td><td style="text-align:right">' + accounting.formatMoney(item.limit) + '</td><td>' + item.description + '</td></tr>');
        });
        limittable.appendTo(container);
    }
}






//$(document).ready(function (e) {
function doPrimaryFunctions() {

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
            $('.regularDriversCls:last .DriversDL input').val($('#applicantIDNumber').val());
            $('.regularDriversCls:last .DriversDLExpirationDate input').val($('#applicationIDExpirationDate').val());
            $('.regularDriversCls:last .DriversDLOriginalDateOfIssue input').val($('#dateFirstIssued').val());
        }
    }

    function addDriver($this, id, callback) {
        var serverUrl = _apiBaseUrl + "/DriverLicense/?id=" + id;
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            success: function (json) {
                //var json = JSON.parse(r);
                json = ConvertToJson(json);
                if (json.error_message) {
                    alert("Invalid ID!!");
                } else if (json.Message) {
                    alert("Invalid ID!!");
                } else {
                    callback(null, json);
                }
            },
            error: function (err) {
                //error handling
                callback(err);
                //alert("error: " + data.statusText);
            }
        });
    }


    //regular driver
    $('#regularDriversBtns').on('click', '.Add', function () {
        var $this = $('#regularDriversBtns .Add');
        var id = $('#regularDriverQueryID').val();
        addDriver($this, id, function (err, r) {
            if (err) {
                alert("error: " + err.statusText);
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

    $('#regularDriversBtns').on('click', '.Reset', function () {
        $('.regularDriversCls').not('.regularDriversCls:first').remove();
        $('.regularDriversCls').find('input:text').val('');
        $('#regularDriversId').hide()
        resetRegularDriver();
    });



    ///
    ///////
    $('#personal-main-page').on('click', '#getTRNDetails', function () {

        var id = $('#applicantTRN').val();
        var serverUrl = _apiBaseUrl + "/DriverLicense/?id=" + id;
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                //success handling
                //var json = JSON.parse(r);
                r = ConvertToJson(r);
                if (r.error_message) {
                    alert("Invalid ID!!");
                } else if (r.Message) {
                    alert("Invalid ID!!");
                } else {
                    r.id = id;
                    populateApplicant(r);
                    createFirstDriver();
                }
            },
            error: function (err) {
                //error handling
                alert("error: " + err.statusText);
            }
        });
    });

    $('#personal-main-page').on('click', '#clearTRNDetails', function () {
        SetTRnDetails(false);
        var imageSrc = "/images/dummy.jpg";
        $('#applicantPhoto').attr('src', imageSrc); //
        $('#applicantTRNDetails input').val('');
        $('#applicantTRN').val('');
        $('#applicantIDNumber').val('');
        $('#dateFirstIssued').val('');
        $('#applicationIDExpirationDate').val('');
        $('#applicantHomeStreetName').val('');
    });

    function populateApplicant(r) {
        //id
        $('#applicantIDNumber').val(r.driversLicenceNo);
        $('#dateFirstIssued').val(r.dateFirstIssued);
        $('#applicationIDExpirationDate').val(r.expiryDate);
        //address
        $('#applicantSurname').val(r.lastName);
        $('#applicantFirstName').val(r.firstName);
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
    $('#page-signature').on('click', '#clear-canvas', function () {
        $('#signature').jSignature('clear');
    });
    /////Final//////////////////////




    /*////////Validate and Get Quotation ////////////////
    $('#page-quotation').on('click', '#get-quotation', function () {
        //var formData = $('form').serialize();
        var formData = JSON.parse(JSON.stringify($('form').serializeObject()));
        //remove all empty nodes
        $.each(formData, function (key, value) {
            if (value === "" || value === null) {
                delete formData[key];
            }
        });

        var serverUrl = _apiBaseUrl + "/ironrockquote/";
        var data = JSON.stringify(formData);
        console.log(formData);
        console.log(data);
        $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: serverUrl,
            dataType: 'json',
            data: data,
            success: function (r) {
                //success handling
                //var r = JSON.parse(results);
                r = ConvertToJson(r);
                if (!r.success) {
                    console.log(r);
                    alert(r.error_message ? r.error_message : '' + r.Message ? r.Message : '');
                } else {
                    loadQuotation(r);
                    $('#quotation-number').val(r.quotation_number);
                    $('#get-quotation').hide();
                    $('#confirmQuotation').show();
                }
            },
            error: function (err) {
                //error handling
                console.log(err);
                alert("error: " + err.statusText);
            }
        });

    });*/






    //////////////////////////////////Insert vehicle
    $('#taxOfficeVehicleRefresh').click(function () {
        $('#vehiclesToBeInsured .vehicle').remove();
        $('#taxOfficeVehicleRefresh').hide();
    });

    //check whether new
    $('#isNewVehicle').change(function () {
        var select_value = $(this).val();
        if (select_value == 'yes') {
            $('#taxOfficeVehicleDialog .chassis').hide();
            $('#taxOfficeVehicleDialog .registration').show();
        } else {
            $('#taxOfficeVehicleDialog .chassis').show();
            $('#taxOfficeVehicleDialog .registration').hide();
        }
    });

    $('#GetTaxOfficeVehicleDialog').click(function () {
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

    function orderSelect($element) {
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


    function loadColours() {
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
        orderSelect($('#QueryVehicleBodyType'));
    }


    $('#QueryVehicleMake').change(function () {
        loadVehicleModels();
    });

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


    //manual entry
    $('#taxOfficeVehicleDialog').on("click", "#queryVehicleAdd", function () {
        var r = {};

        r.plateNo = $('#QueryVehicleRegistrationNo').val();
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


    $('#taxOfficeVehicleDialog').on("click", "#queryVehicleSearch", function () {
        var serverUrl = _apiBaseUrl + "/Vehicle/";
        var plateno = $('#QueryVehicleRegistrationNo').val();
        var chassisno = $('#QueryVehicleChassisNo').val();

        if (plateno) {
            serverUrl = serverUrl + '?plateno=' + plateno; // = null, string chassisNo
        } else if (chassisno) {
            serverUrl = serverUrl + '?chassisno=' + chassisno; // = null, string chassisNo
        } else {
            alert("Registration No and Chassis No cannot be blank");
            return;
        }

        /*if (!VehicleRegistrationNo) {
            alert("Not valid!");
        } else if (IsDuplicate(VehicleRegistrationNo)) {
            alert('Duplicate!');
        }*/

        if ($('#QueryVehicleSumInsured').val() < 1000) {
            alert('Invalid Sum Insured!');
            return;
        }


        $.ajax({
            type: 'GET',
            url: serverUrl,
            dataType: "json",
            success: function (r) {
                //var json = JSON.parse(r);
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
                            loadColours();
                        }
                    });
                } else {
                    r.sumInsured = $('#QueryVehicleSumInsured').val();
                    insertVehicle(r);
                    $('#taxOfficeVehicleDialog').modal('hide');
                }
            },
            error: function (err) {
                //error handling
                alert("Err:" + err.statusText);
            }
        });

    });



    //insert vehicle
    function insertVehicle(r) {

        var cnt = $('#vehiclesToBeInsured .vehicle').length;
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


        var htmlValues = '<span>' + r.plateNo + '</span>' +
            '<input type="hidden" id="' + CaptionBaseVehicleRegistrationNo + cnt + '" name="' + CaptionBaseVehicleRegistrationNo + cnt + '" value="' + $.trim(r.plateNo) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleChassisNo + cnt + '" name="' + CaptionBaseVehicleChassisNo + cnt + '" value="' + $.trim(r.chassisNo) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleMake + cnt + '" name="' + CaptionBaseVehicleMake + cnt + '" value="' + $.trim(r.make) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleModel + cnt + '" name="' + CaptionBaseVehicleModel + cnt + '" value="' + $.trim(r.model) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleYear + cnt + '" name="' + CaptionBaseVehicleYear + cnt + '" value="' + $.trim(r.year) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleBody + cnt + '" name="' + CaptionBaseVehicleBody + cnt + '" value="' + $.trim(r.vehicleBodyType) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleType + cnt + '" name="' + CaptionBaseVehicleType + cnt + '" value="' + $.trim(r.vehicleType) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleEngineNo + cnt + '" name="' + CaptionBaseVehicleEngineNo + cnt + '" value="' + $.trim(r.engineNo) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleColour + cnt + '" name="' + CaptionBaseVehicleColour + cnt + '" value="' + $.trim(r.colour) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleValue + cnt + '" name="' + CaptionBaseVehicleValue + cnt + '" value="' + $.trim(r.sumInsured) + '" />' +
            '<input type="hidden" id="' + CaptionBaseVehicleStatus + cnt + '" name="' + CaptionBaseVehicleStatus + cnt + '" value="' + $.trim(r.vehicleStatus) + '" />';


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
        sumInsuredCell.html('<input type="text" "style="margin-left:auto; margin-right:0;" value="' + accounting.formatMoney(r.sumInsured) + '" disabled/>');
        sumInsuredCell.appendTo(tableRow);
        //
        if (IsDuplicate(r.chassisNo)) {
            bootbox.alert('Duplicate!');
        } else {
            tableRow.appendTo($('#vehiclesToBeInsured'));
            $('#taxOfficeVehicleRefresh tbody').show();
        }
    }



    //check duplicate
    function IsDuplicate(val) {
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

    //return count
    function GetCount() {
        var i = 0;
        $('#vehiclesToBeInsured .ui-grid-d').each(function (index, element) {
            var rowVal = $(this).attr('data-id');
            if (rowVal == val) {
                returnVal = true;
                return false;
            }
        });
        return returnVal;
    }

    //driver Licence 



}

//);