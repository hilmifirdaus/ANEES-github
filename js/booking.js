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
                var userDisability = doc.data().userDisability;
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
                    userDisability: userDisability,
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
    db.collection("bookJobs").where("jobActive", "==", "Yes").onSnapshot(function(querySnapshot) {
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
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Guider/Accompanier").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            guiderJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (cleanerJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Cleaner").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            cleanerJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (dressJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Dressing Helper").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            dressJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (foodJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Food Preparer").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            foodJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}
if (shopJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Shopper").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            
            var requesteruid = doc.id;
            shopJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Start on: </h5><p>" + doc.data().jobDate + ", at " + doc.data().startTime + "</p></div>";
    
        });
    });
}






function openJobDetails(uid) {

    var docuid = uid; //this is actually for the document id that was pass from above, NOT THE REQUESTER. im too lazy to change
    db.collection("bookJobs").doc(docuid).onSnapshot(function(doc) {

        var userId = doc.data().userId;
        var userEmail = doc.data().userEmail;
        var userName = doc.data().userName;
        var userPhone = doc.data().userPhone;
        var jobRequested = doc.data().jobRequested;
        var jobDetails = doc.data().jobDetails;
        var requesterLocation = doc.data().requesterLocation;
        var picOfRequester = doc.data().picOfRequester;
        var additionalPerks = doc.data().additionalPerks;
        var requesterEmergency = doc.data().requesterEmergency;
        var jobDate = doc.data().jobDate;
        var startTime = doc.data().startTime;
        var endTime = doc.data().endTime;
        var requestedSkills = doc.data().requestedSkills;
        var helperGender = doc.data().helperGender;
        var helperAge = doc.data().helperAge;
        var timeBooking = doc.data().timeBooking.toDate();
        var jobPrice = doc.data().jobPrice;
        var docID = doc.id;

        //var m = moment(timeBooking);
        //var mFormatted1 = m.format("Do MMMM YYYY || h:mm a");
        
        localStorage.setItem("requesteruid", docuid);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userName", userName);
        localStorage.setItem("userPhone", userPhone);
        localStorage.setItem("jobRequested", jobRequested);
        localStorage.setItem("jobDetails", jobDetails);
        localStorage.setItem("requesterLocation", requesterLocation);
        localStorage.setItem("picOfRequester", picOfRequester);
        localStorage.setItem("additionalPerks", additionalPerks);
        localStorage.setItem("requesterEmergency", requesterEmergency);
        localStorage.setItem("jobDate", jobDate);
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("endTime", endTime);
        localStorage.setItem("requestedSkills", requestedSkills);
        localStorage.setItem("helperGender", helperGender);
        localStorage.setItem("helperAge", helperAge);
        localStorage.setItem("timeBooking", timeBooking);
        localStorage.setItem("jobPrice", jobPrice);
        localStorage.setItem("docID", docID);

        window.location = '/pages/jobDetail.html';
        alert(userName);
        //window.location = '/pages/jobDetail.html';
    }, function(error) {
        window.location = '/pages/homepage-helper.html';
    });
    //document.getElementsByClassName("jobtype").innerHTML = jobRequested;
}

function displayJobDetails() {

    //document.getElementsByClassName("jobtype").innerHTML += localStorage.getItem("jobRequested");
    document.getElementById("jobtype").innerHTML += localStorage.getItem("jobRequested");
    document.getElementById("price").innerHTML += "RM " + localStorage.getItem("jobPrice");
    document.getElementById("reqbooktime").innerHTML += localStorage.getItem("timeBooking");
    document.getElementById("reqname").innerHTML += localStorage.getItem("userName");
    document.getElementById("reqdetail").innerHTML += localStorage.getItem("jobDetails");
    document.getElementById("reqskill").innerHTML += localStorage.getItem("requestedSkills");
    document.getElementById("reqgender").innerHTML += localStorage.getItem("helperGender");
    document.getElementById("reqage").innerHTML += localStorage.getItem("helperAge");
    document.getElementById("reqdate").innerHTML += localStorage.getItem("jobDate");
    document.getElementById("reqstarttime").innerHTML += "Start = " + localStorage.getItem("startTime");
    document.getElementById("reqendtime").innerHTML += "End = " + localStorage.getItem("endTime");
    document.getElementById("reqperks").innerHTML += localStorage.getItem("additionalPerks");
    document.getElementById("reqdestination").innerHTML += localStorage.getItem("requesterLocation");
    document.getElementById("reqnumber").innerHTML += localStorage.getItem("userPhone");
    document.getElementById("reqemail").innerHTML += localStorage.getItem("userEmail");


    console.log(localStorage.getItem("jobRequested"));
}

function gotoETA() {

    //when helper claim job, change field jobActice to "No" so it wont be displayed in homepage helper
    //then go to helperETApage
    var docID = localStorage.getItem("docID");

    firebase.firestore().collection("bookJobs").doc(docID).set({

        jobActive: "No",
        HelperOTW: "true"

    }, {merge: true})
    .then(function() {

        window.location = '/pages/helperETApage.html';

    })
    .catch(function(error) {

        console.error("Error writing document: ", error);

    });

    /*var user = firebase.auth().currentUser;
    var uid = user.uid;
    firebase.firestore().collection("activeJobs").where("helperId", "==", uid).onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            var helperOTW = doc.data().helperOTW;
            var docid = doc.id;

            firebase.firestore().collection("activeJobs").doc(docid).set( {
                helperOTW: "true"      //false when helper press arrived and requester confirm
            }, {merge: true})
            .then(function(doc) {
                window.location = '/pages/helperETApage.html';
            });
        });
        
    });*/
}

function jobClaimed() {

    document.getElementById("reqAddress").innerHTML = localStorage.getItem("requesterLocation");
    document.getElementById("reqName").innerHTML = localStorage.getItem("userName");
    document.getElementById("reqContact").innerHTML = localStorage.getItem("userPhone");

    //var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var uid = user.uid;
            console.log(uid);

            firebase.firestore().collection('activeJobs').where("helperID", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    var Confirm = doc.data().HelperConfirmHere;
        
                    if (Confirm == "Yes") {
                        window.location = '/pages/sessionHelper.html';
                    }
                    if (Confirm == "No") {
                        console.log("test");
                    }
                });
                
            });

        }

    });
    

}

function ETAwhichBtn() {
    
    if (document.getElementById("helperarrived")) {

        var docID = localStorage.getItem("docID");

        firebase.firestore().collection("bookJobs").doc(docID).get().then(function(doc) {

            var requesterID = doc.data().userId;
            var requesterEmail = doc.data().userEmail;
            var requesterName = doc.data().userName;
            var requesterPhone = doc.data().userPhone;
            var requesterDisability = doc.data().userDisability;
            var jobRequested = doc.data().jobRequested;
            var jobDetails = doc.data().jobDetails;
            var requesterLocation = doc.data().requesterLocation;
            var picOfRequester = doc.data().picOfRequester;
            var additionalPerks = doc.data().additionalPerks;
            var requesterEmergency = doc.data().requesterEmergency;
            var jobDate = doc.data().jobDate;
            var startTime = doc.data().startTime;
            var endTime = doc.data().endTime;
            var requestedSkills = doc.data().requestedSkills;
            var helperGender = doc.data().helperGender;
            var helperAge = doc.data().helperAge;
            var timeBooking = doc.data().timeBooking.toDate();
            var jobPrice = doc.data().jobPrice;

            //var m = moment(timeBooking);
            //var mFormatted1 = m.format("Do MMMM YYYY || h:mm a");

            var user = firebase.auth().currentUser;

            if (user) {

                // User is signed in.
                var uid = user.uid;
                firebase.firestore().collection('userProfile').doc(uid).get().then(function(doc) {
                    
                    var helperID = doc.data().userId;
                    var helperName = doc.data().userName;
                    var helperPhone = doc.data().userPhone;
                    var helperEmail = doc.data().userEmail;
                    var helperDisability = doc.data().userDisability;
                    var helperTransport = doc.data().userTransport;
                    var docID = doc.id;

                    firebase.firestore().collection('activeJobs').doc(docID).set({
                        requesterID: requesterID,
                        helperID: helperID,
                        requesterName: requesterName,
                        helperName: helperName,
                        requesterEmail: requesterEmail,
                        helperEmail: helperEmail,
                        requesterPhone: requesterPhone,
                        helperPhone: helperPhone,
                        requesterDisability: requesterDisability,
                        helperDisability: helperDisability,
                        helperTransport: helperTransport,
                        requesterLocation: requesterLocation,
                        requesterEmergency: requesterEmergency,
                        picOfRequester: picOfRequester,
                        jobRequested: jobRequested,
                        jobDetails: jobDetails,
                        additionalPerks: additionalPerks,
                        jobDate: jobDate,
                        startTime: startTime,
                        endTime: endTime,
                        requestedSkills: requestedSkills,
                        prefGender: helperGender,
                        prefAge: helperAge,
                        jobBookedOn: timeBooking,
                        jobPrice: jobPrice,
                        HelperArrived: "Yes",
                        HelperConfirmHere: "No" 

                    }, {merge: true})
                    .then(function() {

                        firebase.firestore().collection('activeJobs').where("helperID", "==", uid).onSnapshot(function(querySnapshot) {

                            querySnapshot.forEach(function(doc) {
                                var Confirm = doc.data().HelperConfirmHere;

                                if (Confirm == "Yes") {
                                    window.location = '/pages/sessionHelper.html';
                                }
                                
                            });
                            
                        });
                    });

                });
            } else {
                // No user is signed in.
                window.location = '/pages/login.html';
            }

        });
    }
}

function gotosessionifhave() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var uid = user.uid;

            firebase.firestore().collection("bookJobs").where("userId", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    var HelperOTW = doc.data().HelperOTW;

                    if (HelperOTW == "true") {
                        window.location = '/pages/ETApage.html';
                    }
                });
            });

            

        }

    });

}

function tracking() {
    var user = firebase.auth().currentUser;

        if (user) {

            var uid = user.uid;

            db.collection("activeJobs").where("requesterID", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {

                    var HelperArrived = doc.data().HelperArrived;
                    var docID = doc.id;
                    console.log("test");

                    if (HelperArrived == "Yes") {

                        window.location = '/pages/confirmation-arrived.html';
                        
                    }

                });

            });

        }
    
}

function confirmhelperarrived() {
    var user = firebase.auth().currentUser;
    if (user) {

        var uid = user.uid;
        db.collection("activeJobs").where("HelperArrived", "==", "Yes").where("requesterID", "==", uid).onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                    
                var docid = doc.id;

                db.collection("activeJobs").doc(docid).set({

                    HelperConfirmHere: "Yes"

                }, {merge: true})
                .then(function() {

                    console.log("variable helperOTW updated");
                    window.location = '/pages/session.html';
                
                })
                .catch(function(error) {

                    console.error("Error writing document: ", error);

                });
            
            });
        });
    }
}

