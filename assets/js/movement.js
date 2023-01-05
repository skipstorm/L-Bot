(function($){
    var api = window.api || {};

    api.m = {
        move: function(el, top, left){
            var pos = $(el).attr('data-pos').split(',');
            pos[0] = parseInt(pos[0]);
            pos[1] = parseInt(pos[1]);

            if(api.m.setDirection(el, [top, left])) {
                api.m.setPosition(el, pos[1] + top, pos[0] + left);
            }
        },
        setDirection: function(el, direction){
            if(typeof direction == 'object') {
                var top = direction[0];
                var left = direction[1];
                if(top < 0) {
                    direction = 'top';
                } else if(top > 0) {
                    direction = 'down'
                } else if(left < 0) {
                    direction = 'left'
                } else if(left > 0) {
                    direction = 'right'
                } else {
                    direction = 'top';
                }
            }
            if($(el).attr('data-dir') == direction) {
                return false;
            }
            switch(direction) {
                case 'left':
                    $(el).css({'transform': 'rotate(-90deg)'});
                break;
                case 'right':
                    $(el).css({'transform': 'rotate(90deg)'});
                break;
                case 'down':
                    $(el).css({'transform': 'rotate(180deg)'});
                break;
                default:
                    $(el).css({'transform': 'rotate(0deg)'});
                break;
            }
            
            $(el).attr('data-dir', direction);
            return true;
        },
        setPosition: function(el, top, left){
            if(top > 9) {
                top = 9;
            } else if (top < 0){
                top = 0;
            }
            if(left > 9) {
                left = 9;
            } else if (left < 0){
                left = 0;
            }
            $(el).css({
                top: (top * 10) + '%',
                left: (left * 10) + '%',
            });
            $(document).trigger('move-to-'+left+'-'+top);
            $(el).attr('data-pos', left+','+top);
            $(el).attr('data-dir', left+','+top);
        }
    }

    window.api = api;
})(jQuery);