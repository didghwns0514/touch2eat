const tmp_G = document.getElementById("needme");
const GOOGLE_MAP_KEY = tmp_G.getAttribute("gk");
const defaultZoom = 16;
let queryQueue = [];
let markerQueue = [];
let firstPosSmph = false;

let app = {
    map: null,
    currentMarker: null,
    currentInfoWindw : null,
    currLoc: null,
    currMapCenter: {latitude:null, longitude:null},
    currService : null,
    defaultPos: { //default location to use if geolocation fails
      coords: {
        latitude: 45.555,
        longitude: -75.555
      },
    }, 
    init: function() {
      //load the google map script
      let s = document.createElement("script");
      document.head.appendChild(s);
      s.addEventListener("load", app.mapScriptReady);
        
      let locationButton = document.getElementById("nowbutton");
      locationButton.addEventListener("click", app.mapScriptReady);
      
      let searchbutton = document.getElementById("nowsearchbutton");
      console.log("searchbutton : ", searchbutton);
      searchbutton.addEventListener("click", app.runSearchRequest);

      s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}&libraries=places`;
    },

    mapScriptReady: function() {
      //script has loaded. Now get the location
      if (navigator.geolocation) {
        let options = {
          enableHighAccuracy: true,
          timeout: 2000, //2secs
          maximumAge: 1000
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
        // app.currLoc = app.defaultPos.coords;
      }
    },
    markerQueueClear: function() {
        console.log("markerQueueClear is called!");
        // eraise markers
        for(var i=0; i<markerQueue.length;i++){
            markerQueue[i].setMap(null);
        }
        markerQueue = []; // reset marker container
    },
    
    gotPosition: function(position) {
      console.log("gotPosition", position.coords);
      app.currLoc = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      //build the map - we have deviceready, google script, and geolocation coords
      app.map = new google.maps.Map(document.getElementById("map"), {
        zoom: defaultZoom,
        // zoom: 16,
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
      app.getMapCenter();
    },

    getMapCenter : function(){
        google.maps.event.addListener(app.map, "center_changed", app.MapCenterSub);

    },
    MapCenterSub : function(){
        
            console.log("getMapCenter");
            let center = this.getCenter();
            let latitude = center.lat();
            let longitude = center.lng();
            
            console.log("lat in map : ", latitude );
            console.log("lng in map : ", longitude );
            
            app.currMapCenter.latitude = latitude;
            app.currMapCenter.longitude = longitude;
          
    },

    runSearchRequest : function(){
        console.log("runSearchRequest");
        queryQueue = []; // reset query results object container

        //clear marker queue
        app.markerQueueClear();


        let searchQuery = document.getElementById("nowsearchtext").value;
        console.log('searchQuery value : ', searchQuery);

        // let request = {
        //     query : searchQuery,
        //     fields: ['formatted_address', 'name', 'rating','user_ratings_total', 'opening_hours', 'geometry'],
        //     radius:1000,
        // };
        // let request ={
        //     location: new google.maps.LatLng(app.currLoc.latitude, app.currLoc.longitude),
        //     zoom: defaultZoom,
        //     radius :1000,
        //     types:[searchQuery]
        // };


        let request ={
                location: new google.maps.LatLng(app.currMapCenter.latitude, app.currMapCenter.longitude),
                zoom: defaultZoom,
                radius :1000,
                query:searchQuery,
                openNow:true,
                //fields: ['formatted_address', 'name', 'rating','user_ratings_total', 'opening_hours', 'geometry'],
            };

            currService = new google.maps.places.PlacesService(app.map);
            currService.textSearch(request, (results, status) =>{
            //service.findPlaceFromQuery(request, (results, status) =>{
            //service.nearbySearch(request, (results, status) =>{
                if (status === google.maps.places.PlacesServiceStatus.OK){
                    console.group('query result group');
                    console.log('results retrieved : ', results);
                    //queryQueue = results;
                    
                    for(var i =0; i<results.length; i++){
                        let place = results[i];
                        console.log(i+1, results[i]);
                        

                        queryQueue.push(place);
                        markerQueue.push(app.addPlaceMarker(place));

                        //createMarker(results[i]);
                    }
                    console.groupEnd();


                }
            });

    },

    addPlaceMarker: function(result){
        console.log("addPlaceMarker");
        let place_marker = new google.maps.Marker({
        //let place_marker = new google.maps.Marker({
            map:app.map,
            draggable:false,
            position: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng()
            },
            title:result.name
        });

        place_marker.addListener("click", app.addPlaceMarkerClick);

        return place_marker;
    },

    addPlaceMarkerClick : function(ev){
        console.log("addPlaceMarkerClick", ev);
        console.log(this);
        if(app.currentMarker === null){
            let marker = this; // to use the marker locally
            app.currentMarker = marker; //to use the marker globally
            app.map.panTo(marker.getPosition());
            
            // float information
            app.loadPlaceMarkerInfo();

        }else{
            //curr marker already exists, remove all
            //let marker = this; //to use the marker locally
            //marker.setMap(null); // erase from map
            app.currentMarker = null;
            app.loadPlaceMarkerInfo();
        }
    },
    loadPlaceisOpen : function(id){
        // https://note.toice.net/2020/06/19/google-map-place-opening-hours-open-now-to-isOpen-func/
        if(!currService){
            console.log('loadPlaceisOpen 1');
            return undefined;
        }

        currService.getDetails({
            placeId : id,
            fields: ['opening_hours', 'utc_offset_minutes'],
        }, (place, status) =>{
            if(status !== 'OK'){
                console.log('loadPlaceisOpen 2');
                return undefined;}
                console.log('loadPlaceisOpen 3');
            return place.opening_hours.isOpen();
        });
        console.log('loadPlaceisOpen 4');
        return undefined;
    },
    loadPlaceMarkerInfo : function(){
        console.log("loadPlaceMarkerInfo");

        if(app.currentMarker !== null){
            console.log("loadPlaceMarkerInfo - create");
            // search in the object
            let queryResult = null;
            console.group("For Search in queue");
            console.log("current marker title : ", app.currentMarker.title);
            console.log("queryQueue inside : ", queryQueue);
            for(var i=0; i< queryQueue.length; i++){
                console.log(i+1, queryQueue[i]);
                if( queryQueue[i].name === app.currentMarker.title ){
                    queryResult = queryQueue[i];
                    break;
                }
            }
            console.groupEnd();

            //set display text
            let dispText = '';
            if(queryResult === null){
                dispText += '<h1>no information...</h1>';
            }else{
                // let openhourText = null;
                // console.group("opening hours log");
                // console.log('queryResult.opening_hours : ', queryResult.place_id);
                // if('opening_hours' in queryResult){
                //     console.log('property check : ', app.loadPlaceisOpen(queryResult.place_id) );
                //     //console.log('method check : ', queryResult.opening_hours.isOpen(new Date()));
                //     openhourText = app.loadPlaceisOpen(queryResult.place_id);
                // }else{
                //     openhourText =  'no open hour info';
                // }
                // console.groupEnd();
                dispText += `<h1>${queryResult.name}</h1>
                            <p>rating : ${queryResult.rating}</p>
                            <p>total review number : ${queryResult.user_ratings_total}</p>
                            
                            <p>address : ${queryResult.formatted_address}</p>
                            <p>${String(queryResult.photos[0].html_attributions[0]).replace(/>\.*</gi,"Deail info redirect")}</p>
                `; //<!--<p>is open now : ${openhourText}</p>-->
            }

            app.currentInfoWindw = new google.maps.InfoWindow({
                content:dispText,
                maxWidth: 200,
            });
            app.currentInfoWindw.open(app.map, app.currentMarker);

        }else{
            console.log("loadPlaceMarkerInfo - exist checked");
            if(app.currentInfoWindw !== null){
                console.log("loadPlaceMarkerInfo - destroy");
                app.currentInfoWindw.close();
                app.currentInfoWindw = null;
            }else{
                console.log("loadPlaceMarkerInfo - null");
            }
        }
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
