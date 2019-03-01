'use strict';

/* global dataStore, utils, $, api */

const events = (function () {
  // when the button is clicked, use the Open Notify Api to get coordinates of ISS
  // give button a couple second timeout

  const getfirstImage = function () {
    $('.button-container').on('click', '.js-get-data', function () {
      let id;
      let location;
      return api.getISSdata()
        .then(data => dataStore.getCoordinates(data))
        .then(_id => {
          id = _id;
          location = dataStore.findLocationById(id);
          const coors = location.nasaCoordinates;
          return api.getNasaImage(coors);
        })
        .then((data) => nasaImageToDom(data, id))
        .catch(err => {
          console.log(err);
          nasaImageToDom(err, id);
          const coors = location.mapCoordinates;
          return api.getMapData(coors, 4)
            .then(data => mapToDom(data, id))
            .catch(err => console.log(err));
          // TODO CLEAN THIS NAVIGATE ALL DOM map 200s through the maptodom
        });
    });
  };

  const getEarlierImage = () => {
    let id;
    $('.nasa-results').on('click', '.go-back', function () {
      const _id = parseInt($('.go-back').siblings('img.satellite').attr('value'));
      id = _id;
      const location = dataStore.findLocationById(id);
      const coors = location.nasaCoordinates;
      const oneMonthEarlierArray = utils.goBackInTimeOneMonth(location.date);
      location.date = oneMonthEarlierArray;
      const dateString = utils.dateToHyphenString(oneMonthEarlierArray);
      return api.getNasaImage(coors, dateString)
        .then((data) => nasaImageToDom(data, id))
        .catch(err => console.log(err));
    });
  };

  const getLaterImage = () => {
    let id;
    $('.nasa-results').on('click', '.go-forward', function () {
      const _id = parseInt($('.go-forward').siblings('img.satellite').attr('value'));
      id = _id;
      const location = dataStore.findLocationById(id);
      const coors = location.nasaCoordinates;
      const oneMonthEarlierArray = utils.goForwardInTimeOneMonth(location.date);
      location.date = oneMonthEarlierArray;
      const dateString = utils.dateToHyphenString(oneMonthEarlierArray);
      return api.getNasaImage(coors, dateString)
        .then((data) => nasaImageToDom(data, id))
        .catch(err => console.log(err));
    });
  };

  const getMap = function () {
    $('.nasa-results').on('click', '.matching-map', function () {
      const id = parseInt($('.matching-map').siblings('img.satellite').attr('value'));
      const location = dataStore.findLocationById(id);
      const coors = location.mapCoordinates;
      return api.getMapData(coors)
        .then(data => {
          return mapToDom(data, id);
        })
        .catch(err => console.log(err));
    });
  };

  const zoomInOnMap = () => {
    let id;
    $('.map-results').on('click', '.zoom-in', function () {
      const _id = parseInt($('.zoom-in').siblings('img.map').attr('value'));
      id = _id;
      const location = dataStore.findLocationById(id);
      const coors = location.mapCoordinates;
      const zoom = location.mapZoom + 1;
      location.mapZoom = zoom;
      return api.getMapData(coors, zoom)
        .then((data) => mapToDom(data, id))
        .catch(err => console.log(err));
    });
  };


  const mapToDom = (data, id) => {
    const location = dataStore.findLocationById(id);
    const longitude = location.longitude;
    const latitude = location.latitude;
    $('.map-results').html(`
    <img class='map' value=${id} src='${data}' alt='map of the image to the left'>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location as a photo!</span><button class='matching-image'>Get!</button><br>
    <button class='zoom-out'>Zoom out</button>
    <button class='zoom-in'>Zoom in</button>
    
    `);
  };

  const nasaImageToDom = function (data, id) {
    const location = dataStore.findLocationById(id);
    const longitude = location.longitude;
    const latitude = location.latitude;
    const url = data.url;
    const htmlString = `
    <img class='satellite'
    value=${id} 
    src="${url}" alt="satellite image at  longitude ${longitude}, latitude ${latitude}">
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location on a map!</span><button class='matching-map'>Get!</button><br>
    <button class='go-back'>Go back in time</button>
    <button class='go-forward'>Go forward in time</button>
    `;
    //  add the img to the object for later...
    $('.nasa-results').html(htmlString);
  };

  const addFakeData = function () {
    console.log('hi');
    $('.button-container').on('click', '.test-data', function () {
      dataStore.seedData();
      const location = dataStore.findLocationById(9);
      const coors = location.nasaCoordinates;
      return api.getNasaImage(coors)
        .then((data) => {
          console.log(data);
          return nasaImageToDom(data, 9);
        })
        .catch(err => console.log(err));
    });
  };
  //  event listener for button click
  // can the local store maintain the photos?
  const bindEventListeners = () => {
    getfirstImage();
    getMap();
    getEarlierImage();
    getLaterImage();
    zoomInOnMap();
    addFakeData();

  };
  // Bind event listeners
  return {
    bindEventListeners
  };
}());


