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



//called from booking-form.html
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
                    var jobPrice = 15.00;
                }
                if (jobtype.match(/food/g)) {
                    var jobPrice = 25.00;
                }
                if (jobtype.match(/shop/g)) {
                    var jobPrice = 15.00;
                }
                else {
                    var jobPrice = 15.00;
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
                    //alert("your application has been uplaoded successfully!");
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
            var todaydate = new Date();
            var userdate = new Date(doc.data().jobDate);
            // To calculate the time difference of two dates 
            var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            console.log(Difference_In_Days);
            if (Difference_In_Days == 0) {
                dateJob = 'Today';
            }
            else {
                dateJob = Difference_In_Days + " day(s)";
            }
            var requesteruid = doc.id;
            allJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
    
        });
    });
}
if (guiderJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Guider/Accompanier").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var todaydate = new Date();
            var userdate = new Date(doc.data().jobDate);
            // To calculate the time difference of two dates 
            var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            console.log(Difference_In_Days);
            if (Difference_In_Days == 0) {
                dateJob = 'Today';
            }
            else {
                dateJob = Difference_In_Days + " day(s)";
            }
            
            var requesteruid = doc.id;
            guiderJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
    
        });
    });
}
if (cleanerJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Cleaner").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var todaydate = new Date();
            var userdate = new Date(doc.data().jobDate);
            // To calculate the time difference of two dates 
            var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            console.log(Difference_In_Days);
            if (Difference_In_Days == 0) {
                dateJob = 'Today';
            }
            else {
                dateJob = Difference_In_Days + " day(s)";
            }
            
            var requesteruid = doc.id;
            cleanerJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
    
        });
    });
}
if (dressJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Dressing Helper").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var todaydate = new Date();
            var userdate = new Date(doc.data().jobDate);
            // To calculate the time difference of two dates 
            var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            console.log(Difference_In_Days);
            if (Difference_In_Days == 0) {
                dateJob = 'Today';
            }
            else {
                dateJob = Difference_In_Days + " day(s)";
            }
            
            var requesteruid = doc.id;
            dressJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
    
        });
    });
}
if (foodJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Food Preparer").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var todaydate = new Date();
            var userdate = new Date(doc.data().jobDate);
            // To calculate the time difference of two dates 
            var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            console.log(Difference_In_Days);
            if (Difference_In_Days == 0) {
                dateJob = 'Today';
            }
            else {
                dateJob = Difference_In_Days + " day(s)";
            }
            
            var requesteruid = doc.id;
            foodJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
    
        });
    });
}
if (shopJob) {
    db.collection("bookJobs").where("jobActive", "==", "Yes").where("jobRequested", "==", "Shopper").onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {

            var todaydate = new Date();
            var userdate = new Date(doc.data().jobDate);
            // To calculate the time difference of two dates 
            var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
            console.log(Difference_In_Days);
            if (Difference_In_Days == 0) {
                dateJob = 'Today';
            }
            else {
                dateJob = Difference_In_Days + " day(s)";
            }
            
            var requesteruid = doc.id;
            shopJob.innerHTML += "<div class='list-jobs' onclick='openJobDetails(\""+requesteruid+"\")'><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
            doc.data().jobDetails + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
    
        });
    });
}





//called from above 
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
        var timeBooking = doc.data().timeBooking.toDate().toLocaleTimeString();
        var dateBooking = doc.data().timeBooking.toDate().toLocaleDateString('en-GB');
        var jobPrice = doc.data().jobPrice;
        var docID = doc.id;

        var x = new Date(doc.data().jobDate);
        var userDate = x.toLocaleDateString('en-GB');

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
        localStorage.setItem("jobDate", userDate);
        localStorage.setItem("startTime", startTime);
        localStorage.setItem("endTime", endTime);
        localStorage.setItem("requestedSkills", requestedSkills);
        localStorage.setItem("helperGender", helperGender);
        localStorage.setItem("helperAge", helperAge);
        localStorage.setItem("timeBooking", timeBooking);
        localStorage.setItem("dateBooking", dateBooking);
        localStorage.setItem("jobPrice", jobPrice);
        localStorage.setItem("docID", docID);

        window.location = '/pages/jobDetail.html';
        //alert(userName);
        //window.location = '/pages/jobDetail.html';
    }, function(error) {
        window.location = '/pages/homepage-helper.html';
    });
    //document.getElementsByClassName("jobtype").innerHTML = jobRequested;
}

//called from jobDetail.html
function displayJobDetails() {

    //document.getElementsByClassName("jobtype").innerHTML += localStorage.getItem("jobRequested");
    document.getElementById("jobtype").innerHTML += localStorage.getItem("jobRequested");
    document.getElementById("price").innerHTML += "RM " + localStorage.getItem("jobPrice") + ".00";
    document.getElementById("reqbooktime").innerHTML += localStorage.getItem("dateBooking") + ", " + localStorage.getItem("timeBooking");
    document.getElementById("reqname").innerHTML += localStorage.getItem("userName");
    document.getElementById("reqdetail").innerHTML += localStorage.getItem("jobDetails");
    document.getElementById("reqskill").innerHTML += localStorage.getItem("requestedSkills");
    document.getElementById("reqgender").innerHTML += localStorage.getItem("helperGender");
    document.getElementById("reqage").innerHTML += localStorage.getItem("helperAge");
    document.getElementById("reqdate").innerHTML += localStorage.getItem("jobDate");
    document.getElementById("reqstarttime").innerHTML += localStorage.getItem("startTime");
    document.getElementById("reqendtime").innerHTML += localStorage.getItem("endTime");
    document.getElementById("reqperks").innerHTML += localStorage.getItem("additionalPerks");
    document.getElementById("reqdestination").innerHTML += localStorage.getItem("requesterLocation");
    document.getElementById("reqnumber").innerHTML += localStorage.getItem("userPhone");
    document.getElementById("reqemail").innerHTML += localStorage.getItem("userEmail");


    console.log(localStorage.getItem("jobRequested"));
}

//called from startJob.html
function getdatejob() {

    if (sessionStorage.getItem("daysdiff") != 0) {
        document.getElementById("daystojob").innerHTML = "You claimed this job <br> " + sessionStorage.getItem("daysdiff") + " day(s) early.";
        document.getElementById("datetojob").innerHTML = "You may start on <br>" + sessionStorage.getItem("jobDate") + ".";
    }
    else {
        document.getElementById("daystojob").innerHTML = "The job starts Today!";
        document.getElementById("datetojob").innerHTML = "The job is set to start at: " + sessionStorage.getItem("jobTime");
        document.getElementById("startjobcanceljob").innerHTML += "<button onclick='gotoETA()' id='start'>Start Job</button><br>"
    }
    
}

//called from jobDetail.html
function checkjobtime() {
    var user = firebase.auth().currentUser;

    var docID = localStorage.getItem("docID");

    firebase.firestore().collection("bookJobs").doc(docID).get().then(function(doc) {
        var x = new Date(doc.data().jobDate);
        var jobDate = x.toLocaleDateString('en-GB');
        var startTime = doc.data().startTime;

        var todaydate = new Date();
        var userdate = new Date(doc.data().jobDate);
        // To calculate the time difference of two dates 
        var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
            
        // To calculate the no. of days between two dates 
        var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
        console.log(Difference_In_Days);

        sessionStorage.setItem("daysdiff", Difference_In_Days);
        sessionStorage.setItem("jobDate", jobDate);
        sessionStorage.setItem("jobTime", startTime);

        firebase.firestore().collection("userProfile").doc(user.uid).get().then(function(doc) {
            var helperName = doc.data().userName;
            firebase.firestore().collection("bookJobs").doc(docID).set({

                jobClaimed: "true",
                jobActive: "No",
                helperID: user.uid,
                helperName: helperName
    
            }, {merge: true})
            .then(function() {
    
                window.location = '/pages/startJob.html';
    
            })
            .catch(function(error) {
    
                console.error("Error writing document: ", error);
        
            });
        });
    });
}

//called from getdatejob()
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
}

//called from helperETApage
function jobClaimed() {

    

    var docID = localStorage.getItem("docID");

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
                        console.log(Confirm);
                    }
                });
                
            });

            firebase.firestore().collection('bookJobs').where("helperID", "==", uid).onSnapshot(function(querySnapshot) {
                
                querySnapshot.forEach(function(doc) {

                    document.getElementById("reqAddress").innerHTML = doc.data().requesterLocation;
                    document.getElementById("reqName").innerHTML = doc.data().userName;
                    document.getElementById("reqContact").innerHTML = doc.data().userPhone;
                    document.getElementById("username").innerHTML = doc.data().userName;
                });
                
            });

            if (navigator.geolocation) {

                navigator.geolocation.watchPosition(function(position) {

                    firebase.firestore().collection('bookJobs').doc(docID).set({

                        helcurrentLat: position.coords.latitude,
                        helcurrentLon: position.coords.longitude,
                        helcurrentSpeed: position.coords.speed
                    }, {merge: true})
                    .then(function() {
                        console.log(position.coords.latitude);
                        console.log(position.coords.longitude);
                        console.log(position.coords.speed);
                    });
                });
            }

        }

    });
    

}

//called from helperETApage
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
            var bookjobID = doc.id;

            localStorage.setItem("bookjobID", bookjobID);

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
                    var helperpicName = doc.data().picName;
                    var helperpicNumber = doc.data().picNumber;
                    var docID = doc.id;
                    var helperBankHolderName = doc.data().userBankHolderName;
                    var helperBankName = doc.data().userBankName;
                    var helperBankNo = doc.data().userBankNo;
                    console.log(helperID);

                    var helperEmergency = helperpicName + " (" + helperpicNumber + ")";
                    var bookjobID = localStorage.getItem("bookjobID");

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
                        helperEmergency: helperEmergency,
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
                        HelperConfirmHere: "No",
                        sessionStarted: "Yes",
                        helperBankHolderName: helperBankHolderName,
                        helperBankName: helperBankName,
                        helperBankNo: helperBankNo,
                        bookjobID: bookjobID

                    }, {merge: true})
                    .then(function() {
                        var bookjobID = localStorage.getItem("bookjobID");
                        firebase.firestore().collection('bookJobs').doc(bookjobID).set({
                            
                            HelperArrived: "Yes",
                            HelperConfirmHere: "No",
                            sessionStarted: "Yes"

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

                });
            } else {
                // No user is signed in.
                window.location = '/pages/login.html';
            }

        });
    }
    
}

//send messages
function sendMessage() {

    var user = firebase.auth().currentUser;

    if (user) {

        var uid = user.uid;
        firebase.firestore().collection('userProfile').doc(uid).get().then(function(doc) {
            var myName = doc.data().userName;
            // get message
            var message = document.getElementById("message").value;

            // save in database
            firebase.database().ref("messages").push().set({
                "sender": myName,
                "message": message
            });

            // prevent form from submitting
            return false;
        });
    }
    
    //var myName = "testname";
    

}
//display message
if(document.getElementById("helperchat")) {

    document.getElementById("helperchat").addEventListener("click", function(){

        var user = firebase.auth().currentUser;
    
        if (user) {
            var uid = user.uid;
            firebase.firestore().collection('userProfile').doc(uid).get().then(function(doc) {
                var myName = doc.data().userName;
    
                // listen for incoming messages
                firebase.database().ref("messages").on("child_added", function (snapshot) {
                    var html = "";
                    
                    // show delete button if message is sent by me
                    if (snapshot.val().sender == myName) {
                        // give each message a unique ID
                        html += "<li id='message-" + snapshot.key + "' class='sender'>";
                        html += snapshot.val().message;
                        html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'>";
                            html += "Delete";
                        html += "</button>";
                        html += "</li>";
                    }
                    else {
                        // give each message a unique ID
                        html += "<li id='message-" + snapshot.key + "'>";
                        html += snapshot.val().message;
                        html += "</li>";
                    }
                    
                    
            
                    document.getElementById("messages").innerHTML += html;
                });
            });
        }
    
    });
}
else if(document.getElementById("requesterchat")) {
    
    document.getElementById("requesterchat").addEventListener("click", function(){

        var user = firebase.auth().currentUser;
    
        if (user) {
            var uid = user.uid;
            firebase.firestore().collection('userProfile').doc(uid).get().then(function(doc) {
                var myName = doc.data().userName;
    
                // listen for incoming messages
                firebase.database().ref("messages").on("child_added", function (snapshot) {
                    var html = "";
                    
                    // show delete button if message is sent by me
                    if (snapshot.val().sender == myName) {
                        // give each message a unique ID
                        html += "<li id='message-" + snapshot.key + "' class='sender'>";
                        html += snapshot.val().message;
                        html += "<button data-id='" + snapshot.key + "' onclick='deleteMessage(this);'>";
                            html += "Delete";
                        html += "</button>";
                        html += "</li>";
                    }
                    else {
                        // give each message a unique ID
                        html += "<li id='message-" + snapshot.key + "'>";
                        html += snapshot.val().message;
                        html += "</li>";
                    }
                    
                    
            
                    document.getElementById("messages").innerHTML += html;
                });
            });
        }
    
    });
}



//delete message
function deleteMessage(self) {
    // get message ID
    var messageId = self.getAttribute("data-id");
 
    // delete message
    firebase.database().ref("messages").child(messageId).remove();
}
// attach listener for delete message
firebase.database().ref("messages").on("child_removed", function (snapshot) {
    // remove message node
    document.getElementById("message-" + snapshot.key).innerHTML = "This message has been removed";
});


//called from homepage.html
function gotosessionifhave() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var uid = user.uid;
            console.log(uid);

            firebase.firestore().collection("bookJobs").where("userId", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    var HelperOTW = doc.data().HelperOTW;
                    //var jobClaimed = doc.data().jobClaimed;

                    if (HelperOTW == "true") {
                        window.location = '/pages/ETApage.html';
                    }
                });
            });
        }
        else {
            window.location = '/pages/login.html';
        }

    });

}

//called from ETApage
function tracking() {
    
    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var uid = user.uid;

            firebase.firestore().collection("activeJobs").where("requesterID", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    var HelperArrived = doc.data().HelperArrived;

                    if (HelperArrived == "Yes") {
                        window.location = '/pages/confirmation-arrived.html';
                        console.log(HelperArrived);
                    }
                });
            });

            firebase.firestore().collection("bookJobs").where("userId", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    document.getElementById('username').innerHTML = doc.data().helperName;
                    document.getElementById('helname').innerHTML = doc.data().helperName;
                });
            });

            if (navigator.geolocation) {

                navigator.geolocation.watchPosition(function(position) {

                    var reqcurrentLat = position.coords.latitude;
                    var reqcurrentLon = position.coords.longitude;

                    firebase.firestore().collection("bookJobs").where("userId", "==", uid).onSnapshot(function(querySnapshot) {

                        querySnapshot.forEach(function(doc) {

                            var helLat = parseInt(doc.data().helcurrentLat);
                            var helLon = parseInt(doc.data().helcurrentLon);
                            

                            if (doc.data().helcurrentSpeed == null){
                                var helSpeed = 0;
                            }
                            if (doc.data().helcurrentSpeed != null){
                                var helSpeed = parseInt(doc.data().helcurrentSpeed);
                            }
    
                            var R = 6371; // m
                            var dLat = (helLat - reqcurrentLat) * Math.PI / 180;
                            var dLon = (helLon - reqcurrentLon) * Math.PI / 180; 
                            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                    Math.cos(reqcurrentLat * Math.PI / 180) * Math.cos(helLat * Math.PI / 180) * 
                                    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
                            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
                            var d = R * c;

                            if (helSpeed == 0) {
                                var eta = d;
                            }
                            else {
                                var eta = d / helSpeed;
                            }
                            
                            console.log(helSpeed);
                            console.log(d);
                            console.log(eta);
                            document.getElementById("tracktime").innerHTML = "ETA: " + Math.round(eta / 60) + " mins";

                        });
                        Number.prototype.toRad = function() {
                            return this * Math.PI / 180;
                        }
                        
                        
                    });

                    
                });
                
            }
            else {
                alert('Geolocation is not supported for this Browser/OS version yet.');
            }

            

        }

    });
    
}

//called from confirmation-arrived
function helperinfoconfirm() {

    firebase.auth().onAuthStateChanged(function(user) {

        if(user) {
            
            var uid = user.uid;

            firebase.firestore().collection("activeJobs").where("requesterID", "==", uid).onSnapshot(function(querySnapshot) {

                querySnapshot.forEach(function(doc) {
                    var helperName = doc.data().helperName;
                    var helperPhone = doc.data().helperPhone;

                    document.getElementById("h-name").innerHTML = helperName;
                    document.getElementById("h-contact").innerHTML = helperPhone;

                });
            });
        }
    });
}

//called from confirmation-arrived
function confirmhelperarrived() {
    var user = firebase.auth().currentUser;
    if (user) {

        var uid = user.uid;
        var today = new Date();
        //var sessionstarttime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        db.collection("activeJobs").where("HelperArrived", "==", "Yes").where("requesterID", "==", uid).onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                    
                var docid = doc.id;
                localStorage.setItem("activejobID", docid);

                db.collection("activeJobs").doc(docid).set({

                    HelperConfirmHere: "Yes",
                    sessionStartTime: today

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

//called from activity.html
function displayactivity() {
    var jobHistory = document.getElementById('jobHistory');
    var ongoingJob = document.getElementById('ongoingJob');

    firebase.auth().onAuthStateChanged(function(user) {

        if(user) {
            var uid = user.uid;
            console.log(uid);
            
            firebase.firestore().collection("userProfile").doc(uid).get().then(function(doc) {
                var userType = doc.data().userType;
                console.log(userType);
                if (userType == "Requester") {
                    if (ongoingJob) {
            
                        firebase.firestore().collection("bookJobs").where("jobClaimed", "==", "true").where("userId", "==", uid).onSnapshot(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {

                                var todaydate = new Date();
                                var userdate = new Date(doc.data().jobDate);
                                var docID = doc.id;
                                console.log(todaydate);
                                console.log(userdate);
                                console.log(docID);

                                //var userTime = new Date(doc.data().startTime);
                                //var timedistance = userTime.getTime() - todaydate.getTime();
                                //var hours = Math.floor((timedistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                //var minutes = Math.floor((timedistance % (1000 * 60 * 60)) / (1000 * 60));
                                
                                if (doc.data().jobActive && doc.data().jobActive == "Yes") {

                                    var status = "Awaiting for Helper to claim the job";
                                }
                                
                                if (doc.data().jobClaimed && doc.data().jobClaimed == "true") {

                                    var status = "Job Claimed";

                                }
                                if (doc.data().HelperOTW && doc.data().HelperOTW == "true") {

                                    var status = "Helper is On-the-Way";

                                }
                                if (doc.data().HelperArrived && doc.data().HelperArrived == "Yes") {

                                    var status = "Helper has arrived";

                                }

                                console.log(status);

                                // To calculate the time difference of two dates 
                                var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
                                    
                                // To calculate the no. of days between two dates 
                                var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
                                console.log(Difference_In_Days);
                                if (Difference_In_Days == 0) {
                                    
                                    dateJob = 'Today';
                                }
                                else {
                                    dateJob = Difference_In_Days + " day(s)";
                                }

                                ongoingJob.innerHTML += "<div class='list-jobs' onclick='continuejob(\""+docID+"\")'><h3>" + status + "</h3><hr><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
                                doc.data().jobDetails + "</p><h5>Claimed by </h5><p>" + doc.data().helperName + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
                            });
                        });
                    }
                    if (jobHistory) {

                        firebase.firestore().collection("historyJobs").where("requesterID", "==", uid).onSnapshot(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {

                                jobHistory.innerHTML += "<div class='list-jobs'><h3>RM " + doc.data().jobTotalPaid + ".00</h3><hr><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
                                doc.data().jobDetails + "</p><h5>Claimed by </h5><p>" + doc.data().helperName + "</p><h5>Requester: </h5><p>" + doc.data().requesterName + "</p><h5>Job Booked on: </h5><p>" + 
                                doc.data().jobBookedOn.toDate().toLocaleDateString('en-GB') + "</p><h5>Job ID</h5><p>" + doc.id + "</p></div>";
                            });
                        });
                    }
                }
                if (userType == "Helper") {
                    if (ongoingJob) {
                        firebase.firestore().collection("bookJobs").where("jobClaimed", "==", "true").where("helperID", "==", uid).onSnapshot(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                var todaydate = new Date();
                                var userdate = new Date(doc.data().jobDate);
                                var docID = doc.id;
                                console.log(todaydate);
                                console.log(userdate);
                                console.log(docID);

                                if (doc.data().jobClaimed && doc.data().jobClaimed == "true") {

                                    var status = "Job Claimed";

                                }
                                if (doc.data().HelperOTW && doc.data().HelperOTW == "true") {

                                    var status = "On-the-Way to Location";

                                }

                                // To calculate the time difference of two dates 
                                var Difference_In_Time = userdate.getTime() - todaydate.getTime(); 
                                    
                                // To calculate the no. of days between two dates 
                                var Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
                                console.log(Difference_In_Days);
                                if (Difference_In_Days == 0) {
                                    
                                    dateJob = 'Today';
                                }
                                else {
                                    dateJob = Difference_In_Days + " day(s)";
                                }

                                ongoingJob.innerHTML += "<div class='list-jobs' onclick='continuejob(\""+docID+"\")'><h3>" + status + "</h3><hr><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
                                doc.data().jobDetails + "</p><h5>Claimed by </h5><p>" + doc.data().helperName + "</p><h5>Requester: </h5><p>" + doc.data().userName + "</p><h5>Job Starts in: </h5><p>" + dateJob + "</p></div>";
                            });
                        });
                    }
                    if (jobHistory) {

                        firebase.firestore().collection("historyJobs").where("helperID", "==", uid).onSnapshot(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {

                                jobHistory.innerHTML += "<div class='list-jobs'><h3>RM " + doc.data().jobTotalPaid + ".00</h3><hr><h3>" + doc.data().jobRequested + "</h3><h5>Job Details: </h5><p>" + 
                                doc.data().jobDetails + "</p><h5>Volunteered</h5><p>" + doc.data().helperWaived + "</p><h5>Claimed by </h5><p>" + doc.data().helperName + "</p><h5>Requester: </h5><p>" + doc.data().requesterName + "</p><h5>Job Booked on: </h5><p>" + 
                                doc.data().jobBookedOn.toDate().toLocaleDateString('en-GB') + "</p><h5>Job ID</h5><p>" + doc.id + "</p></div>";
                            });
                        });
                    }
                }
                
            });
        }
    });
    
}

//called from above
function continuejob(documentID) {

    firebase.auth().onAuthStateChanged(function(user) {

        if(user) {
            var uid = user.uid;
            console.log(uid);
            
            firebase.firestore().collection("userProfile").doc(uid).get().then(function(doc) {
                var userType = doc.data().userType;
                console.log(userType);
                if (userType == "Requester") {

                    var docid = documentID;
                    //depend on status continue where last task
                    firebase.firestore().collection("bookJobs").doc(docid).onSnapshot(function(doc) {
                        if (doc.data().jobActive && doc.data().jobActive == "Yes") {
                
                            alert("Awaiting for Helper to claim the job");
                        }
                        
                        if (doc.data().jobClaimed && doc.data().jobClaimed == "true") {
                
                            alert("Job Claimed");
                
                        }
                        if (doc.data().HelperOTW && doc.data().HelperOTW == "true") {
                
                            window.location = '/pages/ETApage.html';
                
                        }
                        if (doc.data().HelperArrived && doc.data().HelperArrived == "Yes") {
                
                            window.location = '/pages/confirmation-arrived.html';
                
                        }
                    });
                }
                if (userType == "Helper") {

                    var docid = documentID;
                    //depend on status continue where last task
                    firebase.firestore().collection("bookJobs").doc(docid).onSnapshot(function(doc) {
                        
                        if (doc.data().jobClaimed && doc.data().jobClaimed == "true") {
                
                            window.location = '/pages/startJob.html';
                
                        }
                        if (doc.data().HelperOTW && doc.data().HelperOTW == "true") {
                
                            window.location = '/pages/helperETApage.html';
                
                        }
                        
                    });
                }
            });
        }
    });

    
}

//called from sessionHelper
function displaySessiondetails() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var helperuid = user.uid;
            firebase.firestore().collection("activeJobs").doc(helperuid).onSnapshot(function(doc) {
                var jobType = doc.data().jobRequested;
                var jobDetails = doc.data().jobDetails;
                var reqName = doc.data().requesterName;
                var reqContact = doc.data().requesterPhone;
                var reqAddress = doc.data().requesterLocation;
                var jobDate = new Date(doc.data().jobDate).toLocaleDateString('en-GB');
                var startTime = doc.data().startTime;
                var endTime = doc.data().endTime;
                var reqEmergency = doc.data().requesterEmergency;
                var reqID = doc.data().requesterID;
                var reqDisability = doc.data().requesterDisability;
                var reqPIC = doc.data().picOfRequester;
                var sessionStartTime = doc.data().sessionStartTime;
                var bookjobID = doc.data().bookjobID;
                var activejobID = doc.id;
                
                localStorage.setItem("activejobID", activejobID);
                localStorage.setItem("bookjobID", bookjobID);
                localStorage.setItem("sessionStartTime", sessionStartTime);
                console.log(localStorage.getItem("activejobID"));

                document.getElementById("jobtype").innerHTML = jobType;
                document.getElementById("jobdetails").innerHTML = jobDetails;
                document.getElementById("reqname").innerHTML = reqName;
                document.getElementById("reqdisability").innerHTML = reqDisability;
                document.getElementById("reqcontact").innerHTML = reqContact;
                document.getElementById("reqaddress").innerHTML = reqAddress;
                document.getElementById("reqdatetime").innerHTML = jobDate + ", " + startTime + " - " + endTime;
                document.getElementById("reqpic").innerHTML = reqPIC;
                document.getElementById("reqemergency").innerHTML = reqEmergency;

                var e = new Date(jobDate + " " + endTime);
                var s = new Date(jobDate + " " + startTime);
	            //document.getElementById("demo").innerHTML = d;

                setInterval(function() {
                    var currentdate = new Date();
                    if (currentdate.getTime() >= e.getTime()) {
                        
                        var start = s.getHours();
                        var end = e.getHours();

                        var hoursdiff = end - start;
                        var addpayment = 0;
                        var i;

                        if (hoursdiff != 0){
                            for (i=0; i<hoursdiff; i++) {
                                addpayment = addpayment + 10;
                            }
                        }
                        else if (hoursdiff == 0) {
                            addpayment = 0;
                        }
                
                        var user = firebase.auth().currentUser;
                
                        var helperid = user.uid;
                        firebase.firestore().collection('activeJobs').doc(helperid).set({
                            sessionEndTime: currentdate,
                            additionalPayment: addpayment,
                            sessionEnded: "true"
                        }, {merge: true})
                        .then(function() {
                            //update bookJobs untuk status: session ended
                            //go to sessionHelperReceipt
                            var docID = localStorage.getItem("docID");
                            firebase.firestore().collection('bookJobs').doc(docID).set({
                                sessionEndTime: currentdate,
                                additionalPayment: addpayment,
                                sessionEnded: "true"
                            }, {merge: true})
                            .then(function() {
                                window.location = "/pages/sessionHelperReceipt.html";
                                alert("Time is up");
                            });
                        });
                        //pass data similar in endsessionHelper function
                        //go to sessionHelperReceipt
                    } 
                }, 1000);

                //check if requester reported the helper.
                setInterval(function() {
                    if (doc.data().helperReported && doc.data().helperReported == "true") {
                        
                        var currentdate = new Date();
                        var user = firebase.auth().currentUser;
                        var helperid = user.uid;

                        var docID = localStorage.getItem("docID");
                        firebase.firestore().collection("activeJobs").doc(helperid).set({
                            sessionEndTime: currentdate,
                            jobPrice: 0,
                            sessionEnded: "true"
                        }, {merge: true})
                        .then(function() {
                            firebase.firestore().collection('bookJobs').doc(docID).set({
                                sessionEndTime: currentdate,
                                jobPrice: 0,
                                sessionEnded: "true"
                            }, {merge: true})
                            .then(function() {
                                windoow.location = "/pages/homepage-helper.html";
                                alert("we will contact you in a few days for investigation purposes.")
                            });
                            
                        });
                    }
                }, 3000);
                

            });
        }
    });
}

//called from sessionHelper
function endsessionHelper() {
    var r = confirm("Are you sure you want to end the session?");

    if (r == true) {
        var sessionEndTime = new Date();
        var sessionstart = new Date(localStorage.getItem("sessionStartTime"));
        //var sessionStartTime = sessionstart.toLocaleTimeString();

        var end = sessionEndTime.getHours();
        var start = sessionstart.getHours();

        var hoursdiff = start - end;
        //addpayment is hourly rate which is rm10/hour
        var addpayment = 0;
        var i;

        if (hoursdiff != 0){
            for (i=0; i<hoursdiff; i++) {
                addpayment = addpayment + 10;
            }
        }
        else if (hoursdiff == 0) {
            addpayment = 0;
        }

        var user = firebase.auth().currentUser;

        var helperid = user.uid;
        firebase.firestore().collection('activeJobs').doc(helperid).set({
            sessionEndTime: sessionEndTime,
            additionalPayment: addpayment,
            sessionEnded: "true"
        }, {merge: true})
        .then(function() {
            //update bookJobs untuk status: session ended
            //go to sessionHelperReceipt
            var docID = localStorage.getItem("docID");
            firebase.firestore().collection('bookJobs').doc(docID).set({
                sessionEnded: "true"
            }, {merge: true})
            .then(function() {
                window.location = "/pages/sessionHelperReceipt.html";
            });
        });



    }
    
}

//called from session.html
function displaySessionRequester() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            var requesteruid = user.uid;
            console.log(requesteruid);
            var activejobID = localStorage.getItem("activejobID");
            firebase.firestore().collection("activeJobs").doc(activejobID).onSnapshot(function(doc) {
                

                var sessionEnded = doc.data().sessionEnded;

                if (sessionEnded == "true") {
                    window.location = "/pages/receipt.html";
                    alert("Helper has ended the session");
                 }

                var jobType = doc.data().jobRequested;
                var jobDetails = doc.data().jobDetails;
                var helName = doc.data().helperName;
                var helContact = doc.data().helperPhone;
                var jobDate = doc.data().jobDate;
                var startTime = doc.data().startTime;
                var endTime = doc.data().endTime;
                var helEmergency = doc.data().helperEmergency;
                var helID = doc.data().helperID;
                var helDisability = doc.data().helperDisability;
                var sessionStartTime = doc.data().sessionStartTime;                    
                var activejobID = doc.id;
                var bookjobID = doc.data().bookjobID;

                var datex = new Date(doc.data().jobDate).toLocaleDateString('en-GB');

                localStorage.setItem("bookjobID", bookjobID);
                localStorage.setItem("activejobID", activejobID);
                localStorage.setItem("helID", helID);
    
                localStorage.setItem("sessionStartTime", sessionStartTime);
                document.getElementById("jobtype").innerHTML = jobType;
                document.getElementById("jobdetails").innerHTML = jobDetails;
                document.getElementById("helname").innerHTML = helName;
                document.getElementById("heldisability").innerHTML = helDisability;
                document.getElementById("helcontact").innerHTML = helContact;
                document.getElementById("reqdatetime").innerHTML = datex + ", " + startTime + " - " + endTime;
                document.getElementById("helemergency").innerHTML = helEmergency;
    
                    
                //document.getElementById("demo").innerHTML = d;

                setInterval(function() {
                    var e = new Date(jobDate + " " + endTime);
                    var s = new Date(jobDate + " " + startTime);
                    var currentdate = new Date();
                    if (currentdate.getTime() >= e.getTime()) {
                        
                        var start = s.getHours();
                        var end = e.getHours();
                        var hoursdiff = end - start;
                        var addpayment = 0;
                        var i;
    
                        if (hoursdiff != 0){
                            for (i=0; i<hoursdiff; i++) {
                                addpayment = addpayment + 10;
                            }
                        }
                        else if (hoursdiff == 0) {
                            addpayment = 0;
                        }
                    
                        var user = firebase.auth().currentUser;
                        var reqid = user.uid;
                        var helperid = helID;
                        var activejobID = localStorage.getItem("activejobID");
                        var bookjobID = localStorage.getItem("bookjobID");
                        firebase.firestore().collection('activeJobs').doc(activejobID).set({
                            sessionEndTime: currentdate,
                            additionalPayment: addpayment,
                                sessionEnded: "true"
                        }, {merge: true})
                        .then(function() {
                            //update bookJobs untuk status: session ended
                            //go to sessionHelperReceipt
                            var docID = localStorage.getItem("docID");
                            firebase.firestore().collection('bookJobs').doc(bookjobID).set({
                                sessionEnded: "true"
                            }, {merge: true})
                            .then(function() {
                                window.location = "/pages/receipt.html";
                                alert("Time is up");
                            });
                        });
                            //pass data similar in endsessionHelper function
                            //go to sessionHelperReceipt
                    } 
                }, 3000);

            });
        }
    });
}

//called from session.html
function reportHelper() {
    var r = confirm("Are you sure you want to report the helper?");

    if (r == true) {
        var user = firebase.auth().currentUser;
        var reqid = user.uid;
        var activejobID = localStorage.getItem("activejobID");
        firebase.firestore().collection('activeJobs').doc(activejobID).set({
            helperReported: "true"
        }, {merge: true})
        .then(function() {
            var bookjobID = localStorage.getItem("bookjobID");
            firebase.firestore().collection('bookJobs').doc(bookjobID).set({
                helperReported: "true"
            }, {merge: true})
            .then(function() {
                window.location = "/pages/homepage.html";
                alert("we will contact you in few days time for investigation purposes.");
            });
        });
    }
}

//called from receipt.html
function displayReqReceipt() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            var requesteruid = user.uid;
            console.log(requesteruid);
            //var activejobID = localStorage.getItem("activejobID");
            var helID = localStorage.getItem("helID");
            //console.log(activeJobID);
            console.log(helID);
            firebase.firestore().collection('activeJobs').doc(helID).onSnapshot(function(doc) {

                var jobtype = doc.data().jobRequested;
                var jobdetail = doc.data().jobDetails;
                var sessionstarttime = doc.data().sessionStartTime.toDate();
                var sessionendtime = doc.data().sessionEndTime.toDate();
                var jobdate = new Date(doc.data().jobDate).toLocaleDateString('en-GB');
                var starttime = doc.data().startTime;
                var endtime = doc.data().endTime;
                var helname = doc.data().helperName;
                var helaccholdername = doc.data().helperBankHolderName;
                var helbankname = doc.data().helperBankName;
                var helbankno = doc.data().helperBankNo;
                var jobprice = doc.data().jobPrice;
                var addpay = doc.data().additionalPayment;
                var addperks = doc.data().additionalPerks;
                var helemail = doc.data().helperEmail;
                var helphone = doc.data().helperPhone;
                var jobbook = doc.data().jobBookedOn;
                var bookjobID = doc.data().bookjobID;
                var reqname = doc.data().requesterName;
                var reqemail = doc.data().requesterEmail;
                var reqphone = doc.data().requesterPhone;
                var reqid = doc.data().requesterID;
                var helid = doc.data().helperID;
                var activejobID = doc.id;
                var helperWaived = doc.data().helperWaived;
                

                //delete the documents when session ends
                if (doc.data().requesterPaid == "true" && doc.data().helperReceivePayment == "true") {

                    firebase.firestore().collection('historyJobs').doc().set({
                        jobRequested: jobtype,
                        jobDetails: jobdetail,
                        jobBookedOn: jobbook,
                        sessionStartTime: sessionstarttime,
                        sessionEndTime: sessionendtime,
                        jobDate: jobdate,
                        startTime: starttime,
                        endTime: endtime,
                        additionalPerks: addperks,
                        jobTotalPaid: jobprice + addpay,
                        helperName: helname,
                        helperEmail: helemail,
                        helperPhone: helphone,
                        helperID: helid,
                        requesterName: reqname,
                        requesterEmail: reqemail,
                        requesterPhone: reqphone,
                        requesterID: reqid,
                        helperWaived: helperWaived

                    })
                    .then(function() {
                        firebase.firestore().collection("bookJobs").doc(bookjobID).delete().then(function() {
                            console.log("bookjobs has been deleted.");
                        });
                        firebase.firestore().collection("activeJobs").doc(helID).delete().then(function() {
                            console.log("activejobs has been deleted.");
                            window.location = "/pages/activity.html";
                            alert("check out Job History to see all your past jobs!");
                        });
                        
                    });

                    

                }
                else if (doc.data().requesterPaid == "no" && doc.data().helperReceivePayment == "no") {
                    alert("Please pay the helper");
                }
        
                localStorage.setItem("activejobID", activejobID);
                localStorage.setItem("bookjobID", bookjobID);
        
                var total = jobprice + addpay;
        
                var f = new Date(sessionstarttime);
                var fhour = f.getHours();
                var fmin = f.getMinutes();
        
                var h = new Date(sessionendtime);
                var hhour = h.getHours();
                var hmin = h.getMinutes();
        
                var hourdiff = hhour - fhour;
                var mindiff = Math.abs(hmin - fmin);
        
                var duration = hourdiff + " hour(s) " + mindiff + " minute(s)";
                //var dateandtime = jobdate + ", " + starttime + " - " + endtime;
        
                console.log(duration);
                
                document.getElementById("jobtype").innerHTML = jobtype;
                document.getElementById("jobdetail").innerHTML = jobdetail;
                document.getElementById("jobduration").innerHTML = duration;
                document.getElementById("jobdateandtime").innerHTML = jobdate + ", " + starttime + " - " + endtime;
                document.getElementById("helname").innerHTML = helname;
                document.getElementById("helaccholdername").innerHTML = helaccholdername;
                document.getElementById("helbankname").innerHTML = helbankname;
                document.getElementById("helbankno").innerHTML = helbankno;
                document.getElementById("addperks").innerHTML = addperks;
                document.getElementById("jobprice").innerHTML = "RM" + jobprice + ".00";
                document.getElementById("addpay").innerHTML = "RM" + addpay + ".00";
                document.getElementById("totalfees").innerHTML = "RM" + total + ".00";
                document.getElementById("totalfee").innerHTML = "RM" + total + ".00";
            });
        }
    });
}


//called from sessionHelperReceipt.html
function displayHelReceipt() {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {

            var helqid = user.uid;
            console.log(helqid);
            
            firebase.firestore().collection('activeJobs').doc(helqid).onSnapshot(function(doc) {
                
                var jobtype = doc.data().jobRequested;
                var jobdetail = doc.data().jobDetails;
                var sessionstarttime = doc.data().sessionStartTime.toDate();
                var sessionendtime = doc.data().sessionEndTime.toDate();
                var jobdate = new Date(doc.data().jobDate).toLocaleDateString('en-GB');
                var starttime = doc.data().startTime;
                var endtime = doc.data().endTime;
                var reqname = doc.data().requesterName;
                var jobprice = doc.data().jobPrice;
                var addpay = doc.data().additionalPayment;
                var bookjobID = doc.data().bookjobID;
                var activejobID = doc.id;

                
        
                console.log(sessionstarttime);
                console.log(sessionendtime);
                localStorage.setItem("activejobID", activejobID);
                localStorage.setItem("bookjobID", bookjobID);
        
                var total = jobprice + addpay;
        
                var f = new Date(sessionstarttime);
                var fhour = f.getHours();
                var fmin = f.getMinutes();
                console.log(f);
                console.log(fhour);
                console.log(fmin);
        
                var h = new Date(sessionendtime);
                var hhour = h.getHours();
                var hmin = h.getMinutes();
                console.log(h);
                console.log(hhour);
                console.log(hmin);
        
                var hourdiff = parseInt(hhour) - parseInt(fhour);
                console.log(hourdiff);
                var mindiff = Math.abs(parseInt(hmin) - parseInt(fmin));
                console.log(mindiff);
        
                var duration = hourdiff + " hour(s) " + mindiff + " minute(s)";
        
                document.getElementById("totalfees").innerHTML = "RM" + total + ".00";
                document.getElementById("jobtype").innerHTML = jobtype;
                document.getElementById("jobdetail").innerHTML = jobdetail;
                document.getElementById("jobduration").innerHTML = duration;
                document.getElementById("jobdateandtime").innerHTML = jobdate + ", " + starttime + " - " + endtime;
                document.getElementById("reqname").innerHTML = reqname;
                document.getElementById("jobprice").innerHTML = jobprice;
                document.getElementById("addpay").innerHTML = addpay;
                document.getElementById("totalfee").innerHTML = "RM" + total + ".00";
                
            });
        }
    });
}

//called from sessionHelperReceipt
function receivedPayment(value) {

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            if (value == 'yes') {

                var helqid = user.uid;
                console.log(helqid);
                var bookjobID = localStorage.getItem("bookjobID");
                console.log(bookjobID);

                firebase.firestore().collection("activeJobs").doc(helqid).set({

                    helperReceivePayment: "true",
                    requesterPaid: "true",
                    helperWaived: "no"

                }, {merge: true})
                .then(function() {

                    firebase.firestore().collection("bookJobs").doc(bookjobID).set({
                        
                        helperReceivePayment: "true",
                        requesterPaid: "true",
                        helperWaived: "no"

                    }, {merge: true})
                    .then(function() {

                        window.location = "/pages/activity.html";

                    });
                });

            }
            else if (value == 'no') {

                var helqid = user.uid;
                console.log(helqid);
                var bookjobID = localStorage.getItem("bookjobID");
                console.log(bookjobID);

                firebase.firestore().collection("activeJobs").doc(helqid).set({

                    helperReceivePayment: "no",
                    requesterPaid: "no",
                    helperWaived: "no"

                }, {merge: true})
                .then(function() {

                    firebase.firestore().collection("bookJobs").doc(bookjobID).set({
                        
                        helperReceivePayment: "no",
                        requesterPaid: "no",
                        helperWaived: "no"

                    }, {merge: true})
                    .then(function() {

                        alert("The app has notified the requester to pay.");
                        
                    });
                });
            }
            else if (value == 'waive') {
                var helqid = user.uid;
                console.log(helqid);
                var bookjobID = localStorage.getItem("bookjobID");
                console.log(bookjobID);

                firebase.firestore().collection("activeJobs").doc(helqid).set({

                    helperReceivePayment: "true",
                    requesterPaid: "true",
                    helperWaived: "true"

                }, {merge: true})
                .then(function() {

                    firebase.firestore().collection("bookJobs").doc(bookjobID).set({
                        
                        helperReceivePayment: "true",
                        requesterPaid: "true",
                        helperWaived: "true"

                    }, {merge: true})
                    .then(function() {

                        window.location = "/pages/activity.html";

                    });
                });
            }
        }
    });
    
}

function whichHome() {
    firebase.auth().onAuthStateChanged(function(user) {

        if(user) {
            var uid = user.uid;
            firebase.firestore().collection("userProfile").doc(uid).get().then(function(doc) {
                
                if(doc.data().userType == "Requester") {
                    window.location = "/pages/homepage.html";
                }
                if(doc.data().userType == "Helper") {
                    window.location = "/pages/homepage-helper.html";
                }
            });
        }
        else {
            alert("error");
            window.location = "/pages/login.html";
        }
    });
}

function contact() {

    var email = document.getElementById("eml").value;
    var name = document.getElementById("name").value;
    var message = document.getElementById("message").value;

    firebase.firestore().collection("contactForms").doc().set({
        email: email,
        name: name,
        message: message
    })
    .then(function() {
        alert("message sent! we will reply back in 3 business days.");
        window.location = "/pages/landing.html";
    });
}
