
const seedData = function () {
  const data = {
    iss_position: { longitude: "-122.4194", latitude: "37.7749" }
  };
  return parseCoordinatesAndGetStoreId(data);
};


const buildCoordinateStrings = (responseData) => {
  const latitude = responseData['iss_position'].latitude;
  const longitude = responseData['iss_position'].longitude;
  const nasaCoordinates = `lon=${longitude}&lat=${latitude}`;
  const mapCoordinates = `${latitude},${longitude}`;
  return [latitude, longitude, nasaCoordinates, mapCoordinates];
};

const buildLocationObject = function (coordinateStringArray) {
  const [latitude, longitude, nasaCoordinates, mapCoordinates] = coordinateStringArray;
  const locationObject = {
    storeId: store.requestId,
    nasaCoordinates,
    zoomInDegrees: 0.05,
    mapCoordinates,
    longitude,
    latitude,
    imageIdCount: 1,
    successfulResponses: []
  };
  return locationObject;
};

const parseCoordinatesAndGetStoreId = function (responseData) {
  const coordinateStringArray = buildCoordinateStrings(responseData);
  const freshlocation = buildLocationObject(coordinateStringArray);
  pushToArray(freshlocation);
  store.requestId++;
  return freshlocation.storeId;
};

const pushToArray = function (obj) {
  store.state.push(obj);
};

const findLocationById = function (storeId) {
  return store.state.find(location => {
    if (storeId === location.storeId) {
      return location;
    }
  });
};

const checkForExistingSuccessfulResponse = (store
  
  
  , userRequest) => {
  const locationObject = findLocationById(storeId);
  if (userRequest.mapOrSatellite === 'map') {
    return locationObject.successfulResponses.filter(item =>
      item.mapZoom === userRequest.mapZoom);
  }
  if (userRequest.mapOrSatellite === 'satellite') {
    return locationObject.successfulResponses.filter(item =>
      item.dateArray === userRequest.dateArray
      // this will never work;
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
  let imageId = locationObject.imageIdCount;
  locationObject.imageIdCount++;
  if (responseData.mapOrSatellite === 'map') {
    const { mapOrSatellite, url, mapZoom } = responseData;
    let newResponseObject = {
      imageId,
      mapOrSatellite,
      url,
      mapZoom,
    };
    return addApiResponseToLocationObject(storeId, newResponseObject);
  }
  if (responseData.mapOrSatellite === 'satellite') {
    const { mapOrSatellite, url, dateArray, zoomInDegrees } = responseData;
    let newResponseObject = {
      imageId,
      mapOrSatellite,
      url,
      dateArray,
      zoomInDegrees
    };
    return addApiResponseToLocationObject(storeId, newResponseObject);
  }
};

const addApiResponseToLocationObject = (storeId, newResponseObject) => {
  const locationObject = findLocationById(storeId);
  locationObject.successfulResponses = [
    ...locationObject.successfulResponses,
    newResponseObject
  ];
  return updateCurrentDisplay(storeId, newResponseObject);
};

const updateCurrentDisplay = (storeId, newResponseObject) => {
  if (newResponseObject.mapOrSatellite === 'map') {
    store.currentDisplay = Object.assign({}, store.currentDisplay, {
      currentMapOnDom: {
        storeId,
        imageId: newResponseObject.imageId
      }
    });
  }
  if (newResponseObject.mapOrSatellite === 'satellite') {
    store.currentDisplay = Object.assign({}, store.currentDisplay, {
      currentSatelliteOnDom: {
        storeId,
        imageId: newResponseObject.imageId
      }
    });
  }
};

const handleSecretFormToggle = () => {
  store.secretForm = !store.secretForm;
};

export const store = {
  state: [],
  currentDisplay: {},
  requestId: 10,
  secretForm: false,
  parseCoordinatesAndGetStoreId,
  pushToArray,
  findLocationById,
  seedData,
  handleResponseStorage,
  checkForExistingSuccessfulResponse,
  getExistingSuccessfulResponse,
  handleSecretFormToggle,
  updateCurrentDisplay

};

