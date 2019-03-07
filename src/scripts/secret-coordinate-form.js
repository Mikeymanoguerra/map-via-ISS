
import { store } from './store';
import { api } from './api';
import { events } from './events';

function secretFormToDom() {
  if (store.secretForm) {
    $('.secret-form-container').html(secretCoordinateForm.htmlString);
  } else $('.secret-form-container').html(secretCoordinateForm.disappears);
}


const onExposeCoordinateForm = function () {
  $('.button-container').on('click', '.form-toggle', function () {
    store.handleSecretFormToggle();
    events.render();
    console.log(store.secretForm);
  });
};

function trickStoreWithCoordinates(longitude, latitude) {
  const spaceWalkObject = {
    'iss_position': {
      longitude,
      latitude
    }
  };
  return store.parseCoordinatesAndGetStoreId(spaceWalkObject);
}

function onSecretFormSubmission() {
  $('.secret-form-container').on('click', '.submit-button', function () {
    $('.coordinates-input').submit(function (event) {
      event.preventDefault();
      const formArray = $(event.target).serializeArray();
      const [longitudeObject, latitudeObject] = formArray;
      const nasaCoordinates = `lon=${longitudeObject.value}&lat=${latitudeObject.value}`;
      return api.getNasaImage(nasaCoordinates)
        .then(res => {
          const storeId = trickStoreWithCoordinates(longitudeObject.value, latitudeObject.value);
          events.handleNasaResponse(storeId, res, 'spacewalk');
          events.render();

        })
        .catch(err => console.log(err));
    });
  });
}


function astronautToDom(storeId, newResponseObject) {
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
    `;
  $('.form-results').html(htmlString);
  // <span>Get this location on a map!</span><button class='matching-map'>Get!</button><br>
  //   <button class='go-back'>Go back in time</button>
  //   <button class='go-forward'>Go forward in time</button>

}




const disappears = ` <div class="no-form"></div>`;
const htmlString = ` 
<div class='revealed-form'>
<form class='coordinates-input'>
 <fieldset>
     <legend>Space Walk</legend>
     <div class="input-group"></div>
     <label for="title">Longitude</label>
     <input name="longitude" type="text" placeholder="Longitude">
   <div class="input-group"></div>
     <label for="title">Lattitude</label>
     <input name="lattitude" type="text" placeholder="Lattitude"><br>
     <label for="submit-button">Search For Astronaut Photo</label>
     <button class="submit-button" name="submit">Submit</button>
   </fieldset>
</form>
<div class="form-results"></div>
</div>`;

const bindFormListeners = () => {
  onExposeCoordinateForm();
  onSecretFormSubmission();
};

export const secretCoordinateForm = {
  htmlString,
  disappears,
  astronautToDom,
  bindFormListeners,
  secretFormToDom

};