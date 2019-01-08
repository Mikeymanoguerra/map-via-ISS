'use strict';
/*global events dataStore */

const dataStore = (function(){


  // takes in data from ISS cordinates , stores while client is at the site.


  const getCoordinates = function(data){
    const latitude = data['iss_position'].latitude;
    const longitude =data['iss_position'].longitude;
    const coorString =`lon=${longitude}&lat=${latitude}`;
    console.log(coorString);
    return coorString;
  };

  const pushToArray = function(obj) { 
    this.dataArray.push(obj);
  };

  //  got this iffee wired up and recieves the data on the click. next i guess i have to store the data on 
  // on the store array and use that to make my request to NASA. right now the current itertaion of the
  //  fn in events returns undefined.


  


  // Any functions that deal with looking back and forth in time for nasa data, and degrees of photo go here
  // 


  return{

    dataArray : [],
    getCoordinates,
    pushToArray,


  };

}());

