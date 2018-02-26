//ocultamos
$(".chat-body").html("");
$("#chat").hide();
$("#login").show();

//declaramos variables globales
var user;

var provider = new firebase.auth.GoogleAuthProvider();

$("#google-login").on("click", function(){
	firebase.auth().signInWithPopup(provider)
	.then(result=>{
		//console.log(result.user);
		user = result.user;
		prepareTheChat(result.user);
	})
	.catch(err=>console.log(err));
});

//exito al hacer login:
function prepareTheChat(user){
	$("#chat").show();
	$("#login").hide();
	$(".card-title").html(user.displayName);
	$(".card-text").html(user.email);
	$(".card-img-top").prop("src", user.photoURL);
}


//traemos los mensajes de firebase database
firebase.database().ref("chat")
	.on("child_added", function(snap){
		var datos = snap.val();
		if(user && user.displayName === datos.displayName){
			$(".chat-body").append(`
				<div class="ballon alert alert-info" role="alert">
				  <img width="20" src="${datos.photoURL}" />
				  <strong>${datos.displayName}</strong> 
				  ${datos.text}
				</div>
			`);
		} else {
			$(".chat-body").append(`
				<div class="ballon alert alert-warning" role="alert">
				  <img width="20" src="${datos.photoURL}" />
				  <strong>${datos.displayName}</strong> 
				  ${datos.text}
				</div>
			`);
		}

		$('.chat-body').scrollTop($('.chat-body').height() + 80000);
		
	});

//vamos a subir mensajes!
function pushMessage(text){
	//creamos el mensaje:
	var message = {
		date: new Date(),
		displayName: user.displayName,
		photoURL: user.photoURL,
		text: text
	};
	firebase.database().ref("chat")
		.push(message);	
}

//agregamos el observador
addEventListener("keydown", function(event){
	if(event.keyCode === 13){
		var text = $("input").val();
		pushMessage(text);
		$("input").val("");
	}
});









