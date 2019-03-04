
const getCurrentDateArray = () => {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();
  return [year, month, date];
};

const theDate = "2013-12-28T18:47:30";

function dateFromString(dateTimeString) {
  const dateOnlyString = dateTimeString.slice(0, 10);
  const dateStringArray = dateOnlyString.split('-');
  const dateArray = dateStringArray.map(num => parseInt(num));
  return dateArray;
}

console.log(dateFromString(theDate));

const goBackInTimeOneMonth = (dateArray) => {
  const monthMinusOne = dateArray.map((n, index) => {
    return index === 1 ? n - 1 : n;
  });
  if (monthMinusOne[1] === 0) {
    const yearAdjustedArray = monthMinusOne.map((n, index) => {
      if (index === 0) { return n - 1; }
      if (index === 1) { return n = 12; }
      else return n;
    });
    return yearAdjustedArray;
  } else return monthMinusOne;
};

const goForwardInTimeOneMonth = (dateArray) => {
  const monthPlusOne = dateArray.map((n, index) => {
    return index === 1 ? n + 1 : n;
  });
  if (monthPlusOne[1] === 13) {
    const yearAdjustedArray = monthPlusOne.map((n, index) => {
      if (index === 0) { return n + 1; }
      if (index === 1) { return n = 1; }
      else return n;
    });
    return yearAdjustedArray;
  } else return monthPlusOne;
};

const dateToString = (dateArray) => {
  let year = dateArray[0];
  let month = dateArray[1];
  let date = dateArray[2];
  if (month < 10) {
    month = `0${month}`;
  }
  if (date < 10) {
    date = `0${date}`;
  }
  // TODO actual date handling by month
  if (date > 28) {
    date = 28;
  }
  return `${year}-${month}-${date}`;
};
const today = getCurrentDateArray();
const january = goBackInTimeOneMonth(today);
const december = goBackInTimeOneMonth(january);
const jan = goForwardInTimeOneMonth(december);
const feb = goForwardInTimeOneMonth(jan);

console.log(dateToString(jan), dateToString(feb));


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