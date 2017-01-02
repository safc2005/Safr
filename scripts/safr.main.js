//SCRIPT VERSION 0.22

var safrMain = safrMain || {},
    $incidents = [],
    $year,
    $month,
    $reclat,
    $reclon,
    $rptCategories = [];

safrMain = { 

    upperCase : function (s) {
        s = s.replace(/\-/g, ' ')
        return s[0].toUpperCase() + s.slice(1);  
    },
    removeData : function () {
        //resets the incidents array and length
        $incidents = []; 
        $( '#arraycontent' ).empty();
        $( '#arraycontent2' ).empty(); 
        $( '#arraycontent3' ).empty();
        //if not the first search the map will be reinitialized removing previous markers
        if (window.activeMarkers == true){
            safrGeo.clearMarkers();
        }
        //hide the toggles
        safrMain.hideToggles();
    },
    getIncidents : function (latitude, longitude, year, month){
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
              var $category = safrMain.upperCase(val.category);
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
              //adds the marker
              safrGeo.addMarker($latnum,$lonnum, $category, $streetname, $inMonth, $outStatus); 
              //incident array
              safrReporting.pushIncidents($streetname, $category, $latnum, $lonnum, $outStatus );
              //push categories into array
              $rptCategories.push($category);
              
            });
      
            /**OUTPUTS**/

              //setting the markers
              safrGeo.setMarkers(map);

              //the above incident array length       
              $( "#arraycontent" ).append( '' + safrReporting.incidentsLength($incidents) + ' Incidents' );

              //pass the users DATE selection to the report function
              safrReporting.prevMonthReport($reclat, $reclon, $year, $month);   

              //shows all the toggles that wil be available
              safrMain.showToggles();     

              //reporting category - unique elements
              safrReporting.numUniqueElements($rptCategories); 

              //display elements
              safrReporting.displayElements(window.elementCount)

            /**END**/           

          },
          //the below will complete when the status 400/failure is returned
          error: function (jqXHR, textStatus, errorThrown){
              //inserting custom message to the user
              $( "#arraycontent" ).append( '<br>No records found!' );
          }
      });   
    },
    showToggles : function(){        
        $( '#surrCheck' ).show();        
        document.getElementById("incidentsChk").checked = true;
    },
    hideToggles : function(){
        $( '#surrCheck' ).hide();        
        document.getElementById("incidentsChk").checked = false;
    },
    categories : {  'awaiting-court-result' : 'Awaiting court outcome',  'court-result-unavailable' : 'Court result unavailable',  'unable-to-proceed' : 'Court case unable to proceed',  'local-resolution' : 'Local resolution',  'no-further-action' : 'No further action at this time',  'deprived-of-property' : 'Offender deprived of property',  'fined' : 'Offender fined',  'absolute-discharge' : 'Offender given absolute discharge',  'cautioned' : 'Offender given a caution',  'penalty-notice-issued' : 'Offender given a penalty notice',  'community-penalty' : 'Offender given community sentence',  'conditional-discharge' : 'Offender given conditional discharge',  'suspended-sentence' : 'Offender given suspended prison sentence',  'imprisoned' : 'Offender sent to prison',  'other-court-disposal' : 'Offender otherwise dealt with',  'compensation' : 'Offender ordered to pay compensation',  'sentenced-in-another-case' : 'Suspect charged as part of another case',  'charged' : 'Suspect charged',  'not-guilty' : 'Defendant found not guilty',  'sent-to-rown-court' : 'Defendant sent to Crown Court',  'unable-to-prosecute' : 'Unable to prosecute suspect',  'under-investigation' : 'Under investigation' 
    }
}