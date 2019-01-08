'use strict';

/* global dataStore, $, api */

const events = (function(){
// when the button is clicked, use the Open Notify Api to get coordinates of ISS
// give button a couple second timeout

  const getfirstImage = function(){
    $('.button').on('click', '.js-get-data', function(){
      api.getISSdata(data => dataStore.getCoordinates(data));
    });
  };

  const htmlToDom = function(data){ 
    const url = data.url;
    const htmlString = `<img src="${url}" alt="ehh">`;
    console.log(htmlString);
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


