//Contains all executables i.e buttons:
$( document ).ready(function() {

  //function attached to the button1 - FIND all incidents by automatic geo location
  $( "#button1" ).click(function() {  

    //prevent any action from this button if denied access by user.
    if(window.deniedLocation == false){

      //remove any previous messages
      safrMain.removeData(); 

      window.$year = $( "#year" ).val();
      window.$month = $( "#month" ).val();
      window.$reclat = window.coor.k;
      window.$reclon = window.coor.A;

      //get all incidents data for that month
      safrMain.getIncidents($reclat, $reclon, $year, $month);
      //send all data to storage
      safrData.sendStorage($reclat, $reclon, $year, $month);
    }

  }); 

  //function attached to the button 2 - FIND all incidents by entered postcode
  $( "#button2" ).click(function() {

    //remove any previous messages
    safrMain.removeData();

    //the below function will take an entered postcode and get the lat and lon
      var geocoder = new google.maps.Geocoder();
      var address = document.getElementById("txtAddress").value;
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          window.$year = $( "#year" ).val();
          window.$month = $( "#month" ).val();
          window.$reclat = results[0].geometry.location.lat();
          window.$reclon = results[0].geometry.location.lng();

          //get all incidents data for that month
          safrMain.getIncidents($reclat, $reclon, $year, $month);
          //send all data to storage
          safrData.sendStorage($reclat, $reclon, $year, $month);

          //relocate the map position to the lat and lag being passed:
          var options1 = {
            map: map,
            position: new google.maps.LatLng($reclat, $reclon)
          };

          var infowindow1 = new google.maps.InfoWindow(options1);
          map.setCenter(options1.position);

         } 
         else {
          //inserting custom message to the user
          $( "#arraycontent" ).append( 'No records found!' );
        }
      });      
  });

  //function for the incident check box - show or hide them!
  $( '#incidentsChk' ).click(function() {
    $("#incidentsChk").is(':checked') ? safrGeo.setMarkers(map) : safrGeo.clearMarkers();       
  });

  //get host information when page ready - used by safr.data later in process
  $.support.cors = true;
  $.ajax({
      url : "http://api.hostip.info/get_html.php",
      type: "GET",
      data : "json",
      success: function(json, textStatus, jqXHR){
        var hostInfo = json.split("\n");
        for(var a = 0; a < hostInfo.length; a++){
          window.hostDetails.push(hostInfo[a]);
        }
      },
      error: function(jqXHR, textStatus, errorThrown)
      {
        console.log(textStatus, errorThrown);
      }
  });

});
