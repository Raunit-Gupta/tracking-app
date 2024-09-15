let socket = io(); // a connection request is sent to the server backend

// console.log("connected");

// checking if the browser support geolocation
// navigator.geolocation is a predefined function in the browser
// watchposition expect three arguments
// 1. callback function
// 2. error function
// 3. options and settings
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0, // used for no caching
      timeout: 5000, // 5 seconds
    }
  );
}


// using leaflet for map 
// [0,0] is the center of the map
// 10 is the zoom level
const map = L.map("map").setView([0,0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    "Tracking app ",
}).addTo(map);


// creating an empty marker
const markers = {}


// now we had taken the emitted location from the frontend and send to all users from the backend
socket.on("receive-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 10);
    if(markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
})

socket.on("user-disconnected", () => {
    if(markers[id]) {   
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

