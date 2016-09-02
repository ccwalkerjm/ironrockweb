"use strict";
var doc;

const standardYgap = 5;
const gapBelowHeader = 10;
const startingXPoint = 20;
const startingYPoint = 20;
const startingYFirstPagePoint = 50;

function CreatePDF(resp) {
	console.log(resp);

	doc = new jsPDF();
	doc.setFontSize(12);
	if (resp.insuranceType === 'motor') {
		doc.text(20, 40, 'Motor Vehicle Insurance Proposal');
	} else {
		doc.text(20, 40, 'Home Insurance Proposal');
	}

	var logoCanvas = document.getElementById("canvas-logo");


	var imgLogoData = logoCanvas.toDataURL('image/jpeg', 1.0);


	doc.addImage(imgLogoData, 'JPG', 2, 2, 100, 30);


	doc.setFontSize(10);
	doc.setFont("times");
	doc.setFontType("bold");
    
    doc.text(100, 290, "1");
    
    doc.setFontType("normal");
    
	doc.text(150, 35, "Start date: " + resp.startDate);
	doc.text(150, 40, 'Quote No: ' + resp.applicantQuoteNo);
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
	doc.text(100, 125, 'Email Address: ');
	doc.text(100, 130, 'Mobile Number: ');
	doc.text(100, 135, 'Home Number: ');
	doc.text(100, 140, 'Work Number: ');

	doc.text(20, 150, 'Street Number and Name: ');
	doc.text(20, 160, 'City/Town/Postal Zone: ');
	doc.text(20, 165, 'Parish ');
	doc.text(100, 150, 'Date of Birth: ');
	doc.text(100, 160, 'Place of Birth: ');
	doc.text(100, 165, 'Nationality: ');

	doc.text(20, 175, 'Company Name:');
	doc.text(20, 180, 'Street Number and Name:');
	doc.text(100, 175, 'Town:');
	doc.text(100, 180, 'Parish:');

//	doc.setFontType("italic");
	doc.text(50, 80, resp.applicantSurname);
	doc.text(50, 85, resp.applicantFirstName);
	doc.text(50, 90, resp.applicantMiddleName);
	doc.text(50, 95, resp.applicantTitle);
	doc.text(50, 100, resp.applicantOccupation);
	doc.text(150, 80, resp.applicantMothersMaidenName);
	doc.text(150, 85, resp.applicantAlias);
	doc.text(150, 90, resp.applicantIDType);
	doc.text(150, 95, resp.applicantIDnumber);
	doc.text(150, 100, resp.applicationIDExpirationDate);
	doc.text(150, 105, resp.SourceOfFunds);

	doc.text(20, 120, resp.applicantHomeStreetName);
	doc.text(20, 130, resp.applicantHomeTown);
	doc.text(50, 135, resp.applicantHomeParish);
	doc.text(150, 115, resp.applicantIDnumber);
	doc.text(150, 125, resp.applicantEmailAddress);
	doc.text(150, 130, resp.applicantMobileNumber);

	doc.text(150, 135, resp.applicantHomeNumber);
	doc.text(150, 140, resp.applicantWorkNumber);
	if (resp.mailingAddressSame == "yes") {
		doc.text(20, 155, resp.applicantHomeStreetName);
	} else {
		doc.text(20, 155, resp.applicantMailStreetName || "");
	}

	if (resp.mailingAddressSame == "yes") {
		doc.text(60, 160, resp.applicantHomeTown);
	} else {
		doc.text(60, 160, resp.applicantMailTown);
	}

	if (resp.mailingAddressSame == "yes") {
		doc.text(50, 165, resp.applicantHomeParish);
	} else {
		doc.text(50, 165, resp.applicantMailParish);
	}

	
	
	doc.text(150, 150, resp.applicantDateOfBirth);
	doc.text(150, 160, resp.applicantPlaceOfBirth);
	doc.text(150, 165, resp.applicantNationality);
	doc.text(50, 175, resp.employerName);
	doc.text(20, 185, resp.employerStreetName);
	doc.text(150, 175, resp.employerTown);
	doc.text(150, 180, resp.employerParish);

	doc.setFontType("bold");
	doc.setFontSize("10");
	doc.text(20, 75, 'Name');
	doc.text(20, 110, 'Home Address');
	doc.text(20, 145, 'Mailing Address');
	doc.text(20, 170, 'Employer Details');

	doc.setFontSize("8");
	doc.setFontType("bold");
	doc.text(20, 195, "NB: Please submit the following:");

	doc.setFontType("bold");
	doc.text(20, 198, "** A power of attorney or a letter duly notarized");
	doc.text(20, 201, "Proof of Address");
	doc.text(20, 204, "Picture Identification(Insured an agent, where applicable)");
	doc.text(20, 207, "TRN(if a driver's license is not being used)");

	doc.text(20, 245, "Relation");
	doc.text(60, 245, "Name of Relative");
	doc.text(110, 245, "Address");
    
    
    doc.setFontSize("10");
	doc.setFontType("normal");

	doc.text(20, 220, "Have you or any relative or close associate been entrusted with prominent public functions (e.g. Member of Parliament, ");

	doc.text(20, 223, "Senate or Mayor, Senior Government Official, Judiciary, security forces)?");



	doc.text(20, 230, "If yes, state the type of public office:");

	doc.text(20, 240, "If yes to the above, please give the name and address of spouse and children");




	if (resp.applicantRelativeInPublicOfficeName0) {
		doc.text(20, 248, resp.applicantRelativeInPublicOfficeRelation0 ? resp.applicantRelativeInPublicOfficeRelation0 : "");
		doc.text(60, 248, resp.applicantRelativeInPublicOfficeName0 ? resp.applicantRelativeInPublicOfficeName0 : "");
		doc.text(150, 248, resp.applicantRelativeInPublicOfficeAddress0 ? resp.applicantRelativeInPublicOfficeAddress0 : "");


	}
	if (resp.vehicleRegistrationNo1) {
		doc.text(20, 251, resp.applicantRelativeInPublicOfficeRelation ? resp.applicantRelativeInPublicOfficeRelation0 : "");
		doc.text(60, 251, resp.applicantRelativeInPublicOfficeName0 ? resp.applicantRelativeInPublicOfficeName0 : "");
		doc.text(110, 251, resp.applicantRelativeInPublicOfficeAddress0 ? resp.applicantRelativeInPublicOfficeAddress0 : "");

	}
	if (resp.vehicleRegistrationNo2) {
		doc.text(20, 254, resp.applicantRelativeInPublicOfficeRelation ? resp.applicantRelativeInPublicOfficeRelation0 : "");
		doc.text(60, 254, resp.applicantRelativeInPublicOfficeName0 ? resp.applicantRelativeInPublicOfficeName0 : "");
		doc.text(110, 254, resp.applicantRelativeInPublicOfficeAddress0 ? resp.applicantRelativeInPublicOfficeAddress0 : "");

	}

//	doc.setFontType("italic");

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

	lastPage(resp);
	//doc.output('datauri');
	doc.output('dataurlnewwindow');
	//doc.save('Proposal' + resp.applicantQuoteNo + '.pdf');
}

function setMotorVehiclePages(resp) {
	doc.setFontSize("10");
    
    

	doc.setFontType("bold");
    doc.text(100, 290, "2");

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
		doc.text(162, 30, "$" + resp.vehicleValue0 ? resp.vehicleValue0 : "");

	}
	if (resp.vehicleRegistrationNo1) {
		doc.text(20, 35, resp.vehicleRegistrationNo1 ? resp.vehicleRegistrationNo1 : "");
		doc.text(42, 35, resp.vehicleMake1 ? resp.vehicleMake1 : "");
		doc.text(62, 35, resp.vehicleChassisNo1 ? resp.vehicleChassisNo1 : "");
		doc.text(90, 35, resp.vehicleYear1 ? resp.vehicleYear1 : "");
		doc.text(105, 35, " ");
		doc.text(122, 35, resp.vehicleBody1 ? resp.vehicleBody1 : "");
		doc.text(142, 35, resp.vehicleType1 ? resp.vehicleType1 : "");
		doc.text(162, 35, "$" + resp.vehicleValue1 ? resp.vehicleValue1 : "");

	}
	if (resp.vehicleRegistrationNo2) {
		doc.text(20, 40, resp.vehicleRegistrationNo2 ? resp.vehicleRegistrationNo2 : "");
		doc.text(42, 40, resp.vehicleMake2 ? resp.vehicleMake2 : "");

		doc.text(62, 40, resp.vehicleChassisNo2 ? resp.vehicleChassisNo2 : "");

		doc.text(90, 40, resp.vehicleYear2 ? resp.vehicleYear2 : "");
		doc.text(105, 40, " ");
		doc.text(122, 40, resp.vehicleBody2 ? resp.vehicleBody2 : "");
		doc.text(142, 40, resp.vehicleType2 ? resp.vehicleType2 : "");
		doc.text(162, 40, "$" + resp.vehicleValue2 ? resp.vehicleValue2 : "");

	}

	doc.setFontSize("8");
	doc.setFontType("bold");
	doc.text(20, 75, "NOTE: You are required to ensure that the Sum Insured is revised annually to reflect the current market value. Claims will be settled based ");

	doc.text(20, 78, "on the market value at the time of the loss. For total losses you will be paid based in time of the loss. For total losses you will be paid");

	doc.text(20, 81, " based on the market value or Policy Sum Insured whichever is lesser.");

	doc.setFontSize("10");
	doc.setFontType("bold");
//	doc.text(20, 85, "Lien Holder");

	doc.text(20, 110, "Select cover required");

	doc.setFontType("normal");
	doc.text(20, 45, "Are you the owner of the vehicle(s) and is/are/they registered in your name?");

	doc.text(20, 55, "If not, state the name and address of the owner:");

	doc.text(20, 65, "Will a trailer be used?");

//	doc.text(20, 90, "Name in Full:");
//
//	doc.text(100, 90, "Street Number and Name:");
//
//	doc.text(100, 100, "Town:");
//
//	doc.text(100, 105, "Parish:");



	doc.text(20, 120, "Please indicate if the vehicle is to be used as:");

	doc.text(20, 130, "Is the vehicle fitted with an anti-theft device?");

	doc.text(20, 140, "If yes, state the name, type of device and name of provider");

	doc.text(20, 150, "Will you have regular custody of the vehicle?");

	doc.text(20, 160, "If not, please provide details");

	doc.text(20, 170, "Is the vehicle garaged at the Proposer's home address?");

	doc.text(20, 180, "If not, please state where:");

	doc.text(20, 190, "Is the vehicle kept in?");

//	doc.setFontType("italic");

	doc.text(20, 50, resp.isOwnerOfVehicle);

	doc.text(20, 60, resp.nameAddressOfOwner);

	doc.text(20, 70, resp.trailerUsed);

//	doc.text(50, 90, resp.lienHolderNameInFull);
//
//	doc.text(100, 95, resp.lienHolderStreetName);
//
//	doc.text(150, 100, resp.lienHolderTown);
//
//	doc.text(150, 105, resp.lienHolderParish);

	doc.text(20, 115, resp.insuranceCoverage);

	doc.text(20, 125, resp.vehicleUsedAs);

	doc.text(20, 135, resp.vehicleAntiTheftDevice);

	doc.text(20, 145, resp.vehicleAntiTheftDeviceName + " " + resp.vehicleAntiTheftDeviceType + " " + resp.vehicleAntiTheftDeviceNameOfProvider);

	doc.text(20, 155, resp.vehicleRegularCustody ? resp.vehicleRegularCustody : "");

	doc.text(20, 165, resp.vehicleRegularCustodyDetails ? resp.vehicleRegularCustodyDetails : "");

	doc.text(20, 175, resp.vehicleGaragedAtProposersHome ? resp.vehicleGaragedAtProposersHome : "");

	doc.text(20, 185, resp.vehicleGaragedAtProposersHomeDetails ? resp.vehicleGaragedAtProposersHomeDetails : "");

	doc.text(20, 195, resp.vehicleKeptIn ? resp.vehicleKeptIn : "");
    
	doc.addPage();


	doc.setFontSize("10");
    doc.setFontType("bold");
    
    doc.text(100, 290, "3");
    
    
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

//	doc.setFontType("italic");

	doc.text(20, 25, resp.proposerInsured ? resp.proposerInsured : "");

	doc.text(20, 35, resp.proposerInsuranceDetails ? resp.proposerInsuranceDetails : "");


	doc.text(20, 46, resp.proposerEntitledToNOClaimDiscount ? resp.proposerEntitledToNOClaimDiscount : "");


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


	doc.setFontSize("7");
	doc.setFontType("bold");

	doc.text(20, 150, "Name(s)");
	doc.text(50, 150, "Occupation(s)");
	doc.text(80, 150, "Date of Birth");
	doc.text(100, 150, "Drivers License No.");
	doc.text(130, 150, "Original Date of Issue");
	doc.text(160, 150, "Relationship to Proposer");


	doc.setFontType("normal");


	if (resp.vehicleRegistrationNo0) {

		doc.text(20, 155, resp.regularDriversName0 ? resp.regularDriversName0 : "");
		doc.text(50, 155, resp.regularDriversOccupation0 ? resp.regularDriversOccupation0 : "");
		doc.text(80, 155, resp.regularDriversDateOfBirth0 ? resp.regularDriversDateOfBirth0 : "");
		doc.text(100, 155, resp.regularDriversDL0 ? resp.regularDriversDL0 : "");
		doc.text(130, 155, resp.regularDriversDLOriginalDateOfIssue0 ? resp.regularDriversDLOriginalDateOfIssue0 : "");
		doc.text(160, 155, resp.regularDriversRelationshipToProposer0 ? resp.regularDriversRelationshipToProposer0 : "");

	}
	if (resp.vehicleRegistrationNo1) {

		doc.text(20, 160, resp.regularDriversName1 ? resp.regularDriversName1 : "");
		doc.text(50, 160, resp.regularDriversOccupation1 ? resp.regularDriversOccupation1 : "");
		doc.text(80, 160, resp.regularDriversDateOfBirth1 ? resp.regularDriversDateOfBirth1 : "");
		doc.text(100, 160, resp.regularDriversDL1 ? resp.regularDriversDL1 : "");
		doc.text(130, 160, resp.regularDriversDLOriginalDateOfIssue1 ? resp.regularDriversDLOriginalDateOfIssue1 : "");
		doc.text(160, 160, resp.regularDriversRelationshipToProposer1 ? resp.regularDriversRelationshipToProposer1 : "");

	}



	if (resp.vehicleRegistrationNo2) {

		doc.text(20, 165, resp.regularDriversName2 ? resp.regularDriversName2 : "");
		doc.text(50, 165, resp.regularDriversOccupation2 ? resp.regularDriversOccupation2 : "");
		doc.text(80, 165, resp.regularDriversDateOfBirth2 ? resp.regularDriversDateOfBirth2 : "");
		doc.text(100, 165, resp.regularDriversDL2 ? resp.regularDriversDL2 : "");
		doc.text(130, 165, resp.regularDriversDLOriginalDateOfIssue2 ? resp.regularDriversDLOriginalDateOfIssue2 : "");
		doc.text(160, 165, resp.regularDriversRelationshipToProposer2 ? resp.regularDriversRelationshipToProposer2 : "");
	}









	doc.addPage();

	doc.setFontSize("10");
    
	doc.setFontType("bold");
    
    doc.text(100, 290, "4");
    
    doc.setFontType("normal");
    
	doc.text(20, 20, "Have you or any regular drivers had any accidents or losses during the past three(3) years (whether insured ");

	doc.text(20, 23, "or not in respect of all vehicles)");

	doc.text(20, 26, "I. Owned by you, whether or not you were the driver at the material time?");



	doc.text(20, 29, "II. Not owned by you, but driven by you or in your custody at the material time?");



	doc.text(20, 37, "If yes, please give details below");

	doc.setFontType("bold");
	doc.setFontSize("8");

	doc.text(20, 40, "Date of Accident");
	doc.text(50, 40, "Cost(Paid or Estimated)");
	doc.text(90, 40, "Driver");
	doc.text(120, 40, "Brief details of Accidents, Incident or losses");

	doc.setFontType("normal");


	if (resp.involvedInAccident) {
		doc.text(20, 45, resp.accidentMonth0 ? resp.accidentMonth0 : "");
		doc.text(50, 45, resp.accidentCost0 ? resp.accidentCost0 : "");
		doc.text(90, 45, resp.accidentDriver0 ? resp.accidentDriver0 : "");
		doc.text(120, 45, resp.accidentBrief0 ? resp.accidentBrief0 : "");

	}
	if (resp.involvedInAccident) {
		doc.text(20, 50, resp.accidentMonth1 ? resp.accidentMonth1 : "");
		doc.text(50, 50, resp.accidentCost1 ? resp.accidentCost1 : "");
		doc.text(90, 50, resp.accidentDriver1 ? resp.accidentDriver1 : "");
		doc.text(120, 50, resp.accidentBrief1 ? resp.accidentBrief1 : "");

	}
	if (resp.involvedInAccident) {
		doc.text(20, 55, resp.accidentMonth2 ? resp.accidentMonth2 : "");
		doc.text(50, 55, resp.accidentCost2 ? resp.accidentCost2 : "");
		doc.text(90, 55, resp.accidentDriver2 ? resp.accidentDriver2 : "");
		doc.text(120, 55, resp.accidentBrief2 ? resp.accidentBrief2 : "");

	}

	doc.setFontSize("10");

	doc.text(20, 60, "To the best of your knowledge and belief have you, or any person who to your knowledge will drive have suffered");

	doc.text(20, 63, " from, or now suffer from:");


	doc.text(20, 70, "If yes, please indicate above and give details:");



	doc.text(20, 80, "Have you or any person who to your knowledge will drive received any traffic ticket(s) and");


	doc.text(20, 83, "or have been convicted of any offence in connection with the driving of any motor vehicle within the ");

	doc.text(20, 86, "last three (3) years?");



	doc.text(20, 95, "If yes, please give details:");



	doc.text(20, 105, "Has the vehicle been modified or converted from maker's standard specification or do you intend to do so?");



	doc.text(20, 115, "If yes, please give details:");





	doc.text(20, 135, "Do you require increased limits (in excess of the Standard Limits)?");



	doc.text(110, 145, "Limits");

	doc.text(20, 150, "Protection and Removal (Wrecker Fee)");



	doc.text(20, 155, "Medical Expenses (Including Passengers)");



	doc.text(20, 160, "Manslaughter Defense Costs");



	doc.text(20, 165, "Third Party Limits(Bodily Injury and Property Damage)");



//	doc.setFontType("italic");

	doc.text(20, 32, resp.involvedInAccident);

	doc.text(20, 75, resp.driverSufferFromDetails ? resp.driverSufferFromDetails : "");

	doc.text(20, 90, resp.driverTrafficTicket ? resp.driverTrafficTicket : "");

	doc.text(20, 100, resp.driverTrafficTicketDate);

	doc.text(100, 100, resp.driverTrafficTicketDetails ? resp.driverTrafficTicketDetails : "");

	doc.text(20, 110, resp.vehicleModified ? resp.vehicleModified : "");

	doc.text(20, 120, resp.vehicleModifiedDetails ? resp.vehicleModifiedDetails : "");

	doc.text(20, 140,  resp.increasedLimits ? resp.increasedLimits : "");
	doc.text(110, 150, "$" + resp.wreckerFee ? resp.wreckerFee : "");

	doc.text(110, 155, "$" + resp.medicalExpenses ? resp.medicalExpenses : "");

	doc.text(110, 160, "$" + resp.manslaughterDefenceCosts ? resp.manslaughterDefenceCosts : "");

	//doc.text(110, 165, resp.thirdPartyLimit ? resp.thirdPartyLimit : "");
	switch (resp.thirdPartyLimit) {
	case "standard1":
		doc.text(110, 165, 'Standard Limits - $3M/ $5M/ $5M');
		break;
	case "increased1Option1":
		doc.text(110, 165, 'Increased Limits - $5M/$7.5M/$5M');
		break;
	case "increased1Option2":
		doc.text(110, 165, 'Increased Limits - $5M/ 10M/ $5M');
		break;
	case "increased1Option3":
		doc.text(110, 165, 'Increased Limits - $10M/ $10M/ $10M');
		break;
	case "standard2":
		doc.text(110, 165, 'Standard Limits - $5M/ $10M/ $5M');
		break;
	case "increased2Option1":
		doc.text(110, 165, 'Increased Limits - $10M/ $10M/ $10M');
		break;
	default:
		break;
	}



}

function lastPage(resp) {

	doc.addPage();
	doc.setFontSize("10");
    
    
	doc.setFontType("bold");
    
    doc.text(100, 290, "5");
	doc.text(20, 20, "Disclaimer");

	doc.setFontType("normal");
	doc.text(20, 23, "The liability of the Company does not commence until the acceptance of the proposal has been formally acknowledged ")

	doc.text(20, 26, "by the Company premium or deposit has been paid, except as provided by an Official Cover Note issued by the Company.");

	doc.text(20, 31, "I declare that the information given above has been verified by original documents to ensure the veracity of the information ");
    
    doc.text(20, 34, "given.");



	doc.setFontType("bold");
	doc.text(20, 60, "Customer service Representative");

	doc.text(20, 130, "**THE SECTION BELOW IS ONLY APPLICABLE IF AN AGENT IS COMPLETING THE FORM ON ");
    doc.text(20, 133, "BEHALF OF THE CLIENT.");

	doc.setFontType("normal");

	doc.text(20, 64, "I/We declare that the above answers are true and that all particulars affecting the assessment of the risk have been disclosed.");


	doc.text(20, 142, "Surname:");

	doc.text(20, 145, "First Name:");

	doc.text(20, 148, "Middle Name:");

	doc.text(20, 151, "Date of Birth:");

	doc.text(20, 154, "Nationality:");

	doc.text(20, 157, "TRN No.:");

	doc.text(20, 160, "Address:");

	doc.setFontType("bold");

	doc.text(20, 139, "Agent Details");

	doc.text(20, 70, "Proposer's Signature/Date");

	doc.text(20, 100, "Joint Proposer's Signature Date");

	doc.text(20, 163, "Agent Signature Date");


	if (resp.signatureBytes) {
		//print signature
		var svgSignature = document.getElementById('svg-signature').innerHTML; //atob(resp.signatureBytes);
		svgSignature = svgSignature.replace(/\r?\n|\r/g, '').trim();

		var canvasSignature = document.getElementById('canvas-signature');
		var contextSignature = canvasSignature.getContext('2d');

		contextSignature.clearRect(0, 0, canvasSignature.width, canvasSignature.height);

		canvg(canvasSignature, svgSignature);

		var imgSignatureData = canvasSignature.toDataURL('image/JPEG');
		$('#testimg').attr('src', imgSignatureData);

		doc.addImage(imgSignatureData, 'JPG', 20, 75, 100, 20);
	}

//	doc.setFontType("italic");

}




function setHomePropertyPages(resp) {

    
	
	doc.setFontSize(10);
	doc.setFont("times");
    
    doc.text(100, 290, "2");
   
    doc.setFontType("bold");

	doc.text(20, 20, "Particulars Of Home To Be Insured");

	doc.text(20, 45, "Construction of Dwelling");

	doc.text(20, 65, "Garages or Out Buildings?");


	doc.setFontType("normal");

	doc.text(20, 25, "Risk Address:");



	doc.text(20, 35, "Is the home:");



	doc.text(20, 50, "External Walls:");





	doc.text(100, 50, "Roof:");




	doc.text(20, 70, "External walls:");





	doc.text(100, 70, "Roof:");
    
    
    doc.text(20, 80, "Institution with financial interest in the property:");
    
    doc.text(20, 85, resp.homeFinancialInstitutionCode ? resp.homeFinancialInstitutionCode:"");



	doc.text(20, 90, "Are the buildings in good state of repairs and will be so maintained?");



	doc.text(20, 100, "Is the Dwelling occupied solely by you, your family and domestic employees?");



	doc.text(20, 110, "If no, give the details of other occupants:");



	doc.text(20, 120, "Is any part of the Dwelling or Outbuilding used for any income-earning activity?");



	doc.text(20, 130, "If yes, give details:");



	doc.text(20, 140, "Are all externally communicating doors, windows and other openings grilled?");



	doc.text(20, 150, "If no, describe the security arrangements in place:");
    

	doc.text(20, 160, "Does any institution or individual have a financial interest in the Property:");



	doc.text(20, 170, "If yes, state their name and address:");



	doc.text(20, 180, "Are there any Waterside Structures i.e. docks, jetties, piers, sea walls and any other structure abutting the sea, a ");

	doc.text(20, 183, "river or any other body of water?")



	doc.text(20, 193, "If yes, please describe:");



//	doc.setFontType("italic");

	doc.text(20, 30, resp.homeRiskAddressStreetNo + " " + resp.homeRiskAddressStreetName + ", " + resp.homeRiskAddressTown + ", " + resp.homeRiskAddressParish);

	doc.text(20, 40, resp.homeType ? resp.homeType : "");

	doc.text(50, 50, resp.constructionExternalWalls);

	doc.text(120, 50, resp.constructionRoof);

	doc.text(70, 65, resp.garageOutBuildingExists);

	doc.text(50, 70, resp.garageExternalWalls);

	doc.text(120, 70, resp.garageRoof);

	doc.text(20, 95, resp.homeInGoodState);

	doc.text(20, 105, resp.homeOccupiedByApplicantFamily);

	doc.text(20, 115, resp.homeOccupiedByApplicantFamilyIfNo);

	doc.text(20, 125, resp.homeUsedForIncomeActivity);

	doc.text(20, 135, resp.homeUsedForIncomeActivityDetails);


	doc.text(20, 188, resp.homeHasWatersideStructure);

	doc.text(20, 198, resp.homeHasWatersideStructureDetails);

	doc.addPage();
    
    doc.text(100, 290, "3");

	doc.setFontType("bold");
	doc.setFontSize("10");
    doc.text(100, 290, "3");
	doc.text(20, 20, "DETAILS OF PROPERTY TO BE INSURED");
	doc.setFontSize("10");
	doc.text(20, 25, "BUILDINGS AND OTHER STRUCTURES");
	doc.text(20, 90, "CONTENTS");
	doc.setFontType("normal");
	doc.setFontSize("10");
	doc.text(20, 30, "IMPORTANT NOTE: The SUMS TO BE INSURED must represent the FULL NEW REPLACEMENT COST of the");

	doc.text(20, 33, "property and should include adequate provision for demolition and debris removal costs in the event of major damage as well");

	doc.text(20, 36, "as professional  fees that would be incurred in reinstatement. As the Company will pay up to 10% of the Sum Insured in");

	doc.text(20, 39, "respect of Rent lost or reasonable costs of alternative accomodation if damage by an Insured Peril renders the home");
    
    doc.text(20, 42, "uninhabitable, provision for this should also be included in your Sums Insured.")

	doc.setFontType("bold");
	doc.text(130, 50, " Specified Items");

	doc.text(160, 50, "Sums to be Insured");
	doc.text(160, 140, "Sums to be Insured");
	doc.setFontType("normal");
	doc.text(20, 53, "The Buildings of the private dwelling together with its garages and");

	doc.text(20, 56, "outbuildings, including landlord's fixtures and fittings together with patios,");

	doc.text(20, 59, "driveways and other paved areas, walls gates and fences, underground water");

	doc.text(20, 62, "pipes and cables providing services to and from the home fixed water storage");

	doc.text(20, 65, "tanks and sewage disposal systems.(NB. Swimming Pools and Waterside");
    
    doc.text(20, 68, "structures are not included in the above item)");

	if (resp.homeInsurancePropertyItem0) {
		doc.text(130, 53, "a." + resp.homeInsurancePropertyItem0 ? resp.homeInsurancePropertyItem0 : "");
		doc.text(160, 53, "$" + resp.homeInsurancePropertyItemValue0 ? resp.homeInsurancePropertyItemValue0 : "");


	}
	if (resp.homeInsurancePropertyItem1) {
		doc.text(130, 56, "b." + resp.homeInsurancePropertyItem1 ? resp.homeInsurancePropertyItem1 : "");
		doc.text(160, 56, "$" + resp.homeInsurancePropertyItemValue1 ? resp.homeInsurancePropertyItemValue1 : "");


	}
	if (resp.homeInsurancePropertyItem2) {
		doc.text(130, 59, "c." + resp.homeInsurancePropertyItem2 ? resp.homeInsurancePropertyItem2 : "");
		doc.text(160, 59, "$" + resp.homeInsurancePropertyItemValue2 ? resp.homeInsurancePropertyItemValue2 : "");


	}

	doc.text(20, 71, "Swimming Pools: permanent pool structures together with pump-houses and");

	doc.text(20, 74, "permanently installed pool equipment and accessories including all ");
    
    doc.text(20, 77, "related pipes and cables.");

	doc.text(160, 77, "$" + resp.homeInsurancePropertySwimmingPoolValue);

	doc.setFontType("bold");
	doc.text(20, 80, "The Total Sum Insured under the Buildings and Other Structures");
    
    doc.text(20, 83, "Section of the Policy");

	doc.text(130, 83, "TOTAL SI:");

	doc.text(20, 183, "The Total Sum Insured under the Contents Section of the policy");

	doc.text(130, 183, "TOTAL SI:");

	doc.setFontType("normal");
	doc.text(160, 83, resp.homeInsurancePropertySum);

	doc.text(20, 95, "IMPORTANT NOTES");

	doc.text(20, 100, "The SUMS TO BE INSURED must represent the FULL COST of replacing all the contents insured with NEW articles of");

	doc.text(20, 103, "similar size, style and specification. As the Company will pay up to 10% of the Sum Insured in respect of reasonable costs of ");

	doc.text(20, 106, "alternative accomodation if damage by an Insured Peril renders the home uninhabitable, provision for this should be included ");
    
    doc.text(20, 109, "in your Sum Insured.");

	doc.text(20, 112, "Do not include in your Contents Sum Insured any Article which is to be insured under the All Risks Section");

	doc.text(20, 117, "Unspecified Valuables:");

	doc.text(55, 117, "Coverage is limited to one-third of the Total Sum Insured on Contents with coverage on individual");

	doc.text(20, 120, "articles limited to 5% of such Total Sum Insured. Individual articles worth more than 5% of the Total Sum Insured");

	doc.text(20, 123, "to be insured be separately specified below.");

	doc.text(20, 130, "Valuables include jewellery and other articles of gold, silver and or other precious metal, clocks, watches, cameras, camcorders");

	doc.text(20, 133, "and other photographic equipment, electronic equipment(other than domestic appliances), furs, pictures, and other works of art");

	doc.text(20, 136, "curios, licensed fire-arms, collections of stamps coins or other valuable objects.");



	doc.text(20, 145, "Contents: Household Goods, Personal Effects and Fixtures and Fittings which belong to or are the");

	doc.text(20, 148, "legal responsibility of any member of your household, including personal effects of non-paying");

	doc.text(20, 151, "guests temporarily staying with you but excluding Variables which are to be individually specified");

	doc.text(160, 151, "$" + resp.amountHouseholdGoods);

	doc.text(20, 156, "Valuables to be individually specified(Please attach a list of these articles giving detailes");

	doc.text(20, 159, "descriptions including model and serial numbers where appropriate and individual values)");

	doc.text(160, 159, "$" + resp.amountValuables);

	doc.text(20, 165, "Does the total value of your Valuables excluding those listed above and those which you will be insuring under the All Risk");

	doc.text(20, 168, "Section exceed one-third of the Total Sum to be insured?");

	doc.text(20, 173, "");

	doc.text(20, 178, "If yes, what is the total value of such valuables");

	doc.text(160, 178, "$" + resp.HomeInsuranceOtherValuableAmount);



	doc.text(160, 183, resp.HomeInsuranceContentTotalAmount);

	doc.addPage();

	doc.setFontType("bold");
	doc.setFontSize("10");
    
    doc.text(100, 290, "4");
	doc.text(20, 20, "ALL RISKS INSURANCE IN RESPECT OF PERSONAL POSSESSIONS");
	doc.setFontType("normal");
	
	doc.text(20, 25, "IMPORTANT NOTE: Valuation Reports or Receipts in respect of all Articles to be insured should be attached to this Form.");

	doc.text(20, 30, "Full Description of Article(s) to be insured");

	doc.setFontType("bold");
	doc.text(20, 35, "Items List");

	doc.text(160, 35, "Sum Insured");

	doc.text(20, 50, "The Total Sum Insured under the All Risks Section of the Policy");

	doc.setFontType("normal");

	if (resp.HomeAllRiskArticleDescription0) {
		doc.text(20, 38, resp.HomeAllRiskArticleDescription0 ? resp.HomeAllRiskArticleDescription0 : "");
		doc.text(160, 38, "$" + resp.HomeAllRiskArticleValue0 ? resp.HomeAllRiskArticleValue0 : "");


	}
	if (resp.HomeAllRiskArticleDescription1) {
		doc.text(20, 41, resp.HomeAllRiskArticleDescription1 ? resp.HomeAllRiskArticleDescription1 : "");
		doc.text(160, 41, "$" + resp.HomeAllRiskArticleValue1 ? resp.HomeAllRiskArticleValue1 : "");


	}
	if (resp.HomeAllRiskArticleDescription2) {
		doc.text(20, 44, resp.HomeAllRiskArticleDescription2 ? resp.HomeAllRiskArticleDescription2 : "");
		doc.text(160, 44, "$" + resp.HomeAllRiskArticleValue2 ? resp.HomeAllRiskArticleValue2 : "");


	}
	if (resp.HomeAllRiskArticleDescription3) {
		doc.text(20, 47, resp.HomeAllRiskArticleDescription3 ? resp.HomeAllRiskArticleDescription3 : "");
		doc.text(160, 47, "$" + resp.HomeAllRiskArticleValue3 ? resp.HomeAllRiskArticleValue3 : "");


	}


	doc.setFontType("normal");


	doc.text(20, 55, "Select Territorial Limits Required");



	doc.text(160, 65, "Details");

	doc.text(20, 70, "Do you currently have in force any policy whether with us or with any other");

	doc.text(20, 73, "company or Insurer  covering any of the Property to be Insured");



	doc.text(20, 78, "Has any Company or Insurer, in respect of any of the Perils to which this Proposal applies, ever:");

	doc.text(20, 83, "Declined to insure you?");



	doc.text(20, 88, "Required special terms to insure you?");



	doc.text(20, 93, "Cancelled or refused to renew your policy?");



	doc.text(20, 98, "Increased your premium on renewal");




	doc.text(20, 103, "Have the Building and/or Contents of the Home to which this Proposal relates ever suffered");

	doc.text(20, 106, "damage by Hurricane, Earthquake or Flood");



	doc.text(20, 111, "Have you ever sustained loss from any Perils to which this Proposal would apply?");


//	doc.setFontType("italic");

	doc.text(160, 50, "$" + resp.HomeAllRiskTotalAmount);
	doc.text(20, 60, resp.territorialLimit)
	doc.text(140, 70, resp.currentPolicyWithCompanyOrInsurer);
	doc.text(180, 70, resp.currentPolicyWithCompanyOrInsurerDetails);
	doc.text(140, 83, resp.HomeInsuranceDeclined);
	doc.text(150, 83, resp.HomeInsuranceDeclinedDetails);
	doc.text(140, 88, resp.HomeInsuranceRequiredSpecialTerm);
	doc.text(150, 88, resp.HomeInsuranceRequiredSpecialTermDetails);
	doc.text(140, 93, resp.HomeInsuranceCancelled);
	doc.text(150, 93, resp.HomeInsuranceCancelledDetails);
	doc.text(140, 98, resp.HomeInsuranceIncreasedPremium);
	doc.text(150, 98, resp.HomeInsuranceIncreasedPremiumDetails);
	doc.text(140, 106, resp.HomeInsurancePerilsSuffer);
	doc.text(150, 106, resp.HomeInsurancePerilsSufferDetails);
	doc.text(140, 111, resp.HomeInsuranceSufferLoss);
	doc.text(150, 111, resp.HomeInsuranceSufferLossDetails);


}