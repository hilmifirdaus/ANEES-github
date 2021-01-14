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

const auth = firebase.auth();
const db = firebase.firestore();

function login() {
    var userEmail = document.getElementById("eml").value;
    var userPass = document.getElementById("psw").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then((user) => {
        //signed in
        
        firebase.auth().onAuthStateChanged(function(user) {
            
            if (user) {
                console.log(user)
                var uid = user.uid;
                db.collection('userProfile').doc(uid).get().then(function(doc) {
                    var userType = doc.data().userType;
                    var userName = doc.data().userName;
                    
                    if (userType == 'Helper') {

                        //check in userProfile if false or step not exist then go to certain pageS
                        if (doc.data().step1 == "false" || !doc.data().step1) {
                            window.location = '/pages/requirements-helper.html';
                        }
                        else if (doc.data().step2 == "false" || !doc.data().step2) {
                            window.location = '/pages/step2-1.html';
                        }
                        else if (doc.data().step3 == "false" || !doc.data().step3) {
                            window.location = '/pages/step-3.html';
                        }
                        else {
                            window.location = '/pages/homepage-helper.html';
                            console.log("succesfully sign in a Helper");
                            alert("Welcome " + userName + "!");
                        }
                        
                    }
                    if (userType == 'Requester') {

                        if ( !doc.data().profileUpdate || doc.data().profileUpdate == 'false') {
                            window.location = '/pages/editProfile-Requester.html';
                            console.log("have not setup profile");
                        }
                        else {
                            window.location = '/pages/homepage.html';
                            console.log("succesfully sign in a Requester");
                            alert("Welcome " + userName + "!");
                        }
            
                    }
                });
                //user is signed in
                
            }
        });
    })
    .catch(function(error) {
        //handling errors
        var errorCode = error.code;
        var errorMessage = error.message;

        window.alert("Error :" + errorMessage);
    });
}

function signUp() {
    var userName = document.getElementById("nme").value;
    var userEmail = document.getElementById("eml").value;
    var userPass = document.getElementById("psw").value;
    var userType = document.querySelector('input[name="userType"]:checked').value;
    var timestamp = firebase.firestore.FieldValue.serverTimestamp();
    

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
    .then((user) => {
        //user is signed in
        //set user variables in firestore (for helper, can use update() instead of set())
        var user = firebase.auth().currentUser;

        if (user) {
            var uid = user.uid;

            firebase.firestore().collection("userProfile").doc(uid).set({
                userName: userName,
                userEmail: userEmail,
                userType: userType,
                timesignup: timestamp,
                userId: uid
            })
            .then(function() {
                console.log("Document successfully written!");
                alert("your application has been uplaoded successfully!");
    
                if (userType === "Helper") {
                    //after sign up go to requirements and go through all the steps 
                    window.location = '/pages/requirements-helper.html';
                }
                if (userType === "Requester") {
                    //go to editProfile to fill profile details
                    window.location = '/pages/editProfile-Requester.html';
                }
                
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        }
        else {
            console.log("user not signed in");
            window.location = '/pages/sign-up.html';
        }
        
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        window.alert("Error :" + errorMessage);
    });

}


//this is for checking if helper go through the step1
function checkStep1() {

    var clickedNext = document.getElementById('next');
    var clickedBack = document.getElementById('back');
    var q1ans = document.querySelector('input[name="answerq1"]:checked').value;
    var q2ans = document.querySelector('input[name="answerq2"]:checked').value;
    var q3ans = document.querySelector('input[name="answerq3"]:checked').value;
    //var step1, step2, step3;
    //var user = firebase.auth().currentUser;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && clickedNext) {

            if (q1ans == "rightanswer1" && q2ans == "rightanswer6" && q3ans == "rightanswer11") {
                var uid = user.uid;
    
                firebase.firestore().collection("userProfile").doc(uid).set({
                    step1: "true",
                    step2: "false",
                    step3: "false"
                }, { merge: true })
                .then(function() {
        
                    console.log("Document successfully written!");
                    alert("your application has been uplaoded successfully!");
                    window.location = '/pages/step2-1.html';
            
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
            else {
                alert("Wrong answer(s). Please try again.");
                window.location = '/pages/step1question.html';
            }
            
        }
        else if (user && clickedBack) {
            window.location = '/pages/how-it-works.html';
        }
    });

    
}

//this for checking if user go throu step2
function checkStep2(whichStep) {

    var clickedNext = document.getElementById('next');
    var clickedBack = document.getElementById('back');
    
    //var step1, step2, step3;
    var user = firebase.auth().currentUser;

    if (user && clickedNext && whichStep == '2-1') {

        var workLocation = document.getElementById('location').value;
        var accepttnc = document.getElementById('terms').value;

        if (accepttnc == 'accept') {

            var uid = user.uid;
            firebase.firestore().collection("userProfile").doc(uid).set({
                workLocation: workLocation,
                accepttnc: accepttnc
            }, {merge: true})
            .then(function() {
    
                console.log("Document successfully written!");
                alert("your application has been uplaoded successfully!");
                window.location = '/pages/step2-2.html';
        
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });

        }
        else {

            alert("please check the T&C to continue");
            window.location = '/pages/step2-1.html';

        }
        
    }
    else if (user && clickedNext && whichStep == '2-2') {

        var trainingdate = document.getElementById('trainingsession').value;
        var accepttnc2 = document.getElementById("terms").value;

        if (accepttnc2 == 'accept') {

            var uid = user.uid;
            firebase.firestore().collection("userProfile").doc(uid).set({
                training: trainingdate,
                accepttnc2: accepttnc2
            }, {merge: true})
            .then(function() {
    
                console.log("Document successfully written!");
                alert("your application has been uplaoded successfully!");
                window.location = '/pages/step2-3.html';
        
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });

        }
        else {

            alert("please check the T&C to continue");
            window.location = '/pages/step2-2.html';

        }
        
    }
    else if (user && clickedNext && whichStep == '2-3') {

        var uid = user.uid;
        var userName = document.getElementById("fullname").value;
        var userPhone = document.getElementById("contact").value;
        var userGender = document.querySelector('input[name="gender"]:checked').value;
        var userDisability = document.getElementById("disability").value;
        var userDOB = document.getElementById("dob").value;
        var userNational = document.getElementById("nation").value;
        var userIC = document.getElementById("nric").value;
        var userOccupation = document.getElementById("occupation").value;
        var userHousenum = document.getElementById("housenum").value;
        var userHousestreet = document.getElementById("street").value;
        var userHousecity = document.getElementById("city").value;
        var userHousepost = document.getElementById("postcode").value;
        var userBankHolderName = document.getElementById("holdername").value;
        var userBankName = document.getElementById("bankname").value;
        var userBankNo = document.getElementById("accnum").value;
        var picName = document.getElementById("emergencyname").value;
        var picNumber = document.getElementById("emergencynumber").value;
        var picRelationship = document.getElementById("relationship").value;
        var userTransport = document.getElementById("transportmode").value;

        firebase.firestore().collection("userProfile").doc(uid).set({

            step1: "true",
            step2: "true",
            step3: "false",
            userName: userName,
            userPhone: userPhone,
            userGender: userGender,
            userDisability: userDisability,
            userDOB: userDOB,
            userNational: userNational,
            userIC: userIC,
            userOccupation: userOccupation,
            userHousenum: userHousenum,
            userHousestreet: userHousestreet,
            userHousecity: userHousecity,
            userHousepost: userHousepost,
            userBankHolderName: userBankHolderName,
            userBankName: userBankName,
            userBankNo: userBankNo,
            picName: picName,
            picNumber: picNumber,
            picRelationship: picRelationship,
            userTransport: userTransport

        }, {merge: true})
        .then(function() {

            console.log("Document successfully written!");
            alert("your application has been uplaoded successfully!");
            window.location = '/pages/step-3.html';
    
        })
        .catch(function(error) {

            console.error("Error writing document: ", error);

        });

    }
    else if (user && clickedBack && whichStep == 'back') {

        window.history.back();

    }
    else {

        window.location = '/pages/login.html';

    }
}

//this is for step 3
function checkStep3(whichStep) {

    var clickedNext = document.getElementById('next');
    var clickedBack = document.getElementById('back');
    //var step1, step2, step3;
    var user = firebase.auth().currentUser;

    if (user && clickedNext && whichStep == '3-1') {

        window.location = '/pages/step-3-guidelines.html';

    }
    else if (user && clickedNext && whichStep == '3-2') {

        var uid = user.uid;

        firebase.firestore().collection("userProfile").doc(uid).set({

            training: "done"

        }, {merge: true})
        .then(function() {

            console.log("Document successfully written!");
            alert("your application has been uplaoded successfully!");
            window.location = '/pages/step-3-uniqueno.html';
    
        })
        .catch(function(error) {

            console.error("Error writing document: ", error);

        });

        
    }
    else if (user && clickedNext && whichStep == '3-3') {
    
        var uid = user.uid;
        var uniqueno = document.getElementById("uniqueno").value;

        firebase.firestore().collection("userProfile").doc(uid).set({

            step1: "true",
            step2: "true",
            step3: "true",
            uniqueno: uniqueno

        }, {merge: true})
        .then(function() {

            console.log("Document successfully written!");
            alert("your application has been uplaoded successfully!");
            window.location = '/pages/login.html';
    
        })
        .catch(function(error) {

            console.error("Error writing document: ", error);

        });
    }
    else if (user && clickedBack && whichStep == 'back') {
        window.history.back();
    }
}

//this is to check which user clicked the edit profile
function checkwhichprofile() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            var uid = user.uid;

            db.collection('userProfile').doc(uid).get().then(function(doc) {
                var userType = doc.data().userType;

                if (userType == 'Requester')  {
                    window.location = '/pages/editProfile-Requester.html';
                }
                if (userType == 'Helper') {
                    window.location = '/pages/editProfile-Helper.html';
                }
            });
        }
        else {
            window.location = '/pages/login.html';
        }
    });
}

//this is for updating Profile
function updateProfile() {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            var uid = user.uid;

            db.collection('userProfile').doc(uid).get().then(function(doc) {
                var userType = doc.data().userType;
        
                if (userType == 'Helper') {
                    var userName = document.getElementById("fullname").value;
                    var userPhone = document.getElementById("contact").value;
                    var userGender = document.querySelector('input[name="gender"]:checked').value;
                    var userDOB = document.getElementById("dob").value;
                    var userNational = document.getElementById("nation").value;
                    var userOccupation = document.getElementById("occupation").value;
                    var userBankHolderName = document.getElementById("holdername").value;
                    var userBankName = document.getElementById("bankname").value;
                    var userBankNo = document.getElementById("accnum").value;
                    var picName = document.getElementById("emergencyname").value;
                    var picNumber = document.getElementById("emergencynumber").value;
                    var picRelationship = document.getElementById("relationship").value;
                    var userTransport = document.getElementById("transportmode").value;
                    var userDisability = document.getElementById("disability").value;

                    firebase.firestore().collection("userProfile").doc(uid).set({
                        userName: userName,
                        userPhone: userPhone,
                        picName: picName,
                        picNumber: picNumber,
                        picRelationship: picRelationship,
                        userNational: userNational,
                        userDisability: userDisability,
                        userDOB: userDOB,
                        userGender: userGender,
                        profileUpdate: "true",
                        userOccupation: userOccupation,
                        userBankHolderName: userBankHolderName,
                        userBankName: userBankName,
                        userBankNo: userBankNo,
                        userTransport: userTransport

                    }, {merge:true})
                    .then(function() {
                        console.log("Document successfully written!");
                        alert("You can check your updated profile in the Profile page!");
                        window.location = '/pages/homepage.html';
                    });

                }
                if (userType == 'Requester') {
                    var userName = document.getElementById("nme").value;
                    var userPhone = document.getElementById("contact").value;
                    var picName = document.getElementById("picName").value;
                    var picNumber = document.getElementById("picNumber").value;
                    var picRelationship = document.getElementById("picRelationship").value;
                    var userNational = document.getElementById("nation").value;
                    var userDisability = document.getElementById("disability").value;
                    var userDOB = document.getElementById("birthday").value;
                    var userGender = document.querySelector('input[name="gender"]:checked').value;

                    firebase.firestore().collection("userProfile").doc(uid).set({
                        userName: userName,
                        userPhone: userPhone,
                        picName: picName,
                        picNumber: picNumber,
                        picRelationship: picRelationship,
                        userNational: userNational,
                        userDisability: userDisability,
                        userDOB: userDOB,
                        userGender: userGender,
                        profileUpdate: "true" //if no update cannot go to homepage
                    }, {merge:true})
                    .then(function() {
                        console.log("Document successfully written!");
                        alert("You can check your updated profile in the Profile page!");
                        window.location = '/pages/homepage.html';
                    });

                }
            });
        }
        else {
            window.location = '/pages/login.html';
            console.log("oh no something's wrong");
        }
    });
}