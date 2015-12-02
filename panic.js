/*Don't worry, this site lets the user rest easy knowing their escape to Disney parks from 
wherever they are at.
It is a simple website that pulls the user's location from the html5 api and gives them 
directions to DisneyLand then to DisneyWorld via google's map api. Content is refreshed 
on the page without the page being refreshed.
@author Jim Vermillion
*/

//variables & CONSTANTS
var lata, lon;     
var DISNEYLAT = 33.812511;
var DISNEYLON = -117.918976;
var DISNEYWORLDLAT = 28.371219;
var DISNEYWORLDLONG = -81.5150925;

var $floating_panel;
var $panic2 = $('#panic2');                                 //second panic button
var elDirections = document.getElementById('directions');   //element where directions will go
var elMap = document.getElementById('map');                 //element where the map will go
var map; //actual map
var directionsDisplay;
var directionsService;


// panic & panic2 button event listeners 
$('#panic').click(function() {
    $('#panic').fadeOut().hide();
    $('#floating-panel h2').text("DON'T WORRY");
    $floating_panel = $('#floating-panel h2');
    getLocation();
});
$('#panic2').click(function() {
    $('#panic2').fadeOut().hide();
    $floating_panel.text("REALLY! DON'T WORRY");
    calculateAndDisplayRoute(directionsService, directionsDisplay, DISNEYWORLDLAT, DISNEYWORLDLONG, "DISNEY WORLD");
});

/*
    getLocation uses the html5 api to get the location of the user
*/
function getLocation() {
        if (navigator.geolocation) {
            $floating_panel.fadeIn('slow');
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $floating_panel.text(
                'Geolocation is not supported by this browser.');
            elMap.innerHTML = "Geolocation is not supported by this browser.";
            $floating_panel.fadeIn('slow');
        }
    }
/*
    showPosition takes a position as a parameter from the browser's geolocation response. From that location 
    we cache the latitude and longitude of the location in vars.  Then push on to the initMap function to put a 
    map into the view.
    @param position Object "supplied by html5 api, location position Object"
*/
function showPosition(position) {
    lata = position.coords.latitude;
    lon = position.coords.longitude;
    initMap();
}
/*
    Function initializes map with current location and instantiates the google map/directions objects
*/
function initMap() {
    directionsDisplay = new google.maps.DirectionsRenderer;     //google objects
    directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(elMap, {
        zoom: 14,
        center: {
            lat: lata,
            lng: lon
        }
    });
    
    directionsDisplay.setMap(map);                              //set the map view component
    directionsDisplay.setPanel(elDirections);                   //set the directions view component

    //call the function that gets the route
    calculateAndDisplayRoute(directionsService, directionsDisplay, DISNEYLAT, DISNEYLON, "DISNEYLAND");
    
    //tie up visual loose ends
    $floating_panel.fadeOut('slow').hide();
    $panic2.fadeIn(3000);
}

/*
    Function calculates route.
    @param directionService Object "model of google directions", 
    @param directionDisplay Object "view of google directions", 
    @param destinationLat float "destination's latitude", 
    @param destinationLon float "destination's longitude",
    @param destination string "name of destination"
*/
function calculateAndDisplayRoute(directionsService, directionsDisplay, destinationLat, destinationLon, destination) {    
    directionsService.route({                                   // here.
        origin: {
            lat: lata,
            lng: lon
        }, 
        destination: {                                          //disneyland/world lat/long
            lat: destinationLat,
            lng: destinationLon
        }, 
        travelMode: google.maps.TravelMode.DRIVING              //set travel mode
    }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {        //if it's all load the directions
            directionsDisplay.setDirections(response);
            $floating_panel.text(
                "THIS IS HOW YOU GET TO " + destination).fadeIn(
                'slow');
        } else {
            window.alert('Directions request failed due to ' +
                status);
        }
    });
}