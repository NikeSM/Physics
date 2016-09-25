function showProblem(id, number, mode, cash) {
    var problem, paragraph, chapter;
    if(number != null) {
        paragraph = paragraph_list[id];
        problem = problem_list[paragraph.children[number - 1]]

    }else{
        problem = problem_list[id];
        paragraph = paragraph_list[problem.parent]
    }
    chapter = chapter_list[paragraph.parent];

    if (mode == 1) {
        current_state.current_problem = problem;
        current_state.current_paragraph = paragraph;
        select_in_toc();
        if (!cash) {
            window.history.pushState({id: problem.id, num: number}, null, "/#problemID" + problem.id);
        }
        $search.text("");
        $article_search.hide();
        $button_next.hide();
        $button_previous.hide();
        $header_problems_buttons.show();
        $pos_wrap.show().css('margin-left',"-14px");
        hint.off();

        addProblemsButtons(problem);
        add_pos();
        if(paragraph.children[0] == problem.id){
           buttonDisable($button_previous_problem)
        }else{
            buttonEnable($button_previous_problem)
        }
        if(paragraph.children[paragraph.children.length - 1] == problem.id){
            buttonDisable($button_next_problem)
        }else{
            buttonEnable($button_next_problem)
        }
        if(problem.pos.length == 0){
            buttonDisable($pos_wrap)
        }else{
            buttonEnable($pos_wrap)
        }
    }else {
        current_state.ref_problem = problem;
        current_state.ref_paragraph = paragraph;
        buttonEnable($show_in_article);
        if(current_state.trace.length > 0) {
            buttonEnable($ref_previous);
        }
        problem.type = 'problem';
        current_state.trace.push(problem);
    }
    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/showProblem', {problem: problem.id},
        function (data) {
            var content = data.content[0];
            var $div = $('<div>');
            $div.append($('<h3>').html(problem.name)).append($('<div>').html(content));
            refFill($('<div>').html(paragraph.name),
                $div,
                'open', mode);
            $loading.hide();
        }
    );

}