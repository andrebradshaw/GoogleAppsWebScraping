function grouped(e, n){
  if(e != null){
    return e[n].toString();
  }else{
    return '';
  }
}
/*/GOOGLE APPS SCRIPT
this function will search the tech stack for a specified word & Log the faceted-company codes as an sudoarray for use in LinkedIn Searches. facetCurrentCompany= ["Logged","sudoarray","goes","here"]
/*/
function returnCompanyCodes() {
  var id = '1-K2yKmAR9CaFmQSJUdeA2idQX7a_n5_ZtL8e-r4Le9Q'; //put your sheetID there
  var ss = SpreadsheetApp.openById(id); 
  var searchterm = ['react','workday']; //the keywords you wish to search go here. THIS IS AND (if you want OR, change the following on line 32 "searchterm.every" to "searchterm.some"
  var locations = ["Austin2","SanFran2","LosAngeles2","Seattle2","Chicago2","Boston2","WashingttonDC2","Denver2"]; //the sheetnames you wish to search go here. This searches each locations and returns all matches in a sudo array.
  
  var matched_rowArr = [];
  for(s=0; s<locations.length; s++){
    var checksheet = ss.getSheetByName(locations[s]);
    var lastrow = checksheet.getLastRow();
    var techstack = checksheet.getRange(1, 5, lastrow, 1).getValues();
    var linkedin = checksheet.getRange(1, 8, lastrow, 1).getValues();
    var numEmpl = checksheet.getRange(1, 4, lastrow, 1).getValues();
     
    for(i=0; i<techstack.length; i++){
      var regX = new RegExp(searchterm, "i");
      function keywordsTRUE(v) {
        var rgx = new RegExp(v, "i");
        return rgx.test(techstack[i])
      }

      if(searchterm.every(keywordsTRUE) === true){// && numEmpl[i] >50
        var lid = grouped(/company\/(\d+)/.exec(linkedin[i].toString()), 1);
        matched_rowArr.push(lid);
      }
    }
  }
  var output = '["'+matched_rowArr.toString().replace(/,/g, '","').replace(/"",/g, '')+'"]';
  Logger.log(output.replace(/"",/g, ''));
  
}
