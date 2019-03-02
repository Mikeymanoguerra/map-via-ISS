
window.store = (function () {

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
  const seedData = function () {
    pushToArray(Mock_DATA[1]);
  };

  // takes in data from ISS cordinates , stores while client is at the site.
  const getCoordinates = function (data) {
    const latitude = data['iss_position'].latitude;
    const longitude = data['iss_position'].longitude;
    const nasaCoordinates = `lon=${longitude}&lat=${latitude}`;
    const mapCoordinates = `${latitude},${longitude}`;
    const freshlocation = buildLocationObject(
      nasaCoordinates,
      mapCoordinates,
      latitude,
      longitude);
    pushToArray(freshlocation);
    this.requestId++;
    return freshlocation.id;
  };

  const buildLocationObject = function (
    nasaCoordinates,
    mapCoordinates,
    longitude,
    latitude,
    date = [2013, 12, 24],
    degrees = 0.1) {
    const locationObject = {
      id: store.requestId,
      nasaCoordinates,
      degrees,
      mapCoordinates,
      longitude,
      latitude,
      date,
      mapZoom : 5,
      photoExists: true,
      imageUrls: []
    };
    return locationObject;
  };

  const pushToArray = function (obj) {
    store.state.push(obj);
  };

  const findLocationById = function (id) {
    return this.state.find(location => {
      if (id === location.id) {
        return location;
      }
    });
  };

  return {
    state: [],
    requestId: 10,
    getCoordinates,
    pushToArray,
    findLocationById,
    Mock_DATA,
    seedData
  };

}());

