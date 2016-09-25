function showParagraph(id, mode, cash) {
    //$anchor.append($('<a>').attr('id', '!paragraphID' + id));
    var paragraph, chapter;
    paragraph = paragraph_list[id];
    chapter = chapter_list[paragraph.parent];
    if (mode == 1) {
        current_state.current_problem = null;
        current_state.current_paragraph = paragraph;
        select_in_toc();
        if (!cash) {
            window.history.pushState({id: paragraph.id, num: 0}, null, "/#paragraphID" + paragraph.id);

        }
        $search.val("");
        $article_search.hide();
        $button_next.show();
        $button_previous.show();
        $header_problems_buttons.hide();
        $pos_wrap.show().css('margin-left',"0px");
        hint.off();

        add_pos();

        if(chapter.children[0] == paragraph.id){
            buttonDisable($button_previous)
        }else{
            buttonEnable($button_previous)
        }
        if(chapter.children[chapter.children.length - 1] == paragraph.id){
            buttonDisable($button_next)
        }else{
            buttonEnable($button_next)
        }
        if(paragraph.pos.length == 0){
            buttonDisable($pos_wrap)
        }else{
            buttonEnable($pos_wrap)
        }
    }
    else {
        current_state.ref_problem = null;
        current_state.ref_paragraph = paragraph;
        buttonEnable($show_in_article);
        if(current_state.trace.length > 0) {
            buttonEnable($ref_previous);
        }
        paragraph.type = 'paragraph';
        current_state.trace.push(paragraph);

    }

    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/showParagraph', {
        paragraph: paragraph.id
    }, function (data) {
        var content = data.content[0];
        refFill($('<div>').html(paragraph.name),
            $('<div>').html(content),
            'open', mode);
        $loading.hide();
    })

}