'use strict';

import ShaderProgram from './shaderProgram.js';
import RenderElement from './renderElement.js';
import * as Calculus from '../../math/exports.js';

export default class Renderer
{
    constructor()
    {
        this.canvas = document.createElement('canvas');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = 0;

        document.body.appendChild(this.canvas);

        this._stack = [];
        this._playState = Renderer.stopped;

        this.context = this.canvas.getContext('webgl', {
            premultiplyAlpha: true,
        });
        // this.context.clearColor(.5, 0, .5, .1);
        this.context.clearColor(0.1875, 0.1875, 0.2125, 1);
        this.context.disable(this.context.DEPTH_TEST);
        this.context.enable(this.context.BLEND);
        this.context.blendFunc(this.context.ONE, this.context.ONE_MINUS_SRC_ALPHA);

        this._program = new ShaderProgram(this.context);
    }

    play()
    {
        this._playState = Renderer.playing;
        this.canvas.style.zIndex = 100;
        this.loop();
    }

    pause()
    {
        this._playState = Renderer.paused;
    }

    stop()
    {
        this._playState = Renderer.stopped;
        this.canvas.style.zIndex = 1;
    }

    loop()
    {
        this.resize();
        this.clear();

        for(let [i, item] of Object.entries(this._stack))
        {
            item.render(this);
        }

        if(this._playState === Renderer.playing)
        {
            window.requestAnimationFrame(() => this.loop());
        }
    }

    clear()
    {
        this.context.clear(this.context.COLOR_BUFFER_BIT);
    }

    resize()
    {
        if(
            this.canvas.width !== document.documentElement.clientWidth ||
            this.canvas.height !== document.documentElement.clientHeight
        ){
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;

            this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    add(element)
    {
        if(!element instanceof RenderElement)
        {
            throw new Error('Renderer.add expected an RenderElement, got something else');
        }
        
        this._stack.push(element);
    }

    get width()
    {
        return this.canvas.width;
    }

    get height()
    {
        return this.canvas.height;
    }
    
    get size()
    {
        return new Calculus.Vector2(this.width, this.height);
    }

    get gl()
    {
        return this.context;
    }

    get program()
    {
        return this._program;
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
