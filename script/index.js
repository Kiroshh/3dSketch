firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
   // document.getElementById("user_div").style.display = "block";
    //document.getElementById("login_div").style.display = "none";
    let user = firebase.auth().currentUser;
    if(user != null) {
      let email_id = user.email;
      //document.getElementById("user_para").innerHTML = "logged in as User : " + email_id;
    }
        window.location = "home";

  } else {

    // No user is signed in.
   // document.getElementById("user_div").style.display = "none";
    //document.getElementById("login_div").style.display = "block";
  }
});

function login() {

  let userEmail = document.getElementById("email_field").value;
  let userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {

    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    window.alert("Error iss : " + errorMessage);
   // window.location = "homes.html";

  });
}


function logout() {
  firebase.auth().signOut();
}



