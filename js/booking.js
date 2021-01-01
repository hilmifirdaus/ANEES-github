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
                var userPhone = doc.data().userPhone;
                // Add a new document in collection "bookJobs"
                // 'set()' will overwrite the existing data
                // doc(uid) will only write data for the user, other user will have different document
                // if jobActive is Yes, then keep in the collection. if no keep in other collection called jobHistory

                //set price
                var jobtype = jobType.toLowerCase();
                //var job1 = jobtype.match(/guide/g);

                if (jobtype.match(/guide/g) || jobtype.match(/accompan/g)) {
                    var jobPrice = 15.00;
                }
                if (jobtype.match(/clean/g)) {
                    var jobPrice = 20.00;
                }
                if (jobtype.match(/dress/g)) {
                    var jobPrice = 12.00;
                }
                if (jobtype.match(/food/g)) {
                    var jobPrice = 25.00;
                }
                if (jobtype.match(/shop/g)) {
                    var jobPrice = 15.00;
                }
                else {
                    var jobPrice = 10.00;
                }

                db.collection("bookJobs").doc().set({
                    userId: uid,
                    userEmail: email,
                    userName: userName,
                    userPhone: userPhone,
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
                    timeBooking: timestamp,
                    jobActive: "Yes",
                    jobPrice: jobPrice
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
//onSnapshot listens to realtime changes in your firestore
//Since you are trying to pass a string object, you need to escape your string in the onclick function call
var allJob = document.getElementById('All');
var guiderJob = document.getElementById('Guider');
var cleanerJob = document.getElementById('Cleaner');
var dressJob = document.getElementById('Dressing');
var foodJob = document.getElementById('Food');
var shopJob = document.getElementById('Shopper');

if (allJob) {
    db.collection("bookJobs").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            //since 1 requester can book many jobs, it is best to get the document id this way 
            //instead of using userid
            //can check in submitBooking, when submitting, the doc will be randomize. not using userID
            var requesteruid = doc.id;
            allJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (guiderJob) {
    db.collection("bookJobs").where("jobRequested", "==", "Guider/Accompanier").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            guiderJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (cleanerJob) {
    db.collection("bookJobs").where("jobRequested", "==", "Cleaner").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            cleanerJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (dressJob) {
    db.collection("bookJobs").where("jobRequested", "==", "Dressing Helper").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            dressJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (foodJob) {
    db.collection("bookJobs").where("jobRequested", "==", "Food Preparer").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            foodJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (shopJob) {
    db.collection("bookJobs").where("jobRequested", "==", "Shopper").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            shopJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}






function openJobDetails(uid) {

    var requesteruid = uid;
        db.collection("bookJobs").doc(requesteruid).get().then(function(doc) {

        var userId = doc.data().userId;
        var userEmail = doc.data().userEmail;
        var userName = doc.data().userName;
        //var userPhone = doc.data().userPhone;
        var jobRequested = doc.data().jobRequested;
        var jobDetails = doc.data().jobDetails;
        var requesterLocation = doc.data().requesterLocation;
        //var picOfRequester = doc.data().picOfRequester;
        var additionalPerks = doc.data().additionalPerks;
        //var requesterEmergency = doc.data().requesterEmergency;
        var jobDate = doc.data().jobDate;
        var startTime = doc.data().startTime;
        var endTime = doc.data().endTime;
        var requestedSkills = doc.data().requestedSkills;
        var helperGender = doc.data().helperGender;
        var helperAge = doc.data().helperAge;
        var timeBooking = doc.data().timeBooking.toDate();
        var jobPrice = doc.data().jobPrice;

        var m = moment(timeBooking);
        var mFormatted1 = m.format("MMMM Do YYYY || h:mm:ss");
        
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("userName", userName);
        //sessionStorage.setItem("userPhone", userPhone);
        sessionStorage.setItem("jobRequested", jobRequested);
        sessionStorage.setItem("jobDetails", jobDetails);
        sessionStorage.setItem("requesterLocation", requesterLocation);
        //sessionStorage.setItem("picOfRequester", picOfRequester);
        sessionStorage.setItem("additionalPerks", additionalPerks);
        //sessionStorage.setItem("requesterEmergency", requesterEmergency);
        sessionStorage.setItem("jobDate", jobDate);
        sessionStorage.setItem("startTime", startTime);
        sessionStorage.setItem("endTime", endTime);
        sessionStorage.setItem("requestedSkills", requestedSkills);
        sessionStorage.setItem("helperGender", helperGender);
        sessionStorage.setItem("helperAge", helperAge);
        sessionStorage.setItem("timeBooking", mFormatted1);
        sessionStorage.setItem("jobPrice", jobPrice);

        window.location = '/pages/jobDetail.html';
        alert(userName);
        //window.location = '/pages/jobDetail.html';
    });

    

    
    //document.getElementsByClassName("jobtype").innerHTML = jobRequested;
}

function displayJobDetails() {

    //document.getElementsByClassName("jobtype").innerHTML += sessionStorage.getItem("jobRequested");
    document.getElementById("jobtype").innerHTML += sessionStorage.getItem("jobRequested");
    document.getElementById("price").innerHTML += "RM " + sessionStorage.getItem("jobPrice");
    document.getElementById("reqbooktime").innerHTML += sessionStorage.getItem("timeBooking");
    document.getElementById("reqname").innerHTML += sessionStorage.getItem("userName");
    document.getElementById("reqdetail").innerHTML += sessionStorage.getItem("jobDetails");
    document.getElementById("reqskill").innerHTML += sessionStorage.getItem("requestedSkills");
    document.getElementById("reqgender").innerHTML += sessionStorage.getItem("helperGender");
    document.getElementById("reqage").innerHTML += sessionStorage.getItem("helperAge");
    document.getElementById("reqdate").innerHTML += sessionStorage.getItem("jobDate");
    document.getElementById("reqstarttime").innerHTML += "Start = " + sessionStorage.getItem("startTime");
    document.getElementById("reqendtime").innerHTML += "End = " + sessionStorage.getItem("endTime");
    document.getElementById("reqperks").innerHTML += sessionStorage.getItem("additionalPerks");
    document.getElementById("reqdestination").innerHTML += sessionStorage.getItem("requesterLocation");
    document.getElementById("reqemail").innerHTML += sessionStorage.getItem("userEmail");

    console.log(sessionStorage.getItem("jobRequested"));
}

