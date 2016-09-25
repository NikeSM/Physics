add_image = function($img) {
    $img = $($img);
    $image_demo.show().empty();
    $image_demo.append($img);
    $img.css({width:'50vw'});
    $img.offset({top: 100})
};