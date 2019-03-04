
window.store = (function () {

  const Mock_DATA = [
    {
      id: 8,
      nasaCoordinates: 'lon=32.1453&lat=-17.8883',
      degrees: 0.01,
      mapCoordinates: '-17.8883,32.1453',
      longitude: 32.1453,
      latitude: -17.8883,
      date: null,
      photoExists: true,
      imageUrls: []
    },
    {
      id: 9,
      nasaCoordinates: 'lon=-122.4194&lat=37.7749',
      mapCoordinates: '37.7749,-122.4194',
      degrees: 0.01,
      longitude: -122.4194,
      latitude: 37.7749,
      date: [2013, 12, 24],
      mapZoom: 5,
      photoExists: true,
      imageUrls: ['https://earthengine.googleapis.com/api/thumb?thumbid=bc9b6d19904dfffe9e45271e308630ba&token=f0aee8f19cfd7d48dbd4a257fa9f181f']
    },
    {
      id: 10,
      nasaCoordinates: 'lon=75.1652&lat=39.9526',
      mapCoordinates: '39.9526,75.1652',
      degrees: 0.01,
      longitude: 75.1652,
      latitude: 39.9526,
      date: [2013, 12, 24],
      mapZoom: 5,
      photoExists: true,
      imageUrls: ['https://earthengine.googleapis.com/api/thumb?thumbid=bc9b6d19904dfffe9e45271e308630ba&token=f0aee8f19cfd7d48dbd4a257fa9f181f']
    },

  ];
  const seedData = function () {
    data = {
      iss_position: { longitude: "-122.4194", latitude: "37.7749" }
    };
    return getCoordinates(data);
  };


  // takes in data from ISS cordinates , stores while client is at the site.
  const getCoordinates = function (data) {
    const latitude = data['iss_position'].latitude;
    const longitude = data['iss_position'].longitude;
    const nasaCoordinates = `lon=${longitude}&lat=${latitude}`;
    const mapCoordinates = `${latitude},${longitude}`;
    const freshlocation = buildLocationObject(
      nasaCoordinates,
      mapCoordinates,
      latitude,
      longitude);
    pushToArray(freshlocation);
    this.requestId++;
    return freshlocation.id;
  };

  const buildLocationObject = function (
    nasaCoordinates,
    mapCoordinates,
    longitude,
    latitude,
    date = [2013, 12, 24],
    zoomInDegrees = 0.1) {
    const locationObject = {
      id: store.requestId,
      nasaCoordinates,
      zoomInDegrees,
      mapCoordinates,
      longitude,
      latitude,
      date,
      mapZoom: 5,
      imageId: 1,
      successfulResponses: []
    };
    return locationObject;
  };

  const pushToArray = function (obj) {
    store.state.push(obj);
  };

  const findLocationById = function (id) {
    return store.state.find(location => {
      if (id === location.id) {
        return location;
      }
    });
  };

  const checkForExistingSuccessfulResponse = (storeId, userRequest) => {
    const successfulResponses = findLocationById(storeId).successfulResponses;
    if (userRequest.mapOrSatellite === 'map') {
      return successfulResponses.filter(img =>
        img.mapZoom === userRequest.mapZoom);
    }
    if (userRequest.mapOrSatellite === 'satellite') {
      return successfulResponses.filter(img =>
        img.dateArray === userRequest.zoomInDegrees
      );
    }
  };

  const getExistingSuccessfulResponse = (storeId, imageId) => {

    const locationObject = findLocationById(storeId);
    return locationObject.successfulResponses.filter(img =>
      img.imageId === imageId);
  };

  const handleResponseStorage = (storeId, responseData) => {

    const locationObject = findLocationById(storeId);
    let newImageId = locationObject.imageId;
    locationObject.imageId++;
    if (responseData.mapOrSatellite === 'map') {
      const { mapOrSatellite, url, mapZoom } = responseData;
      newResponseObject = {
        newImageId,
        mapOrSatellite,
        url,
        mapZoom,
      };
      return addApiResponseToLocationObject(storeId, newResponseObject);
    }
    if (responseData.mapOrSatellite === 'satellite') {
      const { mapOrSatellite, url, dateArray, zoomInDegrees } = responseData;
      newResponseObject = {
        newImageId,
        mapOrSatellite,
        url,
        dateArray,
        zoomInDegrees
      };
      return addApiResponseToLocationObject(storeId, newResponseObject);
    };

  };

  const addApiResponseToLocationObject = (storeId, newResponseObj) => {

    const locationObject = findLocationById(storeId);
    locationObject.successfulResponses = [
      ...locationObject.successfulResponses,
      newResponseObj
    ];
    return newResponseObj;
  };

  return {
    state: [],
    requestId: 10,
    getCoordinates,
    pushToArray,
    findLocationById,
    Mock_DATA,
    seedData,
    handleResponseStorage,
    checkForExistingSuccessfulResponse,
    getExistingSuccessfulResponse,
  };

}());

