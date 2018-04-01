'use strict';

import * as Rasher from '../../rasher.js';

export default class Exploring extends Rasher.Scene
{
    setup(game)
    {
        // this.add(new Rasher.Background(this.renderer, 'background'));
    }
    
    loop(game)
    {
    }
    
    static get config()
    {
        return {
            resources: {
                background: 'img/digimon/scenes/backgrounds/accessglacier.png',
                forrest: 'img/digimon/maps/forrest.png',
                music: 'audio/digimon/dawn/battle_02.mp3',
            },
            input: {},
        };
    }
}