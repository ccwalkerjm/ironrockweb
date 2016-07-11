function CreatePDF(resp) {
    var doc = new jsPDF();
    doc.setFontSize(22);
    doc.text(20, 20, 'Proposal');
    doc.setFontSize(10);
    doc.setFont("times");
    doc.setFontType("normal");
    doc.text(20, 30, 'Insurance for ' + resp.insuranceType);
    doc.text(20, 50, 'Surname:');
    doc.text(20, 60, 'First Name:');
    doc.text(20, 70, 'Middle Name:');
    doc.text(20, 80, 'Title:');
    doc.text(20, 90, 'Occupation:');
    doc.text(100, 50, 'Mothers Maiden Name: ');
    doc.text(100, 60, 'Other Names/Aliases: ');
    doc.text(100, 70, 'ID Type: ');
    doc.text(100, 80, 'ID Number: ');
    doc.text(100, 90, 'Expiration Date: ');
    doc.text(100, 100, 'Source of Funds: ');
    doc.text(20, 120, 'Street Number and Name: ');
    doc.text(20, 130, 'City/Town/Postal Zone: ');
    doc.text(20, 140, 'Parish: ');
    doc.text(100, 120, 'TRN: ');
    doc.text(100, 130, 'Email Address: ');
    doc.text(100, 140, 'Mobile Number: ');
    doc.text(100, 150, 'Home Number: ');
    doc.text(100, 160, 'Work Number: ');
    doc.text(20, 180, 'Street Number and Name: ');
    doc.text(20, 190, 'City/Town/Postal Zone: ');
    doc.text(20, 200, 'Parish ');
    doc.text(100, 180, 'Date of Birth: ');
    doc.text(100, 190, 'Place of Birth: ');
    doc.text(100, 200, 'Nationality: ');
    doc.text(20, 220, 'Company Name:');
    doc.text(100, 220, 'Street Number and Name:');
    doc.text(100, 230, 'Town');
    doc.text(100, 240, 'Parish');
    doc.setFontType("bold");
    doc.text(50, 50, resp.applicantSurname); /*doc.text(50, 60, resp.applicantFirstName); doc.text(50, 70, resp.applicantMiddleName);*/
    doc.text(50, 80, resp.applicantTitle);
    doc.text(50, 90, resp.applicantOccupation);
    doc.text(150, 50, resp.applicantMothersMaidenName);
    doc.text(150, 60, resp.applicantAlias);
    doc.text(150, 70, resp.applicantIDType);
    doc.text(150, 80, resp.applicantIDnumber);
    doc.text(150, 90, resp.applicationIDExpirationDate); /* doc.text(150, 100, resp.SourceOfFunds); */
    doc.text(20, 125, resp.applicantHomeStreetName);
    doc.text(20, 135, resp.applicantHomeTown);
    doc.text(50, 140, resp.applicantHomeParish); /* doc.text(150, 120, resp.applicantTRN); */
    doc.text(150, 130, resp.applicantEmailAddress); /* doc.text(150, 140, resp.ApplicantMobileNumber); */
    doc.text(150, 150, resp.applicantHomeNumber);
    doc.text(150, 160, resp.applicantWorkNumber); /* doc.text(20, 185, resp.applicantMailStreetName); */
    doc.text(20, 195, resp.applicantMailTown);
    doc.text(50, 200, resp.applicantMailParish);
    doc.text(150, 180, resp.applicantDateOfBirth);
    doc.text(150, 190, resp.applicantPlaceOfBirth);
    doc.text(150, 200, resp.applicantNationality);
    doc.text(50, 220, resp.employerName);
    doc.text(150, 220, resp.employerStreetName);
    doc.text(150, 230, resp.employerTown);
    doc.text(150, 240, resp.employerParish);
    doc.setFontType("bold");
    doc.setFontSize("14");
    doc.text(20, 40, 'Name');
    doc.text(20, 110, 'Home Address');
    doc.text(20, 170, 'Mailing Address');
    doc.text(20, 210, 'Employer Details');
    
    doc.addPage();
    
    doc.setFontSize("10");
    doc.setFontType("bold");
    doc.text(20, 20, "Particulars Of Vehicles to Be Insured");
    
    doc.text(20,80, "NOTE: You are required to ensure that the Sum Insured is revised annually to reflect the current market value.  ");
    
    doc.text(20, 85, "Claims will be settled based on the market value at the time of the loss. For total losses you will be paid based in");
    
    doc.text(20, 90, "time of the loss. For total losses you will be paid based on the market value or Policy Sum Insured whichever is lesser.");
    
    doc.text(20, 100, "Lien Holder");
    
    doc.text(20, 140, "Select cover required(tick the appropriate box)");
    
    doc.setFontType("normal");
    doc.text(20, 50, "Are you the owner of the vehicle(s) and is/are/they registered in your name?");
    
    doc.text(20, 60, "If not, state the name and address of the owner:");
    
    doc.text(20, 70, "Will a trailer be used?");
    
    doc.text(20, 110, "Name in Full:");
    
    doc. text(100, 110, "Street Number and Name:");
    
    doc.text(100, 120, "Town:");
    
    doc.text(100, 130, "Parish:");
    
    doc.text(20, 150, "Please indicate if the vehicle is to be used as:");
    
    doc.text(20, 160, "Is the vehicle fitted with an anti-theft device?");
    
    doc.text(20, 170, "If yes, state the name, type of device and name of provider");
    
    doc.text(20, 180, "Will you have regular custody of the vehicle?");
    
    doc.text(20, 190, "If not, please provide details");
    
    doc.text(20, 200, "Is the vehicle garaged at the Proposer's home address?");
    
    doc.text(20, 210, "If not, please state where:");
    
    doc.text(20, 220, "Is the vehicle kept in?");
    
    doc.setFontType("bold");
    
   /* doc.text(110, 50, resp.isOwnerOfVehicle); */
    
    doc.text(110, 60, resp.nameAddressOfOwner);
    
  /*  doc.text(110, 70, resp.trailerUsed); */
    
    doc.text(110, 110, resp.lienHolderNameInFull);
    
    doc. text(100, 115, resp.lienHolderStreetName);
    
    doc.text(150, 120, resp.lienHolderTown);
    
    doc.text(150, 130, resp.lienHolderParish);
    
    doc.text(110, 150, resp.vehicleUsedAs);
    
   /* doc.text(110, 160, resp.vehicleAntiTheftDevice); */
    
    doc.text(20, 175, resp.vehicleAntiTheftDeviceName + " " + resp.vehicleAntiTheftDeviceType + " " + resp.vehicleAntiTheftDeviceNameOfProvider);
    
    doc.text(110, 180, resp.vehicleRegularCustody?resp.vehicleRegularCustody:"");
    
    doc.text(110, 190, resp.vehicleRegularCustodyDetails?resp.vehicleRegularCustodyDetails:"");
    
    doc.text(110, 200, resp.vehicleGaragedAtProposersHome?resp.vehicleGaragedAtProposersHome:""); 
    
    doc.text(110, 210, resp.vehicleGaragedAtProposersHomeDetails?resp.vehicleGaragedAtProposersHomeDetails:"");
    
    doc.text(110, 220, resp.vehicleKeptIn?resp.vehicleKeptIn:"");
    
    doc.addPage();
    
    doc.setFontSize("10");
    
    doc.text(20, 20, "Is the proposer now insured or was previously insured in respect of any vehicle(s)");
    
    doc.text(20, 40, "If yes, state the name and address of the Insurance Company:");
    
    doc.text(20, 50, "Is the proposer entitled to No Claim Discount from previous Insurer(s) In respect of any vehicle(s) described in the ");
    
    doc.text(20, 55, "proposal?")
    
    doc.text(20, 60, "If yes, please attach proof of No Claim Discount Letter or Renewal Notice.");
    
    doc.text(20, 70, "Do you have any other Insurance(s) with IronRock Insurance Company Ltd.?");
    
    doc.text(20, 80, "If yes, please state type(s):");
    
    doc.text(20, 90, "Has any Insurer(s) in respect of the Proposer or any other Person who will regularly drive ever?");
    
    doc.text(20, 130, "If yes, please indicate above and give details:");
    
    doc.text(20, 140, "Type of Authorized Driver Clause:");
    
    doc.addPage();
    
    doc.text(20, 20, "Have you or any regular drivers had any accidents or losses during the past three(3) years (whether insured ");
    
    doc.text(20, 25, "or not in respect of all vehicles)");
    
    doc.text(20, 30, "I. Owned by you, whether or not you were the driver at the material time?");
    
    doc.text(20, 35, "II. Not owned by you, but driven by you or in your custody at the material time?");
    
    doc.text(20, 45, "If yes, please give details below");
    
    doc.text(20, 80, "To the best of your knowledge and belief have you, or any person who to your knowledge");
    
    doc.text(20, 85, "will drive have suffered from, or now suffer from:");
    
    doc.text(20, 100, "If yes, please indicate above and give details:");
    
    doc.text(20, 110, "Have you or any person who to your knowledge will drive received any traffic ticket(s) and");
    
    doc.text(20, 115, "or have been convicted of any offence in connection with the driving of any motor vehicle within the ");
    
    doc.text(20, 120, "last three (3) years?");
    
    doc.text(20, 130, "If yes, please give details:");
    
    doc.text(20, 140, "has the vehicle been modified or converted from maker's standard specification or do you intend to do so?");
    
    doc.text(20, 150, "If yes, please give details:");
    
    doc.text(20, 160, "Do you require increased limits (in excess of the Standard Limits)");
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    doc.save('Proposal' + resp.applicantQuoteNo + '.pdf');
}