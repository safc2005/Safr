var safrReporting = safrReporting || {};
var elementCount = {};

safrReporting = {

	prevMonthReport : function (latitude, longitude, year, month){
	    var reportMonth = Number(month),
	    	reportYear = Number(year);
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
	        $( "#arraycontent2" ).append( '' + safrReporting.incidentsLength(json) + ' Previous Month Incidents' );; 
	      },
	      error: function (jqXHR, textStatus, errorThrown) { console.log('error');  }
	    });
  	},  	
    //pushed all info from main incident array
    pushIncidents : function (streetname, category, latnum, lonnum, outStatus){
	    window.$incidents.push( "<li'>" + streetname + ', ' + category + ', ' + latnum + ', ' + lonnum + ', ' + outStatus + "</li><br>" );
  	},
  	//get the number of total incidents for the month reported
  	incidentsLength : function (incidents){
	    return incidents.length;	    
  	},
  	getDateTime : function(){
  		var safrDate = new Date();
  		return safrDate;
  	},
  	numUniqueElements : function(c){   		  		 		
  		$.each(c, function(){  			
		    var cat = this;
		    elementCount[cat] = elementCount[cat]+1 || 1; 
		});		
  	},
  	displayElements : function(e){
  		$.each(e, function(i, val){ 
  			$( "#arraycontent3" ).append( i + ': ' + val + '<br />' );
  		});
  	}
};