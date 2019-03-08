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
    const moreRecentDate =
      utils.goForwardInTimeOneMonth(dateArray);
    const newDateString = utils.dateToHyphenString(moreRecentDate);
    return [moreRecentDate, newDateString];
  }
  else {
    const fartherBackDate =
      utils.goBackInTimeOneMonth(dateArray);
    const newDateString = utils.dateToHyphenString(fartherBackDate);
    return [fartherBackDate, newDateString];
  }
}

function handleTimeTraversal(storeId, userRequest, direction) {
  const [previousSuccess] = store.getExistingSuccessfulResponse(storeId, userRequest.imageId);
  const { dateArray } = previousSuccess;
  let [newDateArray, dateString] = handleDateManipulation(dateArray, direction);
  const userRequestWithDate = Object.assign({}, userRequest, {
    dateArray: newDateArray
  });

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
        zoomInDegrees: .05
      };
      store.handleResponseStorage(storeId, responseData);
      return render();
    })
    .catch(() => {
      return handleErrors('date');
    });
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
  return [
    storeId,
    {
      imageId,
      mapOrSatellite: 'satellite',
    }];
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
  return [
    storeId, {
      mapOrSatellite: 'map',
      mapZoom: mapZoom + 2,
    }];
}

function generateErrorString(reset) {
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
  const { url, imageId } = newResponseObject;
  const {
    longitude,
    latitude,
  } = store.findLocationById(storeId);
  const errorString = generateErrorString();
  const htmlString = `
    <img class='nasa-map-image'
    value=${storeId} id=${imageId}
    src="${url}" alt="satellite image at longitude ${longitude}, latitude ${latitude}">
    <div class='error-container'>${errorString}</div>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location on a map!</span><button class='matching-map'>Get!</button><br>
    <button class='go-back'>Go back in time</button>
    <button class='go-forward'>Go forward in time</button>
    `;
  $('.nasa-results').html(htmlString);
  generateErrorString('nasa-reset');
};

const mapToDom = (storeId, newResponseObject) => {
  const {
    latitude,
    longitude,
  } = store.findLocationById(storeId);
  let { mapZoom, url } = newResponseObject;
  mapZoom = mapZoom - 2;
  $('.map-results').html(`
    <img class='map-image' value=${storeId} src='${url}' alt='map of the image to the left'>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location as a photo!</span><button class='matching-image'>Get!</button><br>
    <p>Resolution</p>
    <label for="Adjust">Adjust</label> <br>
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
    <span>Retrieve </span><button class='map-zoom-adjust'>Get New Map</button>
    `);
};

function render() {
  secretCoordinateForm.secretFormToDom();
  if (store.currentDisplay.currentSatelliteOnDom) {
    const storeId = store.currentDisplay.currentSatelliteOnDom.storeId;
    const imageId = store.currentDisplay.currentSatelliteOnDom.imageId;
    const [responseObject] = store.getExistingSuccessfulResponse(storeId, imageId);

    nasaImageToDom(storeId, responseObject);
  }

  if (store.currentDisplay.currentMapOnDom) {
    const storeId = store.currentDisplay.currentMapOnDom.storeId;
    const imageId = store.currentDisplay.currentMapOnDom.imageId;
    const [responseObject] = store.getExistingSuccessfulResponse(storeId, imageId);
    mapToDom(storeId, responseObject);
  }

  if (store.currentDisplay.currentAstronautOnDom) {
    const storeId = store.currentDisplay.currentAstronautOnDom.storeId;
    const imageId = store.currentDisplay.currentAstronautOnDom.imageId;
    const [responseObject] = store.getExistingSuccessfulResponse(storeId, imageId);
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
    zoomInDegrees: .05
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
  $('.nasa-results').on('click', '.go-back', function (event) {
    const [storeId, userRequest] = getStoreAndImageIds(event);
    handleTimeTraversal(storeId, userRequest, -1);
  });
};

const onRequestForLaterImage = () => {
  $('.nasa-results').on('click', '.go-forward', function (event) {
    const [storeId, userRequest] = getStoreAndImageIds(event);
    handleTimeTraversal(storeId, userRequest, 1);
  });
};

const onRequestForMatchingMap = function () {
  $('.nasa-results').on('click', '.matching-map', function () {
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
  $('.map-results').on('click', '.matching-image', function () {
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

const onMapZoomAdjust = () => {
  $('.map-results')
    .on('click',
      '.map-zoom-adjust', (event) => {
        const [storeId, userRequest] = getZoomValueAndStoreId(event);
        const [existingAsset] =
          store.checkForExistingSuccessfulResponse(storeId, userRequest);
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
  onIssBasedSatelliteImageRequest();
  onIssBasedMapRequest();
  onRequestForMatchingMap();
  onRequestForMatchingSatelliteImage();
  onRequestForEarlierImage();
  onRequestForLaterImage();
  onMapZoomAdjust();
  addFakeData();

};

export const events = {
  handleErrors,
  generateErrorString,
  handleNasaResponse,
  handleMapResponse,
  getlocationObjectFromStore,
  bindEventListeners,
  render
};



