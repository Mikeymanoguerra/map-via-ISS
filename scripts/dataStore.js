'use strict';
/*global events dataStore */

const dataStore = (function(){

  const Mock_DATA = [
    {
      id : 9,
      coorString: 'lon=75.1652&lat=39.9526',
      degrees: 0.01,
      date: null,
      photoExists : true,
      imageUrls: ['https://earthengine.googleapis.com/api/thumb?thumbid=bc9b6d19904dfffe9e45271e308630ba&token=f0aee8f19cfd7d48dbd4a257fa9f181f']
    },
  ];


  // takes in data from ISS cordinates , stores while client is at the site.
  const getCoordinates = function(data){
    const latitude = data['iss_position'].latitude;
    const longitude =data['iss_position'].longitude;
    const coorString =`lon=${longitude}&lat=${latitude}`;
    const freshlocation = buildLocationObject(coorString);
    pushToArray(freshlocation);
    this.requestId ++;
    return freshlocation.id;
  };

  const buildLocationObject =function(coorString, degrees = 0.1){
    const locationObject = {
      id : dataStore.requestId,
      coorString,
      degrees,
      date: null,
      photoExists : true,
      imageUrls : []
    };
    return locationObject;
  };

  const pushToArray = function(obj) { 
    dataStore.dataArray.push(obj);
  };

  const findLocationById = function(id){
    return this.dataArray.find(location =>{
      if(id === location.id){
        return location;}
    });
  };

  // Any functions that deal with looking back and forth in time for nasa data, and degrees of photo go here
  // 


  return{

    dataArray : [],
    requestId : 10,
    getCoordinates,
    pushToArray,
    findLocationById,
    Mock_DATA,

  };

}());

