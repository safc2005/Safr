$.ajax({
    url : "http://data.police.uk/api/crimes-street/all-crime?lat=54.9272030&lng=-1.4215940&date=2014-02",
    type: "POST",
    data : json,
    success: function(data, textStatus, jqXHR)
    {
        console.log('YESYES')
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
        console.log('NONO')
    }
});


//old request:

//this gets the JSON from the URL - police api
        /*$.getJSON("http://data.police.uk/api/crimes-street/all-crime?lat=" + $reclat + "&lng=" + $reclon + "&date=2014-02", function(json) {
        
            //this uses the returned JSON and get the latitude from the first incident array
            $info = json[0].location.latitude;

            //loops through all the incidents and at the moment gets the street name only
            $.each( json, function( key, val ) {

                var $streetname = val.location.street.name;   
          var $latnum = val.location.latitude;
          var $lonnum = val.location.longitude;
                $incidents.push( "<li'>" + $streetname + ', ' + $latnum + ', ' + $lonnum + "</li><br>" );
            });

            //inserts the above incident latitude and show on the page
            $( "#texthere" ).append( 'the latitude is: ' +  $info );  

            //inserts the above incident array length
            $( "#arraycontent" ).append( 'there were: ' + $incidents.length + ' incidents in 2014-02' );  

      //inserts the above incident array
      $( "#arraycontent2" ).append( $incidents ); 

        });*/