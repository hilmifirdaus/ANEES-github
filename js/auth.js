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



function login() {
    var userEmail = document.getElementById("eml").value;
    var userPass = document.getElementById("psw").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass)
    .then((user) => {
        //signed in
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                //user is signed in
                window.location = '/pages/homepage.html';
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

function signup() {
    var userName = document.getElementById("nme").value;
    var userEmail = document.getElementById("eml").value;
    var userPass = document.getElementById("psw").value;
    var userPhone = document.getElementById("pn").value;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPass)
    .then((user) => {
        //user is signed in
        window.location = '/pages/homepage.html';
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        
        window.alert("Error :" + errorMessage);
    });
}