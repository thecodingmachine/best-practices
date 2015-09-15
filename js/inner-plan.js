/* Adds a menu in the left bar based on h2 elements in the page */

$(function() {
    $elems = [];
    $activeLi = $('#sidebar > ul > li.active');

    $ul = $('<ul />').appendTo($activeLi);

    $("#main .content h2").each(function(index, elem) {
        $elem = $(elem);
        var $li = $('<li/>').appendTo($ul);
        var link = $('<a />').attr('href', '#'+elem.id).text($elem.text()).appendTo($li);
    });

});