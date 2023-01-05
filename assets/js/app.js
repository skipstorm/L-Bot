(function($){
    var objs = [];
    $(document).ready(function(){
        $('[data-pos]').each(function(){
            var el = this;

            if($(el).hasClass('object')) {
                objs.push(new Obj(el, 'object'));
            } else {
                var player = new Obj(el, 'player');
                $(document).on('move_'+player.id, function(){
                    $('.score').text(player.moveCount);
                });
            }
        });
    });

})(jQuery);