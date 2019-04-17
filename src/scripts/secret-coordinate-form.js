
import { store } from './store';
import { api } from './api';
import { events } from './events';

function secretFormToDom() {
  if (store.secretForm) {
    $('.secret-form-container').html(secretCoordinateForm.htmlString);
  } else $('.secret-form-container').html(secretCoordinateForm.disappears);
}

const onExposeCoordinateForm = function () {
  $('#secret').on('click', function () {
    store.handleSecretFormToggle();
    events.render();
  });
};

function trickStoreWithCoordinates(longitude, latitude) {
  const spaceWalkObject = {
    longitude,
    latitude
  };
  return store.parseCoordinatesAndGetStoreId(spaceWalkObject);
}

function validator(value) {
  let error;
  const lengthCheck = str => str.trim().length > 10 ? error = 'form-input-length' : undefined;
  const characterCheck = str => str.match(/[^0-9.-]/) ? error = 'form-characters' : undefined;
  characterCheck(value);
  lengthCheck(value);
  return error;
}

function validateAndPrepareSubmission(event) {
  const formArray = $(event.target).serializeArray();
  const [longitudeObject, latitudeObject] = formArray;
  const latitude = latitudeObject.value;
  const longitude = longitudeObject.value;
  let error1 = validator(longitude);
  let error2 = validator(longitude);
  if (error1) {
    store.handleErrorMessage(error1);
    return [null];
  }
  if (error2) {
    store.handleErrorMessage(error2);
    return [null];
  }
  const nasaCoordinates = `lon=${longitude}&lat=${latitude}`;
  return [nasaCoordinates, longitude, latitude];

}

function onSecretFormSubmission() {
  $('.secret-form-container').on('click', '.submit-button', function () {
    $('.coordinates-input').submit(function (event) {
      event.preventDefault();
      const [nasaCoordinates, longitude, latitude] = validateAndPrepareSubmission(event);
      if (!nasaCoordinates) {
        return events.render();
      }
      return api.getNasaImage(nasaCoordinates)
        .then(res => {
          const storeId = trickStoreWithCoordinates(longitude, latitude);
          events.handleNasaResponse(storeId, res, 'spacewalk');
          events.render();

        })
        .catch(() => events.handleErrors('form-water'));
    });
  });
}

function validationErrorToDom() {
  const errorString = events.generateErrorString();
  const htmlString = `<div class='error-container'>${errorString}</div>`;
  $('.form-results').html(htmlString);
  events.generateErrorString('form-reset');
}

function onShowFormRequestOnMap() {
  $('.secret-form-container').on('click', '.form-matching-map', function () {

    const storeId = parseInt($(this).siblings('img.form-map-image').attr('value'));
    const { mapCoordinates } = events.getlocationObjectFromStore(storeId);
    return api.getMapData(mapCoordinates, 5)
      .then(url => {
        events.handleMapResponse(storeId, url);
        return events.render();
      })
      .catch(err => console.log(err));
  });
}

function astronautToDom(storeId, newResponseObject) {

  const { url, imageId, dateArray, zoomInDegrees } = newResponseObject;
  const {
    longitude,
    latitude,
  } = store.findLocationById(storeId);

  let checkedClose, checkedMedium, checkedWide, checkedSuper, checkedDuper;
  zoomInDegrees === '.05' ? checkedClose = 'checked' : '';
  zoomInDegrees === '0.1' ? checkedMedium = 'checked' : '';
  zoomInDegrees === '0.5' ? checkedWide = 'checked' : '';
  zoomInDegrees === '1.0' ? checkedSuper = 'checked' : '';
  zoomInDegrees === '2.0' ? checkedDuper = 'checked' : '';


  const errorString = events.generateErrorString();
  const htmlString = `
    <img class='form-map-image'
    value=${storeId} id=${imageId}
    src="${url}" alt="satellite image at longitude ${longitude}, latitude ${latitude}">
    <div class='error-container'>${errorString}</div>
    <p>Longitude: ${longitude}, Latitude: ${latitude}</p>
    <p>Approximate date of Photo: ${dateArray[1]}-${dateArray[2]}-${dateArray[0]} </p>
    <label for="radio">Adjust Resolution</label> <br>
    
    <input type="radio"name='degree' class="astronaut-degree-range" ${checkedClose} value=".05" name="degree">
    <label for="radio">Close up </label> <br>
    <input type="radio" name='degree'class="astronaut-degree-range" ${checkedMedium} value="0.1" name="degree">
    <label for="radio">Medium  </label><br>
    <input type="radio" name='degree'class="astronaut-degree-range" ${checkedWide} value="0.5" name="degree">
    <label for="radio">Wide Angle  </label><br>
    <input type="radio" name='degree'class="astronaut-degree-range" ${checkedSuper} value="1.0" name="degree">
    <label for="radio">Super Wide Angle  </label><br>
    <input type="radio" name='degree'class="astronaut-degree-range" ${checkedDuper} value="2.0" name="degree">
    <label for="radio">Super Duper Wide Angle  </label><br>
  <button id='adjust-button' class='astronaut-degree-adjust'>Get updated Resolution</button>
   <br>
    <span>Get this location on a map!</span><button id='adjust-button' class='form-matching-map'>Get!</button><br>
    `;
  $('.form-results').html(htmlString);
  events.generateErrorString('form-reset');
  // <button class='form-go-back'>Go back in time</button>
  // <button class='form-go-forward'>Go forward in time</button>
}

const disappears = ` <div class="no-form"></div>`;
const htmlString = ` 
<div class='revealed-form'>
<form class='coordinates-input'>
 <fieldset>
     <legend>Space Walk</legend>
     <div class="input-group"></div>
     <input name="longitude" type="text" placeholder="Longitude">
     <label for="title">Longitude</label>
   <div class="input-group"></div>
   <input name="lattitude" type="text" placeholder="Lattitude">
     <label for="title">Lattitude</label><br>
     <label for="submit-button">Search For Astronaut Photo</label>
     <button id='adjust-button'class="submit-button" name="submit">Submit</button>
   </fieldset>
</form>
<div class="form-results"></div>
</div>`;

const bindFormListeners = () => {
  onExposeCoordinateForm();
  onSecretFormSubmission();
  onShowFormRequestOnMap();
};

export const secretCoordinateForm = {
  htmlString,
  disappears,
  astronautToDom,
  bindFormListeners,
  secretFormToDom,
  validationErrorToDom,

};