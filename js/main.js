'use strict';

import Game from './engine/game.js';
import Scene from './engine/scene.js';
import Texture from './engine/graphics/elements/texture.js';
import Background from './engine/graphics/elements/background.js';
import Sprite from './engine/graphics/elements/sprite.js';
import Vector2 from './math/vector2.js';
import Animation from './engine/graphics/animation.js';

document.querySelector('button[start]').addEventListener('click', () => {
    let game = new Game();
    let scene1 = new Scene({
        resources: {
            forrest: 'img/digimon/maps/forrest.png',
            background: 'img/digimon/scenes/backgrounds/accessglacier.png',
            monster: 'img/digimon/giga/miragegaogamon_burst_mode.png',
            music: 'audio/digimon/dawn/battle_02.mp3',
        },
    }, scene => {
        let forrest = new Texture(scene.renderer, 'forrest');
        forrest.position = new Vector2(0, 0);

        setTimeout(() =>
        {
            // let size = forrest.size;
            Animation.ease(f => {
                // forrest.position = new Vector2(800 + 200 * f, 100 * f);
                // forrest.size = size.multiply(1 + f);
            }, {duration: 1000});
        }, 1000);

        scene.add(new Background(scene.renderer, 'background'));
        scene.add(forrest);
        scene.add(new Sprite(scene.renderer, 'monster'));
    }, scene => {});

    game.addScene(scene1)
        .then(scene => { game.selectScene(scene); })
});
