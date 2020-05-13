import { api } from "./api";
import { events } from "./events";

const buildLocationObject = (responseData) => {
  let latitude = Math.round(responseData.latitude * 10000) / 10000;
  let longitude = Math.round(responseData.longitude * 10000) / 10000;

  const nasaCoordinates = `lon=${longitude}&lat=${latitude}`;
  const mapCoordinates = `${latitude},${longitude}`;

  return {
    latitude,
    longitude,
    mapCoordinates,
    nasaCoordinates,
    imageIdCount: 0,
    successfulResponses: [],
    storeId: store.requestId,
  }
};

const parseCoordinatesAndGetStoreId = function (responseData) {
  const freshlocation = buildLocationObject(responseData);
  store.state.push(freshlocation);
  store.requestId++;

  return freshlocation.storeId;
};

const findLocationById = function (storeId) {
  return store.state.find(location => {
    if (storeId === location.storeId) {
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
    img.imageId === imageId)[0];
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

  if (responseData.mapOrSatellite === 'satellite' ||
    responseData.mapOrSatellite === 'spacewalk') {
    const { mapOrSatellite, url, dateArray, zoomInDegrees } = responseData;
    let newResponseObject = {
      url,
      imageId,
      dateArray,
      zoomInDegrees,
      mapOrSatellite,
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
  const assetType = newResponseObject.mapOrSatellite.slice(0, 1).toUpperCase().concat(newResponseObject.mapOrSatellite.slice(1))
  const key = `current${assetType}OnDom`

  store.currentDisplay = {
    ...store.currentDisplay,
    [key]: {
      storeId,
      imageId: newResponseObject.imageId
    }
  };
};

const toggleSecretForm = () => {
  store.secretForm = !store.secretForm;
};

const handleErrorMessage = (errorType = null) => {
  if (errorType === 'nasa-water') {
    store.nasaError = `The ISS is probably over water,
    and there is not a corresponding LandSat 8 photo.
    Enjoy A Randomly chosen island photo`;
  }

  if (errorType === 'nasa-date') {
    store.nasaError = `There is no LandSat 8 photo from this time perio.
    Explore in the other direction.`;
  }

  if (errorType === 'form-water') {
    store.formError = `The ISS is probably over water,
    and there is not a corresponding LandSat 8 photo.
    Enjoy A Randomly chosen island photo`;
  }

  if (errorType === 'form-input-length') {
    store.formValidationError = '10 characters or less please!';
  }

  if (errorType === 'form-characters') {
    store.formValidationError = 'Decimal degrees only include 0-9, periods, and minus sign.';
  }

  if (errorType === 'form-500') {
    store.formError = '500 error from server. try again later!';
  }

  if (errorType === 'nasa-500') {
    store.nasaError = '500 error from server. try again later!';
  }

  if (errorType === 'form-reset') {
    store.formError = null;
    store.formValidationError = null;
  }

  if (errorType === 'nasa-reset') store.nasaError = null;
};

const chooseRandomIslandFromMemory = (errorType) => {
  const storeId = Math.floor(Math.random() * 9 + 1);
  const { nasaCoordinates } = findLocationById(storeId);

  const errorLocation = errorType.slice(0, 4);
  const mapOrSatellite = errorLocation === 'form' ? 'spacewalk' : 'satellite';


  return api.getNasaImage(nasaCoordinates)
    .then(res => {
      return events.handleNasaResponse(storeId, res, mapOrSatellite);
    })
    .catch(() => {
      const errorType = `${errorLocation}-500`;
      handleErrorMessage(errorType);

      return events.render();
    });
};

const ERROR_REDIRECTS = [
  {
    imageIdCount: 0,
    latitude: "0.3113",
    longitude: "-89.9557",
    mapCoordinates: "0.3113,-89.9557",
    nasaCoordinates: "lon=-89.9557&lat=0.3113",  // TODO practice 500 error here
    storeId: 1,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "41.6658",
    longitude: "-70.6562",
    mapCoordinates: "41.6658,-70.6562",
    nasaCoordinates: "lon=-70.6562&lat=41.6658",
    storeId: 2,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "-27.1127",
    longitude: "-109.3997",
    mapCoordinates: "-27.1127,-109.3997",
    nasaCoordinates: "lon=-109.3997&lat=-27.1127",
    storeId: 3,
    successfulResponses: [],
    zoomInDegrees: 0.10,
  },
  {
    imageIdCount: 0,
    latitude: "-27.1258",
    longitude: "-109.2769",
    mapCoordinates: "-27.1258,-109.2769",
    nasaCoordinates: "lon=-109.2769&lat=-27.1258",
    storeId: 4,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "43.0646",
    longitude: "141.2468",
    mapCoordinates: "43.0646,141.2468",
    nasaCoordinates: "lon=141.2468&lat=43.0646",
    storeId: 5,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "52.0602",
    longitude: "177.5736",
    mapCoordinates: "52.0602,177.5736",
    nasaCoordinates: "lon=177.5736&lat=52.0602",
    storeId: 6,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "37.6989",
    longitude: "-123.0034",
    mapCoordinates: "37.6989,-123.0034",
    nasaCoordinates: "lon=-123.0034&lat=37.6989",
    storeId: 7,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "20.5523",
    longitude: "-156.5511",
    mapCoordinates: "20.5523,-156.5511",
    nasaCoordinates: "lon=-156.5511&lat=20.5523",
    storeId: 8,
    successfulResponses: [],
    zoomInDegrees: 0.10
  },
  {
    imageIdCount: 0,
    latitude: "24.5551",
    longitude: "-81.7800",
    mapCoordinates: "24.5551,-81.7800",
    nasaCoordinates: "lon=-81.7800&lat=24.5551",
    storeId: 9,
    successfulResponses: [],
    zoomInDegrees: 0.10
  }
];

export const store = {
  requestId: 10,
  nasaError: null,
  formError: null,
  secretForm: false,
  currentDisplay: {},
  formValidationError: null,
  state: [...ERROR_REDIRECTS],
  findLocationById,
  toggleSecretForm,
  handleErrorMessage,
  updateCurrentDisplay,
  handleResponseStorage,
  chooseRandomIslandFromMemory,
  getExistingSuccessfulResponse,
  parseCoordinatesAndGetStoreId,
  checkForExistingSuccessfulResponse,
};



/**
 * {imageIdCount: 0,
latitude: "41.6688",
longitude: "-122.4194",
mapCoordinates: "41.6688,-122.4194",
nasaCoordinates: "lon=-122.4194&lat=41.6688",
storeId: 10,
successfulResponses: [],
zoomInDegrees: 0.10}
 */
