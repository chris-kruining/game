'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';
import Digimon from '../entities/digimon.js';

const enemies = [
    [ 5, 10, 10, 129, 175, 'giga', 'beelzemon_blast_mode', 225, 10 ],
    [ 0, 0, 6, 123, 156, 'giga', 'imperaildramon_paladin_ mode', 200, 30 ],
    [ 10, 11, 6, 165, 161, 'giga', 'miragegaogamon_burst_mode', 175, -100 ],
    [ 35, 10, 20, 134, 180, 'giga', 'shinegreymon_burst_mode', 225, -50 ],
    [ 0, 4, 12, 78, 110, 'giga', 'rosemon_burst_mode', 175, -30 ],
];

export default class Battle extends Rasher.Scene
{
    setup(game)
    {
        this.add(new Rasher.Background(this.renderer, 'background'));
        this.add(new Rasher.Background(this.renderer, 'background_overlay'));
        this.add(new Rasher.Background(this.renderer, 'attack')).then(a => a.blink(500));
        
        this.digimon = Object.entries(enemies)
            .map(([i, [x, y, s, w, h, r, n, a, b]]) => new Digimon(this, n, new Calculus.Vector4(x, y, w, h), s, Number.parseInt(i), a, b));
        
        this.digimon.forEach(d => this.add(d));
        
        this.add(new Rasher.Background(this.renderer, 'foreground'));
        this.add(new Rasher.Texture(this.renderer, 'frame')).then(el => {
            el._srcSize = el._imageSize;
            el.size = el._imageSize;
            el.position = new Calculus.Vector2(130, 70);
        });
        
        this.add(new Rasher.Texture(this.renderer, 'frame')).then(el => {
            el._srcSize = el._imageSize;
            el.size = el._imageSize;
            el.position = new Calculus.Vector2(130, 210);
        });
        
        this.music = new Rasher.Audio.Music('music');
    }
    
    loop(game)
    {
    }
    
    onPlay()
    {
        Promise.chain(this.digimon, d => d.spawn(100));
        this.music.play();
    }
    
    onPause()
    {
        this.music.pause();
    }
    
    onStop()
    {
        this.music.stop();
    }
    
    static get config()
    {
        return {
            resources: Object.assign({
                background: 'img/digimon/scenes/backgrounds/accessglacier.png',
                background_overlay: 'img/digimon/scenes/backgrounds/battle-overlay.png',
                attack: 'img/digimon/scenes/backgrounds/attack-2.png',
                foreground: 'img/digimon/scenes/foregrounds/battle.png',
                frame: 'img/digimon/scenes/foregrounds/timeline-frame.png',
                music: 'audio/digimon/dawn/battle_02.mp3',
            }, enemies.reduce((t, e) => {
                t[e[6]] = `img/digimon/${e[5]}/${e[6]}.png`;
                
                return t;
            }, {})),
            input: {
            
            },
        };
    }
}