//initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAYEoCaKcfOlsvoQ1DQp1SM0XjTiUU8Ohw",
    authDomain: "anees2-1e09b.firebaseapp.com",
    databaseURL: "https://anees2-1e09b.firebaseio.com",
    projectId: "anees2-1e09b",
    storageBucket: "anees2-1e09b.appspot.com",
    messagingSenderId: "383619725343",
    appId: "1:383619725343:web:79ca3212820914239c3d2a",
    measurementId: "G-PS61QRVG9E"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();



//add booking form to firebase
function submitBooking() {
    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var uid = user.uid;
            var email = user.email;
            var jobType = document.getElementById('jobType').value;
            var jobDetails = document.getElementById('jobDetails').value;
            var location = document.getElementById('location').value;
            var pic = document.getElementById('personincharge').value;
            var perks = document.getElementById('addPerks').value;
            var emergency = document.getElementById('emergencyContact').value;
            var jobDate = document.getElementById('jobDate').value;
            var startJob = document.getElementById('startJob').value;
            var endJob = document.getElementById('endJob').value;
            var skills = document.getElementById('skills').value;
            var gender = document.querySelector('input[name="gender"]:checked').value;
            var age = document.querySelector('input[name="age"]:checked').value;
            var timestamp = firebase.firestore.FieldValue.serverTimestamp();
            
            //MUST WRITE SET INSIDE GET because doc.data() only works inside the .then() [because it is an async function]
            db.collection('userProfile').doc(uid).get().then(function(doc) {
                var userName = doc.data().userName;
                // Add a new document in collection "bookJobs"
                // 'set()' will overwrite the existing data
                // doc(uid) will only write data for the user, other user will have different document
                db.collection("bookJobs").doc(uid).set({
                    userId: uid,
                    userEmail: email,
                    userName: userName,
                    jobRequested: jobType,
                    jobDetails: jobDetails,
                    requesterLocation: location,
                    picOfRequester: pic,
                    additionalPerks: perks,
                    requesterEmergency: emergency,
                    jobDate: jobDate,
                    startTime: startJob,
                    endTime: endJob,
                    requestedSkills: skills,
                    helperGender: gender,
                    helperAge: age,
                    timeBooking: timestamp
                })
                .then(function() {
                    console.log("Document successfully written!");
                    alert("your application has been uplaoded successfully!");
                    window.location = '/pages/homepage.html';
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            });
            
        }
        else {
            window.location = '/pages/login.html';
            console.log("user is signed out");
        }
    });
}


//this part is for displaying jobs in helper homepage
var allJob = document.getElementById('All');
var guiderJob = document.getElementById('Guider');
var cleanerJob = document.getElementById('Cleaner');
var dressJob = document.getElementById('Dressing');
var foodJob = document.getElementById('Food');
var shopJob = document.getElementById('Shopper');

db.collection("bookJobs").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        allJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails()'><h3>" + doc.data().jobRequested + "</h3><p>Job Details: <br>" + 
        doc.data().jobDetails + "</p><p>Requester: <br>" + doc.data().userEmail + "</p></div>";

    });
});

db.collection("bookJobs").where("jobRequested", "==", "Guider/Accompanier").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        guiderJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails()'><h3>" + doc.data().jobRequested + "</h3><p>Job Details: <br>" + 
        doc.data().jobDetails + "</p><p>Requester: <br>" + doc.data().userEmail + "</p></div>";

    });
});

db.collection("bookJobs").where("jobRequested", "==", "Cleaner").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        cleanerJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails()'><h3>" + doc.data().jobRequested + "</h3><p>Job Details: <br>" + 
        doc.data().jobDetails + "</p><p>Requester: <br>" + doc.data().userEmail + "</p></div>";

    });
});

db.collection("bookJobs").where("jobRequested", "==", "Dressing Helper").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        dressJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails()'><h3>" + doc.data().jobRequested + "</h3><p>Job Details: <br>" + 
        doc.data().jobDetails + "</p><p>Requester: <br>" + doc.data().userEmail + "</p></div>";

    });
});

db.collection("bookJobs").where("jobRequested", "==", "Food Preparer").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        foodJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails()'><h3>" + doc.data().jobRequested + "</h3><p>Job Details: <br>" + 
        doc.data().jobDetails + "</p><p>Requester: <br>" + doc.data().userEmail + "</p></div>";

    });
});

db.collection("bookJobs").where("jobRequested", "==", "Shopper").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        
        shopJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails()'><h3>" + doc.data().jobRequested + "</h3><p>Job Details: <br>" + 
        doc.data().jobDetails + "</p><p>Requester: <br>" + doc.data().userEmail + "</p></div>";

    });
});

function openJobDetails() {
    window.location = '/pages/jobDetail.html';
}