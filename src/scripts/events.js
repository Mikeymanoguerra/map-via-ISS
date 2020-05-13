/* eslint-disable no-undef */
/* eslint-disable no-console,  */

import { utils } from './utils';
import { store } from './store';
import { api } from './api';
import { secretCoordinateForm } from './secret-coordinate-form';

function getlocationObjectFromStore(storeId) {
  return store.findLocationById(storeId);
}

function handleDateManipulation(dateArray, direction) {
  if (direction === 1) {
    const moreRecentDate = utils.goForwardInTimeOneMonth(dateArray);
    const newDateString = utils.dateToHyphenString(moreRecentDate);
    return [moreRecentDate, newDateString];
  }

  else {
    const fartherBackDate = utils.goBackInTimeOneMonth(dateArray);
    const newDateString = utils.dateToHyphenString(fartherBackDate);
    return [fartherBackDate, newDateString];
  }
}

function handleTimeTraversal(storeId, userRequest, direction) {
  const previousSuccess = store.getExistingSuccessfulResponse(storeId, userRequest.imageId);
  const { dateArray } = previousSuccess;
  let [newDateArray, dateString] = handleDateManipulation(dateArray, direction);
  const userRequestWithDate = {
    ...userRequest,
    dateArray: newDateArray
  };

  // TODO, Pull below code out, once this works
  const [existingAsset] =
    store.checkForExistingSuccessfulResponse(storeId, userRequestWithDate);
  if (existingAsset) {
    console.log('Got this image from local storage');
    store.updateCurrentDisplay(storeId, existingAsset);
    return render();
    //  if imageId == current image ID, css notice.
  }

  const { nasaCoordinates } = getlocationObjectFromStore(storeId);
  return api.getNasaImage(nasaCoordinates, dateString)
    .then((res) => {
      const responseData = {
        mapOrSatellite: 'satellite',
        url: res.url,
        dateArray: [...newDateArray],
        zoomInDegrees: res.zoomInDegrees ? res.zoomInDegrees : '0.1'
      };
      store.handleResponseStorage(storeId, responseData);
      return render();
    })
    .catch(() => {
      return handleErrors('date');
    });
}


function getDegreeValueAndStoreId(event) {
  const storeId = parseInt(
    $(event.currentTarget)
      .siblings('img.nasa-map-image')
      .attr('value'));
  const imageId = parseInt(
    $(event.currentTarget)
      .siblings('img.nasa-map-image')
      .attr('id'));
  const zoomInDegrees =
    $(event.currentTarget)
      .siblings('input[name=degree]:checked')
      .val();
  return [
    storeId, imageId, {
      mapOrSatellite: 'satellite',
      zoomInDegrees
    }];
}

function getStoreAndImageIds(event) {
  const storeId = parseInt(
    $(event.currentTarget)
      .siblings('img.nasa-map-image')
      .attr('value'));
  const imageId = parseInt(
    $(event.currentTarget)
      .siblings('img.nasa-map-image')
      .attr('id'));

  return {
    storeId,
    userRequest: {
      imageId,
      mapOrSatellite: 'satellite',
    }
  };
}

function getZoomValueAndStoreId(event) {
  const storeId = parseInt(
    $(event.currentTarget)
      .siblings('img.map-image')
      .attr('value'));
  const mapZoom = parseInt(
    $(event.currentTarget)
      .siblings('input.map-zoom-range')
      .val());

  return {
    storeId,
    userRequest: {
      mapOrSatellite: 'map',
      mapZoom: mapZoom + 2,
    }
  };
}

function generateErrorString(reset = null) {
  if (reset) {
    return store.handleErrorMessage(reset);
  }

  if (store.formError) {
    const errorMessage = store.formError;
    return `<p>${errorMessage}</p>`;
  }

  if (store.nasaError) {
    const errorMessage = store.nasaError;
    return `<p>${errorMessage}</p>`;
  }

  if (store.formValidationError) {
    const errorMessage = store.formValidationError;
    return `<p>${errorMessage}</p>`;
  }

  return `<p></p>`;
}

const nasaImageToDom = function (storeId, newResponseObject) {
  const { url, imageId, dateArray, zoomInDegrees } = newResponseObject;
  const { longitude, latitude } = store.findLocationById(storeId);

  let checkedClose, checkedMedium, checkedWide, checkedSuper;
  zoomInDegrees === '.05' ? checkedClose = 'checked' : '';
  zoomInDegrees === '0.1' ? checkedMedium = 'checked' : '';
  zoomInDegrees === '0.5' ? checkedWide = 'checked' : '';
  zoomInDegrees === '1.0' ? checkedSuper = 'checked' : '';

  const errorString = generateErrorString();
  const htmlString = `
  <div class='nasa-results'>
    <img class='nasa-map-image'
    value=${storeId} id=${imageId}
    src="${url}" alt="satellite image at longitude ${longitude}, latitude ${latitude}">
    <div class='error-container'>${errorString}</div>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location on a map!</span><button id='adjust-button' class='matching-map'>Get!</button><br>
    <p>Approximate date of Photo: ${dateArray[1]}-${dateArray[2]}-${dateArray[0]} </p>
    <button id='adjust-button'class='go-back'>Go back in time</button>
    <button id='adjust-button' class='go-forward'>Go forward in time</button>
   <br>
    <label for="radio">Adjust Resolution</label> <br>

    <input type="radio"name='degree' class="nasa-degree-range" ${checkedClose} value=".05" name="degree">
    <label for="radio">Close up </label> <br>
    <input type="radio" name='degree'class="nasa-degree-range" ${checkedMedium} value="0.1" name="degree">
    <label for="radio">Medium  </label><br>
    <input type="radio" name='degree'class="nasa-degree-range" ${checkedWide} value="0.5" name="degree">
    <label for="radio">Wide Angle  </label><br>
    <input type="radio" name='degree'class="nasa-degree-range" ${checkedSuper} value="1.0" name="degree">
    <label for="radio">Super Wide Angle  </label><br>
    <button id='adjust-button' class='nasa-degree-adjust'>Get updated Resolution</button>
    </div>
    `;
  $('.nasa-container').html(htmlString);
  generateErrorString('nasa-reset');
};

const mapToDom = (storeId, newResponseObject) => {
  const {
    latitude,
    longitude,
  } = store.findLocationById(storeId);
  let { mapZoom, url } = newResponseObject;
  mapZoom = mapZoom - 2;
  $('.map-container').html(`
  <div class='map-results'>
    <img class='map-image' value=${storeId} src='${url}' alt='map of the image to the left'>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location as a photo!</span><button id='adjust-button' class='matching-image'>Get!</button><br>
    <br>
    <br>
    <br>
    <br>
    <label for="Adjust">Adjust Resolution</label> <br>
    <span> Zoom out </span>
    <input type="range" class="map-zoom-range" name="Adjust" list='tickmarks' value='${mapZoom}'
    min="1" max="15">
    <span> Zoom in </span>
    <datalist id="tickmarks">
       <option value="1" label="1">
       <option value="2">
       <option value="3">
       <option value="4">
       <option value="5" label="5">
       <option value="6">
       <option value="7">
       <option value="8">
       <option value="9">
       <option value="10" label="10">
       <option value="11">
       <option value="12">
       <option value="13">
       <option value="14">
       <option value="15" label="15">
    </datalist>
    <br>
    <span>Retrieve </span><button id='adjust-button' class='map-zoom-adjust'>Get New Map</button>
    </div>
    `);
};

function render() {
  secretCoordinateForm.secretFormToDom();
  if (store.currentDisplay.currentSatelliteOnDom) {
    const storeId = store.currentDisplay.currentSatelliteOnDom.storeId;
    const imageId = store.currentDisplay.currentSatelliteOnDom.imageId;
    const responseObject = store.getExistingSuccessfulResponse(storeId, imageId);

    nasaImageToDom(storeId, responseObject);
  }

  if (store.currentDisplay.currentMapOnDom) {
    const storeId = store.currentDisplay.currentMapOnDom.storeId;
    const imageId = store.currentDisplay.currentMapOnDom.imageId;
    const responseObject = store.getExistingSuccessfulResponse(storeId, imageId);
    mapToDom(storeId, responseObject);
  }

  if (store.currentDisplay.currentAstronautOnDom) {
    const storeId = store.currentDisplay.currentAstronautOnDom.storeId;
    const imageId = store.currentDisplay.currentAstronautOnDom.imageId;
    const responseObject = store.getExistingSuccessfulResponse(storeId, imageId);
    secretCoordinateForm.astronautToDom(storeId, responseObject);
  }

  if (store.formValidationError) {
    secretCoordinateForm.validationErrorToDom();
  }
}

function handleNasaResponse(storeId, res, mapOrSatellite = 'satellite') {
  const dateArray = utils.dateArrayFromString(res.date);
  const responseData = {
    mapOrSatellite,
    url: res.url,
    dateArray,
    zoomInDegrees: res.zoomInDegrees ? res.zoomInDegrees : '0.1'
  };
  store.handleResponseStorage(storeId, responseData);
}

function handleMapResponse(storeId, url, mapZoom = 5) {
  const responseData = {
    mapOrSatellite: 'map',
    url,
    mapZoom
  };
  store.handleResponseStorage(storeId, responseData);
}

function handleISSRequest() {
  return api.getISSdata()
    .then(data => {
      const storeId = store.parseCoordinatesAndGetStoreId(data);
      return storeId;
    });
}

const handleErrors = function (errorType) {
  store.handleErrorMessage(errorType);
  return store.chooseRandomIslandFromMemory(errorType)
    .then(() => {
      return render();
    });
};

const onIssBasedSatelliteImageRequest = function () {
  $('.button-container').on('click', '.js-get-data', function () {
    let storeId;
    return handleISSRequest()
      .then(_storeId => {
        storeId = _storeId;
        const { nasaCoordinates } = getlocationObjectFromStore(storeId);
        return api.getNasaImage(nasaCoordinates);
      })
      .then((res) => {
        handleNasaResponse(storeId, res);
        return render();
      })
      .catch(() => {
        return handleErrors('nasa-water');
      });
  });
};

const onRequestForEarlierImage = () => {
  $('.nasa-container').on('click', '.go-back', function (event) {
    const { storeId, userRequest } = getStoreAndImageIds(event);
    handleTimeTraversal(storeId, userRequest, -1);
  });
};

const onRequestForLaterImage = () => {
  $('.nasa-container').on('click', '.go-forward', function (event) {
    const { storeId, userRequest } = getStoreAndImageIds(event);
    handleTimeTraversal(storeId, userRequest, 1);
  });
};

const onRequestForMatchingMap = function () {
  $('.nasa-container').on('click', '.matching-map', function () {
    const storeId = parseInt($(this).siblings('img.nasa-map-image').attr('value'));
    const { mapCoordinates } = getlocationObjectFromStore(storeId);

    return api.getMapData(mapCoordinates, 5)
      .then(url => {
        handleMapResponse(storeId, url);

        return render();
      })
      .catch(err => console.log(err));
  });
};

function onRequestForMatchingSatelliteImage() {
  $('.map-container').on('click', '.matching-image', function () {
    const storeId = parseInt($(this).siblings('img.map-image').attr('value'));
    const { nasaCoordinates } = getlocationObjectFromStore(storeId);

    return api.getNasaImage(nasaCoordinates)
      .then((res) => {
        handleNasaResponse(storeId, res);

        return render();
      })
      .catch(() => {
        return handleErrors('nasa-water');
      });
  });
}

const onIssBasedMapRequest = function () {
  $('.button-container').on('click', '.js-get-map', function () {
    let storeId;

    return handleISSRequest()
      .then(_storeId => {
        storeId = _storeId;
        const { mapCoordinates } = getlocationObjectFromStore(storeId);

        return api.getMapData(mapCoordinates, 5);
      })
      .then(url => {
        handleMapResponse(storeId, url);
        return render();
      })
      .catch(err => console.log(err));
  });
};


const onImageZoomAdjust = () => {
  $('.nasa-container').on('click', '.nasa-degree-adjust', function (event) {
    //  get the store Id and the user request
    const [storeId, imageId, userRequest] = getDegreeValueAndStoreId(event);
    // TODO: check for existing response. still need to check for Date array equality first
    const { nasaCoordinates, successfulResponses } = getlocationObjectFromStore(storeId);
    const dateArray = successfulResponses[imageId].dateArray;
    const dateString = utils.dateToHyphenString(dateArray);

    return api.getNasaImage(nasaCoordinates, dateString, userRequest.zoomInDegrees)
      .then((res) => {
        res.zoomInDegrees = userRequest.zoomInDegrees;
        handleNasaResponse(storeId, res);

        return render();
      })
      .catch(() => {
        return handleErrors('nasa-water');
      });
  });
};

const onMapZoomAdjust = () => {
  $('.map-container').on('click', '.map-zoom-adjust', (event) => {
    const { storeId, userRequest } = getZoomValueAndStoreId(event);
    const [existingAsset] = store.checkForExistingSuccessfulResponse(storeId, userRequest);

    if (existingAsset) {
      console.log('Got this image from local storage');
      return mapToDom(storeId, existingAsset);
      //  if imageId == current image ID, css notice.
    }

    const { mapCoordinates } = getlocationObjectFromStore(storeId);

    return api.getMapData(mapCoordinates, userRequest.mapZoom)
      .then(url => {
        handleMapResponse(storeId, url, userRequest.mapZoom);

        return render();
      })
      .catch(err => console.log(err));
  });
};

const bindEventListeners = () => {
  onMapZoomAdjust();
  onImageZoomAdjust();
  onIssBasedMapRequest();
  onRequestForLaterImage();
  onRequestForMatchingMap();
  onRequestForEarlierImage();
  onIssBasedSatelliteImageRequest();
  onRequestForMatchingSatelliteImage();
};

export const events = {
  render,
  handleErrors,
  handleMapResponse,
  handleNasaResponse,
  bindEventListeners,
  generateErrorString,
  getlocationObjectFromStore,
};



