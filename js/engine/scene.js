'use strict';

import Renderer from './graphics/renderer.js';
import Texture from './graphics/elements/texture.js';
import Background from './graphics/elements/background.js';
import Sprite from './graphics/elements/sprite.js';
import Vector2 from '../math/vector2.js';
import Animation from './graphics/animation.js';

export default class Scene {
    constructor()
    {
        this.renderer = new Renderer();
        
        let forrest = new Texture(this.renderer, 'img/digimon/maps/forrest.png');
        forrest.position = new Vector2(800, 0);
        
        setTimeout(() =>
        {
            let size = forrest.size;
            Animation.ease(f =>
            {
                forrest.position = new Vector2(800 + 200 * f, 100 * f);
                forrest.size = size.multiply(1 + f);
            }, {duration: 1000});
        }, 1000);
        
        this.renderer.add(new Background(this.renderer, 'img/digimon/scenes/backgrounds/accessglacier.png'));
        this.renderer.add(forrest);
        this.renderer.add(new Sprite(this.renderer, 'img/digimon/giga/miragegaogamon_burst_mode.png'));
        this.renderer.play();
    }
}