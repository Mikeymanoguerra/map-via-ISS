'use strict';
/*global dataStore, $ */

const api = (function () {
  const testCoors = dataStore.Mock_DATA[0].nasaCoordinates;

  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  const NASA_URL = 'https://api.nasa.gov/planetary/earth/imagery?';
  const NASA_API_KEY = 'api_key=6xjJbi1FBz5ogidAuBgD1CNzpVDhMlopTUXgFTLY';
  const testCoordinates = '-75.12,39.974';
  const MAP_URL = 'https://www.mapquestapi.com/staticmap/v5/map?key=Zv1VRVyg4mhlWC8AmfdyyfhLhZS5EGcO&locations=';

  const getNasaImage = function (coordinates, date, callback) {
    return $.getJSON(`${NASA_URL}${coordinates}&${date}&dim=.1&${NASA_API_KEY}`, callback);
  };

  const getMapData = (coordinates) => {
    return fetch(
      `${MAP_URL}${coordinates}&zoom=5&size=800,600&defaultMarker=flag-009900-ISS-sm`)
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res.statusText);
        }
        return res.url;
      });
  };

  // const getISSdata = function(callback){
  //   $.getJSON(`${ISS_URL}`,callback);
  // };


  const getISSdata = function () {
    const data = $.getJSON(`${ISS_URL}`);
    return data;
  };

  // getISSdata.then(function(nasaCoordinates){
  //   console.log('NASA ajax ran');
  //   $.getJSON(`${NASA_URL}${nasaCoordinates}&cloud_score=false&dim=.5&${api_key}`, htmlToDom);
  // });    





  // use those coordinates to get picture of the map open static map api

  // use those coordinates to get the data from nasa sattelite data


  // use those coordinates to determine if over land or water on water API


  // use IP address of user to get dead reckoning or something

  return {
    getISSdata,
    getNasaImage,
    testCoordinates,
    testCoors,
    getMapData
  };

}());