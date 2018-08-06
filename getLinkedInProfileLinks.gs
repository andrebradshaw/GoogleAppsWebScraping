/*/
the build:
  https://youtu.be/gmev1-b2C_0
  https://youtu.be/fMxs80voFNk
/*/

//some boiler plate
function grouped(e, n){
  if(e != null){
    return e[n].toString();
  }else{
    return '';
  }
}
function soFetch(path){
  var url = path;
  var opt = {"method": "GET"};
  var resp = UrlFetchApp.fetch(url, opt);
  return resp.toString().replace(/\n|\r/g, '');
}

function uri(obj){
  return obj.toString().replace(/\s+/g, '+');
}

var id = 'YOURsheetID_goesHere'
var ss = SpreadsheetApp.openById(id);
var s1 = ss.getSheetByName("Sheet1");

function ducky() {
  var lastrow = s1.getLastRow(); //now we need to get the row number of the last row with data
  /*/
  lets make this something we can use at scale.
  /*/
  
  /*/
  firstname column: 
    start with the first row and first column, 
      get the number of rows which is the same as the number of rows you want to retrieve... in this case. 
  /*/
  var firstname = s1.getRange(1, 1, lastrow, 1).getValues();
  var lastname  = s1.getRange(1, 2, lastrow, 1).getValues();
  var title  = s1.getRange(1, 3, lastrow, 1).getValues();
  var company = s1.getRange(1, 4, lastrow, 1).getValues();
  
  //
  for(i=0; i<firstname.length; i++){ //change the 0 to a 1 if you have a header in your google sheet
    /*/ https://www.w3schools.com/js/tryit.asp?filename=tryjs_object_for_in
    you coul also say for(i in firstname), but I like to use this method or forEach. 
    I tend not to use forEach in google apps script as much because it is ES5 and does not allow for arrow functions which are available in ES6.
    /*/  
    var url = 'https://duckduckgo.com/?q=inurl%3A%22linkedin.com%2Fin%2F%22+%22'+firstname[i]+'+'+lastname[i]+'%22+%22'+uri(title[i])+'%22+%22'+uri(company[i])+'%22';
    var resp = soFetch(url);
    var searchMatches = resp.match(/<h2 class="result__title">.+?<a class="result__url".+?<\/a>/g);

    //need a few regex to check company and title within the matches. this will ensure we only return the link if it is a match to the name, title, and company.
    var regXFname = new RegExp(firstname[i].toString(), 'i');
    var regXLname = new RegExp(lastname[i].toString(), 'i');
    var regXcompany = new RegExp(title[i].toString(), 'i');
    var regXtitle = new RegExp(company[i].toString(), 'i');
   
    for(s=0; s<searchMatches.length; s++){
      var matches = searchMatches[s].toString();
      if(regXFname.test(matches) === true && regXLname.test(matches) === true && regXtitle.test(matches) === true && regXcompany.test(matches) === true){
        var link = grouped(/(www\.linkedin\.com%2Fin%2F.+?)(?:%|")/i.exec(matches), 1);
        s = searchMatches.length; 
        Logger.log(link);
        s1.getRange((i+1), 5).setValue(link.replace(/%2F/g, '/'));
      }
    }
  }
  


 // var matchedLink = grouped(/<h2 class="result__title">.+?href.+?(linkedin\.com%2Fin%2F.+?)"/i.exec(resp), 1);
 // s1.getRange(1, 5).setValue(matchedLink.replace(/%2F/g, '/'));


}
