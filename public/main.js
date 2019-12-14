//window.onload = function(){
var update= document.getElementById('update');
var del = document.getElementById('delete');

console.log(update);

update.addEventListener('click',function(){
	console.log('event listener');
	fetch('quotes', {
	  method: 'put',
	  headers: {'Content-Type': 'application/json'},
	  body: JSON.stringify({
	    'name': 'XXX Hi MotherFucker',
	    'quote': 'I\'ll kill you!'
	  })
	}).then(response=>{
	  if(response.ok) return response.json();
	}).then(data=>{
	  console.log(data);
	});
});

del.addEventListener('click', function () {
  fetch('quotes', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'name': 'Darth Vader'
    })
  }).then(function (response) {
    window.location.reload()
  })
})



//}


