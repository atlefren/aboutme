var blog = {};

(function(ns){

    var showMap = ns.showMap = function(pos){
        $("#map").css("height", window.innerHeight  +"px");

        if(pos) {
            createMap(pos.lon, pos.lat);
        } else {
            createMap(10.4, 60.4);
        }
    };

    var createMap = function(lon, lat){
        var map = L.map('map', {zoomControl: false}).setView([lat, lon], 10);
        map.attributionControl.setPrefix("");
        L.tileLayer('http://{s}.tile.cloudmade.com/{key}/998/256/{z}/{x}/{y}.png',
            {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
                maxZoom: 18,
                key: "298f62509c504480b82849744356fd20"

            }
        ).addTo(map);
    };



    window.onscroll = function() {
        $("#map").css("top", window.pageYOffset + "px");

    };
}(blog));