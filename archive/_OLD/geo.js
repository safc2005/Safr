//SCRIPT VERSION 0.03

//global variable
var coor;
var deniedLocation = false;

/*** START OF GOOGLE MAPS SCRIPT ***/

var map;

function initialize() {
  var mapOptions = {
    zoom: 14
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      // SNE: custom work to capture the location and use in safrscript later
      coor = pos;

      //SNE: custom work to add new marker for 'your' location
      var image = new google.maps.MarkerImage('http://www.stephennew.com/safr/markers/loc.gif',
        new google.maps.Size(129, 42),
        new google.maps.Point(0,0),
        new google.maps.Point(18, 42)
      );

      // SNE: custom work to attach the above a marker
      var marker1 = new google.maps.Marker({
        position: pos,
        map: map,
        icon: image
      });

      /*var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You'
      });*/
      
      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation or users selects DENY
    handleNoGeolocation(false);    
  }
}

// SNE: this function will be executed if the user selects DENY or the browser doesn't support HTML 5 geolocation
function handleNoGeolocation(errorFlag) {

  //SNE: this statement will check if the geo has been denied and hide #button1
  deniedLocation = true;
  $( '#button1' ).hide();

  if (errorFlag) {
    var content = 'You denied us access!' ;
    // SNE: custom failure status inserted into the page
    $( "#arraycontent" ).append( 'Sorry you denied us access to your location - try searching by your address' );
  } else {
    var content = 'Update to a better browser!';
    // SNE: custom failure status inserted into the page
    $( "#arraycontent" ).append( "Sorry your browser isn't great - try searching by your address" );
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(52.2, -1),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);
