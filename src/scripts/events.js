
import { utils } from './utils';
import { store } from './store';
import { api } from './api';

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

const getNewMapImage = function () {
  $('.button-container')
    .on('click', '.js-get-map', function () {
      let storeId;
      return api.getISSdata()
        .then(data => store.getCoordinates(data))
        .then(_id => {
          storeId = _id;
          const { mapCoordinates } = getlocationObjectFromStore(storeId);
          return api.getMapData(mapCoordinates, 5)
            .then(url => {
              const responseData = {
                mapOrSatellite: 'map',
                url,
                mapZoom: 5
              };
              const newResponseObject =
                store.handleResponseStorage(storeId, responseData);
              return mapToDom(storeId, newResponseObject);
            })
            .catch(err => console.log(err));
        });
    });
};

const getNewSatelliteImage = function () {
  $('.button-container')
    .on('click', '.js-get-data', function () {
      let storeId;
      return api.getISSdata()
        .then(data => store.getCoordinates(data))
        .then(_id => {
          storeId = _id;
          const { nasaCoordinates } = getlocationObjectFromStore(storeId);
          return api.getNasaImage(nasaCoordinates);
        })
        .then((res) => {
          const dateArray = utils.dateArrayFromString(res.date);
          const responseData = {
            mapOrSatellite: 'satellite',
            url: res.url,
            dateArray,
            zoomInDegrees: .05
          };
          debugger;

          const newResponseObject = store.handleResponseStorage(storeId, responseData);
          return nasaImageToDom(storeId, newResponseObject);
        })
        .catch(err => {
          console.log(err);
          nasaImageToDom(storeId, err);
          const { mapCoordinates } = getlocationObjectFromStore(storeId);
          return api.getMapData(mapCoordinates, 4)
            .then(url => {

              const responseData = {
                mapOrSatellite: 'map',
                url,
                mapZoom: 4
              };
              const newResponseObject =
                store.handleResponseStorage(storeId, responseData);
              return mapToDom(storeId, newResponseObject);
            })
            .catch(err => console.log(err));
        });
    });
};

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

const getEarlierImage = () => {
  $('.nasa-results').on('click', '.go-back', function (event) {
    const [storeId, userRequest] = getStoreAndImageIds(event);
    handleTimeTraversal(storeId, userRequest, -1);
  });
};

const getLaterImage = () => {
  $('.nasa-results').on('click', '.go-forward', function (event) {
    const [storeId, userRequest] = getStoreAndImageIds(event);
    handleTimeTraversal(storeId, userRequest, 1);
  });
};

function handleTimeTraversal(storeId, userRequest, direction) {
  const [previousSuccess] = store.getExistingSuccessfulResponse(storeId, userRequest.imageId);
  const { dateArray } = previousSuccess;
  let [newDateArray, dateString] = handleDateManipulation(dateArray, direction);
  const userRequestWithDate = Object.assign({}, userRequest, {
    dateArray: newDateArray
  });
  const [existingAsset] =
    store.checkForExistingSuccessfulResponse(storeId, userRequestWithDate);
  if (existingAsset) {
    console.log('Got this image from local storage');
    return nasaImageToDom(storeId, existingAsset);
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
      const newResponseObject = store.handleResponseStorage(storeId, responseData);
      return nasaImageToDom(storeId, newResponseObject);
    })
    .catch(err => console.log(err));
};

function getmatchingSatelliteImage() {
  $('.map-results').on('click', '.matching-image', function () {
    const storeId = parseInt($(this).siblings('img.map-image').attr('value'));
    const { nasaCoordinates } = getlocationObjectFromStore(storeId);
    return api.getNasaImage(nasaCoordinates)
      .then((res) => {
        const dateArray = utils.dateArrayFromString(res.date);
        const responseData = {
          mapOrSatellite: 'satellite',
          url: res.url,
          dateArray,
          zoomInDegrees: .05
        };

        const newResponseObject = store.handleResponseStorage(storeId, responseData);
        return nasaImageToDom(storeId, newResponseObject);
      })
      .catch(err => {
        console.log(err);
      });
  });
};
const getMatchingMap = function () {
  $('.nasa-results').on('click', '.matching-map', function () {
    const storeId = parseInt($('.matching-map').siblings('img.nasa-map-image').attr('value'));
    const { mapCoordinates } = getlocationObjectFromStore(storeId);
    return api.getMapData(mapCoordinates, 5)
      .then(url => {
        const responseData = {
          mapOrSatellite: 'map',
          url,
          mapZoom: 5
        };
        const newResponseObject =
          store.handleResponseStorage(storeId, responseData);
        return mapToDom(storeId, newResponseObject);
      })
      .catch(err => console.log(err));
  });
};

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
    storeId,
    {
      mapOrSatellite: 'map',
      mapZoom: mapZoom + 2,
    }];
}

const adjustZoomOnMap = () => {
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
            const responseData = {
              mapOrSatellite: 'map',
              url,
              mapZoom: userRequest.mapZoom
            };
            const newResponseObject =
              store.handleResponseStorage(storeId, responseData);
            return mapToDom(storeId, newResponseObject);
          })
          .catch(err => console.log(err));
      });
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

const nasaImageToDom = function (storeId, newResponseObject) {
  const { url, imageId } = newResponseObject;
  const {
    longitude,
    latitude,
  } = store.findLocationById(storeId);
  console.log(newResponseObject);

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

const addFakeData = function () {
  $('.button-container').on('click', '.test-data', function () {
    let storeId = store.seedData();
    const { nasaCoordinates } = getlocationObjectFromStore(storeId);
    return api.getNasaImage(nasaCoordinates)
      .then((res) => {
        const dateArray = utils.dateArrayFromString(res.date);
        const responseData = {
          mapOrSatellite: 'satellite',
          url: res.url,
          dateArray,
          zoomInDegrees: .05
        };
        let newResponseObject = store.handleResponseStorage(storeId, responseData);
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
  getNewSatelliteImage();
  getNewMapImage();
  getMatchingMap();
  getmatchingSatelliteImage();
  getEarlierImage();
  getLaterImage();
  adjustZoomOnMap();
  addFakeData();
};

export const events = {
  bindEventListeners
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