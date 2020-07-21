# Views-Via-ISS

https://mikeymanoguerra.github.io/Views-via-ISS/

This app cobbles together several public API's to display The International Space Station's Current Location, and also serves a LandSat 8 image of this location, if the ISS is over land.  

The app is built with jQuery, contains a jQuery global state, and is deployed with webpack.

There is a secret form when the .png of the Landsat 8 is clicked. 

## A note on image quality

The image quality that api returns has degraded since this application was originally built. If I were to return to this project, I would use google earth based API's to freshen up the data sources. This was the suggestion of one of the NASA Api's maintainers. For now, this project (Views-via-ISS) is on the backburner. 

![app screenshot](https://res.cloudinary.com/dgzjr8afn/image/upload/v1555687146/issdark.png)


### Next Steps

- Improved 'you are here' image for map view, that switches to an astronaut on form submission, (spacewalk).
- View previous locations from the current session.
- smooth image transition
- Find and impliment other space API's
- Convert the store to a node back end, and archive  successful GETS from Nasa api.
- Collect my own DataSet, allow point and click locations for satellite images


### APIs utilized: 

https://wheretheiss.at/w/developer

https://api.nasa.gov/

https://developer.mapquest.com/documentation/


 
