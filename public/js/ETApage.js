var x= document.getElementById("location");

function getlocation() {  
    if(navigator.geolocation){  
        navigator.geolocation.getCurrentPosition(initETA, showPosition);  
    }  
    else {  
        alert("Sorry! your browser is not supporting");  
    }

    
}  
       
function showPosition(position){  
    var x = "Your current location is (" + "Latitude: " + position.coords.latitude + 
            ", " + "Longitude: " +    position.coords.longitude + ")";  
    document.getElementById("location").innerHTML = x;  
}

function initETA(position) {
    var crd = position.coords;
    const bounds = new google.maps.LatLngBounds();
    const markersArray = [];
    //var origin1 = {lat: ${crd.latitude}, lng: ${crd.longitude}};
    var destinationA = 'Kuala Lumpur, Malaysia';
    const geocoder = new google.maps.Geocoder();
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [origin1],
            destinations: [destinationA],
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false,
        },
        (response, status) => {
            if (status !== "OK") {
                alert("Error was: " + status);
            } else {
                const originList = response.originAddresses;
                const destinationList = response.destinationAddresses;
                const outputDiv = document.getElementById("output");
                outputDiv.innerHTML = "";
                deleteMarkers(markersArray);

                for (let i = 0; i < originList.length; i++) {
                    const results = response.rows[i].elements;
                    geocoder.geocode(
                      { address: originList[i] },
                      showGeocodedAddressOnMap(false)
                    );
          
                    for (let j = 0; j < results.length; j++) {
                      geocoder.geocode(
                        { address: destinationList[j] },
                        showGeocodedAddressOnMap(true)
                      );
                      outputDiv.innerHTML +=
                        originList[i] +
                        " to " +
                        destinationList[j] +
                        ": " +
                        results[j].distance.text +
                        " in " +
                        results[j].duration.text +
                        "<br>";
                    }
                }
            }
        }
    );
}

function deleteMarkers(markersArray) {
    for (let i = 0; i < markersArray.length; i++) {
      markersArray[i].setMap(null);
    }
    markersArray = [];
  }

