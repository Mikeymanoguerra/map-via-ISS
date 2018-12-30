'use strict';
/*global $ */

const api = (function(){

  
  const ISS_URL = 'http://api.open-notify.org/iss-now.json?callback=?';
  const MAP_URL = 'https://www.mapquestapi.com/staticmap/v5/map?key=Zv1VRVyg4mhlWC8AmfdyyfhLhZS5EGcO&center=';
  const NASA_URL = 'https://api.nasa.gov/planetary/earth/imagery?';
  const api_key = 'api_key=6xjJbi1FBz5ogidAuBgD1CNzpVDhMlopTUXgFTLY';
  const testCoordinates = 'lon=-42.4009&lat=-13.9241';

  const  getCoordinates = function(data){
    const latitude = data['iss_position'].latitude;
    const longitude =data['iss_position'].longitude;
    const coorString =`lon=${longitude}&lat=${latitude}`;
    console.log(coorString);
    return coorString;
  };

  const htmlToDom = function(data){ 
    const url = data.url;
    const htmlString = `<img src="${url}" alt="ehh">`;
    $('.js-results').html(htmlString); 
  };

  const getISSdata = new Promise(function(){
    $.getJSON(`${ISS_URL}`, getCoordinates);
  });

  // getISSdata.then(function(coorString){
  //   console.log('NASA ajax ran');
  //   $.getJSON(`${NASA_URL}${coorString}&cloud_score=false&dim=.5&${api_key}`, htmlToDom);
  // });    

  const getNasaImage = function (){
    console.log('NASA ajax ran');
    $.getJSON(`${NASA_URL}${testCoordinates}&cloud_score=true&dim=.3&${api_key}`, htmlToDom);
  };



  // use those coordinates to get picture of the map open static map api

  // use those coordinates to get the data from nasa sattelite data


  // use those coordinates to determine if over land or water on water API


  // use IP address of user to get dead reckoning or something

  return{
    getISSdata,
    getNasaImage
   
  };

}());


