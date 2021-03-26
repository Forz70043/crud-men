
function restoreValueBought(){
	var idElem=document.getElementById('id_update').value;
	el=document.getElementById('bought_'+idElem);
	console.log(el);
	if(el.checked) el.checked=false;
	else el.checked=true;

}

function pushInfoElement(e){
	console.log(e);
	document.getElementById('exampleModalCenterTitle').innerText="Delete "+e.name;
	document.getElementById('textModal').innerText='Are you sure to delete '+e.name+' ?';
	console.log(document.getElementById('id'));
	document.getElementById('id').value=e.id;
	document.getElementById('modalForm').action=e.action;
	console.log(document.getElementById('modalForm'));
}

function updateBought(e){
	console.log(e);
	var boughtEl = document.getElementById('bought_'+e.id);
	console.log(boughtEl);
	document.getElementById('exampleModalCenterUpdateTitle').innerText="Update "+e.name;
	var stringText='Vuoi segnare '+e.name+' come ';
	stringText+=(boughtEl.checked) ? 'comprato ?' : 'non comprato ?';
	document.getElementById('textModalUpdate').innerText=stringText;
	document.getElementById('id_update').value=e.id;
	document.getElementById('bought_update').value=(boughtEl.checked)?'yes':'no';
	document.getElementById('modalFormUpdate').action=e.action;
	//$('#modalFormUpdate').append(boughtEl);
	console.log(document.getElementById('modalFormUpdate'));
}
