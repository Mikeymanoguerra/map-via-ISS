'use strict';
/*global $ */

const api = (function(){

  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  const MAP_URL = 'https://open.mapquestapi.com/staticmap/v5/map?key=KEY&center=';
  const mapTestURL = 'https://open.mapquestapi.com/staticmap/v5/map?key=KEY&center=-11.2631,-10.9335&size=@2x';
  
  const getISSdata = function(callback){
    $.getJSON(`${ISS_URL}`, callback);
  };

  const getCoordinates = function(data){
    const latitude = data['iss_position'].latitude;
    const longitude =data['iss_position'].longitude;
    const coorString =`${latitude},${longitude}`;
    console.log(coorString);
    return coorString;
  };

  // need to add a promise somehow

  const getMapImage = function(callback){
    console.log('getMapImage ran');
    const coordinatesString = getISSdata(getCoordinates);
    console.log(coordinatesString);
    // $.getJSON(`${MAP_URL}${coordinatesString}&size=@2x`,callback);
    $.getJSON(`${mapTestURL}`, callback);
  }

// use those coordinates to get picture of the map open static map api

// use those coordinates to get the data from nasa sattelite data


// use those coordinates to determine if over land or water on water API


// use IP address of user to get dead reckoning or something

  return{
    getISSdata,
    getCoordinates,
    getMapImage,
  };

}());


