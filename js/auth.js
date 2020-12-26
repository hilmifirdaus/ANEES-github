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
                        
                        window.location = '/pages/homepage.html';
                        console.log("succesfully sign in a Requester");
                        alert("Welcome " + userName + "!");
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
                timesignup: timestamp
            })
            .then(function() {
                console.log("Document successfully written!");
                alert("your application has been uplaoded successfully!");
    
                if (userType === "Helper") {
                    //this should go to requirement page but for go to step 1
                    window.location = '/pages/requirements-helper.html';
                }
                if (userType === "Requester") {
                    //if requester, go to requester homepage
                    window.location = '/pages/homepage.html';
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
    //var step1, step2, step3;
    var user = firebase.auth().currentUser;

    if (user && clickedNext) {
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
    else if (user && clickedBack) {
        window.location = '/pages/how-it-works.html';
    }
}

//this for checking if user go throu step2
function checkStep2(whichStep) {

    var clickedNext = document.getElementById('next');
    var clickedBack = document.getElementById('back');
    //var step1, step2, step3;
    var user = firebase.auth().currentUser;

    if (user && clickedNext && whichStep == '2-1') {
        window.location = '/pages/step2-2.html';
    }
    else if (user && clickedNext && whichStep == '2-2') {
        var trainingdate = document.getElementById('trainingsession').value;
        var uid = user.uid;
        firebase.firestore().collection("userProfile").doc(uid).set({
            training: trainingdate
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
    else if (user && clickedNext && whichStep == '2-3') {
        var uid = user.uid;

        firebase.firestore().collection("userProfile").doc(uid).update({
            step1: "true",
            step2: "true",
            step3: "false"
        })
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

        firebase.firestore().collection("userProfile").doc(uid).update({
            training: "done"
        })
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

        firebase.firestore().collection("userProfile").doc(uid).update({
            step1: "true",
            step2: "true",
            step3: "true"
        })
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