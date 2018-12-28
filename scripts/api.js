'use strict';

const api = (function(){

  const ISS_URL = 'http://api.open-notify.org/iss-now.json';
  const getCoordinates = function(){
    console.log('get coordinates ran');
    $.getJSON(`${ISS_URL}`,data => console.log('success', data));
  }
// when the button is clicked, use the Open Notify Api to get coordinates of ISS

// use those coordinates to get picture of the map open static map api

// use those coordinates to get the data from nasa sattelite data


// use those coordinates to determine if over land or water on water API


// use IP address of user to get dead reckoning or something

return{
  getCoordinates,
}

}());


