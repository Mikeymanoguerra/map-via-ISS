'use strict';

/* global dataStore, $, api */

const events = (function () {
  // when the button is clicked, use the Open Notify Api to get coordinates of ISS
  // give button a couple second timeout

  const getfirstImage = function () {
    $('.button-container').on('click', '.js-get-data', function () {
      let id;
      return api.getISSdata()
        .then(data => dataStore.getCoordinates(data))
        .then(_id => {
          id = _id;
          const location = dataStore.findLocationById(id);
          const coors = location.nasaCoordinates;
          return api.getNasaImage(coors);
        })
        .then((data) => nasaImageToDom(data, id))
        .catch(err => console.log(err));
    });
  };

  const addFakeData = function () {
    $('.button-container').on('click', '.test-data', function () {
      dataStore.seedData();
      const location = dataStore.findLocationById(8);
      const coors = location.nasaCoordinates;
      return api.getNasaImage(coors)
        .then((data) => {
          console.log(data);
          return nasaImageToDom(data, 8);
        })
        .catch(err => console.log(err));
    });
  };

  const getMap = function () {
    $('.button-container').on('click', '.map', function () {
      const id = parseInt($('.map').closest('.action-container').find('img.satellite').attr('value'));
      const location = dataStore.findLocationById(id);
      const coors = location.mapCoordinates;
      return api.getMapData(coors)
        .then(data => {
          $('.map-results').html(`<img src='${data}' alt='what'>`);
        })
        .catch(err => console.log(err));
    });
  };

  const nasaImageToDom = function (data, id) {
    console.log(data, id);
    const location = dataStore.findLocationById(id);
    const longitude = location.longitude;
    const latitude = location.latitude;
    const url = data.url;
    const htmlString = `
    <img class='satellite'
    value=${id} 
    src="${url}" alt="satellite image at  longitude ${longitude}, latitude ${latitude}">
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location on a map!</span><button>use above map button</button>
    `;
    //  add the img to the object for later...
    $('.nasa-results').html(htmlString);
  };
  //  event listener for button click
  // can the local store maintain the photos?



  // Bind event listeners

  return {
    getfirstImage,
    nasaImageToDom,
    getMap,
    addFakeData
  };
}());


