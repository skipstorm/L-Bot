(function($){
    var api = window.api || {};


    api.game = {
        init: function(app, defaults) {
            app.stop = false;
            // Il movimento è relativo all'ape e non all'utente
            app.fp = true;
            
            if($(app).data('type') == 'logic') {
                app.logicPlay = true;
            } else {
                app.logicPlay = false;
            }
            var objs = [];
            var defaults = defaults || {
                controls: "37,38,39,40", // L,U,R,D -- WASD: 65,87,68,83
                pickables: 0
            };
            var _this = this;

            var pars = $(app).data('game');
            var params = {};
            if(pars && pars != '') {
                params = typeof pars == 'object'? pars : JSON.parse(pars);
            }
            
            var options = $.extend({}, defaults, params);
            
            $('[data-pos]', app).each(function(){
                var el = this;
    
                if($(el).hasClass('object')) {
                    // Creazione oggetti fissi
                    objs.push(new Obj(el, app, {type: [$(el).data('properties')]}));
                } else {
                    // Creazione oggetto giocatore
                    var player = new Obj(el, app, {type: ['movable'], controls: options.controls});
                    $(app).on('move_'+player.id, function(e, p){
                        // Aggiorna il punteggio
                        $('.score', app).text(options.name +': '+ player.moveCount);
                    });
                    $(app).on('storedmove_'+player.id, function(e, p){
                        if(p.top == 0 && p.left == 1) {
                            $('.planned_moves', app).append('<span class="button" data-top="'+p.top+'" data-left="'+p.left+'">&rarr;</span>');
                        } else if(p.top == 0 && p.left == -1) {
                            $('.planned_moves', app).append('<span class="button" data-top="'+p.top+'" data-left="'+p.left+'">&larr;</span>');
                        } else if(p.top == -1 && p.left == 0) {
                            $('.planned_moves', app).append('<span class="button" data-top="'+p.top+'" data-left="'+p.left+'">&uarr;</span>');
                        } else if(p.top == 1 && p.left == 0) {
                            $('.planned_moves', app).append('<span class="button" data-top="'+p.top+'" data-left="'+p.left+'">&darr;</span>');
                        }
                    });
                    app.player = player;
                }
            });
            api.utils.show(app);
            api.utils.fitSize(app);

            $(app).on('object_picked', function(){
                if($('.picked', app).length >=  $('[data-properties="pickable"]', app).length) {
                    // Gestione fine gioco
                    app.stop = true;
                    $('.fireworks', app).css('display', 'block');
                    $('.land', app).css('opacity', .8);
                    const container = $('.fireworks', app).get(0);
                    const fireworks = new Fireworks.default(container)
                    fireworks.start();
                }
            });
            $('.control_pad .submit button', app).on('click', function(){
                window.api.game.consumeMoves(app);
            });
            
            

            // Handling game info display
            $('.extra', app).addClass('hidden');
            $('.extra-toggle', app).click(function(){
                if($('.extra', $(this).parent()).hasClass('hidden')){
                    $('.extra', $(this).parent()).removeClass('hidden');
                } else {
                    $('.extra', $(this).parent()).addClass('hidden');
                }
            });
        },
        consumeMoves: function(app){
            var _this = this;
            if($('.control_pad .planned_moves span', app).length == 0) return;
            app.stop = true;
            var m = $('.control_pad .planned_moves span', app).first();
            app.player.move($(m).data('top'), $(m).data('left'), true);
            $('.control_pad .planned_moves span', app).first().remove();
            app.stop = false;
            setTimeout(function(){
                _this.consumeMoves(app);
            }, 100);
            
        }
    }

    api.settings = {
        init: function(){

        }
    }

    window.api = api;

    $(document).ready(function(){
        // Set land
        var land = api.utils.getLand();
        
        $('.land').attr('data-level', land);
        
        // Set game type
        var land = api.utils.getLand();
        if(land) {
            $('.land').attr('data-level', land);
        }

        // Build level
        var playerNum = 1;
        $('[data-game]').each(function(){
            var L = new Levels();
            L.buildLevel($('.land', this), parseInt($('.land', this).data('level')));
            
            $('.land', this)
                .append('<div class="controls"></div>')
                .append('<div class="score"></div>');

            window.api.game.init(this, {name: "Player "+playerNum});
            playerNum++;
        });
    });

})(jQuery);