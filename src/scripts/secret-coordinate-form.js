

// from events.js
function secretFormToDom() {
  if (store.secretForm) {
    $('.secret-form-container').html(secretCoordinateForm.htmlString);
  }
  console.log(store.secretForm);
}


const toggleCoordinateForm = function () {
  $('.button-container').on('click', '.form-toggle', function () {
    store.handleSecretFormToggle();
    secretFormToDom();
  });
};



const htmlString = ` <div class="form-results">
<img src='fail.com' alt='hey'>
<form class='coordinates-input'>
 <fieldset>
     <legend>Add Bookmark</legend>
     <div class="input-group"></div>
     <label for="title">Longitude</label>
     <input type="text" placeholder="Longitude">
   <div class="input-group"></div>
     <label for="title">Lattitude</label>
     <input type="text" placeholder="Lattitude">
     <label for="submit-button">Search For Astronaut Photo</label>
     <button name="submit">Submit</button>
   </fieldset>
</form>
</div>`;

export const secretCoordinateForm = {
  htmlString
};