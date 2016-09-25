var result = { 'c0': "", 'c1': "", 'c2': "", 'c3': "", 'c4': "", 'c5': "", 'c6': ""};
var currentType = "c0";
var editing = 0;
var selected = 2;
var response = [[ ]];
var responseLinks = [[ ]];
var radioName = [['Описание', 'Имя', 'Номер'],['Описание', 'Имя', 'Номер'],
				 ['Содержание', 'Описание', 'Ключевые слова', 'Название', 'Номер', 'Задачи по теме'],
				 ['Условие', 'Ключевые слова', 'Название', 'Номер', 'Теория по теме'],
				 ['Содержание', 'Название', 'Номер']];
var linksArray;
var problems;

var  all = {books:{},chapters:{},paragraphs:{},problems:{}};

$(document).ready(function() {

    $('body').click(function(){
        $('[data-role=dialog]').dialog( "close" );
    });

	allProblems();
   load_data();
	$('#textMain').val("");
	start();

	$('#selectMain').change(function() {
		empt();
		selected = $('#selectMain').val();

		addradio(radioName[selected]);
		$('#buttonHor').controlgroup("refresh");

		addoption($('#selectData'), selected, editing);
		change();
		currentType = "c0";


	});

	$('#buttonAdd').click(function() {
		$('#img').attr("style", "display:none");
		$('#del').hide();
		empt();
		editing = 0;
		addoption($('#selectData'), selected, editing); 
	});
	$('#buttonEdit').click(function() {
		$('#img').attr("style", "display");
		$('#del').show();
		editing = 1 ;
		addoption($('#selectData'), selected, editing);
		empt();

	});

	$('#selectData').change(function() {
		if(editing == 1)
			fill(selected, editing);

	});

	$('#sub').click(function() {
      result[currentType] = $('#textMain').val();

      for (var i in result) {
          if (!result.hasOwnProperty())
              continue;
          result[i] = result[i].replace('"', "'");
      }
      if (correct(selected, editing, result, response[$('#selectData').val()])) {
              $.post($SCRIPT_ROOT + "/submit",
                  {"A": JSON.stringify(result),
                      "B": editing,
                      "C": selected,
                      "D": response[$('#selectData').val()][0]},
                  onAjaxSuccess
              );
              function onAjaxSuccess(data) {
                  alert("Данные отправлены");
              }
          }
  });

    function correct( sel, ed, res, id) {
        var name = "";
        var number = 0;
        var pos = "";
        var kw = "";
        var content = "";
        if(id != undefined){
            id = id[0]
        }else{
            if(sel != 0){
                if(ed == 0) {
                    alert("Parent element doesn't choose");
                    return false
                }
                else{
                    alert("Editable element doesn't choose");
                    return false
                }
            }
            if(sel == 0){
                if(ed == 1){
                    alert("Editable element doesn't choose");
                    return false
                }
            }
        }
        switch (parseInt(sel)){
            case 0:
                name = res['c1'];
                number = res['c2'];
                content = "None";
                if(isInt(number)) {
                    if (ed == 0) {
                        if (numberExist(number, all['books'], 0)) {
                            alert("Number already exist");
                            return false
                        }
                    }
                }
                else{
                    alert("Number is not a number");
                    return false
                }
                break;
            case 1:
                name = res['c1'];
                number = res['c2'];
                content = "None";
                if(isInt(number)) {
                    if (ed == 0) {
                        if (numberExist(number, all['chapters'], id)) {
                            alert("Number already exist");
                            return false
                        }
                    }
                }
                else{
                    alert("Number is not a number");
                    return false
                }
                break;
            case 2:
                name = res['c3'];
                number = res['c4'];
                kw = res['c2'];
                pos = res['c5'];
                content = res['c0'];
                if(isInt(number)) {
                    if (ed == 0) {
                        if (numberExist(number, all['paragraphs'], id)) {
                            alert("Number already exist");
                            return false
                        }
                    }
                }
                else{
                    alert("Number is not a number");
                    return false
                }
                break;
            case 3:
                content = res['c0'];
                name = res['c2'];
                number = res['c3'];
                kw = res['c1'];
                pos = res['c4'];
                if(isInt(number)) {
                    if (ed == 0) {
                        if (numberExist(number, all['problems'], id)) {
                            alert("Number already exist");
                            return false
                        }
                    }
                }
                else{
                    alert("Number is not a number");
                    return false
                }
                break;
            case 4:
                content = res['c0'];
                name = res['c1'];
            break;
        }
        if(content.length == 0){
            alert("Content length is 0");
            return false
        }
        if(name.length > 150){
            alert("Name is very long");
            return false
        }
        if(name.length == 0){
            alert("Name length is 0");
            return false
        }
        if(kw.length > 500){
            alert('Too match keywords');
            return false
        }
        if(pos && pos.length > 0 && pos != "None" ){
            pos = pos.split(",");
            for(var  i in pos){
                if(!isInt(pos[i])){
                    alert("Exception in 'pos' format");
                    return false
                }
            }
        }

        return true;
    }
    function isInt(value) {
        var x = parseInt(value);
        return !isNaN(value) && (x | 0) === x;
    }

	$('#addLink').change(function() {
		if ($('#addLink').val() > 0)
			addoption($('#selectLink'), $('#addLink').val(), 1);
		else{
			$('#outLink').attr("style", "display");
			$('#addOutLink').click(function(){
				replaceSelectedText($('#textMain')[0], addLink, 0, $('#addLink').val());
			$('#outLink').attr("style", "display: none");			
			})
		}
	});

	$('#selectLink').change(function() {
		replaceSelectedText($('#textMain')[0], addLink, responseLinks[$('#selectLink').val()][0], $('#addLink').val());
	});

	$('#addFile').change(function(event){
		var file = $('#addFile')[0].files[0];
		var reader = new FileReader();
		reader.onload = function(event) {
			var contents = event.target.result;
			$('#textMain').val(contents)
		};
		reader.readAsText(file);

	});
    $('#reset').click(function(){
        var control = $('#addFile');
        control.replaceWith( control = control.clone( true ) );
        $($('#selectLink').children()[0]).attr("selected", "selected");
        $('#selectLink').selectmenu('refresh', true);
    });
	$('#clear').click(function() {
		 $('#textMain').val("")
	});

	$('#delete').click(function() {
		del();
	})
});

function start() {
	addoption($('#selectData'), 2, 0);
	change();
}

function change() {
	$('#buttonHor').find('input').click(function() {
		result[currentType] = $('#textMain').val();
		$('#textMain').val(result[this.id]);
		currentType = this.id;
	})
}

function replaceSelectedText(obj, cbFunc, id, type) {
	obj.focus();
	if (document.selection) {
		var s = document.selection.createRange(); 
		if (s.text) {
			s.text = cbFunc(s.text, id, type);
			s.select();
			return true;
		}
	}
	else if (typeof(obj.selectionStart) == "number") {
		if (obj.selectionStart != obj.selectionEnd) {
			var start = obj.selectionStart;
			var end = obj.selectionEnd;
			eval("var rs = " + cbFunc + "(obj.value.substr(start,end-start)," + id + "," + type + ");");
			obj.value = obj.value.substr(0,start) + rs + obj.value.substr(end);
			obj.setSelectionRange(end, end);
		}
		return true;
	}
	return false;
}

function sleep(ms) {
ms += new Date().getTime();
while (new Date() < ms){}
} 

function allProblems () {
	$.getJSON($SCRIPT_ROOT + '/' + editor + '/getAllProblems',
		function (data) {
			problems = data.problems;
	})
}

function linkProblem (s, id) {
	for(var i in problems){
		if(problems[i][0] == id){
			linksArray[3] = '<a href = "javascript: showProblem(' + problems[i][1] + ',' + problems[i][2] + ',-1)">';
		}
	}
}

function addLink (s, id, type) {
	linksArray =['<a href = http://' + $('#textOutLink').val() + ' target = "_blank">',
					'',
					'<a href = "javascript: showParagraph(' + id + ',-1)">',
					'',
					'<a href = "javascript: showSummary(' + id + ')">'
			   ];
	linkProblem(s, id);
	s = linksArray[type] + s +'</a>';
	return s;
}

function fill(selected, editing) {
	$.getJSON($SCRIPT_ROOT + '/' + editor + '/data', {A: selected, B: editing},
	function (data) {
		response = data.res;
		$.getJSON($SCRIPT_ROOT + '/' + editor + '/fill', {A: selected, B: response[$('#selectData').val()][0]},
		function (data) {
			for(i in data.res[0]){
				result['c' + i] = data.res[0][i];
			}
			$('#textMain').val(data.res[0][currentType.replace(/\D*/, "")]);
		})

			
	})
}
function addradio(name) {
	$('#buttonHor').empty();
	for (var i in name) {
		$('#buttonHor').append($('<input>')
					.attr("type", "radio")
					.attr("name", "add2")
					.attr("id", "c" + i)
					.val("off")
					.append($('<label>').attr("for", "c" + i).text(name[i]))
		)
	}
	$('#c0').attr("checked", "checked").val("on");
	$("input[type = 'radio']").checkboxradio();
	$("input[type = 'radio']").checkboxradio("refresh");

}

function empt() {
	$('#textMain').val("");
	result = { 'c0': "", 'c1': "", 'c2': "", 'c3': "", 'c4': "", 'c5': "", 'c6': "", 'c7': "" };
}

function addoption($obj, selected, editing) {
	$.getJSON( $SCRIPT_ROOT + '/' + editor + '/data', {A: selected, B: editing},

		function (data) {

			$obj.empty();
//			if($obj.selector == "#selectLink")
				$obj.append($('<option>').attr("data-placeholder", "true").text("Выберите:"));
			var res = data.res;

			if (selected == 4 && editing == 0) {res.push(["0","Нет", "", ""])}
			if (res != [[]]){
				for (var i in res) {
					var s = "";
					for (var j in res[i]) {
						if (j != 0)
							s = s + res[i][j] + ".";
					}
				$obj.append($('<option>').attr("value", i).text(s));
				}			
			}
		$obj.selectmenu('refresh');
		if($obj.selector == "#selectData")
			response = res;
		else
			responseLinks = res
	})
}



function del() {
	if(confirm("Удалить " + $($('#selectData').children()[$('#selectData').val()]).text() + "?")) { 
	$.getJSON( $SCRIPT_ROOT + '/' + editor + '/delete', {type: selected, id: response[$('#selectData').val()][0]},
		function (data) {
		})
			.done(function() {
	    alert("Удалено")
	  	})
		  .fail(function() {
		    alert( "Ошибка" );
		  })
		
	}


}

load_data = function() {
    $.getJSON( $SCRIPT_ROOT + '/TOC',
        function (data) {
            all.books = data.books;
            all.chapters = data.chapters;
            all.paragraphs = data.paragraphs;
            all.problems = data.problems;

        }
    )
};
function numberExist(a, b, key){
    if(key == 0) {
        for (var i in b) {
            if (a == b[i].number)
                return true;
        }
        return false;
    }else{

        for (var i in b) {
            if (a == b[i].number && b[i].parent == key)
                return true;
        }
        return false;
    }
}