'use strict';

/* global dataStore, $, api */

const events = (function(){
// when the button is clicked, use the Open Notify Api to get coordinates of ISS
// give button a couple second timeout

  const getfirstImage = function(){
    console.log('get first image ran');
    $('.button').on('click', '.js-get-data', function(){
      console.log('click register');
    api.getISSdata(data => dataStore.getCoordinates(data));
      // console.log(coorString);
        // .then(coorString => api.getNasaImage(coorString, htmlToDom));
    });
  };

  const htmlToDom = function(data){ 
    const url = data.url;
    const htmlString = `<img src="${url}" alt="ehh">`;
    $('.js-results').html(htmlString); 
  };
  //  event listener for button click
  // can the local store maintain the photos?



  // Bind event listeners

  return {
    getfirstImage
  };
}());


