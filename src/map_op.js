const tmp_G = document.getElementById("needme");
const GOOGLE_MAP_KEY = tmp_G.getAttribute("gk");

let tmp_H = document.getElementById("needplacetosearch");
let contentfromhomepage = tmp_H.getAttribute("gk");

const defaultZoom = 16;
let queryQueue = [];
let markerQueue = [];
let directionQueue = [];
let firstPosSmph = false;



let app = {
    /**make the app object */
    map: null,
    currentMarker: null,
    currentLocMarker : null,
    currentInfoWindw : null,
    currLoc: null,
    currMapCenter: {latitude:null, longitude:null},
    currServicePlace : null,
    currServiceDirection : null,
    defaultPos: { //default location to use if geolocation fails
      coords: {
        latitude: 37.541,
        longitude: 126.986
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
          timeout: 3000, //3secs
          maximumAge: 1000 //1secs
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
    directionQueueClear : function(){
        console.log("directionQueueClear is called!");
        for(var i=0; i<directionQueue.length;i++){
            directionQueue[i].setMap(null);
        }
        directionQueue = []; // reset direction container        

    },
    
    gotPosition: function(position) {
        /** get the current position and create the Google map element */
      console.log("gotPosition", position.coords);
      console.log("type of callback param : ", typeof position);
      app.currLoc = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      //build the map - we have deviceready, google script, and geolocation coords
      // set options for the google map
      app.map = new google.maps.Map(document.getElementById("map"), {
        zoom: defaultZoom,
        // zoom: 16,
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        minZoom: 4,
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

      //set map center after load
      let center = app.map.getCenter();
      app.currMapCenter.latitude = center.lat();
      app.currMapCenter.longitude = center.lng();      

      //add direct map event listeners and other listeners from map.html
      app.addMapListeners();
      app.getMapCenter();
      app.getRoute();
      app.addSubmitListener();

      // deal with homepage requests
      app.dealHomeRequest();
    },

    addSubmitListener : function() {
        let submit_elem = document.getElementById("submit_form");
        let textarea = document.getElementById("nowsearchtext");
        const funcCaptureAction = function(){
            if((window.event.keyCode === 13 ) && (document.activeElement === textarea)){
                app.runSearchRequest();
            }
        }

        submit_elem.addEventListener("keypress", funcCaptureAction, {capture:true});
    },

    dealHomeRequest : function(){
        console.log("dealHomeRequest");
        console.log("request name : ", contentfromhomepage);

        if(contentfromhomepage){ // if query exists
            //alter homepage text search text session
            let homepage_textarea = document.getElementById("nowsearchtext");
            homepage_textarea.value = contentfromhomepage;

            // run search request
            app.runSearchRequest();
        }
    },

    getRoute : function () {
        let routebutton = document.getElementById("routebutton");
        routebutton.addEventListener("click",app.findRoutetoPlace);
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
        /** Function to handle place search request made from client side 
         * Using Google Place API
         * Recursive and callbacks
        */
        console.log("runSearchRequest");
        queryQueue = []; // reset query results object container

        // delete existing table info
        app.deleteTable();

        // add marker to the current location
        console.log("app.currMapCenter ::: ", app.currMapCenter);
        let ev = {
            latLng : {
                lat : function () {return app.currMapCenter.latitude;},
                lng : function () {return app.currMapCenter.longitude;}
            }
        };
        app.addMarker(ev);
        

        let functionReuquest = (in_request) => {

            let request = in_request;// get request when called

            currServicePlace = new google.maps.places.PlacesService(app.map);
            currServicePlace.textSearch(request, (results, status, next_page_token) =>{
            //service.findPlaceFromQuery(request, (results, status) =>{
            //service.nearbySearch(request, (results, status) =>{
            /** here, only textSearch will return Broad search results */
                console.log("results :: ", results);
                console.log("status :: ", status);
                console.log("next_page_token :: ", next_page_token);
                if (status === google.maps.places.PlacesServiceStatus.OK){
                    // console.group('query result group');
                    // console.log('results retrieved : ', results);
                    //queryQueue = results;
                    
                    for(var i =0; i<results.length; i++){
                        let place = results[i];
                        
                        let duplicateFound = false;
                        for(var j=0; j < queryQueue.length; j++){
                            
                            if(queryQueue[j].name === place.name){
                                duplicateFound = true;
                                break;
                            }
                        }
                        if(duplicateFound===false){
                            queryQueue.push(place);
                        }

                    }
                    console.log('next_page_token : ', next_page_token);
                    console.log('next_page_token.o : ', next_page_token.o);


                    if(next_page_token){
                        let subreqest = {
                            pagetoken:next_page_token.o,
                            query:request.query,
                        };
                        // recursive calling
                        functionReuquest(subreqest);
                    }else{
                        // will not be reached, PlacesServiceStatus === NOK
                    }
                }else{
                    console.log("queryQueue : ", queryQueue);
                    for(var i=0; i < queryQueue.length; i++ ){
                        markerQueue.push(app.addPlaceMarker(queryQueue[i]));
                    }  

                    // fill info in table
                    app.updateTable();

                }
            console.log("result ! : ", markerQueue );
            });

        };

        //clear marker queue / direction queue
        app.markerQueueClear();
        app.directionQueueClear();


        let searchQuery = document.getElementById("nowsearchtext").value;
        console.log('searchQuery value : ', searchQuery);

        if(!(searchQuery)){
            alert('no valid search input... Please retry!');
        }


        let request ={
                location: new google.maps.LatLng(app.currMapCenter.latitude, app.currMapCenter.longitude),
                zoom: defaultZoom,
                radius :500,//meters
                query:searchQuery,
                openNow:true,
                fields: ['formatted_address', 'name', 'rating','user_ratings_total', 'opening_hours', 'geometry', 'url'],
            };

        
        functionReuquest(request);

    },
    updateTable : function(){
        /** Updating clientside table */
        console.group("UPDATE TABLE!");


        let setPoint = null;
        if(app.currentLocMarker == null){
            setPoint = {
                lat : app.currLoc.latitude,
                lng : app.currLoc.longitude
            };
        }else{
            setPoint = {
                lat : app.currentLocMarker.position.lat(),
                lng : app.currentLocMarker.position.lng()
            };
        }

        // comparing function for lising up
        let compareFunction = (a, b)=>{
            let tmpA = (a.rating * Math.sqrt(a.user_ratings_total))/Math.pow(Math.hypot(a.geometry.location.lat()-setPoint.lat, a.geometry.location.lng()-setPoint.lng),1); // (a.price_level + 1);
            let tmpB = (b.rating * Math.sqrt(b.user_ratings_total))/Math.pow(Math.hypot(b.geometry.location.lat()-setPoint.lat, b.geometry.location.lng()-setPoint.lng),1); // (b.price_level + 1);

            if(tmpA < tmpB){return 1;}
            if(tmpA > tmpB){return -1;}
            return 0;
        }

        let targetToCreate = document.getElementById("SimpleFilter");


        // set table element
        let table = document.createElement("table");
        table.setAttribute('id', 'SFid');
        // add table headers
        let tableHead = document.createElement("th");
        let tableHeadText = document.createTextNode("Place Name");
        tableHead.appendChild(tableHeadText);
        table.appendChild(tableHead);

        let tableHead2 = document.createElement("th");
        let tableHeadText2 = document.createTextNode("Place rating");
        tableHead2.appendChild(tableHeadText2);
        table.appendChild(tableHead2);

        // do simple sorting
        queryQueue.sort(compareFunction);
        console.log("queryQueue ::: ", queryQueue);
        for(var iQ=0; iQ<queryQueue.length; iQ++){
            let tmpElement = document.createElement("tr"); // table row
            tmpElement.setAttribute('id', queryQueue[iQ].name);

            tmpElement.onclick = app.mapFromTable;


            let tmpValueElement = document.createElement("td");
            let tmpValueElementText = document.createTextNode(queryQueue[iQ].name);
            tmpValueElement.appendChild(tmpValueElementText);
            tmpElement.appendChild(tmpValueElement);

            let tmpValueElement2 = document.createElement("td");
            let tmpValueElementText2 = document.createTextNode(queryQueue[iQ].rating);
            tmpValueElement2.appendChild(tmpValueElementText2);
            tmpElement.appendChild(tmpValueElement2);

            table.appendChild(tmpElement);

        }

        targetToCreate.appendChild(table);


        console.groupEnd();

    },
    deleteTable : function(){
        /** delete tables since its now not needed */
        console.log("DELETE TABLE!");
        let elem = document.getElementById("SFid");
        if(elem){elem.parentNode.removeChild(elem);}

    },

    mapFromTable : function(ev){
        /** Activate map markers from table row click */
            console.log('mapper properly attached : ',ev.path[1].id);

            let placeindex = null;
            for(var t=0; t<markerQueue.length; t++){
                if(markerQueue[t].title === ev.path[1].id){
                    placeindex = t;
                    break;
                }
            }

            console.log('placeindex :: ', placeindex);

            if(placeindex !== null){
                if(app.currentInfoWindw !== null){
                    console.log("loadPlaceMarkerInfo - destroy");
                    app.currentInfoWindw.close();
                    app.currentInfoWindw = null;}
                app.currentMarker = markerQueue[placeindex];
                app.loadPlaceMarkerInfo();
            }

    },

    addPlaceMarker: function(result){
        /** add place markers into array container(returns Marker Object) */
        console.log("addPlaceMarker");
        let marker = new google.maps.Marker({
        //let place_marker = new google.maps.Marker({
            map:app.map,
            draggable:false,
            position: {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng()
            },
            title:result.name
        });

        marker.addListener("click", app.addPlaceMarkerClick);

        return marker;

    },

    addPlaceMarkerClick : function(ev){
        /** function callback on event when marker is clicked */
        console.log("addPlaceMarkerClick", ev);
        console.log(this);
        if(app.currentMarker === null){
            let marker = this; // to use the marker locally
            app.currentMarker = marker; //to use the marker globally
            app.map.panTo(marker.getPosition());
            
            // float information
            app.loadPlaceMarkerInfo();

        }else{
            app.currentMarker = null;
            app.loadPlaceMarkerInfo();
        }
    },

    findRoutetoPlace : function(){
        /** find routes from curr position to selected marker */
        // init existing routes
        app.directionQueueClear();

        if(app.currentMarker === null){
            alert("Please click a marker from map!");
        }else{
            // app.currLoc
            currServiceDirection = new google.maps.DirectionsService();
            
            // find travel method
            let k = document.getElementById("myTravelMethod");

            let travelMethod = k.options[k.selectedIndex].value;
            let transType = null;
            let typeOption = null;

            if(travelMethod === '0'){ //Public Transport
                transType = 'TRANSIT';
                typeOption = {
                    transitOption : {
                        modes:[],
                        //modes:['BUS', 'SUBWAY', 'TRAM', 'TRAIN', 'RAIL'],
                        //routingPreference: 'LESS_WALKING',
                    },
                    drivingOptions : null,

                };
            }else if(travelMethod === '1'){
                transType = 'DRIVING';
                typeOption = {
                    transitOption : null,
                    drivingOptions : null,
                    
                };
            }else if(travelMethod === '2'){
                transType = 'WALKING';
                typeOption = {
                    transitOption : null,
                    drivingOptions : null,
                    
                };
            }

            console.log(`app.currLoc.latitude, app.currLoc.longitude : ${app.currLoc.latitude}, ${app.currLoc.longitude}`);
            console.log(`app.currentMarker.position.lat, app.currentMarker.position.lng : ${app.currentMarker.position.lat()}, ${app.currentMarker.position.lng()}`);

            if(app.currentLocMarker === null){
                let ev = {
                    latLng : {
                        lat : function () {return app.currLoc.latitude;},
                        lng : function () {return app.currLoc.longitude;}
                    }
                };
                app.addMarker(ev);
            }else{
                // current place marker already exists
                // pass
            }
            
            let request = {
                origin: new google.maps.LatLng(app.currentLocMarker.position.lat(), app.currentLocMarker.position.lng()),
                destination: new google.maps.LatLng(app.currentMarker.position.lat(), app.currentMarker.position.lng()),
                travelMode:transType,
                transitOptions:typeOption.transitOption,
                drivingOptions:typeOption.drivingOptions,
                unitSystem: google.maps.UnitSystem.METRIC

            };
            //, google.maps.DirectionsTravelMode.WALKING],

            currServiceDirection.route(request, (result, status)=>{
                console.group("Route finder");
                console.log("result", result);
                console.log("status", status);
                console.groupEnd();

                if (status == 'OK'){
                    let directionRender = new google.maps.DirectionsRenderer({
                        polylineOptions: {
                          //strokeColor: "#00FF00"
                        },
                        suppressMarkers: true,
                      });
                    // directionRender.setMap(app.map);
                    // directionRender.setDirections(result);

                    directionQueue.push(directionRender)
                    for(var i=0; i<directionQueue.length; i++){
                        directionQueue[i].setMap(app.map);
                        directionQueue[i].setDirections(result);
                    }

                }else{
                    alert('no direction found..! Please select Public Transportation and retry');
                }

            });

        }
        

    },

    loadPlaceMarkerInfo : function(){
        /**when marker is clicked, load information on the marker using API InfoWindow */
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

                dispText += `<h1>${queryResult.name}</h1>
                            <p>rating : ${queryResult.rating}</p>
                            <p>total review number : ${queryResult.user_ratings_total}</p>
                            
                            <p>address : ${queryResult.formatted_address}</p>
                            <p>more info : <a href=https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryResult.name)}&query_place_id=${queryResult.place_id}>Link</a></p>
                            
                `; //<!--<p>is open now : ${openhourText}</p>-->
                // <p>${String(queryResult.photos[0].html_attributions[0]).replace(/>\.*</gi,"Deail info redirect")}</p>
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

            //clear if routes exist
            app.directionQueueClear();
        }
    },

    addMapListeners: function() {
      /** double click on map, adds current position marker */
      console.log("addMapListeners");
      //add double click listener to the map object

      app.map.addListener("dblclick", app.addMarker);

    },
    addMarker: function(ev) {
      /** function that adds marker to map */
      console.log("addMarker", ev);
      console.log("app.currentLocMarker before :: ", app.currentLocMarker);
      
      if(app.currentLocMarker === null){
        app.currentLocMarker= new google.maps.Marker({
            map: app.map,
            draggable: true,
            icon: {
                url: "/images/black-48dp/1x/outline_place_black_48dp.png"
              },
            position: {
            lat: ev.latLng.lat(),
            lng: ev.latLng.lng()
            }
        });
        //add click listener to Marker
        app.currentLocMarker.addListener("click", app.markerClick);
        //add double click listener to Marker
        app.currentLocMarker.addListener("dblclick", app.markerDblClick);
        // dragging the marker
        app.currentLocMarker.addListener("drag", (ev)=>{
            app.deleteTable();
            app.updateTable();
        });


      }else{
        app.currentLocMarker.setMap(null);
        app.currentLocMarker = null;
        app.addMarker(ev);
      }
      console.log("app.currentLocMarker after :: ", app.currentLocMarker);
    },
    markerClick: function(ev) {
      console.log("Click", ev);
      console.log(this);
      let marker = this; // to use the marker locally
      app.currentLocMarker = marker; //to use the marker globally
      app.map.panTo(marker.getPosition());
    },
    markerDblClick: function(ev) {
      console.log("Double Click", ev);
      console.log(this);
      let marker = this; //to use the marker locally

      marker.setMap(null);
      app.currentLocMarker = null;
    },
    failPosition: function(err) {
      console.log("failPosition", err);
      //failed to get the user's location for whatever reason
      app.gotPosition(app.defaultPos);
    }
  };
  
  app.init();


