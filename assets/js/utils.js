(function($){
    var api = window.api || {};

    api.utils = {
        show: function(el){
            $(el).removeClass('hidden');
        },
        hide: function(){
            $(el).addClass('hidden');
        },
        fitSize: function(app){
            $(window).resize(function(){
                $('.land-wrap', app).css({
                    'max-width': 
                        Math.min($(window).height() - 150, ($(window).width() - 100) / 2)
                    }
                );
            });
            $(window).trigger('resize');
        },
        getLand: function(){
            let params = (new URL(document.location)).searchParams;
            return parseInt(params.get("land")) || 0;
        }
    };

    window.api = api;
})(jQuery);