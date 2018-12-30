'use strict';
/*global $ */

const api = (function(){

  
  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  const MAP_URL = 'https://www.mapquestapi.com/staticmap/v5/map?key=Zv1VRVyg4mhlWC8AmfdyyfhLhZS5EGcO&center=';
  const NASA_URL ='https://api.nasa.gov/planetary/apod?api_key=6xjJbi1FBz5ogidAuBgD1CNzpVDhMlopTUXgFTLY'
  const nasaDemo = 'https://api.nasa.gov/planetary/earth/imagery?lon=101.75&lat=7.5&dim=.5&cloud_score=true&api_key=6xjJbi1FBz5ogidAuBgD1CNzpVDhMlopTUXgFTLY';

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

  const coordinates = getISSdata(getCoordinates);
  // need to add a promise somehow



  const getNasaImage = function(callback){
    $.getJSON(`${nasaDemo}`, callback);
  };


 



// use those coordinates to get picture of the map open static map api

// use those coordinates to get the data from nasa sattelite data


// use those coordinates to determine if over land or water on water API


// use IP address of user to get dead reckoning or something

  return{
    getISSdata,
    getCoordinates,
    getNasaImage,
    coordinates,
  };

}());


