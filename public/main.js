<<<<<<< HEAD

=======
>>>>>>> devel
var update= document.getElementById('update');
var del = document.getElementById('delete');

update.addEventListener('click',function(){
	//console.log('event listener');
	fetch('quotes', {
	  method: 'put',
	  headers: {'Content-Type': 'application/json'},
	  body: JSON.stringify({
	    'name': 'XXX',
	    'quote': 'YYY'
	  })
	}).then(response=>{
	  if(response.ok) return response.json();
	}).then(data=>{
<<<<<<< HEAD
	  //console.log(data);
	  window.location.reload();
=======
	  console.log(data);
	  //window.location.reload();
>>>>>>> devel
	});
});

del.addEventListener('click',function() {
	console.log('delete');
  fetch('quotes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'XXX',
      'quote': 'Hi MotherFucker I\'ll kill you!'
    })
  }).then(function(response) {
    window.location.reload();
  })
});


