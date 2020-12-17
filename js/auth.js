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

function login() {
    var userEmail = document.getElementById("eml").value;
    var userPass = document.getElementById("psw").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then((user) => {
        //signed in
        
        firebase.auth().onAuthStateChanged(function(user) {
            
            if (user) {

                var uid = user.uid;
                db.collection('userProfile').doc(uid).get().then(function(doc) {
                    var userType = doc.data().userType;
                    var userName = doc.data().userName;
                    
                    if (userType == 'Helper') {
                        
                        window.location = '/pages/homepage-helper.html';
                        console.log("succesfully sign in a Helper");
                        alert("Welcome " + userName + "!");
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
    var userPhone = document.getElementById("contact").value;
    var userDisability = document.getElementById("disability").value;
    var userDOB = document.getElementById("birthday").value;
    var userGender = document.querySelector('input[name="gender"]:checked').value;
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
                userPhone: userPhone,
                userDisability: userDisability,
                userDOB: userDOB,
                userGender: userGender,
                userType: userType,
                timesignup: timestamp
            })
            .then(function() {
                console.log("Document successfully written!");
                alert("your application has been uplaoded successfully!");
    
                if (userType === "Helper") {
                    //this should go to requirement page but for go to step 1
                    window.location = '/pages/step1question.html';
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