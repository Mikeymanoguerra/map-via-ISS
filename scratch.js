
/*
const Mock_DATA = [
  {
    id: 8,
    nasaCoordinates: 'lon=32.1453&lat=-17.8883',
    degrees: 0.01,
    mapCoordinates: '-17.8883,32.1453',
    longitude: 32.1453,
    latitude: -17.8883,
    date: null,
    photoExists: true,
    imageUrls: []
  },
  {
    id: 9,
    nasaCoordinates: 'lon=-122.4194&lat=37.7749',
    mapCoordinates: '37.7749,-122.4194',
    degrees: 0.01,
    longitude: -122.4194,
    latitude: 37.7749,
    date: [2013, 12, 24],
    mapZoom: 5,
    photoExists: true,
    imageUrls: ['https://earthengine.googleapis.com/api/thumb?thumbid=bc9b6d19904dfffe9e45271e308630ba&token=f0aee8f19cfd7d48dbd4a257fa9f181f']
  },
  {
    id: 10,
    nasaCoordinates: 'lon=75.1652&lat=39.9526',
    mapCoordinates: '39.9526,75.1652',
    degrees: 0.01,
    longitude: 75.1652,
    latitude: 39.9526,
    date: [2013, 12, 24],
    mapZoom: 5,
    photoExists: true,
    imageUrls: ['https://earthengine.googleapis.com/api/thumb?thumbid=bc9b6d19904dfffe9e45271e308630ba&token=f0aee8f19cfd7d48dbd4a257fa9f181f']
  },

];
*/

// const newCollectedLocation = {
//   id,
//   lattitude,
//   longitude,
//   etc,
//   etc,
//   etc,
//   firstPictureREsolutions: .1,
//   firstPictureDate: [2013, 12, 24],
//   otherSuccessfulResponses: [
//     {
//       date: [2013, 11, 24],
//       resolution: .05,
//       hostedUrl: 'XXXXXXX'

//     },
//     {
//       date: [2013, 10, 24],
//       resolution: .05,
//       hostedUrl: 'XXXXXXX'

//     },
//     {
//       date: [2013, 11, 24],
//       resolution: .25,
//       hostedUrl: 'XXXXXXX'
//     }
//   ]
// };


// const result = newCollectedLocation
//   .otherSuccessfulResponses
//   .find(matchingparam => matchingparam === newClientRequest)

// function handleNewImageRequest() {
//   if (result) {
//     return hostedUrl;
//   }
//   else {
//     // compile and make new request
//     then(
//       // spread new response object into otherSuccessfull responses array,
//     );
//   }
// };

// /** ============== zoom on satelite tooo variable at the moment, want to  focus on
//  * other functionality first =========================
//  */

// // function getZoomValueAndStoreId() {
// //   const storeId = parseInt(
// //     $('.nasa-zoom-adjust')
// //       .siblings('img.map-image')
// //       .attr('value'));
// //   const zoom =
// //     $('.nasa-zoom-adjust')
// //       .siblings('input.nasa-zoom-range')
// //       .val();
// //   return [storeId, zoom];
// //   // add date to DOM
// // }

// // function adjustZoomOnSatelliteImage() {
// //   $('.nasa-results')
// //     .on('click',
// //       '.nasa-zoom-adjust', () => {
// //         const storeIdAndZoomArray = getZoomValueAndStoreId();
// //         const [storeId, zoomInDegrees] = storeIdAndZoomArray;
// //         const { nasaCoordinates } = getlocationObjectFromStore(storeId);
// //         // build date into this as well
// //         let date = '2013-12-24';
// //         return api.getNasaImage(nasaCoordinates, date, zoomInDegrees)
// //           .then(res => nasaImageToDom(res, storeId, zoomInDegrees))
// //           .catch(err => console.log('Image at this resolution does not exist', err));
// //       });
// // }


// // `<p>Resolution</p>
// //   <label for="Adjust">Adjust</label> <br>
// //     <span> Zoom out </span>
// //     <input type="range" class="nasa-zoom-range" name="Adjust" list='tickmarks2' value=${zoom}'
// //     min="0.05" max='0.5' step='0.05'>
// //     <span> Zoom in </span>
// //     <datalist id="tickmarks2">
// //       <option value="0.5" label="1">
// //         <option value="0.45">
// //           <option value="0.4">
// //             <option value="0.35">
// //               <option value="0.3" label="5">
// //                 <option value="0.25">
// //                   <option value="0.2">
// //                     <option value="0.15">
// //                       <option value="0.1">
// //                         <option value="0.05" label="10">

// //     </datalist>
// //                         <br>
// //                           <span>Retrieve </span><button class='nasa-zoom-adjust'>Get New Image</button>`

/*
right path but fail
if (userRequest.mapOrSatellite === 'satellite') {
  return locationObject.successfulResponses.find(item => {
    for (let i = 0; i < item.dateArray.length; i++) {
      if (item.dateArray[i] !== userRequest.dateArray[i])
        return false;
    }
  });
 
}

*/


// const addFakeData = function () {
//   $('.button-container').on('click', '.test-data', function () {
//     let storeId = store.seedData();
//     const { nasaCoordinates } = getlocationObjectFromStore(storeId);
//     return api.getNasaImage(nasaCoordinates)
//       .then((res) => {
//         const newResponseObject = handleNasaResponse(storeId, res);
//         return nasaImageToDom(storeId, newResponseObject);
//       })
//       .catch(err => {
//         console.log(err);
//         nasaImageToDom(storeId, err);
//         const { mapCoordinates } = getlocationObjectFromStore(storeId);
//         return api.getMapData(mapCoordinates, 4)
//           .then(data => mapToDom(storeId, data))
//           .catch(err => console.log(err));
//       });
//   });
// };



// const seedData = function () {
//   const data = {
//     iss_position: { longitude: "-122.4194", latitude: "37.7749" }
//   };
//   return parseCoordinatesAndGetStoreId(data);
// };