(function($){
    var api = window.api || {};

    api.game = {
        init: function(app, defaults) {
            var objs = [];
            var defaults = defaults || {};
            var pars = $(app).data('game');
            var params = {};
            if(pars && pars != '') {
                params = typeof pars == 'object'? pars : JSON.parse(pars);
            }
            var options = $.extend({}, defaults, params);
            $('[data-pos]', app).each(function(){
                var el = this;
    
                if($(el).hasClass('object')) {
                    objs.push(new Obj(el, app, [$(el).data('properties')]));
                } else {
                    var player = new Obj(el, app, ['movable']);
                    $(app).on('move_'+player.id, function(){
                        $('.score').text(player.moveCount);
                    });
                }
            });

            $(app).css({'opacity': 1});
        }
    }

    window.api = api;

    $(document).ready(function(){
        $('[data-game]').each(function(){
            window.api.game.init(this, {});
        });
    });

})(jQuery);