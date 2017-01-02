//SCRIPT VERSION 0.03

//Global Variables
var coor,
    deniedLocation = false,
    map;

/*** START OF GOOGLE MAPS SCRIPT ***/

function initialize() {

  var styles=[{featureType:"landscape",stylers:[{color:"#080a23"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#212f48"}]},{elementType:"geometry.stroke",stylers:[{color:"#212f48"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"road",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},
{featureType:"transit",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{hue:"#ffdd00"},{color:"#f09926"}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#232f48"},{saturation:4},{lightness:21}]},{featureType:"poi.park",stylers:[{color:"#76c980"}]},{featureType:"poi.school",stylers:[{color:"#5b7fad"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#ff3180"}]},{featureType:"water",
elementType:"geometry",stylers:[{color:"#5f80ff"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",stylers:[{lightness:48},{saturation:-63}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#8080d5"},{saturation:-39}]},{elementType:"labels.text",stylers:[{lightness:-49}]},{}];

  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});


  var mapOptions = {
    zoom: 14,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    } 
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  map.mapTypes.set('map_style', styledMap);
  map.setMapTypeId('map_style');

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

      // SNE: custom work to capture the location and use in safrscript later
      coor = pos;

      //SNE: custom work to add new marker for 'your' location
      var image = new google.maps.MarkerImage('http://www.stephennew.com/safr/content/markers/loc.gif',
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
