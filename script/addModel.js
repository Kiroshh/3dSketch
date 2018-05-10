let selectedFile;
var usermail;
let uploader = document.getElementById('progressBar')

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      let user = firebase.auth().currentUser;
      usermail = user.email;
    } else {
      // No user is signed in.
      window.location = "index.html";
    }
});

$(document).ready(function(){
  console.log( "ready!" );
  $("#uploadButton").hide();
  });


function uploadFile(){
	var filename =selectedFile.name;
	var storageRef = firebase.storage().ref("/model/"+filename);
	var uploadTask=storageRef.put(selectedFile);
	// Register three observers:
// 1. 'state_changed' observer, called any time the state changes
// 2. Error observer, called on failure
// 3. Completion observer, called on successful completion
uploadTask.on('state_changed', function(snapshot){
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //console.log('Upload is ' + progress + '% done');
  uploader.value = progress;
  switch (snapshot.state) {
    case firebase.storage.TaskState.PAUSED: // or 'paused'
      console.log('Upload is paused');
      break;
    case firebase.storage.TaskState.RUNNING: // or 'running'
      console.log('Upload is running');
      break;
  }
}, function(error) {
  // Handle unsuccessful uploads
  console.log("some error happened")
}, function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
  var downloadURL = uploadTask.snapshot.downloadURL;
  var postKey=firebase.database().ref().child('Model').push().key;
  var updates={};
  var postData={
  	url: downloadURL,
  	name: selectedFile.name,
  	user :usermail
  };
  updates['/Model/'+postKey]=postData;
  firebase.database().ref().update(updates);

  uploader.value = 0;
    window.location.reload();


});

}

$("#file").on("change", function(event) {
	  $("#uploadButton").show();
	  selectedFile = event.target.files[0];
});


$(document).ready(function(){
  console.log( "ready!" );
  });

let tblUsers=document.getElementById("tbl_models_list");
let databaseref = firebase.database().ref('Model/');
let rowIndex=1;

databaseref.once('value', function(snapshot) {
  snapshot.forEach(function(childSnaphot) {
    let childkey=childSnaphot.key;
    let childData=childSnaphot.val();
    let row=tblUsers.insertRow(rowIndex);
    let cellName=row.insertCell(0);
    let cellUrl=row.insertCell(1);
    let cellUploader=row.insertCell(2);
    cellName.appendChild(document.createTextNode(childData.name));
    cellUrl.appendChild(document.createTextNode(childData.url));
    cellUploader.appendChild(document.createTextNode(childData.user));
    rowIndex=rowIndex+1;
  });
});



function myFunction() {
  // Declare variables
  let input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbl_models_list");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}