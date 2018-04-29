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

export default class Battle extends Rasher.Scene {
    setup(game)
    {
        this.add(new Rasher.Background(this.renderer, 'background'));
        
        for(let [i, [x, y, s, w, h, r, n, a, b]] of Object.entries(enemies))
        {
            this.add(new Digimon(this, n, new Calculus.Vector4(x, y, w, h), s, Number.parseInt(i), a, b));
        }
    }
    
    loop(game)
    {
    }
    
    static get config()
    {
        return {
            resources: Object.assign({
                background: 'img/digimon/scenes/backgrounds/accessglacier.png',
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