let map; // global access
//const GOOGLE_MAP_KEY = "<%=google_map_key%>"
document.addEventListener("DOMContentLoaded", () => {
    let s = document.createElement("script");
    document.head.appendChild(s);
    s.addEventListener("load", () => {
        //script has loaded
        console.log("script has loaded");
        map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: 45.3496711,
                lng: -75.7569551
            },
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    });
    //console.log('map key : ',GOOGLE_MAP_KEY)
    s.src = `https://maps.googleapis.com/maps/api/js?key=${"<%=google_map_key%>"}`;
});