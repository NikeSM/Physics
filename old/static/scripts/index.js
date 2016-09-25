$(document).ready(function () {
    var header_height;
    var search_height;
    var font_size;
    init();
    create_toc();

    if(current_state.isMobile) {
        $header_hide[$event](function(){
            if(current_state.header_is_visible) {
                $header_hide.buttonMarkup({ icon: 'bars' });
                font_size = $current_topic.css('font-size');
                $current_topic.css('font-size', '10px');
                set_header_height();
                header_height = $current_topic.offset().top - 4;
                $header.animate({
                    'margin-top': '-=' + header_height
                }, 500, function() {
                    current_state.header_is_visible = false;
                    $content.height($(window).height() - $header.height() - $header.offset().top);
                    $article_search.height($content.height());
                })
            }else{
                $header_hide.buttonMarkup({ icon: 'hide' });
                $current_topic.css('font-size', font_size);
                set_header_height();
                $header.animate({
                    'margin-top': '+=' + header_height
                }, 500, function() {
                    current_state.header_is_visible = true;
                    $content.height($(window).height() - $header.height() - $header.offset().top);
                    $article_search.height($content.height());
                });
            }

        });
        $search_hide[$event](function(){
            if(current_state.search_is_visible) {
                search_height = $button_open_t.offset().top - 4;
                $header.animate({
                    'margin-top': '-=' + search_height
                }, 500, function() {
                    current_state.search_is_visible = false;
                    $content.height($(window).height() - $header.height() - $header.offset().top);
                    $article_search.height($content.height());
                })
            }else{
                $header.animate({
                    'margin-top': '+=' + search_height
                }, 500, function() {
                    current_state.search_is_visible = true;
                    $content.height($(window).height() - $header.height() - $header.offset().top);
                    $article_search.height($content.height());
                })

            }

        });
        $search_hide.trigger('click');
    }else{
        $('.hint').each(function (index, elem) {
            $(elem).mouseenter(function open_hint() {
                var self = $(this);
                var id = setTimeout(function () {
                    hint.off();
                    hint.data = self.attr("data-title");
                    hint.on({x: self.offset().left + self.width(), y: self.offset().top + self.height()});

                }, 500);
                $(this).mouseleave(function close_hint() {
                    hint.off();
                    $(this).unbind('mouseleave', close_hint);
                    clearTimeout(id);
                });
            });
        });
    }


    $image_demo[$event](function () {
        $image_demo.hide();
        $page.show();
    });
    if(!current_state.isMobile) {
        $problem_number.change(function () {
                onNumberChange();
            }
        );
    }

    $button_open_t[$event](function () {
        $toc_panel_header.empty().text("Теория");
        $toc_theory.show();
        $toc_problems.hide();
    });
    $button_open_p[$event](function () {
        $toc_panel_header.empty().text("Примеры решения задач");
        $toc_problems.show();
        $toc_theory.hide();
    });


    $search.keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).trigger("enterKey");
        }
    });

    $body.on( 'click', '[data-role=dialog]', function(e){
        $.mobile.changePage($page);
    } );
    $search.bind("enterKey", function () {
        search();
    });
    window.onpopstate = function (e) {
        if (e.state && $('[data-role=dialog]').length == 0) {
            get_location(true);
        }
    };
    $pos.change(function (e) {

        if (current_state.current_problem == null) {
            showProblem($pos.val(), null, -1)
        } else {
            showParagraph($pos.val(), -1)
        }
    });
    $toc_panel.panel({
        beforeopen: function () {
            select_in_toc();
            hint.off();

        }
    });

    $ref_panel.panel({
        beforeclose: function () {
            current_state.trace = [];
            buttonDisable($ref_previous);
            add_pos();
        },
        beforeopen: function () {
            hint.off();
            $.mobile.changePage($page);
        }

    });
    $loading.hide()
});

function add_pos() {
    $pos.empty();
    var paragraph, problem;
    if(current_state.current_paragraph || current_state.current_problem) {
        if (current_state.current_problem == null) {
            paragraph = current_state.current_paragraph;
            $pos.append($('<option>').attr("data-placeholder", "true").text("Задачи по теме"));
            Object.keys(paragraph.pos).forEach(function (i) {
                var problem = problem_list[paragraph.pos[i]];
                if (problem) {
                    $pos.append($('<option>').text(problem.name).val(paragraph.pos[i]))
                }
            })
        } else {
            problem = current_state.current_problem;
            $pos.append($('<option>').attr("data-placeholder", "true").text("Теория по теме"));
            Object.keys(problem.pos).forEach(function (i) {
                var paragraph = paragraph_list[problem.pos[i]];
                if (paragraph) {
                    $pos.append($('<option>').text(paragraph.name).val(problem.pos[i]))
                }
            })
        }
        $pos.selectmenu('refresh');
    }

}

function check_problems() {
    Object.keys(problem_list).forEach(function (i) {
        if (i != 'order') {
            paragraph_list[problem_list[i].parent].has_problem = true;
            chapter_list[paragraph_list[problem_list[i].parent].parent].has_problem = true;
            book_list[chapter_list[paragraph_list[problem_list[i].parent].parent].parent].has_problem = true;
        }
    })


}

function get_location(cash) {
    var location = window.location.href;
    if (location.indexOf('#') != -1) {
        location = location.slice(location.indexOf('#') + 1);
        if(location[0] == "!"){
            location = location.slice(1);
        }
        switch (location) {
            case '':
            case 'home':
                showHome();
                break;
            case 'help':
                showHelp();
                break;
            default :
                var id = location.match(/[0-9]+/g);
                if (id) {
                    id = id[0];
                    var isProblem = location[1];
                    if (isProblem == "r") {
                        if (problem_list[id]) {
                            showProblem(id, null, 1, cash);
                        } else {
                            showError()
                        }
                    } else {
                        if (isProblem == "a") {
                            if (paragraph_list[id]) {
                                showParagraph(id, 1, cash)
                            } else {
                                showError()
                            }
                        } else {
                            showError()
                        }
                    }
                } else {
                    showError()
                }

        }
    } else {
        if (location.indexOf('escaped') == -1) {
            showHome();
        }
    }
}

function buttonDisable($button) {
    $button.addClass('ui-disabled');
}

function buttonEnable($button) {
    $button.removeClass('ui-disabled');
}

function showHome() {
    current_state.current_problem = null;
    current_state.current_paragraph = null;
    $search.val("");
    $article_search.hide();
    buttonDisable($button_next);
    buttonDisable($button_previous);
    $pos_wrap.hide();
    hint.off();


    $header_problems_buttons.hide();
    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/getHome', function (data) {
        $current_topic.html(data.title);
        $article.html(data.content);
        $loading.hide();
        set_header_height();
    });
    $pos_wrap.hide();
    window.history.pushState({id: -1, num: 0}, null, "/#home");

}

function showError() {
    current_state.current_problem = null;
    current_state.current_problem = null;
    current_state.current_paragraph = null;
    $search.val("");
    $article_search.hide();
    buttonDisable($button_next);
    buttonDisable($button_previous);
    $pos_wrap.hide();
    hint.off();

    $header_problems_buttons.hide();
    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/getError', function (data) {
        $current_topic.html(data.title);
        $article.html(data.content);
        $loading.hide();
        set_header_height();
    });
    $pos_wrap.hide();
    window.history.pushState({id: -3, num: 0}, null, "/#error");

}

function showSummary(id) {
    current_state.ref_paragraph = null;
    current_state.ref_problem = null;
    buttonDisable($show_in_article);
    if (current_state.trace.length > 0) {
        buttonEnable($ref_previous);
    }
    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/showSum', {number: id},
        function (data) {
            var sum = data.result;
            refFill($('<div>').html(sum[0][0]),
                $('<div>').html(sum[0][1]),
                'open', -1);
            current_state.ref_sum = {
                name: sum[0][0],
                content: sum[0][1],
                id: id,
                type: 'summary'
            };
            current_state.trace.push(current_state.ref_sum);
            $loading.hide();
        }
    );
}

function ref_previous() {
    var trace = current_state.trace;
    if (trace.length == 1) {
        buttonDisable($ref_previous);
    }
    if (trace.length > 0) {
        var current = trace.pop();
        if (current.type == 'paragraph') {
            if (current.id != current_state.ref_paragraph.id) {
                showParagraph(current.id, -1)
            } else {
                ref_previous();
            }
        }
        if (current.type == 'problem') {
            if (current.id != current_state.ref_problem.id) {
                showParagraph(current.id, null, -1)
            } else {
                ref_previous();
            }
        }
        if (current.type == 'summary') {
            if (current.id != current_state.ref_sum.id) {
                showParagraph(current.id)
            } else {
                ref_previous();
            }
        }
    }

}

function showHelp() {
    current_state.current_problem = null;
    current_state.current_paragraph = null;
    $search.val("");
    $article_search.hide();
    buttonDisable($button_next);
    buttonDisable($button_previous);
    $header_problems_buttons.hide();
    hint.off();
    $loading.show();
    $.getJSON($SCRIPT_ROOT + '/getHelp', function (data) {
        $current_topic.html(data.title);
        $article.html(data.content);
        $loading.hide();
        set_header_height();
    });
    $pos_wrap.hide();
    window.history.pushState({id: -2, num: 0}, null, "/#help");

}

function refFill(title, content, panel, position) {
    $(content.find("script#safe_surfing_detect_script")).remove();
    if(current_state.isMobile){
        content.append($empty_div.clone());
    }
    if (position == -1) {
        $ref_title.html(title);
        $ref_content.html(content);
        $ref_panel.panel(panel);
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub, "ref-content"]);
    } else if (position == 1) {
        $content.show();
        $current_topic.html(title);
        $article.html(content);
        if(current_state.isMobile) {
            $toc_panel.panel("close");
        }
        //MathJax.Hub.Queue(["Typeset", MathJax.Hub, "article"]);
        var $img = $('#article img');
        $img[$event](function (e) {
            e.stopPropagation();
            add_image($(this).clone());
            $page.hide();
        });
        set_header_height();
        $('.pdf').click(function() {
            //window.history.pushState({id: -3, num: 0}, null, $(this).attr('data-my-href'));
            window.open("/helpers" + $(this).attr('data-my-href'), "_blank");

        })
    }
    var $iframe = $('iframe');
    $iframe.width($($article.children()[0]).width());
    $iframe.height(320);
    //var $a = $('a[href*="javascript: showP"]');
    //$a.parent().css({'font-style':'oblique','font-size':'small'})


}

function onNumberChange() {
    var num = parseInt($problem_number.val());
    var paragraph = current_state.current_paragraph;
    var problem = current_state.current_problem;
    if (problem) {
        var count_problems = paragraph.children.length;
        if (isNaN(num)) {
            $problem_number.val(paragraph.children.indexOf(problem.id) + 1 + '/' + count_problems);
            $input_number.width($problem_number.val().length * 8);
        }
        else {
            num = Math.max(Math.min(num, count_problems), 1) - 1;
            showProblem(paragraph.children[num], null, 1)
        }
    }
}

function addProblemsButtons(problem) {
    var count_problems = paragraph_list[problem.parent].children.length;
    if(current_state.isMobile){
        $problem_number.text(problem.number + '/' + count_problems + " ");
    }else {
        $problem_number.val(problem.number + '/' + count_problems + " ");
        $input_number.width($problem_number.val().length * 7.5);
    }
}

function buttonNextProblem() {
    var problems = current_state.current_paragraph.children;
    var problem = current_state.current_problem;
    showProblem(problems[problems.indexOf(problem.id) + 1], null, 1)
}

function buttonPreviousProblem() {
    var problems = current_state.current_paragraph.children;
    var problem = current_state.current_problem;
    showProblem(problems[problems.indexOf(problem.id) - 1], null, 1)
}

function buttonNext() {
    var paragraph = current_state.current_paragraph;
    var chapter = chapter_list[paragraph.parent];
    paragraph = paragraph_list[chapter.children[chapter.children.indexOf(paragraph.id) + 1]];
    showParagraph(paragraph.id, 1);
}

function buttonPrevious() {
    var paragraph = current_state.current_paragraph;
    var chapter = chapter_list[paragraph.parent];
    paragraph = paragraph_list[chapter.children[chapter.children.indexOf(paragraph.id) - 1]];
    showParagraph(paragraph.id, 1);
}

function select_in_toc() {
    var paragraph, problem, chapter, $chapter, $paragraph;
    var $collapsible = $('.collapse');
    var $paragraphs = $('.paragraph');
    paragraph = current_state.current_paragraph;
    $paragraphs.removeClass('selectInContent');
    $paragraphs.css({color: '#000000'});
    $collapsible.trigger('collapse');
    if (paragraph) {
        chapter = chapter_list[paragraph.parent];
        problem = current_state.current_problem;

        if (problem) {
            $paragraph = $('#problem_paragraph_' + chapter.parent + '_' + chapter.id + '_' + paragraph.id);
            $chapter = $('#problem_chapter_' + chapter.parent + '_' + chapter.id);
            $chapter.trigger('expand');
            $paragraph.addClass('selectInContent');
            $paragraph.css({color: '#ffffff'});
        } else {
            $paragraph = $('#theory_paragraph_' + chapter.parent + '_' + chapter.id + '_' + paragraph.id);
            $chapter = $('#theory_chapter_' + chapter.parent + '_' + chapter.id);
            $chapter.trigger('expand');
            $paragraph.addClass('selectInContent');
            $paragraph.css({color: '#ffffff'});
        }
    }
}

function show_in_article() {
    var paragraph = current_state.ref_paragraph;
    var problem = current_state.ref_problem;
    if (problem) {
        showProblem(problem.id, null, 1)
    } else {
        showParagraph(paragraph.id, 1)
    }
    $ref_panel.panel('close');
}


function open_t() {
    $toc_panel_header.empty().text("Теория");
    $toc_theory.show();
    $toc_problems.hide();
}

function open_p() {
    $toc_panel_header.empty().text("Примеры решения задач");
    $toc_problems.show();
    $toc_theory.hide();
}
