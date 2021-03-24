var update= document.getElementById('update');
var del = document.getElementById('delete');

function pushInfoElement(e){
	console.log(e);
	document.getElementById('exampleModalCenterTitle').innerText="Delete "+e.name;
	document.getElementById('textModal').innerText='Are you sure to delete '+e.name+' ?';
	console.log(document.getElementById('id'));
	document.getElementById('id').value=e.id;
}

/*
update.addEventListener('click',function(){
	//console.log('event listener');
	fetch('quotes', {
	  method: 'put',
	  headers: {'Content-Type': 'application/json'},
	  body: JSON.stringify({
	    'name': 'replace',
	    'quote': 'quote'
	  })
	}).then(response=>{
	  if(response.ok) return response.json();
	}).then(data=>{
	  console.log(data);
	  window.location.reload();
	});
});
*/

del.addEventListener('click',function() {
	console.log('delete');
	id=document.getElementById('id').value;
	fetch('home', {
		method: 'delete',
		headers: {
		'Content-Type': 'application/json'
		},
		body: JSON.stringify({'id': id})
	}).then(function(response) {
		console.log("response");
		console.log(response);
		//window.location=
		window.location.href=window.location;
		//return true;
		//window.location.reload();
	})
	.catch((err)=>{
		console.log(err);
	})
});


