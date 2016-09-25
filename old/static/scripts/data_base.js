$( document ).ready(function (event) {
	$.getJSON($SCRIPT_ROOT + '/getAll', 
	function (data) {
		var list = ['book', 'chapter', 'paragraph', 'problem', 'prompt', 'search', 'image', 'feedback'];
		for(var i in list)
			addTable(list[i], data);
	})

});

function addTable(name, data){

	for(var i in data[name]){
		$('#' + name).append($('<tr>').attr("id",name + i));
		for(var j in data[name][i])
			$('#' + name + i).append($('<td>').html(data[name][i][j]))
	}	
}