// document ready function
'use strict';
/* global events, api, $  */

$(document).ready(function () {
  console.log('end');
  events.getfirstImage();
  events.getMap();
  events.addFakeData();
  events.getEarlierImage();
});

