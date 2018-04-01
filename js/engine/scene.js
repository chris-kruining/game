'use strict';

import Renderer from './graphics/renderer.js';
import RenderElement from './graphics/renderElement.js';
import Resources from './network/resources.js';
import Config from './config.js';

export default class Scene
{
    constructor(game)
    {
        if(!this.__proto__.hasOwnProperty('setup'))
        {
            throw new Error(this.__proto__.constructor.name + ' does not have a method `setup`');
        }
        
        if(!this.__proto__.hasOwnProperty('loop'))
        {
            throw new Error(this.__proto__.constructor.name + ' does not have a method `loop`');
        }
        
        if(!this.__proto__.constructor.hasOwnProperty('config'))
        {
            throw new Error(this.__proto__.constructor.name + ' does not have a getter `config`');
        }
        
        this.state = Scene.stopped;
        this.renderer = new Renderer();
        this.loopInterval = null;
        new Config('tickSpeed', 50);

        this._owner = game;
        this.variables = {};
        this.options = Object.assign({
            resources: {},
        }, this.__proto__.constructor.config);
    }

    install()
    {
        return Promise.all(Object.entries(this.options.resources).map(([k, v]) => new Resources(k, v)))
            .then(() => {
                this.setup(this._owner);

                return this;
            });
    }

    add(element)
    {
        this.renderer.add(element);
        
        return element.load().then(() => element);
    }

    interval()
    {
        if(this.state === Scene.playing)
        {
            this.loop(this._owner);
        }
    }

    play()
    {
        if(this.state === Scene.playing)
        {
            return;
        }

        this.state = Scene.playing;

        this.loopInterval = setInterval(() => this.interval(), Config.tickSpeed);
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

    get owner()
    {
        return this._owner;
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
