var hint = (function () {

    var div = $('<div>')
        .attr('id', 'hint')
        .css({position: 'absolute'});

    var exist = false;
    var $body;
    var $document;

    var isOn = false;

    var hint = {
        data: {},

        on: function (position) {
            isOn = true;
            if (!exist) {
                $body = $('body');
                $document = $(document);
                $body.append(div);
                exist = true;
            }
            div.show();
            div.empty();
            div.html(
                hint.data
            );

            if (position) {
                div.offset(
                    {
                        left: Math.min(Math.max(position.x, 0), $document.width() - div.width()),
                        top: Math.min(Math.max(position.y, 0), $document.height() - div.height())
                    });
            }


        },

        off: function () {

            div.hide();
            isOn = false;
        },
        isOn: function(){return isOn},

        move: function (position) {
            if (position) {
                div.offset(
                    {
                        left: Math.min(Math.max(position.x, 0), $document.width() - div.width()),
                        top: Math.min(Math.max(position.y, 0), $document.height() - div.height())
                    });
            }
        }
    };
    return hint;
})();