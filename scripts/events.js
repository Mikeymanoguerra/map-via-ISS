'use strict';

/* global dataStore, $, api */

const events = (function(){
// when the button is clicked, use the Open Notify Api to get coordinates of ISS
// give button a couple second timeout

  const getfirstImage = function(){
    $('.button-container').on('click', '.js-get-data', function(){
      new Promise( function(resolve){
        const obj = api.getISSdata();
        resolve(obj);})
        .then(data => dataStore.getCoordinates(data))
        .then(id => { 
          const location = dataStore.findLocationById(id);
          const coors = location.coorString;
          return api.getNasaImage(coors);
        })
        .then(data => htmlToDom(data));
    });
  };
  
  const htmlToDom = function(data){ 
    const url = data.url;
    const htmlString = `<img src="${url}" alt="ehh">`;
    //  add the img to the object for later...
    $('.js-results').html(htmlString); 
  };
  //  event listener for button click
  // can the local store maintain the photos?



  // Bind event listeners

  return {
    getfirstImage,
    htmlToDom
  };
}());


