'use strict';

import Scene from './scene.js';

export default class Game
{
    constructor()
    {
        navigator.serviceWorker.register('./worker.js')
            .then(r => console.log(e), e => console.error(e));
        
        new Scene();
    }
}