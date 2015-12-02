/*Don't worry, this site lets the user rest easy knowing their escape to Disney parks from 
wherever they are at.
It is a simple website that pulls the user's location from the html5 api and gives them 
directions to DisneyLand then to DisneyWorld via google's map api. Content is refreshed 
on the page without the page being refreshed.*/

//variables
var pos, lata, lon;
var disneyLat = 33.812511;
var disneyLon = -117.918976;
var disneyWorldLat = 28.371219;
var disneyWorldLong = -81.5150925;

var $floating_panel;
var $panic2 = $('#panic2');
var elDirections = document.getElementById('directions');
var elMap = document.getElementById('map'); //element where the map will go
var map; //actual map
var directionsDisplay;
var directionsService;


// panic button event listener
$('#panic').click(function() {
    $('#panic').fadeOut().hide();
    $('#floating-panel h2').text("DON'T WORRY");
    $floating_panel = $('#floating-panel h2');
    getLocation();
});
$('#panic2').click(function() {
    $('#panic2').fadeOut().hide();
    $floating_panel.text("REALLY! DON'T WORRY");

    calculateAndDisplayRoute(directionsService, directionsDisplay, disneyWorldLat, disneyWorldLong, "DISNEY WORLD");

});

function getLocation(destination) {
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
  showPosition takes a position as a parameter from the browser's geolocation response. From that location we cache the latitude and longitude of the location in vars.  Then push on to the initMap function to put a map into the view.
*/

function showPosition(position) {
    lata = position.coords.latitude;
    lon = position.coords.longitude;
    initMap();
}

function initMap() {
    directionsDisplay = new google.maps.DirectionsRenderer;
    directionsService = new google.maps.DirectionsService;
    map = new google.maps.Map(elMap, {
        zoom: 14,
        center: {
            lat: lata,
            lng: lon
        }
    });
    
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(elDirections); 

    calculateAndDisplayRoute(directionsService, directionsDisplay, disneyLat, disneyLon, "DISNEYLAND");
    
    $floating_panel.fadeOut('slow').hide();
    $panic2.fadeIn(3000);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, destinationLat, destinationLon, destination) {
    /*
  The route funciton works by passing an oject that holds the origin, destination, and travelMode then as 
  a second parameter -- a function with instructions on what to do with the response from the google 
  directions api.
*/
    
    directionsService.route({
        origin: {
            lat: lata,
            lng: lon
        }, // here.
        destination: {
            lat: destinationLat,
            lng: destinationLon
        }, //disneyland lat/long
        travelMode: google.maps.TravelMode.DRIVING //set travel mode
    }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
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