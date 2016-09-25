$(document).ready(function () {
   $('#submit').click(function () {
       var result = '';
        for (var i = 1; i <= 5; i++){
            var check = $('#form' + i).find('input:checked');
            if (check.length > 0) {
                result += i + ':' + $(check[0]).val() + ', '
            } else {
                result += i + ':Не выбрано, ';
            }
        }
       $.getJSON($SCRIPT_ROOT + '/feedback', {text: result.slice(0, -2)}, function () {
           $('#confirm').text("Данные отправлены. Спасибо за Ваш ответ!")
       });
        console.log()
   }); 

    $('#form2').change(function () {
        var check = $('#form2').find('input:checked');
        ($(check).val() == 'Нет') ?
            $('#hidden').show() :
            $('#hidden').hide()
    });
    $('#pay').click(function () {
        $('#payPage').show();
    });

    $('#payPage').click(function () {
        $('#payPage').hide();
    });
    $('#closeButton').click(function () {
        $('#payPage').hide();
    });
    $('#payPageContent').click(function (e) {
        e.stopPropagation()
    });
});