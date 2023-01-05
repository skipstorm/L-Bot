class Obj{
    constructor(el, type){
        this.el = el;
        this.pos = $(this.el).data('pos').split(',');
        this.dir = $(this.el).data('dir');
        this.moveCount = 0;
        this.id = 'obj'+Math.ceil(Math.random() * 100000);

        this.setPosition(this.pos[1], this.pos[0]);
        this.setDirection(this.dir);

        if($('img', this.el).length > 0) {
            $('img', this.el).css('display', 'none');
            $(this.el).css({'background-image': 'url("'+$('img', this.el).attr('src')+'")'});
        }

        this.init(type);
    }

    init(type){
        var inst = this;
        switch(type) {
            case "player":
                $(document).keydown(function(e) {
                    switch(e.keyCode) {
                        case 37: // left
                            inst.move(0, -1);
                        break;
                        case 38: // up
                            inst.move(-1, 0);
                        break;
                        case 39: // right
                            inst.move(0, 1);
                        break;
                        case 40: // down
                            inst.move(1, 0);
                        break;
                    }
                });
            break;
            default: 
                $(document).on('move-to-'+inst.pos[0]+'-'+inst.pos[1], function(){
                    $(inst.el).hide();
                });
            break;
        }
    }

    
    setPosition(top, left){
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
        $(this.el).css({
            top: (top * 10) + '%',
            left: (left * 10) + '%',
        });
        $(document).trigger('move-to-'+left+'-'+top);
        $(this.el).attr('data-pos', left+','+top);
    }

    
    move(top, left){
        var pos = $(this.el).attr('data-pos').split(',');
        pos[0] = parseInt(pos[0]);
        pos[1] = parseInt(pos[1]);

        if(this.setDirection([top, left])) {
            this.setPosition(pos[1] + top, pos[0] + left);
        }
        this.moveCount++;
        $(document).trigger('move_'+this.id);
    };


    setDirection(direction){
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
        
        switch(direction) {
            case 'left':
                $(this.el).css({'transform': 'rotate(-90deg)'});
            break;
            case 'right':
                $(this.el).css({'transform': 'rotate(90deg)'});
            break;
            case 'down':
                $(this.el).css({'transform': 'rotate(180deg)'});
            break;
            default:
                $(this.el).css({'transform': 'rotate(0deg)'});
            break;
        }

        if($(this.el).attr('data-dir') != direction) {
            $(this.el).attr('data-dir', direction);
            return false;
        }
        
        $(this.el).attr('data-dir', direction);
        return true;
    }
}