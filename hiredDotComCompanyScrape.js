var ss = SpreadsheetApp.openById("num2h4shTok3n_puTy0urID-h3re"); //put your sheetID there
var s1 = ss.getSheetByName("Sheet1"); //make sure you have a Sheet1 and Sheet2
var s2 = ss.getSheetByName("Sheet2");

function uniqueArray(arrArg){ return arrArg.filter(function(elem, pos,arr){ return arr.indexOf(elem) == pos; });}

function grouped(e, n){
  if(e != null){
    return e[n].toString();
  }else{
    return '';
  }
}
function soFetch(path){
  var url = "https://hired.com/company/"+path;
  var opt = {"method": "GET"};
  var resp = UrlFetchApp.fetch(url, opt);
  return resp.toString().replace(/\n|\r/g, '');
}

function matchesToSudoArr(matchArr, rgx){
  var listItems = matchArr;
  var listArr = [];
if(listItems != null){
  for(m=0; m<listItems.length; m++){
    var itm = grouped(rgx.exec(listItems[m]), 1);
    if(itm.length > 0){
      listArr.push(itm.toString().replace(/\&\#39;|\&quot;/g, "'").replace(/&amp;/g, '').replace(/<br>/g, '\n').replace(/<.+?>/g, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/,/g, ";"));
    }
  }
  return '["'+uniqueArray(listArr).toString().replace(/,/g, '","')+'"]';
}else{
  return '';
}
}
function scrapeSiteByPathName_opt1(str) {
  var cleaned = str;
  var companyName = grouped(/xs-gamma text-medium'>(.+?)</i.exec(cleaned), 1).replace(/,/g, '');
  var headline = grouped(/xs-delta text-medium xs-mt1 xs-mbh0 sm-mth0 sm-mb1 text-black-dark'>(.+?)</i.exec(cleaned), 1).replace(/,/g, '');
  var fulladdress = grouped(/www\.google\.com\/maps\/place\/(.+?)">/i.exec(cleaned), 1).replace(/,/g, '');
  
  var aboutListContainer = grouped(/(bare-list inline-list list--divider.+?<h4)/.exec(cleaned), 1)
  var aboutUs = matchesToSudoArr(aboutListContainer.match(/inline-list__item'>.*?</ig), /inline-list__item'>(.*?)</i);
  
  var techStackContainer = grouped(/(tech stack.+?<\/ul>)/i.exec(cleaned), 1);
  var techStack = matchesToSudoArr(techStackContainer.match(/xs-pr1'>.*?</ig), /xs-pr1'>(.*?)</i); 
  
  var perksContainer = grouped(/(>perks<.+?><\/ul><)/i.exec(cleaned), 1);
  var perks = matchesToSudoArr(perksContainer.match(/xs-pr1'>.*?</ig), /xs-pr1'>(.*?)</i);
  
  var benefitsContainer = grouped(/(benefits<.+?<\/ul>)/i.exec(cleaned), 1);
  var benefits = matchesToSudoArr(benefitsContainer.match(/xs-mrh0'.+?>.+?</ig), /xs-mrh0'.+?>(.+?)</i);
  
  var aboutContainer = grouped(/(>About.+?<\/div>)/i.exec(cleaned), 1)
  var about = matchesToSudoArr(aboutContainer.match(/<p>.+?<\/p>/ig), /<p>(.+?)<\/p>/i);
  
  var websiteContainer = grouped(/>LINKS<(.+?)<\/ul>/i.exec(cleaned), 1)
  var website = matchesToSudoArr(websiteContainer.match(/href='.+?'/ig), /href='(.+?)'/i); 
  
  var output = new Array(companyName,headline,fulladdress,aboutUs,techStack,perks,benefits,about,website);
  
  Logger.log(output);
  var nextrow = s1.getLastRow() + 1;
  s1.getRange(nextrow, 1, 1, output.length).setValues([output]);
}

function scrapeSiteByPathName_opt2(str) {
  var cleaned = str;
  var companyName = grouped(/text-black" href="\/company\/.+?>(.+?)</i.exec(cleaned), 1);
  var fulladdress = grouped(/text-medium xs-pbh0'>.+?<p>(.+?)<\/p>/i.exec(cleaned), 1);
  var website = grouped(/<a target=._blank. href=.(.+?).>Website/i.exec(cleaned), 1);
  var linkedin = grouped(/(www.linkedin.com\/company\/.+?)">/i.exec(cleaned), 1);
  var numEmployee = grouped(/>Size<.+?<span>(\d+)/i.exec(cleaned), 1);
  var industry = grouped(/industry<.+?\/jobs\/(.+?).>/i.exec(cleaned), 1);
  
  var techStackContainer = grouped(/Tech Stack(.+?)<\/ul>/.exec(cleaned), 1);
  var techStack = matchesToSudoArr(techStackContainer.match(/xs-plh0 xs-mlh0'>\s*.+?</ig), /xs-plh0 xs-mlh0'>\s*(.+?)</i);
  var output = new Array(companyName,industry,fulladdress,numEmployee,techStack,'','',linkedin,website);
  
  Logger.log(output);
  var nextrow = s2.getLastRow() + 1;
  s2.getRange(nextrow, 1, 1, output.length).setValues([output]);

}
//run this function
function parseCompanyDetails(){ //this script will check for the two variations of company pages on hired.com and send that data to a spreadsheet.

var pathArr = ["walmartlabs","walmart-global-ecommerce","postmates-inc","bonobos","spotfront","applied-predictive-technologies","quid","boxed","dealdash","giving-assistant","cuberon","ordergroove","even","flipp","linqia","pepsico","plenty","formidable","coachlogix-inc","haven","master-mcneil-inc","vidora","clip","ifeelgoods","yerdle","opinionlab","aitoro-appliance","seekpanda","indigo-fair"];
for(i=0; i<pathArr.length; i++){
  var path = pathArr[i];
  var htmlStr = soFetch(path);

  if(/text-black" href="\/company\/.+?>/.test(htmlStr) === true){
    scrapeSiteByPathName_opt2(htmlStr);
  }
  if(/xs-gamma text-medium'>.+?</.test(htmlStr) === true){
    scrapeSiteByPathName_opt1(htmlStr);
  }
}
}
