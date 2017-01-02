//SCRIPT VERSION 0.11

/*** START OF SAFR SCRIPTS ***/
$(document).ready(function(){

	/** GLOBAL VARIABLES **/
	var $incidents = [];
  var $year;
  var $month;
  var $reclat;
  var $reclon;
  /** END OF GLOBAL VAIRABLES **/

  //object to change the default incident outcome to readable content
  var __categories = {  'awaiting-court-result' : 'Awaiting court outcome',  'court-result-unavailable' : 'Court result unavailable',  'unable-to-proceed' : 'Court case unable to proceed',  'local-resolution' : 'Local resolution',  'no-further-action' : 'No further action at this time',  'deprived-of-property' : 'Offender deprived of property',  'fined' : 'Offender fined',  'absolute-discharge' : 'Offender given absolute discharge',  'cautioned' : 'Offender given a caution',  'penalty-notice-issued' : 'Offender given a penalty notice',  'community-penalty' : 'Offender given community sentence',  'conditional-discharge' : 'Offender given conditional discharge',  'suspended-sentence' : 'Offender given suspended prison sentence',  'imprisoned' : 'Offender sent to prison',  'other-court-disposal' : 'Offender otherwise dealt with',  'compensation' : 'Offender ordered to pay compensation',  'sentenced-in-another-case' : 'Suspect charged as part of another case',  'charged' : 'Suspect charged',  'not-guilty' : 'Defendant found not guilty',  'sent-to-rown-court' : 'Defendant sent to Crown Court',  'unable-to-prosecute' : 'Unable to prosecute suspect',  'under-investigation' : 'Under investigation'  }

  //funtion to take a string i.e returned category and remove the '-' and upperCase the first letter of the first word.
  function __upperCase(s) {
      s = s.replace(/\-/g, ' ')
      return s[0].toUpperCase() + s.slice(1);
  }

  //empty previously shown/populated content
  function removeData() {   
    //resets the incidents array and lenght
    $incidents = []; 
    //removes display info #1
    $( '#arraycontent' ).empty();
    //removes display info #2
    $( '#arraycontent2' ).empty();
  }

  /*************************  BUTTONS *************************/

	//function attached to the button1 - FIND all incidents by automatic geo location
	$( "#button1" ).click(function() {   

    //prevent any action from this button if denied access by user.
    if(window.deniedLocation == false){

      //remove any previous messages
      removeData(); 

      $year = $( "#year" ).val();
      $month = $( "#month" ).val();
      $reclat = window.coor.k;
      $reclon = window.coor.A;

      //get all incidents data for that month
      getIncidents($reclat, $reclon, $year, $month);
    }

	}); 

  //function attached to the button 2 - FIND all incidents by entered postcode
  $( "#button2" ).click(function() {

    //remove any previous messages
    removeData();

    //the below function will take an entered postcode and get the lat and lon
      var geocoder = new google.maps.Geocoder();
      var address = document.getElementById("txtAddress").value;
      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {

          $year = $( "#year" ).val();
          $month = $( "#month" ).val();
          $reclat = results[0].geometry.location.lat();
          $reclon = results[0].geometry.location.lng();

          //get all incidents data for that month
          getIncidents($reclat, $reclon, $year, $month);

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

  /**************** END ******************************************/



  /********************** INCIDENTS ********************************/

  // get all incidents from the data retrieved
  function getIncidents(latitude, longitude, year, month){
    //this is the ajax reques (uses $.POST) to get the data from the API
    $.ajax({
      url : "http://data.police.uk/api/crimes-street/all-crime?lat=" + latitude + "&lng=" + longitude + "&date=" + year + "-" + month +"",
      type: "POST",
      data : "json",
      //the below will complete when the status 200/success is returned
      success: function(json, textStatus, jqXHR)
      {
        //loops through all the incidents and at the moment gets the street name only
        $.each( json, function( key, val ) {

          //SNE: not needed at this time
          var $inId = val.id;
          var $inMonth = val.month;
          var $category = __upperCase(val.category);
          var $streetname = val.location.street.name;             
          var $latnum = val.location.latitude;
          var $lonnum = val.location.longitude;
          var $outStatus = val.outcome_status;
          //some of the outcome statuses are not yet listed || no outcome
          if ($outStatus != null){
            $outStatus = val.outcome_status.category;
          }
          else{
            $outStatus = 'Awaiting outcome';
          }         

          var image = new google.maps.MarkerImage('http://www.stephennew.com/safr/markers/mrkr.gif',
          // This marker is 129 pixels wide by 42 pixels tall.
          new google.maps.Size(129, 42),
          // The origin for this image is 0,0.
          new google.maps.Point(0,0),
          // The anchor for this image is the base of the flagpole at 18,42.
          new google.maps.Point(18, 42)
          );
           
          // create a marker for the key in loop
          var marker1 = new google.maps.Marker({
          position: new google.maps.LatLng($latnum,$lonnum),
          map: map,
          icon: image
          });

          // Add listener for a click on marker icon
          google.maps.event.addListener(marker1, 'click', function() {
            infowindow1.open(map, marker1);
          });
           
          // Add information window to the pin that has been clicked
          var infowindow1 = new google.maps.InfoWindow({
            content:  createInfo( '<strong>Id: ' + $inId + '</strong><br>Category: ' + $category + '<br>Location: ' + $streetname + '<br>Month: ' + $inMonth + '<br>Outcome: ' + $outStatus)
          });
             
          // Create information window for the clicked pin
          function createInfo(content) {
          return '<div class="infowindow">' + content + '</div>';
          }

          pushIncidents($streetname, $category, $latnum, $lonnum, $outStatus );

        });
  
        //OUTPUTS the above incident array length       
        $( "#arraycontent" ).append( '' + incidentsLength($incidents) + ' Incidents' );

        //pass the users DATE selection to the report function
        prevMonthReport($reclat, $reclon, $year, $month);         

      },
      //the below will complete when the status 400/failure is returned
      error: function (jqXHR, textStatus, errorThrown)
      {
        //inserting custom message to the user
        $( "#arraycontent" ).append( '<br>No records found!' );
      }
    });   
  }  

  /**************************** END  *************************************************/


  /**************************** REPORTING AREA ***************************************/

  //previous month report
  function prevMonthReport(latitude, longitude, year, month){
    var reportMonth = Number(month);
    var reportYear = Number(year);
    // first check if it january then revert to december and decrease the year
    if (reportMonth == 1){
      reportMonth = "12";
      reportYear = reportYear -1;
    }
    else {
      // if the end month is single digit add the zero for API url.
      reportMonth = (reportMonth - 1).toString();
      if (reportMonth.length < 2) {
        reportMonth = '0' + reportMonth;  
      }
      else {
        reportMonth;
      }
    }
    // once the previous month has been worked out these are then ran through the API and the numbers are captured/displayed
    $.ajax({
      url : "http://data.police.uk/api/crimes-street/all-crime?lat=" + latitude + "&lng=" + longitude + "&date=" + reportYear + "-" + reportMonth +"",
      type: "POST",
      data : "json",
      success: function(json, textStatus, jqXHR) { 
        //OUTPUTS the above array length       
        $( "#arraycontent2" ).append( '' + incidentsLength(json) + ' Previous Month Incidents' );; 
      },
      error: function (jqXHR, textStatus, errorThrown) { console.log('error');  }
    });
  }

  //pushed all info from main incident array
  function pushIncidents($streetname, $category, $latnum, $lonnum, $outStatus){
    $incidents.push( "<li'>" + $streetname + ', ' + $category + ', ' + $latnum + ', ' + $lonnum + ', ' + $outStatus + "</li><br>" );
  }

  //get the number of total incidents for the month reported
  function incidentsLength($incidents){
    return $incidents.length;
  }



  /************** END OF REPORTING FUNCTION ******/




});

/*** END ***/
