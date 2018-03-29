'use strict';

import Scene from './scene.js';
import Resources from './network/resources.js';

export default class Game
{
    constructor()
    {
        this.scenes = [];
        this.currentScene = null;

        navigator.serviceWorker.register('./worker.js')
            .then(r => console.log(r), e => console.error(e));
    }

    addScene(scene)
    {
        this.scenes.push(scene);
        scene._owner = this;

        return scene.setup();
    }

    selectScene(scene)
    {
        if(!(scene instanceof Scene))
        {
            if(id < 0 || id >= this.scenes.length)
            {
                throw new TypeError('Out of bound');
            }

            scene = this.scenes[id];
        }

        if(this.currentScene !== null)
        {
            this.currentScene.stop();
        }

        this.currentScene = scene;
        this.currentScene.play();
    }
}
