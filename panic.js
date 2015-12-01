var elMap = document.getElementById('map');
var $floating_panel;
var $button = $('button');
var pos, lata, lon;
var disneyLat = 33.812511;
var disneyLon = -117.918976;

$('#panic').click(function() {
    $('#panic').fadeOut().remove();
    //$('#floating_panel').css("border", "border: 1px solid black");
    $('#floating-panel h2').text("DON'T WORRY");
    $floating_panel = $('#floating-panel h2');
    getLocation();
});

function getLocation() {
        if (navigator.geolocation) {
            $floating_panel.fadeIn('slow');
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            $floating_panel.text(
                'Geolocation is not supported by this browser.');
            demo.innerHTML = "Geolocation is not supported by this browser.";
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
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var directionsService = new google.maps.DirectionsService;
    var map = new google.maps.Map(elMap, {
        zoom: 14,
        center: {
            lat: lata,
            lng: lon
        }
    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions'));
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    $floating_panel.fadeOut('slow').hide();
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    /*
  The route funciton works by passing an oject that holds the origin, destination, and travelMode then as a second parameter -- a function with instructions on what to do with the response from the google directions api.
*/
    directionsService.route({
        origin: {
            lat: lata,
            lng: lon
        }, // here.
        destination: {
            lat: disneyLat,
            lng: disneyLon
        }, //disneyland lat/long
        travelMode: google.maps.TravelMode.DRIVING //set travel mode
    }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            $floating_panel.text(
                "THIS IS HOW YOU GET TO DISNEYLAND").fadeIn(
                'slow');
            elMap.fadeIn('slow');
        } else {
            window.alert('Directions request failed due to ' +
                status);
        }
    });
}