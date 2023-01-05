(function($){
    var objs = [];
    $(document).ready(function(){
        $('[data-pos]').each(function(){
            var el = this;

            if($(el).hasClass('object')) {
                objs.push(new Obj(el, [$(el).data('properties')]));
            } else {
                var player = new Obj(el, ['movable']);
                $(document).on('move_'+player.id, function(){
                    $('.score').text(player.moveCount);
                });
            }
        });
    });

})(jQuery);