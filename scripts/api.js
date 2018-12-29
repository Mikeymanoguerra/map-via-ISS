'use strict';
/*global $ */

const api = (function(){

  
  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  // const MAP_URL = ;
  const mapTestURL = 'https://www.mapquestapi.com/staticmap/v5/map?key=Zv1VRVyg4mhlWC8AmfdyyfhLhZS5EGcO&center=San+Francisco,CA&zoom=14&type=map';
  
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
    $.ajax({
      method: 'GET',
      url: `${mapTestURL}`,
      // contentType: 'application/json',
      // data: getCoordinates(),
      success  : callback,

    });

  };


 

  const whatsTheObject = function(data){
    console.log(data, typeof data, 'success');

  }

// use those coordinates to get picture of the map open static map api

// use those coordinates to get the data from nasa sattelite data


// use those coordinates to determine if over land or water on water API


// use IP address of user to get dead reckoning or something

  return{
    getISSdata,
    getCoordinates,
    getMapImage,
    whatsTheObject,
  };

}());


