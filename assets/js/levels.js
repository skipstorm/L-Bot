class Levels {

    constructor(){
        return this;
    }

    levels() {
        const $ = this.hero();
        const _ = function(){return null;}
        const M = this.wall();
        const o = this.pickable();
        return [
[
    _,_,_,_,_,_,_,_,_,o,
    _,_,_,M,o,_,_,_,_,_,
    _,_,_,_,_,_,_,_,_,_,
    _,_,_,_,_,o,_,_,_,_,
    _,_,M,_,_,_,_,_,_,_,
    _,_,_,_,_,_,_,M,_,_,
    _,_,_,o,_,_,_,_,_,_,
    _,_,_,_,_,M,_,_,_,_,
    o,_,_,_,_,_,_,_,o,_,
    _,_,_,_,_,$,_,_,_,_,
],
[
    _,_,_,M,o,M,M,_,M,M,
    _,M,_,M,_,M,M,M,M,_,
    _,M,_,M,_,_,_,_,_,_,
    _,M,_,M,M,M,M,M,M,_,
    _,M,_,_,_,_,_,_,_,_,
    _,_,M,M,M,M,M,M,M,M,
    M,_,M,_,_,_,_,_,_,_,
    _,_,M,_,M,M,M,M,M,_,
    _,M,M,_,M,_,_,_,M,_,
    _,_,_,_,M,$,M,_,_,_,
],
[
    _,_,_,_,_,_,_,_,_,o,
    o,_,_,M,_,_,M,_,_,_,
    _,_,_,_,_,_,_,_,_,_,
    _,_,_,_,_,o,_,_,_,_,
    _,M,M,_,M,_,_,_,_,_,
    _,M,_,_,_,M,_,M,_,o,
    _,o,M,_,_,_,_,_,_,_,
    _,M,_,_,_,M,_,_,_,_,
    o,_,_,_,_,_,_,_,o,_,
    _,_,M,_,_,$,_,_,_,_,
]
        ];
    }

    buildLevel(container, levelIndex) {
        const levels = this.levels();
        if(!levels[levelIndex]) return;
        let pos = [0,0];
        for(let l of levels[levelIndex]) {
            let el = l();
            if(el) {
                container.append(
                    '<div '+
                    (el.hasOwnProperty('class')? 'class="'+el.class+'"' : '')+ ' '+
                    (el.hasOwnProperty('properties')? 'data-properties="'+el.properties+'"' : '')+ ' '+
                    'data-pos="'+pos[1]+','+pos[0]+'" '+
                    (el.hasOwnProperty('dir')? 'data-dir="'+el.dir+'"' : '')+ ' >'+
                    (el.hasOwnProperty('img')? '<img src="'+el.img+'">' : '')+
                    '</div>'
                );
            }

            if(pos[1] < 9) {
                pos[1]++;
            } else {
                pos[0]++;
                pos[1] = 0;
            }
        }
    }

    pickable() {
        return function () {
            const p = [
                {img: 'assets/img/flowers/a.svg', class: 'object', properties: 'pickable'},
                {img: 'assets/img/flowers/b.svg', class: 'object', properties: 'pickable'},
                {img: 'assets/img/flowers/c.svg', class: 'object', properties: 'pickable'},
                {img: 'assets/img/flowers/d.svg', class: 'object', properties: 'pickable'},
                {img: 'assets/img/flowers/e.svg', class: 'object', properties: 'pickable'},
                {img: 'assets/img/flowers/f.svg', class: 'object', properties: 'pickable'},
                {img: 'assets/img/flowers/a.png', class: 'object', properties: 'pickable'}
            ];
            return p[Math.floor(Math.random() * p.length)];
        }
    }

    wall() {
        return function () {
            const p = [
                {img: 'assets/img/stones/a.svg', class: 'object', properties: 'wall'},
                {img: 'assets/img/stones/b.svg', class: 'object', properties: 'wall'},
                {img: 'assets/img/stones/c.png', class: 'object', properties: 'wall'},
                {img: 'assets/img/stones/d.png', class: 'object', properties: 'wall'},
                {img: 'assets/img/stones/e.png', class: 'object', properties: 'wall'}
            ];
            return p[Math.floor(Math.random() * p.length)];
        }
    }

    hero() {
        return function() {
            return {class: 'hero', dir: 'top'}
        }
    }
}