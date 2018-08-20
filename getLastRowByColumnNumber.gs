function returnLastRowNum_bySpecifiedCol(colNum){//gets the last row number with data in the specified column. 
  var rowArr = []; //empty array
  var data = s1.getRange(1, colNum, s1.getLastRow(), 1).getValues(); //gets data from a specified column (passed through the function) and assigns it the name "data"
  for(i =(data.length-1); i >=0;  i--){ //reverse loop.
    if (data[i][0] != null && data[i][0] != ''){ //if the current cell on the loop is not empty, 
      rowArr.push(i+1); //push the row number into an array
    }
  }
  return Math.max.apply(null, rowArr); //then return the largest number in the array. this will be the last row with data in the specificed column. 
}
