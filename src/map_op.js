

let map;

const tmp_G = document.getElementById("needme");
const GOOGLE_MAP_KEY = tmp_G.getAttribute("gk");
//console.log('map key : ',GOOGLE_MAP_KEY);

const curPosFunction = ()=>{

    return new Promise( (resolve, reject) => {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position) => {
    
                    // position.coords.latitude
                    // position.coords.longitude
                    console.group('map cur pose');
                    console.log('lat : ', position.coords.latitude)
                    console.log('lng : ', position.coords.longitude)
                    console.groupEnd();
                    resolve( [position.coords.latitude, position.coords.longitude]);
                });
    
            
    
        }else{
            resolve([ 45.4496711, -75.6569551 ]);
        }

    })

}

function mapFactory(t_lat, t_lng){
    return new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: t_lat,
            lng: t_lng
        },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        restriction: {
            latLngBounds: {
                north: 50.00,
                south: 40.00,
                west: -100.00,
                east: -60.00,
            }
        },
        minZoom: 10,
        maxZoom: 17,
        disableDoubleClickZoom: false,
        clickableIcons: false,
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
}


document.addEventListener("DOMContentLoaded", () => {
    let s = document.createElement("script");
    let locationButton = document.getElementById("nowbutton");

    document.head.appendChild(s);

    s.addEventListener("load", () => {
        //script has loaded
        console.log("script has loaded. About to load the map");

        curPosFunction().then((result)=>{
            console.log('after resolve : ', result);

            map = mapFactory(result[0], result[1]);
        });

    });
    
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_KEY}`;

        
    locationButton.addEventListener("click", ()=>{
        //event triggered from button
        console.log("event triggered by the map");

        curPosFunction().then((result)=>{
            console.log('after resolve : ', result);

            map = mapFactory(result[0], result[1]);
        });


    });


    
});


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