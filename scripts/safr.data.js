var safrData = safrData || {};

var hostDetails = [];

safrData = {

	ip : function(){		
	    for (i=0; i < hostDetails.length; i++) {
	        var dataCheck = hostDetails[i].split(":");
	        if ( dataCheck[0] == "IP" ) {
	        	return dataCheck[1];
        	}
	    }
	    return false;
	},
	country : function(){
	    for (i=0; i < hostDetails.length; i++) {
	        var dataCheck = hostDetails[i].split(":");
	        if ( dataCheck[0] == "Country" ) {
	        	return dataCheck[1];
	    	}
	    }
	    return false;
	},
	city : function(){		
	    for (i=0; i < hostDetails.length; i++) {
	        var dataCheck = hostDetails[i].split(":");
	        if ( dataCheck[0] == "City" ) {
	        	return dataCheck[1];
	    	}
	    }
	    return false;
	},
	sendStorage : function(lat, lon, year, month){
		localStorage.setItem('MONTH', month);
		localStorage.setItem('YEAR', year);
		localStorage.setItem('LAT', lat);
		localStorage.setItem('LON', lon);
		localStorage.setItem('IP', safrData.ip());
		localStorage.setItem('CITY', safrData.city());
		localStorage.setItem('COUNTRY', safrData.country());
		localStorage.setItem('TIME', safrReporting.getDateTime());

		//whilst sending the data to local storage this will send the results also sendDatabase
		safrData.sendDatabase('', month, year, lat, lon, safrData.ip(), safrData.city(), safrData.country(), safrReporting.getDateTime())		
	},
	getStorage : function(){
		//get the info here - coming shortly
	},
	sendDatabase: function(ID, search_month, search_year, latitude, longitude, ip, city, country, search_time) {
		$.ajax({
			type: "POST",
		    url : "scripts/safr.store.php",		    
		    data : {"ID" : ID, "search_month" : search_month, "search_year" : search_year, "latitude" : latitude, "longitude" : longitude, "ip" : ip, "city" : city, "country" : country, "search_time" : search_time}
		    /*success: function(data) {
		        alert('success');
		    },
		    error: function () {
	    		alert('failed');
		    }*/
		});
	}
}