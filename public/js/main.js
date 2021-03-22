var update= document.getElementById('update');
var del = document.getElementById('delete');


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

del.addEventListener('click',function() {
	console.log('delete');
  fetch('quotes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'replace',
      'quote': 'quote'
    })
  }).then(function(response) {
    //window.location.reload();
  })
});
*/

