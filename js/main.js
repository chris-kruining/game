'use strict';

import * as Utilities from './utility/exports.js';
import Game from './engine/game.js';
import Battle from './app/scenes/battle.js';
import Exploring from './app/scenes/exploring.js';

window.mobile = navigator.userAgent.match(/Android|webOS|IPhone|Ipad|Ipod|Windows Phone/i) !== null;

let game = new Game();
let scenes = [
    Exploring,
    Battle,
];

function main()
{
    Promise.all(scenes.map(scene => game.addScene(scene))).then(loadedScenes => {
        scenes = loadedScenes;

        game.selectScene(scenes[1]);
    });
}

document.querySelector('button[start]').addEventListener('click', main);
document.querySelector('button[reload]').addEventListener('click', () => caches.keys()
    .then(names => Promise.all(names
        .filter(name => [
            'game-cache-static',
            'game-cache-dynamic'
        ].includes(name))
        .map(name => caches.delete(name))
    ))
    .then(window.location.reload())
);
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
