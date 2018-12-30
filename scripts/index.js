// document ready function
'use strict';
/* global api, $  */

$(document).ready(function() {
  console.log('end');
  // api.getISSdata(api.getCoordinates);
  api.getNasaImage( function(data){ 
    const url = data.url;
    const htmlString = `<img src="${url}" alt="ehh">`;
    $('.js-results').html(htmlString);
  });

});