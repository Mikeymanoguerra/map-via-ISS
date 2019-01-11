'use strict';
/*global dataStore, $ */

const api = (function(){
  const testCoors = dataStore.Mock_DATA[0].coorString;
  
  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  const NASA_URL = 'https://api.nasa.gov/planetary/earth/imagery?';
  const api_key = 'api_key=6xjJbi1FBz5ogidAuBgD1CNzpVDhMlopTUXgFTLY';
  const testCoordinates = 'lon=-75.1253377&lat=39.9793544';
  // const MAP_URL = 'https://www.mapquestapi.com/staticmap/v5/map?key=Zv1VRVyg4mhlWC8AmfdyyfhLhZS5EGcO&center=';

  const getNasaImage = function (coordinates, callback){
    return  $.getJSON(`${NASA_URL}${coordinates}&dim=.1&${api_key}`, callback);
  };


  // const getISSdata = function(callback){
  //   $.getJSON(`${ISS_URL}`,callback);
  // };


  const getISSdata = function(){
    return $.getJSON(`${ISS_URL}`);
  };

  // getISSdata.then(function(coorString){
  //   console.log('NASA ajax ran');
  //   $.getJSON(`${NASA_URL}${coorString}&cloud_score=false&dim=.5&${api_key}`, htmlToDom);
  // });    

  



  // use those coordinates to get picture of the map open static map api

  // use those coordinates to get the data from nasa sattelite data


  // use those coordinates to determine if over land or water on water API


  // use IP address of user to get dead reckoning or something

  return{
    getISSdata,
    getNasaImage,
    testCoordinates,
    testCoors
   
  };

}());


