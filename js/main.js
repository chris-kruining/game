'use strict';

import Game from './engine/game.js';
import Battle from './app/scenes/battle.js';
import Exploring from './app/scenes/exploring.js';

const mobile = navigator.userAgent.match(/Android|webOS|IPhone|Ipad|Ipod|Windows Phone/i) !== null;

let game = new Game();
let scenes = [
    Battle,
    Exploring,
];

function main()
{
    Promise.all(scenes.map(scene => game.addScene(scene))).then(loadedScenes => {
        scenes = loadedScenes;
    
        game.selectScene(scenes[1]);
    });
}

document.querySelector('button[start]').addEventListener('click', main);
document.querySelector('button[reload]').addEventListener('click', () => window.location.reload());
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
