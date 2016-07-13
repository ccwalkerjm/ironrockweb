"use strict";
var doc;

const standardYgap = 5;
const gapBelowHeader = 10;
const startingXPoint = 20;
const startingYPoint = 20;
const startingYFirstPagePoint = 50;


function CreatePDF(resp) {
	doc = new jsPDF();
	console.log(resp);
	doc.setFontSize(12);
	if (resp.insuranceType === 'motor') {
		doc.text(20, 40, 'Motor Vehicle Insurance Proposal');
	} else {
		doc.text(20, 40, 'Home Insurance Proposal');
	}
    
   
    /*var ironRockLogo = 'data:image/png;base64,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';
    
    doc.addImage(ironRockLogo, 'PNG', 5, 5, 100, 30);*/
    
	

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
    
    doc.text(20 , 240, "If yes to the above, please give the name and address of spouse and children");
    
    doc.setFontType("italic");
    
    doc.text(20, 226, resp.applicantRelativeInPublicOffice?resp.applicantRelativeInPublicOffice:"" );
    
    doc.text(20, 235, resp.applicantRelativeTypePublicOffice0?resp.applicantRelativeTypePublicOffice0:"");
    
    
    
    
    
    doc.setFontSize("8");
    doc.setFontType("bold");
    doc.text( 20, 45, "DUTY TO DISCLOSE. This proposal must be completed, dated and signed by the proposer. When answering the questions on this form," );
    
    doc.text( 20, 48, " you must be honest and truthful. You have a duty under law to tell us anything known to you which is material to the questions asked as ");
    
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
    doc.text(62, 25,"SChassis & Engine No.");
    doc.text(90,25 , "Year of Make");
    doc.text(105, 25, "C.C. Rating");
    doc.text(122, 25, "Seating");
    doc.text(142, 25, "Type Of Body");
    doc.text(162, 25,"Sum Insured");
    
    doc.setFontType("normal")
        
   
    if (resp.vehicleRegistrationNo0) {
		doc.text(20, 30 , resp.vehicleRegistrationNo0?resp.vehicleRegistrationNo0:"");
        doc.text(42, 30, resp.vehicleMake0?resp.vehicleMake0:"");
        doc.text(62, 30,resp.vehicleChassisNo0?resp.vehicleChassisNo0:"");
        doc.text(90,30 , resp.vehicleYear0?resp.vehicleYear0:"");
        doc.text(105, 30, "");
        doc.text(122, 30, resp.vehicleBody0?resp.vehicleBody0:"");
        doc.text(142, 30, resp.vehicleType0?resp.vehicleType0:"");
        doc.text(162, 30,resp.QueryVehicleSumInsured?resp.QueryVehicleSumInsured:"");

	}
	if (resp.vehicleRegistrationNo1) {
		doc.text(20, 35, resp.vehicleRegistrationNo1?resp.vehicleRegistrationNo1:"");
        doc.text(42, 35, resp.vehicleMake1?resp.vehicleMake1:"");
        doc.text(62, 35,resp.vehicleChassisNo1?resp.vehicleChassisNo1:"");
        doc.text(90,35 , resp.vehicleYear1?resp.vehicleYear1:"");
        doc.text(105, 35, " ");
        doc.text(122, 35, resp.vehicleBody1?resp.vehicleBody1:"");
        doc.text(142, 35, resp.vehicleType1?resp.vehicleType1:"");
        doc.text(162, 35,resp.QueryVehicleSumInsured?resp.QueryVehicleSumInsured:"");

	}
	if (resp.vehicleRegistrationNo2) {
		doc.text(20, 40, resp.vehicleRegistrationNo2?resp.vehicleRegistrationNo2:"");
        doc.text(42, 40, resp.vehicleMake2?resp.vehicleMake2:"");
                 
        doc.text(62, 40, resp.vehicleChassisNo2?resp.vehicleChassisNo2:"");
        
        doc.text(90,40 , resp.vehicleYear2?resp.vehicleYear2:"");
        doc.text(105, 40, " ");
        doc.text(122, 40, resp.vehicleBody2?resp.vehicleBody2:"");
        doc.text(142, 40, resp.vehicleType2?resp.vehicleType2:"");
        doc.text(162, 40,resp.QueryVehicleSumInsured?resp.QueryVehicleSumInsured:"");

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

	doc.text(20, 125 , resp.vehicleUsedAs);

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
    doc.text(80, 150,"Date of Birth");
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
    doc.text(100, 40,"Driver");
    doc.text(150, 40 , "Brief details of Accidents, Incident or losses");
    
    doc.setFontType("normal");
    
   
    if (resp.involvedInAccident) {
        doc.text(20, 45, resp.accidentMonth0?resp.accidentMonth0:"");
        doc.text(50, 45, resp.accidentCost0?resp.accidentCost0:"");
        doc.text(100, 45,resp.accidentDriver0?resp.accidentDriver0:"");
        doc.text(150, 45 , resp.accidentBrief0?resp.accidentBrief0:"");

	}
	if (resp.involvedInAccident) {
		doc.text(20, 50, resp.accidentMonth1?resp.accidentMonth1:"");
        doc.text(50, 50, resp.accidentCost1?resp.accidentCost1:"");
        doc.text(100, 50,resp.accidentDriver1?resp.accidentDriver1:"");
        doc.text(150, 50 , resp.accidentBrief1?resp.accidentBrief1:"");

	}
	if (resp.involvedInAccident) {
		doc.text(20, 55, resp.accidentMonth2?resp.accidentMonth2:"");
        doc.text(50, 55, resp.accidentCost2?resp.accidentCost2:"");
        doc.text(100, 55,resp.accidentDriver2?resp.accidentDriver2:"");
        doc.text(150, 55, resp.accidentBrief2?resp.accidentBrief2:"");

	}
    
    

	doc.text(20, 60, "To the best of your knowledge and belief have you, or any person who to your knowledge will drive have suffered from, or now suffer from:");
	
	doc.text(20, 70, "If yes, please indicate above and give details:");

	doc.text(20, 80 , "Have you or any person who to your knowledge will drive received any traffic ticket(s) and");

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