// document ready function
'use strict';
/* global api, $  */

$(document).ready(function() {
  console.log('end');
  api.getISSdata(data => api.getNasaImage(api.getCoordinates(data)));
});

