class Obj{
    constructor(el, app, properties){
        this.app = app;
        this.el = el;
        this.pos = $(this.el).data('pos').split(',');
        this.dir = $(this.el).data('dir');
        this.moveCount = 0;
        this.id = 'obj'+Math.ceil(Math.random() * 100000);
        this.properties = properties;

        this.setPosition(this.pos[1], this.pos[0]);
        this.setDirection(this.dir);

        if($('img', this.el).length > 0) {
            // Sposta l'immagine dal markup al background
            $('img', this.el).css('display', 'none').addClass('hidden');        
            $(this.el).css({'background-image': 'url("'+$('img', this.el).attr('src')+'")'});
        }

        this.init(properties);
        return this;
    }

    init(properties){
        var inst = this;
        for(var p of properties.type) {
            switch(p) {
                case "movable":
                    var controls = properties.controls || "37,38,39,40";
                    controls = controls.split(',');
                    $(document).keydown(function(e) {
                        switch(e.keyCode) {
                            case parseInt(controls[0]): // left
                                inst.move(0, -1);
                            break;
                            case parseInt(controls[1]): // up
                                inst.move(-1, 0);
                            break;
                            case parseInt(controls[2]): // right
                                inst.move(0, 1);
                            break;
                            case parseInt(controls[3]): // down
                                inst.move(1, 0);
                            break;
                        }
                    });
                    $('[data-movekey="'+controls[0]+'"]').click(function(){ // left
                        inst.move(0, -1);
                    });
                    $('[data-movekey="'+controls[1]+'"]').click(function(){ // up
                        inst.move(-1, 0);
                    });
                    $('[data-movekey="'+controls[2]+'"]').click(function(){ // right
                        inst.move(0, 1);
                    });
                    $('[data-movekey="'+controls[3]+'"]').click(function(){ // down
                        inst.move(1, 0);
                    });

                    $(inst.app).trigger('object_moved', inst.el);
                break;
                case "pickable": 
                    $(inst.app).on('move-to-'+inst.pos[0]+'-'+inst.pos[1], function(){
                        $(inst.el).hide().addClass('picked');
                        $(inst.app).trigger('object_picked', inst.el);
                    });
                break;
                case "wall": 
                    $(inst.app).on('moving-to-'+inst.pos[0]+'-'+inst.pos[1], function(e, pars){
                        pars.canGo = false;
                    });
                break;
            }
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
        var pars = {canGo: true};
        $(this.app).trigger('moving-to-'+left+'-'+top, pars);
        if(!pars.canGo) {
            return false;
        }
        $(this.el).css({
            top: (top * 10) + '%',
            left: (left * 10) + '%',
        });
        $(this.app).trigger('move-to-'+left+'-'+top);
        $(this.el).attr('data-pos', left+','+top);
    }

    
    move(top, left, force){
        var _this = this;
        if(!force) {
            if(this.app.stop) return;
            if(this.app.logicPlay) {
                $(this.app).trigger('storedmove_'+this.id, {top: top, left: left});
                return;
            }
        }
        var pos = $(this.el).attr('data-pos').split(',');
        pos[0] = parseInt(pos[0]);
        pos[1] = parseInt(pos[1]);

        if(this.setDirection([top, left])) {
            this.setPosition(pos[1] + top, pos[0] + left);
        } else if(this.app.fp){
            if(top > 0) {
                switch($(this.el).attr('data-dir')){
                    case 'left': 
                        this.setPosition(pos[1], pos[0] + 1); break;
                    case 'top': 
                        this.setPosition(pos[1] + 1, pos[0]); break;
                    case 'right':
                        this.setPosition(pos[1], pos[0] - 1); break;
                    case 'down': 
                        this.setPosition(pos[1] - 1, pos[0]); break;
                }
            } else if (top < 0){
                switch($(this.el).attr('data-dir')){
                    case 'left': 
                        this.setPosition(pos[1], pos[0] - 1); break;
                    case 'top': 
                        this.setPosition(pos[1] - 1, pos[0]); break;
                    case 'right':
                        this.setPosition(pos[1], pos[0] + 1); break;
                    case 'down': 
                        this.setPosition(pos[1] + 1, pos[0]); break;
                }
            }
        } 

        this.moveCount++;
        $(this.app).trigger('move_'+this.id, this);
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

        
        if(this.app.fp){
            var deg = parseInt($(this.el).attr('data-deg')) || 0;
            var currDir = $(this.el).attr('data-dir');
            
            var newDir;
            if (direction == 'left'){
                switch(currDir){
                    case 'left': newDir = 'down'; break;
                    case 'top': newDir = 'left'; break;
                    case 'right': newDir = 'top'; break;
                    case 'down': newDir = 'right'; break;
                }
                $(this.el).css({'transform': 'rotate('+(deg - 90)+'deg)'});
                $(this.el).attr('data-deg', deg - 90);
                $(this.el).attr('data-dir', newDir);
            } else if (direction == 'right'){
                switch(currDir){
                    case 'left': newDir = 'top'; break;
                    case 'top': newDir = 'right'; break;
                    case 'right': newDir = 'down'; break;
                    case 'down': newDir = 'left'; break;
                }
                $(this.el).css({'transform': 'rotate('+(deg + 90)+'deg)'});
                $(this.el).attr('data-deg', deg + 90);
                $(this.el).attr('data-dir', newDir);
            }
            return false;
        }

        switch(direction) {
            case 'left':
                $(this.el).css({'transform': 'rotate(-90deg)'});
                $(this.el).attr('data-deg', -90);
            break;
            case 'right':
                $(this.el).css({'transform': 'rotate(90deg)'});
                $(this.el).attr('data-deg', 90);
            break;
            case 'down':
                $(this.el).css({'transform': 'rotate(180deg)'});
                $(this.el).attr('data-deg', 180);
            break;
            default:
                $(this.el).css({'transform': 'rotate(0deg)'});
                $(this.el).attr('data-deg', 0);
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