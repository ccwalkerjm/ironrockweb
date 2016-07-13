"use strict";
var doc;

const standardYgap = 5;
const gapBelowHeader = 10;
const startingXPoint = 20;
const startingYPoint = 20;
const startingYFirstPagePoint = 50;

function CreatePDF(resp) {
	doc = new jsPDF();
	doc.setFontSize(12);
	if (resp.insuranceType === 'motor') {
		doc.text(20, 40, 'Motor Vehicle Insurance Proposal');
	} else {
		doc.text(20, 40, 'Home Insurance Proposal');
	}

	var logoCanvas = document.getElementById("canvas");
	var ctx = logoCanvas.getContext("2d");
	var logoImg = document.getElementById("image");
	ctx.drawImage(logoImg, 5, 5);

	var imgData = logoCanvas.toDataURL('image/jpeg');
	console.log(imgData);

	doc.addImage(imgData, 'JPG', 5, 5, 100, 30);

	doc.setFontSize(10);
	doc.setFont("times");
	doc.setFontType("normal");

	doc.text(150, 40, 'Quote No:');
	//doc.text(startingXPoint, 30, 'Insurance for ' + resp.insuranceType);
	doc.text(20, 80, 'Surname:');
	doc.text(20, 85, 'First Name:');
	doc.text(20, 90, 'Middle Name:');
	doc.text(20, 95, 'Title:');
	doc.text(20, 100, 'Occupation:');


	doc.text(100, 80, 'Mothers Maiden Name: ');
	doc.text(100, 85, 'Other Names/Aliases: ');
	doc.text(100, 90, 'ID Type: ');
	doc.text(100, 95, 'ID Number: ');
	doc.text(100, 100, 'Expiration Date: ');
	doc.text(100, 105, 'Source of Funds: ');

	doc.text(20, 115, 'Street Number and Name: ');
	doc.text(20, 125, 'City/Town/Postal Zone: ');
	doc.text(20, 135, 'Parish: ');
	doc.text(100, 115, 'TRN: ');
	doc.text(100, 120, 'Email Address: ');
	doc.text(100, 125, 'Mobile Number: ');
	doc.text(100, 130, 'Home Number: ');
	doc.text(100, 135, 'Work Number: ');

	doc.text(20, 145, 'Street Number and Name: ');
	doc.text(20, 155, 'City/Town/Postal Zone: ');
	doc.text(20, 165, 'Parish ');
	doc.text(100, 145, 'Date of Birth: ');
	doc.text(100, 150, 'Place of Birth: ');
	doc.text(100, 155, 'Nationality: ');

	doc.text(20, 175, 'Company Name:');
	doc.text(100, 175, 'Street Number and Name:');
	doc.text(100, 185, 'Town');
	doc.text(100, 190, 'Parish');

	doc.setFontType("italic");
	doc.text(50, 80, resp.applicantSurname);
	/*doc.text(50, 85, resp.applicantFirstName);
	doc.text(50, 90, resp.applicantMiddleName);*/
	doc.text(50, 95, resp.applicantTitle);
	doc.text(50, 100, resp.applicantOccupation);
	doc.text(150, 80, resp.applicantMothersMaidenName);
	doc.text(150, 85, resp.applicantAlias);
	doc.text(150, 90, resp.applicantIDType);
	doc.text(150, 95, resp.applicantIDnumber);
	doc.text(150, 100, resp.applicationIDExpirationDate);
	/* doc.text(150, 105, resp.SourceOfFunds); */

	doc.text(20, 120, resp.applicantHomeStreetName);
	doc.text(20, 130, resp.applicantHomeTown);
	doc.text(50, 135, resp.applicantHomeParish);
	/* doc.text(150, 115, resp.applicantTRN); */
	doc.text(150, 120, resp.applicantEmailAddress);
	/* doc.text(150, 125, resp.ApplicantMobileNumber);
	 */
	doc.text(150, 130, resp.applicantHomeNumber);
	doc.text(150, 135, resp.applicantWorkNumber);
	/* doc.text(20, 150, resp.applicantMailStreetName); */
	doc.text(20, 160, resp.applicantMailTown);
	//doc.text(50, 165, resp.applicantMailParish);
	doc.text(150, 145, resp.applicantDateOfBirth);
	doc.text(150, 150, resp.applicantPlaceOfBirth);
	doc.text(150, 155, resp.applicantNationality);
	doc.text(50, 175, resp.employerName);
	doc.text(100, 180, resp.employerStreetName);
	doc.text(150, 185, resp.employerTown);
	doc.text(150, 190, resp.employerParish);

	doc.setFontType("bold");
	doc.setFontSize("10");
	doc.text(20, 75, 'Name');
	doc.text(20, 110, 'Home Address');
	doc.text(20, 140, 'Mailing Address');
	doc.text(20, 170, 'Employer Details');

	doc.setFontSize("10");
	doc.setFontType("bold");
	doc.text(20, 195, "NB: Please submit the following:");

	doc.setFontType("bold");
	doc.text(20, 200, "** A power of attorney or a letter duly notarized");
	doc.text(20, 205, "Proof of Address");
	doc.text(20, 210, "Picture Identification(Insured an agent, where applicable)");
	doc.text(20, 215, "TRN(if a driver's license is not being used)");

	doc.setFontType("normal");

	doc.text(20, 220, "Have you or any relative or close associate been entrusted with prominent public functions (e.g. Member of Parliament, ");

	doc.text(20, 223, "Senate or Mayor, Senior Government Official, Judiciary, security forces)?");



	doc.text(20, 230, "If yes, state the type of public office:");

	doc.text(20, 240, "If yes to the above, please give the name and address of spouse and children");

	doc.setFontType("italic");

	doc.text(20, 226, resp.applicantRelativeInPublicOffice ? resp.applicantRelativeInPublicOffice : "");

	doc.text(20, 235, resp.applicantRelativeTypePublicOffice0 ? resp.applicantRelativeTypePublicOffice0 : "");





	doc.setFontSize("8");
	doc.setFontType("bold");
	doc.text(20, 45, "DUTY TO DISCLOSE. This proposal must be completed, dated and signed by the proposer. When answering the questions on this form,");

	doc.text(20, 48, " you must be honest and truthful. You have a duty under law to tell us anything known to you which is material to the questions asked as ");

	doc.text(20, 51, "those answers will guide us in deciding whether to insure you or anyone else to be insured under the policy and on what terms. ");

	doc.text(20, 54, "If you are in doubt as to whether a fact is relevant, you should state it. Your duty to make full and frank discourse occurs: (1) at the time ");

	doc.text(20, 57, "of the time of proposing for insurance. (2) during the currency of the policy, if there are any changes or variations in the information given ");

	doc.text(20, 60, "and (3) at each renewal.");

	doc.text(20, 65, "FAILURE TO DISCLOSE. If you do not comply with these duties and answer our questions honestly, the company will be at liberty to ");

	doc.text(20, 68, "treat your Policy as if it never existed and refuse to pay any claims you make under it.");



	doc.addPage();
	if (resp.insuranceType === 'motor') {
		setMotorVehiclePages(resp);
	} else {
		setHomePropertyPages(resp);
	}

	//doc.output('datauri');
	doc.output('dataurlnewwindow');
	//doc.save('Proposal' + resp.applicantQuoteNo + '.pdf');
}


function setMotorVehiclePages(resp) {
	doc.setFontSize("10");


	doc.setFontType("bold");

	doc.text(20, 20, "Particulars Of Vehicles to Be Insured");
	doc.setFontSize("7");


	doc.text(20, 25, "Registration No.");
	doc.text(42, 25, "Make and Model");
	doc.text(62, 25, "SChassis & Engine No.");
	doc.text(90, 25, "Year of Make");
	doc.text(105, 25, "C.C. Rating");
	doc.text(122, 25, "Seating");
	doc.text(142, 25, "Type Of Body");
	doc.text(162, 25, "Sum Insured");

	doc.setFontType("normal")


	if (resp.vehicleRegistrationNo0) {
		doc.text(20, 30, resp.vehicleRegistrationNo0 ? resp.vehicleRegistrationNo0 : "");
		doc.text(42, 30, resp.vehicleMake0 ? resp.vehicleMake0 : "");
		doc.text(62, 30, resp.vehicleChassisNo0 ? resp.vehicleChassisNo0 : "");
		doc.text(90, 30, resp.vehicleYear0 ? resp.vehicleYear0 : "");
		doc.text(105, 30, "");
		doc.text(122, 30, resp.vehicleBody0 ? resp.vehicleBody0 : "");
		doc.text(142, 30, resp.vehicleType0 ? resp.vehicleType0 : "");
		doc.text(162, 30, resp.QueryVehicleSumInsured ? resp.QueryVehicleSumInsured : "");

	}
	if (resp.vehicleRegistrationNo1) {
		doc.text(20, 35, resp.vehicleRegistrationNo1 ? resp.vehicleRegistrationNo1 : "");
		doc.text(42, 35, resp.vehicleMake1 ? resp.vehicleMake1 : "");
		doc.text(62, 35, resp.vehicleChassisNo1 ? resp.vehicleChassisNo1 : "");
		doc.text(90, 35, resp.vehicleYear1 ? resp.vehicleYear1 : "");
		doc.text(105, 35, " ");
		doc.text(122, 35, resp.vehicleBody1 ? resp.vehicleBody1 : "");
		doc.text(142, 35, resp.vehicleType1 ? resp.vehicleType1 : "");
		doc.text(162, 35, resp.QueryVehicleSumInsured ? resp.QueryVehicleSumInsured : "");

	}
	if (resp.vehicleRegistrationNo2) {
		doc.text(20, 40, resp.vehicleRegistrationNo2 ? resp.vehicleRegistrationNo2 : "");
		doc.text(42, 40, resp.vehicleMake2 ? resp.vehicleMake2 : "");

		doc.text(62, 40, resp.vehicleChassisNo2 ? resp.vehicleChassisNo2 : "");

		doc.text(90, 40, resp.vehicleYear2 ? resp.vehicleYear2 : "");
		doc.text(105, 40, " ");
		doc.text(122, 40, resp.vehicleBody2 ? resp.vehicleBody2 : "");
		doc.text(142, 40, resp.vehicleType2 ? resp.vehicleType2 : "");
		doc.text(162, 40, resp.QueryVehicleSumInsured ? resp.QueryVehicleSumInsured : "");

	}

	doc.setFontSize("8");
	doc.text(20, 75, "NOTE: You are required to ensure that the Sum Insured is revised annually to reflect the current market value.  ");

	doc.text(20, 78, "Claims will be settled based on the market value at the time of the loss. For total losses you will be paid based in");

	doc.text(20, 81, "time of the loss. For total losses you will be paid based on the market value or Policy Sum Insured whichever is lesser.");

	doc.setFontSize("10");
	doc.text(20, 85, "Lien Holder");

	doc.text(20, 110, "Select cover required(tick the appropriate box)");

	doc.setFontType("normal");
	doc.text(20, 45, "Are you the owner of the vehicle(s) and is/are/they registered in your name?");

	doc.text(20, 55, "If not, state the name and address of the owner:");

	doc.text(20, 65, "Will a trailer be used?");

	doc.text(20, 90, "Name in Full:");

	doc.text(100, 90, "Street Number and Name:");

	doc.text(100, 100, "Town:");

	doc.text(100, 105, "Parish:");

	doc.text(20, 110, "Select cover required(tick the appropriate box)");

	doc.text(20, 120, "Please indicate if the vehicle is to be used as:");

	doc.text(20, 130, "Is the vehicle fitted with an anti-theft device?");

	doc.text(20, 140, "If yes, state the name, type of device and name of provider");

	doc.text(20, 150, "Will you have regular custody of the vehicle?");

	doc.text(20, 160, "If not, please provide details");

	doc.text(20, 170, "Is the vehicle garaged at the Proposer's home address?");

	doc.text(20, 180, "If not, please state where:");

	doc.text(20, 190, "Is the vehicle kept in?");

	doc.setFontType("bold");

	/* doc.text(20, 50, resp.isOwnerOfVehicle); */

	doc.text(20, 60, resp.nameAddressOfOwner);

	/*  doc.text(20, 70, resp.trailerUsed); */

	doc.text(50, 90, resp.lienHolderNameInFull);

	doc.text(100, 95, resp.lienHolderStreetName);

	doc.text(150, 100, resp.lienHolderTown);

	doc.text(150, 105, resp.lienHolderParish);

	doc.text(20, 125, resp.vehicleUsedAs);

	/* doc.text(20, 135, resp.vehicleAntiTheftDevice); */

	doc.text(20, 145, resp.vehicleAntiTheftDeviceName + " " + resp.vehicleAntiTheftDeviceType + " " + resp.vehicleAntiTheftDeviceNameOfProvider);

	doc.text(20, 155, resp.vehicleRegularCustody ? resp.vehicleRegularCustody : "");

	doc.text(20, 165, resp.vehicleRegularCustodyDetails ? resp.vehicleRegularCustodyDetails : "");

	doc.text(20, 175, resp.vehicleGaragedAtProposersHome ? resp.vehicleGaragedAtProposersHome : "");

	doc.text(20, 185, resp.vehicleGaragedAtProposersHomeDetails ? resp.vehicleGaragedAtProposersHomeDetails : "");

	doc.text(20, 195, resp.vehicleKeptIn ? resp.vehicleKeptIn : "");

	doc.addPage();

	doc.setFontSize("10");
	doc.setFontType("normal");

	doc.text(20, 20, "Is the proposer now insured or was previously insured in respect of any vehicle(s)");

	doc.text(20, 30, "If yes, state the name and address of the Insurance Company:");

	doc.text(20, 40, "Is the proposer entitled to No Claim Discount from previous Insurer(s) In respect of any vehicle(s) described in the ");

	doc.text(20, 43, "proposal?");

	doc.text(20, 50, "If yes, please attach proof of No Claim Discount Letter or Renewal Notice.");

	doc.text(20, 60, "Do you have any other Insurance(s) with IronRock Insurance Company Ltd.?");

	doc.text(20, 70, "If yes, please state type(s):");

	doc.text(20, 80, "Has any Insurer(s) in respect of the Proposer or any other Person who will regularly drive ever?");

	doc.text(20, 90, "If yes, please indicate above and give details:");

	doc.text(20, 100, "Type of Authorized Driver Clause:");

	doc.setFontType("bold");

	doc.text(20, 25, resp.proposerInsured ? resp.proposerInsured : "");

	doc.text(20, 35, resp.proposerInsuranceDetails ? resp.proposerInsuranceDetails : "");


	doc.text(50, 45, resp.proposerEntitledToNOClaimDiscount ? resp.proposerEntitledToNOClaimDiscount : "");


	doc.text(20, 65, resp.applicantOtherInsurer ? resp.applicantOtherInsurer : "");

	doc.text(20, 75, resp.applicantOtherInsurerType ? resp.applicantOtherInsurerType : "");

	doc.text(20, 85, resp.applicantPreviouslyInsured ? resp.applicantPreviouslyInsured : "");

	doc.text(20, 95, resp.ApplicantPreviouslyInsuredDetails ? resp.ApplicantPreviouslyInsuredDetails : "");

	doc.text(20, 105, resp.typeOfAuthorizedDriver ? resp.typeOfAuthorizedDriver : "");

	doc.setFontType("normal");

	doc.text(20, 110, "Will anyone driving your motor vehicle:");

	doc.text(20, 115, "In respect of PRIVATE CARS:");

	doc.text(20, 125, "In respect of PRIVATE COMMERCIAL:");

	doc.text(20, 135, "In respect of GENERAL CARTAGE:");

	doc.text(20, 145, "If yes, please give particulars of drivers below:");


	doc.setFontSize("6");
	doc.setFontType("bold");

	doc.text(20, 150, "Name(s)");
	doc.text(50, 150, "Occupation(s)");
	doc.text(80, 150, "Date of Birth");
	doc.text(100, 150, "Drivers License No.");
	doc.text(130, 150, "Original Date of Issue");
	doc.text(160, 150, "Relationship to Proposer");


	doc.setFontType("normal");


	/* if (resp.vehicleRegistrationNo0) {
       
        doc.text(20, 155, resp.regularDriversName0?resp.regularDriversName0:"");
        doc.text(50, 155, resp.regularDriversOccupation0?resp.regularDriversOccupation0:"");
        doc.text(80, 155, resp.regularDriversDateOfBirth0?resp.regularDriversDateOfBirth0:"");
        doc.text(100, 155, resp.regularDriversDL0?resp.regularDriversDL0:"");
        doc.text(130, 155, resp.regularDriversDLOriginalDateOfIssue0?resp.regularDriversDLOriginalDateOfIssue0:"");
        doc.text(160, 155, resp.regularDriversDLExpirationDate0?resp.regularDriversDLExpirationDate0:"");

	}
	if (resp.vehicleRegistrationNo1) {
        
            doc.text(20, 160, resp.regularDriversName1?resp.regularDriversName1:"");
            doc.text(50, 160, resp.regularDriversOccupation1?resp.regularDriversOccupation1:"");
            doc.text(80, 160,resp.regularDriversDateOfBirth1?resp.regularDriversDateOfBirth1:"");
            doc.text(100, 160, resp.regularDriversDL1?resp.regularDriversDL1:""));
            doc.text(130, 160, resp.regularDriversDLOriginalDateOfIssue01resp.regularDriversDLOriginalDateOfIssue1:"");
            doc.text(160, 160, resp.regularDriversDLExpirationDate1?resp.regularDriversDLExpirationDate1:"");
        
        }

	
    
	if (resp.vehicleRegistrationNo2) {
        
         doc.text(20, 165, resp.regularDriversName2?resp.regularDriversName2:"");
        doc.text(50, 165, resp.regularDriversOccupation2?resp.regularDriversOccupation2:"");
        doc.text(80, 165,resp.regularDriversDateOfBirth2?resp.regularDriversDateOfBirth2:"");
        doc.text(100, 165, resp.regularDriversDL2?resp.regularDriversDL2:""));
        doc.text(130, 165, resp.regularDriversDLOriginalDateOfIssue2?resp.regularDriversDLOriginalDateOfIssue2:"");
        doc.text(160, 165, resp.regularDriversDLExpirationDate2?resp.regularDriversDLExpirationDate2:"");
    }
    
    */








	doc.addPage();

	doc.setFontSize("10");
	doc.setFontType("normal");
	doc.text(20, 20, "Have you or any regular drivers had any accidents or losses during the past three(3) years (whether insured ");

	doc.text(20, 23, "or not in respect of all vehicles)");

	doc.text(20, 26, "I. Owned by you, whether or not you were the driver at the material time?");

	doc.text(20, 29, "II. Not owned by you, but driven by you or in your custody at the material time?");

	doc.text(20, 35, "If yes, please give details below");

	doc.setFontType("bold");
	doc.setFontSize("8");

	doc.text(20, 40, "Date of Accident");
	doc.text(50, 40, "Cost(Paid or Estimated)");
	doc.text(100, 40, "Driver");
	doc.text(150, 40, "Brief details of Accidents, Incident or losses");

	doc.setFontType("normal");


	if (resp.involvedInAccident) {
		doc.text(20, 45, resp.accidentMonth0 ? resp.accidentMonth0 : "");
		doc.text(50, 45, resp.accidentCost0 ? resp.accidentCost0 : "");
		doc.text(100, 45, resp.accidentDriver0 ? resp.accidentDriver0 : "");
		doc.text(150, 45, resp.accidentBrief0 ? resp.accidentBrief0 : "");

	}
	if (resp.involvedInAccident) {
		doc.text(20, 50, resp.accidentMonth1 ? resp.accidentMonth1 : "");
		doc.text(50, 50, resp.accidentCost1 ? resp.accidentCost1 : "");
		doc.text(100, 50, resp.accidentDriver1 ? resp.accidentDriver1 : "");
		doc.text(150, 50, resp.accidentBrief1 ? resp.accidentBrief1 : "");

	}
	if (resp.involvedInAccident) {
		doc.text(20, 55, resp.accidentMonth2 ? resp.accidentMonth2 : "");
		doc.text(50, 55, resp.accidentCost2 ? resp.accidentCost2 : "");
		doc.text(100, 55, resp.accidentDriver2 ? resp.accidentDriver2 : "");
		doc.text(150, 55, resp.accidentBrief2 ? resp.accidentBrief2 : "");

	}



	doc.text(20, 60, "To the best of your knowledge and belief have you, or any person who to your knowledge will drive have suffered from, or now suffer from:");

	doc.text(20, 70, "If yes, please indicate above and give details:");

	doc.text(20, 80, "Have you or any person who to your knowledge will drive received any traffic ticket(s) and");

	doc.text(20, 115, "or have been convicted of any offence in connection with the driving of any motor vehicle within the ");

	doc.text(20, 120, "last three (3) years?");

	doc.text(20, 130, "If yes, please give details:");

	doc.text(20, 140, "has the vehicle been modified or converted from maker's standard specification or do you intend to do so?");

	doc.text(20, 150, "If yes, please give details:");

	doc.text(20, 160, "Do you require increased limits (in excess of the Standard Limits)");

	doc.setFontType("bold");


	doc.addPage();

	doc.setFontSize(10);
	doc.setFont("times");

	doc.text(20, 20, "Name");
	doc.text(70, 20, "License");
	doc.text(100, 20, "Occupation");
	doc.text(150, 20, "Expired Date");

	doc.setFontType("normal");

	if (resp.regularDriversDL0) {
		doc.text(20, 30, resp.regularDriversName0);
		doc.text(70, 30, resp.regularDriversDL0);
		doc.text(100, 30, resp.regularDriversOccupation0);
		doc.text(150, 30, resp.regularDriversDLExpirationDate0);

	}
	if (resp.regularDriversDL1) {
		doc.text(20, 40, resp.regularDriversName1);
		doc.text(70, 40, resp.regularDriversDL1);
		doc.text(100, 40, resp.regularDriversOccupation1);
		doc.text(150, 40, resp.regularDriversDLExpirationDate1);

	}
	if (resp.regularDriversDL2) {
		doc.text(20, 50, resp.regularDriversName2);
		doc.text(70, 50, resp.regularDriversDL2);
		doc.text(100, 50, resp.regularDriversOccupation2);
		doc.text(150, 50, resp.regularDriversDLExpirationDate2);

	}
}

function setHomePropertyPages(resp) {


	doc.setFontType("bold");
	doc.setFontSize(10);
	doc.setFont("times");

	doc.text(20, 20, "Particulars Of Home To Be Insured");

	doc.text(20, 60, "Construction of Dwelling");

	doc.text(20, 110, "Garages or Out Buildings?");


	doc.setFontType("normal");

	doc.text(20, 30, "Risk Address:");

	doc.text(20, 40, "Is the home:");

	doc.text(20, 80, "External Walls");

	doc.text(100, 80, "Roof:");

	doc.text(20, 100, "Internal Walls:");

	doc.text(20, 120, "External walls:");

	doc.text(20, 140, "Internal Walls:");

	doc.text(100, 120, "Roof:");

	doc.text(20, 160, "Are the buildings in good state of repairs and will be so maintained?");

	doc.text(20, 180, "Is the Dwelling occupied solely by you, your family and domestic employees?");

	doc.text(20, 190, "If no, give the details of other occupants:");

	doc.text(20, 200, "Is any part of the Dwelling or Outbuilding used for any income-earning activity?");

	doc.text(20, 210, "If yes, give details:");

	doc.text(20, 220, "Are all externally communicating doors, windows and other openings grilled?");

	doc.text(20, 230, "If no, describe the security arrangements in place:");

	doc.text(20, 240, "Does any institution or individual have a financial interest in the Property:");

	doc.text(20, 250, "If yes, state their name and address:");

	doc.text(20, 260, "Are there any Waterside Structures i.e. docks, jetties, piers, sea walls and any other structure abutting the sea, a river or any other body of water?");
}