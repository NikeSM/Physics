search = function() {
if($search.val != ""){
    var $search_elements = $('.search_element');
    $search_elements.remove();
    buttonDisable($button_next);
    buttonDisable($button_previous);
    $header_problems_buttons.hide();
    $pos_wrap.hide();
    $content.hide();
    $article_search.show();
    $($article_search.children('div')).remove();
    $current_topic.html($('<span>').text("Результаты поиска"));
    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/search', {request: $search.val()},
        function (data) {
            var result = data.result;
            var threshold = 0;
            for(var i = 0; i < result.length; i++) {
                threshold += result[i][1]
            }
            threshold /= result.length;
            result.sort(function(a, b){
                return b[1] - a[1]
            });
            var $a, $li;
            for(i = result.length - 1; i >= 0; i--){
                if(result[i][2]) {
                    $a = $('<a>').text(paragraph_list[result[i][0]].name);
                    $li = $('<li>').addClass("search_element").attr("data-icon", "t").append($a);
                }else{
                    $a = $('<a>').text(problem_list[result[i][0]].name);
                    $li = $('<li>').addClass("search_element").attr("data-icon", "p").append($a);
                }
                    if (result[i][1] < threshold) {
                        $search_good_result.after($li);
                    } else {
                        $search_best_result.after($li);
                    }
                    (function () {
                        var id = result[i];
                        var button = $a;
                        $a[$event](function () {
                            $search_elements = $('.search_element a');
                            $search_elements.removeClass('selectInContent');
                            $search_elements.css({color: '#000000'});
                            button.addClass('selectInContent');
                            button.css({color: 'white'});
                            if(id[2]) {
                                showParagraph(id[0], -1);
                            }else{
                                showProblem(id[0], null, -1)
                            }
                        })
                    })();

            }


            $search_results.listview('refresh');
            $article_search.append($empty_div.clone());
            if (result == []) {
                $('#article').empty().append($('<span>').text('Ничего не найдено.'))
            }
        $loading.hide();
        });
}
};