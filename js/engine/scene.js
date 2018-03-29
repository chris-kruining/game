'use strict';

import Renderer from './graphics/renderer.js';
import Resources from './network/resources.js';

export default class Scene {
    constructor(options, setup, loop)
    {
        this.state = Scene.stopped;
        this.renderer = new Renderer();
        this.loopInterval = null;
        this.setupCallback = setup;
        this.loopCallback = loop;

        this._owner = null;
        this.variables = {};
        this.options = Object.assign({
            resources: {},
        }, options);
    }

    setup()
    {
        return Promise.all(Object.entries(this.options.resources).map(([k, v]) => new Resources(k, v)))
            .then(() => {
                this.setupCallback(this, this._owner);

                return this;
            });
    }

    add(element)
    {
        if(element instanceof RenderElement)
        {
            this.renderer.add(element);
        }
    }

    loop()
    {
        if(this.state === Scene.playing)
        {
            this.loopCallback(this, this._owner);
        }
    }

    play()
    {
        this.state = Scene.playing;

        this.loopInterval = setInterval(() => this.loop(), tickSpeed);
        this.renderer.play();
    }

    pause()
    {
        this.state = Scene.paused;
    }

    stop()
    {
        this.state = Scene.stopped;
        clearInterval(this.loopInterval);
        this.renderer.stop();
    }

    set owner(owner)
    {
        if(!(owner instanceof Game))
        {
            throw new TypeError('_owner must be instance of Game');
        }

        this._owner = owner;
    }

    static get playing()
    {
        return 'playing';
    }

    static get paused()
    {
        return 'paused';
    }

    static get stopped()
    {
        return 'stopped';
    }
}
