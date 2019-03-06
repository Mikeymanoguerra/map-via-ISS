/* eslint-disable no-undef */
/* eslint-disable no-console,  */


import { utils } from './utils';
import { store } from './store';
import { api } from './api';
// import { secretCoordinateForm } from './secret-coordinate-form';

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
    .catch(err => console.log(err));
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

const nasaImageToDom = function (storeId, newResponseObject) {
  const { url, imageId } = newResponseObject;
  const {
    longitude,
    latitude,
  } = store.findLocationById(storeId);
  const htmlString = `
    <img class='nasa-map-image'
    value=${storeId} id=${imageId}
    src="${url}" alt="satellite image at longitude ${longitude}, latitude ${latitude}">
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location on a map!</span><button class='matching-map'>Get!</button><br>
    <button class='go-back'>Go back in time</button>
    <button class='go-forward'>Go forward in time</button>
    `;
  $('.nasa-results').html(htmlString);
};

const mapToDom = (storeId, newResponseObject) => {
  const {
    latitude,
    longitude,
  } = store.findLocationById(storeId);
  let { mapZoom, url } = newResponseObject;
  mapZoom = mapZoom - 2;
  console.log(newResponseObject);
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
  console.log(store.currentDisplay);
  if (store.secretForm) {
    // get form.storeId and form.imageId
    // call a function that builds formHtmlString
    // insert that string into dom
  }
  if (store.currentDisplay.currentSatelliteOnDom) {
    const storeId = store.currentDisplay.currentSatelliteOnDom.storeId;
    const imageId = store.currentDisplay.currentSatelliteOnDom.imageId;
    const [responseObject] = store.getExistingSuccessfulResponse(storeId, imageId);
    return nasaImageToDom(storeId, responseObject);
  }

  if (store.currentDisplay.currentMapOnDom) {
    const storeId = store.currentDisplay.currentMapOnDom.storeId;
    const imageId = store.currentDisplay.currentMapOnDom.imageId;
    const [responseObject] = store.getExistingSuccessfulResponse(storeId, imageId);
    return mapToDom(storeId, responseObject);
  }
}

function handleNasaResponse(storeId, res) {
  const dateArray = utils.dateArrayFromString(res.date);
  const responseData = {
    mapOrSatellite: 'satellite',
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

const onIssBasedSatelliteImageRequest = function () {
  $('.button-container').on('click', '.js-get-data', function () {
    return handleISSRequest()
      .then(storeId => {
        const { nasaCoordinates } = getlocationObjectFromStore(storeId);
        return api.getNasaImage(nasaCoordinates)
          .then((res) => {
            handleNasaResponse(storeId, res);
            return render();
          });
      })
      .catch(err => {

        console.log(err);
        nasaImageToDom(storeId, err);
        const { mapCoordinates } = getlocationObjectFromStore(storeId);
        return api.getMapData(mapCoordinates, 4)
          .then(url => {
            handleMapResponse(storeId, url);
            return render();
          })
          .catch(err => console.log(err));
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
      .catch(err => {
        nasaImageToDom(storeId, err);
        console.log(err);
      });
  });
}

const onIssBasedMapRequest = function () {
  $('.button-container').on('click', '.js-get-map', function () {
    return handleISSRequest()
      .then(storeId => {
        const { mapCoordinates } = getlocationObjectFromStore(storeId);
        return api.getMapData(mapCoordinates, 5)
          .then(url => {
            handleMapResponse(storeId, url);
            return render();
          })
          .catch(err => console.log(err));
      });
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

const addFakeData = function () {
  $('.button-container').on('click', '.test-data', function () {
    let storeId = store.seedData();
    const { nasaCoordinates } = getlocationObjectFromStore(storeId);
    return api.getNasaImage(nasaCoordinates)
      .then((res) => {
        const newResponseObject = handleNasaResponse(storeId, res);
        return nasaImageToDom(storeId, newResponseObject);
      })
      .catch(err => {
        console.log(err);
        nasaImageToDom(storeId, err);
        const { mapCoordinates } = getlocationObjectFromStore(storeId);
        return api.getMapData(mapCoordinates, 4)
          .then(data => mapToDom(storeId, data))
          .catch(err => console.log(err));
      });
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
  bindEventListeners,
  render
};

// when the button is clicked, use the Open Notify Api to get coordinates of ISS
// give button a couple second timeout
//  event listener for button click
// can the local store maintain the photos?



// function getImageSatteliteVal(){
//    return parseInt($('.go-forward').siblings('img.map-image').attr('value'));
// }

//   function handleGoForward(){
//       id = getImageSatteliteVal();
//       const originalLocation = store.findLocationById(id);

//   }

     // TODO error immage;