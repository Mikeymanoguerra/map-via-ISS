
const seedData = function () {
  const data = {
    iss_position: { longitude: "-122.4194", latitude: "37.7749" }
  };
  return getCoordinates(data);
};

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
  store.requestId++;
  return freshlocation.id;
};

const buildLocationObject = function (
  nasaCoordinates,
  mapCoordinates,
  longitude,
  latitude,
  zoomInDegrees = 0.05) {
  const locationObject = {
    id: store.requestId,
    nasaCoordinates,
    zoomInDegrees,
    mapCoordinates,
    longitude,
    latitude,
    imageIdCount: 1,
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

const addApiResponseToLocationObject = (storeId, newResponseObj) => {
  const locationObject = findLocationById(storeId);
  locationObject.successfulResponses = [
    ...locationObject.successfulResponses,
    newResponseObj
  ];
  return newResponseObj;
};

const handleSecretFormToggle = () => {
  store.secretForm = !store.secretForm;
};

export const store = {
  state: [],
  requestId: 10,
  secretForm: false,
  getCoordinates,
  pushToArray,
  findLocationById,
  seedData,
  handleResponseStorage,
  checkForExistingSuccessfulResponse,
  getExistingSuccessfulResponse,
  handleSecretFormToggle



