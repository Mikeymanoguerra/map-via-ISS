'use strict';
/*global $ */

const api = (function(){

  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  const MAP_URL = 'https://open.mapquestapi.com/staticmap/v5/map?key=KEY&center=';
  
  const getISSdata = function(callback){
    $.getJSON(`${ISS_URL}`, callback);
  };

  const getCoordinates = function(data){
    const latitude = data['iss_position'].latitude;
    const longitude =data['iss_position'].longitude;
    console.log(latitude, longitude);
  };


  // 37.7749,-122.4194&size=@2x
  const getMapImage = function(callback){
    $
  }

// use those coordinates to get picture of the map open static map api

// use those coordinates to get the data from nasa sattelite data


// use those coordinates to determine if over land or water on water API


// use IP address of user to get dead reckoning or something

  return{
    getISSdata,
    getCoordinates,
  };

}());


