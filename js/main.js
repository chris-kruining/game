'use strict';

import Game from './engine/game.js';
import Battle from './app/scenes/battle.js';
import Exploring from './app/scenes/exploring.js';

let game = new Game();
let scenes = [
    Battle,
    Exploring,
];

function main()
{
    Promise.all(scenes.map(scene => game.addScene(scene))).then(loadedScenes => {
        scenes = loadedScenes;
    
        game.selectScene(scenes[0]);
    });
}

document.querySelector('button[start]').addEventListener('click', main);
document.addEventListener('keydown', e => {
    if(e.keyCode >= 49 && e.keyCode <= 57)
    {
        game.selectScene(scenes[e.keyCode - 49]);
    }
});

if(window.location.search.includes('direct-start'))
{
    main();
}
