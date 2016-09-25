var book_list, problem_list, chapter_list, paragraph_list;

create_toc = function() {
    $.getJSON($SCRIPT_ROOT + '/TOC', function (data) {
        book_list = data.books;
        chapter_list = data.chapters;
        paragraph_list = data.paragraphs;
        problem_list = data.problems;
        check_problems();
        Object.keys(book_list.order).forEach(function (i) {
            var book_id = book_list.order[i];
            var $book_element = $('<h4>').text(book_list[book_id].name).addClass("book");


            $toc_theory.append($book_element.clone());
            $toc_problems.append($book_element.clone());

            Object.keys(book_list[book_id].children).forEach(function (j) {
                var chapter_id = book_list[book_id].children[j];
                var chapter_html_id = 'chapter_' + book_list[book_id].id + '_' + chapter_list[chapter_id].id;
                var $chapter_element = $('<div>', {
                    class: 'chapter collapse',
                    "data-theme": "b",
                    "data-content-theme": "c",
                    "data-collapsed-icon": "arrow-r",
                    "data-expanded-icon": "arrow-d",
                    "data-iconpos": "right",
                    "data-inset": "true"
                })
                    .append($('<h2>').text(chapter_list[chapter_id].name))
                    .append($('<ul>', {
                        "data-role": "listview"
                    }));

                $toc_theory.append($chapter_element.clone().attr('id', 'theory_' + chapter_html_id));
                $toc_problems.append($chapter_element.clone().attr('id', 'problem_' + chapter_html_id));


                Object.keys(chapter_list[chapter_id].children).forEach(function (k) {
                    var paragraph_id = chapter_list[chapter_id].children[k];
                    var paragraph_html_id = 'paragraph_' + book_list[book_id].id + '_' + chapter_list[chapter_id].id
                        + '_' + paragraph_list[paragraph_id].id;
                    var $a =$('<a>', {
                        id: 'theory_' + paragraph_html_id,
                        class: "buttonTheoryContent paragraph"
                    }).text(paragraph_list[paragraph_id].name);
                    var paragraph_element_theory = $('<li>').append($a);
                    (function(){
                        var id = paragraph_list[paragraph_id].id;
                        $a[$event](function () {
                            showParagraph(id, 1);
                        });
                    })();

                    $('#theory_' + chapter_html_id + ' ul').append(paragraph_element_theory);
                    if(paragraph_list[paragraph_id].has_problem) {
                        $a = $('<a>', {
                            id: 'problem_' + paragraph_html_id,
                            class: "buttonTheoryContent paragraph"
                        }).text(paragraph_list[paragraph_id].name);
                        var paragraph_element_problem = $('<li>')
                            .append($a);

                        (function(){
                            var id = paragraph_list[paragraph_id].children[0];
                            $a[$event](function () {
                                showProblem(id, null, 1);
                            });
                        })();
                    }

                    $('#problem_' + chapter_html_id + ' ul').append(paragraph_element_problem);

                });
                $('#theory_' + chapter_html_id + ' ul').listview();
                $('#problem_' + chapter_html_id + ' ul').listview();
                $('#theory_' + chapter_html_id).collapsible();
                $('#problem_' + chapter_html_id).collapsible();
            });


        });
        $('.collapse').bind('expand', function () {
            $('.collapse:not(#' + this.id + ')').trigger("collapse");
        });
        $('.chapter').find('h2')[$event](function() {
            var $ul = $(this);
            $toc_scroll.scrollTop($($ul).offset().top - $toc_scroll.offset().top +  $toc_scroll.scrollTop());
        });
        $toc_theory.append($empty_div.clone());
        $toc_problems.append($empty_div.clone());
        get_location(false);

    });


};