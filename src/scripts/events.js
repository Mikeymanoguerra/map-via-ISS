
import { utils } from './utils';

window.events = (function () {
  // when the button is clicked, use the Open Notify Api to get coordinates of ISS
  // give button a couple second timeout

  const getfirstImage = function () {
    $('.button-container')
      .on('click',
        '.js-get-data',
        function () {
          let id;
          let location;
          return api.getISSdata()
            .then(data => store.getCoordinates(data))
            .then(_id => {
              id = _id;
              location =
                store.findLocationById(id);
              const coors =
                location.nasaCoordinates;
              return api.getNasaImage(coors);
            })
            .then((data) => nasaImageToDom(data, id))
            .catch(err => {
              console.log(err);
              nasaImageToDom(err, id);
              // TODO error immage;
              const coors =
                location.mapCoordinates;
              return api.getMapData(coors, 4)
                .then(data => mapToDom(data, id))
                .catch(err => console.log(err));
            });
        });
  };

  const getEarlierImage = () => {
    let id;
    $('.nasa-results').on('click', '.go-back', function () {
      const _id = parseInt($('.go-back').siblings('img.satellite').attr('value'));
      id = _id;
      const location = store.findLocationById(id);
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
    $('.nasa-results').on('click', '.go-forward', function () {
      const id = parseInt($('.go-forward').siblings('img.satellite').attr('value'));
      const originalLocation = store.findLocationById(id);
      const location = Object.assign({}, originalLocation);
      const coors = location.nasaCoordinates;
      const oneMonthEarlierArray = utils.goForwardInTimeOneMonth(location.date);
      console.log(oneMonthEarlierArray);
      location.date = oneMonthEarlierArray;
      const dateString = utils.dateToHyphenString(oneMonthEarlierArray);
      return api.getNasaImage(coors, dateString)
        .then((data) => nasaImageToDom(data, id))
        .catch(err => console.log(err));
    });
  };

// function getImageSatteliteVal(){
//    return parseInt($('.go-forward').siblings('img.satellite').attr('value'));
// }

//   function handleGoForward(){
//       id = getImageSatteliteVal();
//       const originalLocation = store.findLocationById(id);

//   }


  const getMap = function () {
    $('.nasa-results').on('click', '.matching-map', function () {
      const id = parseInt($('.matching-map').siblings('img.satellite').attr('value'));
      const location = store.findLocationById(id);
      const coors = location.mapCoordinates;
      return api.getMapData(coors)
        .then(data => {
          return mapToDom(data, id);
        })
        .catch(err => console.log(err));
    });
  };

  const adjustZoomOnMap = () => {
    let id;
    let zoom;
    $('.map-results')
      .on('click',
        '.zoom-adjust',
        function () {
          const _id = parseInt(
            $('.zoom-adjust')
              .siblings('img.map')
              .attr('value'));
          const _zoom = parseInt(
            $('.zoom-adjust')
              .siblings('input.zoom-range')
              .val());
          id = _id;
          zoom = _zoom + 2;
          const location =
            store.findLocationById(id);
          const coors =
            location.mapCoordinates;
          if (zoom === location.mapZoom)
            return; // TODO show CSS stopp, flash red shadow
          location.mapZoom = zoom;
          return api.getMapData(coors, zoom)
            .then((data) => mapToDom(data, id))
            .catch(err => console.log(err));
        });
  };

  const mapToDom = (data, id) => {
    const location = store.findLocationById(id);
    const longitude = location.longitude;
    const latitude = location.latitude;
    const zoom = location.mapZoom - 2;
    $('.map-results').html(`
    <img class='map' value=${id} src='${data}' alt='map of the image to the left'>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <span>Get this location as a photo!</span><button class='matching-image'>Get!</button><br>
    <p>Resolution</p>
    <label for="Adjust">Adjust</label> <br>
    <span> Zoom out </span> 
    <input type="range" class="zoom-range" name="Adjust" list='tickmarks' value='${zoom}'
    min="1" max="15">
    <span> Zoom in </span> 
    <datalist id="tickmarks">
       <option value="1" label="1%">
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
    <span>Retrieve </span><button class='zoom-adjust'>Get New Map</button>
    `);
  };

  const nasaImageToDom = function (data, id) {
    const location = store.findLocationById(id);
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
      store.seedData();
      const location = store.findLocationById(9);
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
    adjustZoomOnMap();
    addFakeData();
  };
  // Bind event listeners
  return {
    bindEventListeners
  };
}());


