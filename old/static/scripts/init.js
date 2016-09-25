var $pos, $header, $button_previous, $button_next, $problem_number, $input_number, $toc_theory, $toc_problems,
    $toc_panel_header, $article_search, $search, $header_problems_buttons, $current_topic, $article, $pos_wrap,
    $show_in_article, $button_open_t, $button_open_p, $ref_title, $ref_content, $ref_panel, $pos_button,
    $button_previous_problem, $button_next_problem, $toc_panel, $ref_previous, $search_results, $search_best_result,
    $search_good_result, $content, $page, $image_demo, $toc_scroll, $header_controlgroup, $toc_control_buttons,
    $anchor, $body, $empty_div, $event, $header_hide, $loading, $search_hide;

function init() {
    $loading = $('#loading');
    $loading.show();
    $loading.offset({
        left: ($(window).width() - $($loading.children()).width()) / 2,
        top: ($(window).height() - $($loading.children()).height()) / 2
    });
    $body = $('body');
    $toc_control_buttons = $('.toc_control_buttons');
    $toc_panel_header = $('#panel_header');
    $toc_theory = $('#toc_theory');
    $toc_problems = $('#toc_problems');
    $toc_panel = $('#toc_panel');
    $header = $('#header');
    $article_search = $('#article_search');
    $article = $('#article');
    $show_in_article = $('#show_in_article');
    $ref_title = $('#ref_title');
    $ref_content = $('#ref_content');
    $ref_panel = $('#ref_panel');
    $ref_previous = $('#ref_previous');
    $search_results = $('#search_results');
    $search_best_result = $('#search_best');
    $search_good_result = $('#search_good');
    $content = $('#content');
    $page = $('#main_page');
    $image_demo = $('#image_demo');
    $toc_scroll = $('#toc_scroll');
    $anchor = $('#anchor');
    $empty_div = $('<div>').css('height', '150px');


    if (current_state.isMobile) {
        $header.hide();
        $search_hide = $('#search_hide');
        $header_hide = $('#mobile_header_hide');
        $event = 'click';
        $toc_control_buttons.hide();
        $header = $('#mobile_header');
        $button_previous = $('#mobile_button_previous');
        $button_next = $('#mobile_button_next');
        $button_previous_problem = $('#mobile_button_previous_problem');
        $button_next_problem = $('#mobile_button_next_problem');
        $header_problems_buttons = $('#mobile_header_problems_buttons');
        $problem_number = $('#mobile_problem_number');
        $input_number = $($header_problems_buttons.find('input'));
        $button_open_t = $('#mobile_button_t');
        $button_open_p = $('#mobile_button_p');
        $pos = $('#mobile_pos');
        $pos_wrap = $('#mobile_pos_wrap');
        $pos_button = $('#mobile_pos_button');
        $current_topic = $('#mobile_current_topic');
        $search = $('#mobile_search');
        $header_controlgroup = $('#mobile_header_controlgroup');
        $content.height($(window).height() - $header.height());
        $article_search.height($content.height());
        add_mobile_css();
        $header.css('margin-top', $header.css('margin-top') - $search.height())
    } else {
        $event = 'click';
        $('#mobile_toc_close_button').hide();
        $('#mobile_header').hide();
        $button_previous = $('#button_previous');
        $button_next = $('#button_next');
        $button_previous_problem = $('#button_previous_problem');
        $button_next_problem = $('#button_next_problem');
        $header_problems_buttons = $('#header_problems_buttons');
        $problem_number = $('#problem_number');
        $input_number = $($header_problems_buttons.find('input'));
        $button_open_t = $('#button_t');
        $button_open_p = $('#button_p');
        $pos = $('#pos');
        $pos_wrap = $('#pos_wrap');
        $pos_button = $('#pos_button');
        $current_topic = $('#current_topic');
        $search = $('#search');
        $header_controlgroup = $('#header_controlgroup');
    }
    set_header_height();
}
function set_header_height(value) {

    if (current_state.isMobile) {
        $header.height($header_hide.offset().top + $header_hide.height() - $header.offset().top + 5);
    }
}
function add_mobile_css() {

    //$content.css({
    //    margin: '1px',
    //    padding: '3px'
    //});
    //
    //$('#toc_panel.ui-panel').css({
    //    width: '100vw'
    //});
    //
    //
    ////$('#toc_panel.ui-panel-closed').css({
    ////    width: 0
    ////});
    //
    //$('.ui-panel-position-left.ui-panel-display-reveal').css({
    //    left: 0
    //});
    //
    //$('.ui-panel-content-wrap-position-left.ui-panel-content-wrap-open,' +
    //    '.ui-panel-dismiss-position-left.ui-panel-dismiss-open').css(
    //    {
    //        left: '100vw',
    //        right: '-100vw'
    //    });
    //
    //$('.ui-panel-animate.ui-panel-content-wrap-position-left.ui-panel-content-wrap-open' +
    //    '.ui-panel-content-wrap-display-reveal').css(
    //    {
    //        left: 0,
    //        right: 0,
    //        '-webkit-transform': 'translate3d(100vw, 0, 0)',
    //        '-moz-transform': 'translate3d(100vw, 0, 0)',
    //        'transform': 'translate3d(100vw, 0, 0)'
    //    });
    //
    //$('#ref_panel.ui-panel').css({
    //    width: '100vw'
    //});
    //
    //
    ////$('#ref_panel.ui-panel-closed').css({
    ////    width: 0
    ////});
    //$('.ui-panel-position-right.ui-panel-display-reveal').css({
    //    right: 0
    //});
    //
    //$('.ui-panel-content-wrap-position-right.ui-panel-content-wrap-open,' +
    //    '.ui-panel-dismiss-position-right.ui-panel-dismiss-open').css(
    //    {
    //        left: '100vw',
    //        right: '-100vw'
    //    });
    //
    //$('.ui-panel-animate.ui-panel-content-wrap-position-right.ui-panel-content-wrap-open' +
    //    '.ui-panel-content-wrap-display-reveal').css(
    //    {
    //        left: 0,
    //        right: 0,
    //        '-webkit-transform': 'translate3d(100vw, 0, 0)',
    //        '-moz-transform': 'translate3d(100vw, 0, 0)',
    //        'transform': 'translate3d(100vw, 0, 0)'
    //    });
    $('#mobile_search').parent().parent().css({
        padding: 0,
        margin: '4px',
        border: 0
    })

}