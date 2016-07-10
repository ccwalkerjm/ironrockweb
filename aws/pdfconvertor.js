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
    doc.save('Proposal' + id + '.pdf');
}