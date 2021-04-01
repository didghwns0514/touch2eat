const tmp_G = document.getElementById("needme");
const GOOGLE_MAP_KEY = tmp_G.getAttribute("gk");

let app = {
    map: null,
    currentMarker: null,
    defaultPos: {
      coords: {
        latitude: 45.555,
        longitude: -75.555
      }
    }, //default location to use if geolocation fails
    // init: function() {
    //   document.addEventListener("deviceready", app.ready);
    // },
    init: function() {
      //load the google map script
      let s = document.createElement("script");
      document.head.appendChild(s);
      s.addEventListener("load", app.mapScriptReady);
        
      let locationButton = document.getElementById("nowbutton");
      locationButton.addEventListener("click", app.mapScriptReady);

      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}`;
    },
    mapScriptReady: function() {
      //script has loaded. Now get the location
      if (navigator.geolocation) {
        let options = {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000 * 60 * 60
        };
        navigator.geolocation.getCurrentPosition(
          app.gotPosition,
          app.failPosition,
          options
        );
      } else {
        //not supported
        //pass default location to gotPosition
        app.gotPosition(app.defaultPos);
      }
    },
    gotPosition: function(position) {
      console.log("gotPosition", position.coords);
      //build the map - we have deviceready, google script, and geolocation coords
      app.map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        minZoom: 10,
        maxZoom: 17,
        disableDoubleClickZoom: true,
        gestureHandling: "greedy", // disable two fingers
        clickableIcons: true,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: ["roadmap", "terrain", "satellite"],
            position: google.maps.ControlPosition.LEFT_TOP
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP
        },
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM
        },
        rotateControl: true
    });
      //add map event listeners
      app.addMapListeners();
    },
    addMapListeners: function() {
      console.log("addMapListeners");
      //add double click listener to the map object
      app.map.addListener("dblclick", app.addMarker);
    },
    addMarker: function(ev) {
      console.log("addMarker", ev);
      let marker = new google.maps.Marker({
        map: app.map,
        draggable: false,
        position: {
          lat: ev.latLng.lat(),
          lng: ev.latLng.lng()
        }
      });
      //add click listener to Marker
      marker.addListener("click", app.markerClick);
      //add double click listener to Marker
      marker.addListener("dblclick", app.markerDblClick);
    },
    markerClick: function(ev) {
      console.log("Click", ev);
      console.log(this);
      let marker = this; // to use the marker locally
      app.currentMarker = marker; //to use the marker globally
      app.map.panTo(marker.getPosition());
    },
    markerDblClick: function(ev) {
      console.log("Double Click", ev);
      console.log(this);
      let marker = this; //to use the marker locally
      //app.currentMarker = marker; //to use the marker globally
      //remove the marker from the map
      marker.setMap(null);
      app.currentMarker = null;
    },
    failPosition: function(err) {
      console.log("failPosition", err);
      //failed to get the user's location for whatever reason
      app.gotPosition(app.defaultPos);
    }
  };
  
  app.init();


////////////////////////////////////////////////////////////////////////////////////////////////////////////

// let map;

// const tmp_G = document.getElementById("needme");
// const GOOGLE_MAP_KEY = tmp_G.getAttribute("gk");
// //console.log('map key : ',GOOGLE_MAP_KEY);

// const curPosFunction = ()=>{

//     return new Promise( (resolve, reject) => {
//         if (navigator.geolocation){
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
    
//                     // position.coords.latitude
//                     // position.coords.longitude
//                     console.group('map cur pose');
//                     console.log('lat : ', position.coords.latitude);
//                     console.log('lng : ', position.coords.longitude);
//                     console.groupEnd();
//                     resolve( [position.coords.latitude, position.coords.longitude]);
//                 });
    
            
    
//         }else{
//             resolve([ 45.4496711, -75.6569551 ]);
//         }

//     })

// }

// function mapFactory(t_lat, t_lng){
//     return new google.maps.Map(document.getElementById("map"), {
//         center: {
//             lat: t_lat,
//             lng: t_lng
//         },
//         zoom: 15,
//         mapTypeId: google.maps.MapTypeId.ROADMAP,
//         restriction: {
//             latLngBounds: {
//                 north: 50.00,
//                 south: 40.00,
//                 west: -100.00,
//                 east: -60.00,
//             }
//         },
//         minZoom: 10,
//         maxZoom: 17,
//         disableDoubleClickZoom: false,
//         clickableIcons: false,
//         disableDefaultUI: true,
//         zoomControl: true,
//         zoomControlOptions: {
//             position: google.maps.ControlPosition.RIGHT_CENTER
//         },
//         mapTypeControl: true,
//         mapTypeControlOptions: {
//             style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
//             mapTypeIds: ["roadmap", "terrain", "satellite"],
//             position: google.maps.ControlPosition.LEFT_TOP
//         },
//         fullscreenControl: true,
//         fullscreenControlOptions: {
//             position: google.maps.ControlPosition.RIGHT_TOP
//         },
//         scaleControl: false,
//         streetViewControl: true,
//         streetViewControlOptions: {
//             position: google.maps.ControlPosition.RIGHT_BOTTOM
//         },
//         rotateControl: true
//     });
// }


// document.addEventListener("DOMContentLoaded", () => {
//     let s = document.createElement("script");
//     let locationButton = document.getElementById("nowbutton");

//     document.head.appendChild(s);

//     s.addEventListener("load", () => {
//         //script has loaded
//         console.log("script has loaded. About to load the map");

//         curPosFunction().then((result)=>{
//             console.log('after resolve : ', result);

//             map = mapFactory(result[0], result[1]);
//         });

//     });
    
//     s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}`;

        
//     locationButton.addEventListener("click", ()=>{
//         //event triggered from button
//         console.log("event triggered by the map");

//         curPosFunction().then((result)=>{
//             console.log('after resolve : ', result);

//             map = mapFactory(result[0], result[1]);
//         });


//     });


    
// });



////////////////////////////////////////////////////////////////////////////////////////////////////

// let map;

// const tmp_G = document.getElementById("needme");
// const GOOGLE_MAP_KEY = tmp_G.getAttribute("gk");
// //console.log('map key : ',GOOGLE_MAP_KEY);

// document.addEventListener("DOMContentLoaded", () => {
//     let s = document.createElement("script");
//     let locationButton = document.getElementById("nowbutton");

//     document.head.appendChild(s);
//     s.addEventListener("load", () => {
//         //script has loaded
        

//         console.log("script has loaded. About to load the map");
//         map = new google.maps.Map(document.getElementById("map"), {
//             center: {
//                 lat: 45.4496711,
//                 lng: -75.6569551
//             },
//             zoom: 15,
//             mapTypeId: google.maps.MapTypeId.ROADMAP,
//             restriction: {
//                 latLngBounds: {
//                     north: 50.00,
//                     south: 40.00,
//                     west: -100.00,
//                     east: -60.00,
//                 }
//             },
//             minZoom: 10,
//             maxZoom: 17,
//             disableDoubleClickZoom: false,
//             clickableIcons: false,
//             disableDefaultUI: true,
//             zoomControl: true,
//             zoomControlOptions: {
//                 position: google.maps.ControlPosition.RIGHT_CENTER
//             },
//             mapTypeControl: true,
//             mapTypeControlOptions: {
//                 style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
//                 mapTypeIds: ["roadmap", "terrain", "satellite"],
//                 position: google.maps.ControlPosition.LEFT_TOP
//             },
//             fullscreenControl: true,
//             fullscreenControlOptions: {
//                 position: google.maps.ControlPosition.RIGHT_TOP
//             },
//             scaleControl: false,
//             streetViewControl: true,
//             streetViewControlOptions: {
//                 position: google.maps.ControlPosition.RIGHT_BOTTOM
//             },
//             rotateControl: true
//         });
//     });
//     s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}`;

        
//     locationButton.addEventListener("click", ()=>{
        
//         if (navigator.geolocation){
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const pos = {
//                         lat:position.coords.latitude,
//                         lng:position.coords.longitude
//                     };

//                     map = new google.maps.Map(document.getElementById("map"), {
//                         center: {
//                             lat:pos.lat,
//                             lng:pos.lng
//                         },
//                         zoom:16,
//                         mapTypeId: google.maps.MapTypeId.ROADMAP
//                     })

//                 }

//             );

//         }else{
//             alert('cannot get current location..!')
//         }
    
//     });


    
// });