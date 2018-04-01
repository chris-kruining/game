'use strict';

import Scene from './scene.js';

export default class Game
{
    constructor()
    {
        this.scenes = [];
        this.currentScene = null;

        // navigator.serviceWorker.register('./worker.js')
        //     .then(r => console.log(r), e => console.error(e));
    }

    addScene(scene)
    {
        scene = new scene(this);
        
        this.scenes.push(scene);
        
        return scene.install();
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