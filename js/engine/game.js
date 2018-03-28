'use strict';

import Scene from './scene.js';
import Resources from './network/resources.js';

export default class Game
{
    constructor()
    {
        navigator.serviceWorker.register('./worker.js')
            .then(r => console.log(e), e => console.error(e));
        
        console.log(...Resources);
        
        new Scene();
    }
}