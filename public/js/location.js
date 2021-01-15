//apikey expires after some time so need to create new account and create new api
/*var platform = new H.service.Platform({
    'apikey': 'dfNAeW51k1SRWxk81CPxbIdQ-hMTp3izshLJwUrj9rY'
});

var geocoder = platform.getSearchService();

function getLocation() {
    var x = document.getElementById("location").value;

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition( position => {

            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

            geocoder.reverseGeocode({

                limit: 1,
                at: lat + "," + lng

            }, data => {
                document.getElementById("location").value = data.items[0].address.label;
                alert("The nearest address to your location is:\n" + data.items[0].address.label);
            }, error => {
                console.error(error);
            });
        });
    } else {
        console.error("Geolocation is not supported by this browser!");
    }
}*/


function getLocation() {
    var x = document.getElementById("location").value;

    if (navigator.geolocation) {

        navigator.geolocation.watchPosition(showPosition);
        
    }
    else {
        alert('Geolocation is not supported for this Browser/OS version yet.');
    }
}

function showPosition(position) {
    
    document.getElementById("location").value = position.coords.latitiude + ", " + position.coords.longitude;
}