//SCRIPT VERSION 0.04

//Global Variables
var safrGeo = safrGeo || {},
    coor,
    deniedLocation = false,
    marker1,
    map,
    activeMarkers = false,
    markersArray = [];

safrGeo = {

    initialize : function() {

      /*var styles=[{featureType:"landscape",stylers:[{color:"#080a23"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#212f48"}]},{elementType:"geometry.stroke",stylers:[{color:"#212f48"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{elementType:"labels.text.fill",stylers:[{color:"#ffffff"}]},{featureType:"road",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},
    {featureType:"transit",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"labels.text.fill",stylers:[{hue:"#ffdd00"},{color:"#f09926"}]},{featureType:"poi",elementType:"geometry",stylers:[{visibility:"on"},{color:"#232f48"},{saturation:4},{lightness:21}]},{featureType:"poi.park",stylers:[{color:"#76c980"}]},{featureType:"poi.school",stylers:[{color:"#5b7fad"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#ff3180"}]},{featureType:"water",
    elementType:"geometry",stylers:[{color:"#5f80ff"}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"water",stylers:[{lightness:48},{saturation:-63}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#8080d5"},{saturation:-39}]},{elementType:"labels.text",stylers:[{lightness:-49}]},{}];*/

      var styles = [{featureType: "landscape.man_made",elementType: "geometry",stylers: [{ visibility: "on" },{ color: "#000000" }]},{featureType: "landscape.natural",stylers: [{ visibility: "on" },{ color: "#1b1b1b" }]},{featureType: "road",elementType: "geometry.stroke",stylers: [{ visibility: "off" }]
    },{featureType: "road",elementType: "geometry.fill",stylers: [{ color: "#444444" }]},{elementType: "labels.text.stroke",stylers: [{ visibility: "off" }]},{elementType: "labels.text.fill",stylers: [{ color: "#989898" }]    },{featureType: "poi.park",stylers: [{ color: "#999999" }]},{elementType: "labels.text",stylers: [{ lightness: 100 }]},{stylers: [{ gamma: 1.25 },{ lightness: 32 }]    }  ];

      var styledMap = new google.maps.StyledMapType(styles,
        {name: "Styled Map"});

      var mapOptions = {
        zoom: 14,
        disableDefaultUI: true,
        mapTypeControlOptions: {
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        } 
      };

      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	  map = new google.maps.Map(document.getElementById('map-canvastwo'), mapOptions);

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
          marker1 = new google.maps.Marker({
            position: pos,
            map: map,
            icon: image
          });
          
          map.setCenter(pos);

          google.maps.event.addListener(marker1, 'click', safrGeo.toggleBounce);

        }, function() {
          safrGeo.handleNoGeolocation(true);
        });
      } else {
        // Browser doesn't support Geolocation or users selects DENY
        safrGeo.handleNoGeolocation(false);    
      }
    },

    handleNoGeolocation : function (errorFlag) {
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
    },
    addMarker : function(lat, lon, cat, street, month, status){
        //marker watcher (if true when new search complete the map will be reiniatlized)
        activeMarkers = true;

        var image = new google.maps.MarkerImage('http://www.stephennew.com/safr/content/markers/crime_marker.svg',
        // This marker is 129 pixels wide by 42 pixels tall.
        new google.maps.Size(129, 42),
        // The origin for this image is 0,0.
        new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 18,42.
        new google.maps.Point(18, 42)
        );
         
        // create a marker for the current key in loop
        var safrMarker = new google.maps.Marker({
          position: new google.maps.LatLng(lat,lon),
          //map: map, //removed to allow control of setting the markers
          icon: image
        });

        // Add listener for a click on current marker
        google.maps.event.addListener(safrMarker, 'click', function() {
          infowindow1.open(map, safrMarker);
        });
         
        // Add information window to the pin that has been clicked
        var infowindow1 = new google.maps.InfoWindow({
          content:  createInfo( 'Category: ' + cat + '<br>Location: ' + street + '<br>Month: ' + month + '<br>Outcome: ' + status)
        });
           
        // Create information window for the clicked pin
        function createInfo(content) {
          return '<div class="infowindow">' + content + '</div>';
        }

        //pushing current marker into the Marker Array - needed by setMarkers and clearMarkers
        markersArray.push(safrMarker);

    },   
    setMarkers : function(map){
        for (var i = 0; i < markersArray.length; i++) {
          markersArray[i].setMap(map);
        }
    },
    clearMarkers : function(){
        safrGeo.setMarkers(null);
    },
    toggleBounce : function(){
        if (marker1.getAnimation() != null) {
            marker1.setAnimation(null);
        } else {
            marker1.setAnimation(google.maps.Animation.BOUNCE);
        }
    }
}

google.maps.event.addDomListener(window, 'load', safrGeo.initialize);