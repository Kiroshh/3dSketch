var usermail;
var selectedFile;

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

function logout() {

         firebase.auth().signOut();
         window.location = "index.html";

      }

$(document).ready(function(){
  console.log( "ready!" );
  });

$("#file").on("change", function(event) {
  selectedFile = event.target.files[0];
});
let tblUsers=document.getElementById("tbl_users_list");
let databaseref = firebase.database().ref('users/');
let rowIndex=1;

databaseref.once('value', function(snapshot) {
	snapshot.forEach(function(childSnaphot) {
	  let childkey=childSnaphot.key;
	  let childData=childSnaphot.val();
	  let row=tblUsers.insertRow(rowIndex);
	  let cellId=row.insertCell(0);
	  let cellName=row.insertCell(1);
	  let cellAge=row.insertCell(2);
    let celldesc=row.insertCell(3);  
	  cellId.appendChild(document.createTextNode(childkey));
	  cellName.appendChild(document.createTextNode(childData.username));
	  cellAge.appendChild(document.createTextNode(childData.age));
    celldesc.appendChild(document.createTextNode(childData.desc));
	  rowIndex=rowIndex+1;
	});
});



//create criminal profile 
function Save() {
  let user_name=document.getElementById("user_name").value;
  let user_id=document.getElementById("user_id").value;
  let age=document.getElementById("age").value;
  let desc=document.getElementById("desc").value;

 firebase.database().ref('users/' + user_id).set({
    username: user_name,
    age: age,
    desc: desc
  });
  var filename =selectedFile.name;
  var storageRef = firebase.storage().ref("/gallery/"+filename);

  var uploadTask=storageRef.put(selectedFile);
uploadTask.on('state_changed', function(snapshot){
  // Observe state change events such as progress, pause, and resume
  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  console.log('Upload is ' + progress + '% done');
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
}, function() {
  // Handle successful uploads on complete
  // For instance, get the download URL: https://firebasestorage.googleapis.com/...
   var downloadURL = uploadTask.snapshot.downloadURL;
    var postKey=firebase.database().ref('Gallery/').push().key;
  var updates={};
  var postData={
    url: downloadURL,
    name: selectedFile.name,
    user :usermail
  };
  updates['/gallery/'+postKey]=postData;
  firebase.database().ref().update(updates);

  window.location.reload();
});
 //   console.log(downloadURL);

 

 
}

//update criminal profile 
function Update() {
  let user_name=document.getElementById("user_name").value;
  let user_id=document.getElementById("user_id").value;
  let age=document.getElementById("age").value;
  let desc=document.getElementById("desc").value;
  if (user_name == "" || user_id == "" || age =="" || desc ==="" ){
    alert("Try again.There may be unfilled fields");
  }else{
    firebase.database().ref('users/' + user_id).set({
      username: user_name,
      age: age ,
      desc: desc
  });
  window.location.reload();
}
}

//delete criminal profile 
function Delete() {
  let user_id=document.getElementById("user_id").value;
  //let user_name=document.getElementById("user_name").value;

  if(user_name == ""){
    alert("enter the id  of the profile to be deleted ");
  }else{
    firebase.database().ref('users/' + user_id).remove();
    //the related image in the storage should also/may be deleted 

   // let temp = 'gallery/'+user_name+'.jpg';
   // console.log(temp);
   // let desertRef = firebase.storage().ref(temp);
  //  desertRef.delete().then(function() {
  // File deleted successfully
  //  }).catch(function(error) {
  // Uh-oh, an error occurred!
  //  });
    window.location.reload();

}
}


function findProfile(valuee) {
  // Declare variables
  let input, filter, table, tr, td, i;
  input = document.getElementById("profilee");
  filter = input.value.toUpperCase();
  table = document.getElementById("tbl_users_list");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 1; i < tr.length; i++) {
    if(valuee==1){
    td = tr[i].getElementsByTagName("td")[1];
     }
      if(valuee==2){
    td = tr[i].getElementsByTagName("td")[2];
     }
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}