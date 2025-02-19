$(document).ready(function(){
	firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var token = firebase.auth().currentUser.uid;
      queryDatabase(token);
    } else {
      // No user is signed in.
      window.location = "index";
    }
});
});


function queryDatabase(token) {
  firebase.database().ref('/gallery/').once('value').then(function(snapshot) {
    var PostObject = snapshot.val();
    console.log(PostObject);
    
    var keys = Object.keys(PostObject);
    var currentRow;
    for (var i = 0; i< keys.length; i++) {
      var currentObject = PostObject[keys[i]];
      if (i % 4 == 0) {
        currentRow = document.createElement("div");
        $(currentRow).addClass("row");
        $("#contentHolder").append(currentRow);
      }
      var col = document.createElement("div");
      $(col).addClass("col-lg-3");
      var image = document.createElement("img");
      image.src = currentObject.url;
      $(image).addClass("contentImage");
      var p = document.createElement("p");
      let temp=currentObject.name;
      temp=temp.slice(0, -4);
      $(p).html(temp);
      $(p).addClass("contentCaption");
      var aElem = document.createElement('a');
      aElem.href="model.html"+ '#' + temp;
      var aElemTN = document.createTextNode('view');
      aElem.appendChild(aElemTN);
      $(aElem).addClass("content link");

      col.appendChild(aElem);
      $(col).append(image);
      $(col).append(p);
      $(currentRow).append(col);
    }
    
  });

}

