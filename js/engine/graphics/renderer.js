'use strict';

import ShaderProgram from './shaderProgram.js';
import RenderElement from './renderElement.js';

export default class Renderer
{
    constructor()
    {
        this.canvas = document.createElement('canvas');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = 0;
        this.canvas.style.zIndex = 100;

        document.body.appendChild(this.canvas);

        this._stack = [];
        this._playState = Renderer.stopped;

        this.context = this.canvas.getContext('webgl');

        this._program = new ShaderProgram(this.context);
    }

    play()
    {
        this._playState = Renderer.playing;
        this.loop();
    }

    pause()
    {
        this._playState = Renderer.paused;
    }

    stop()
    {
        this._playState = Renderer.stopped;
    }

    loop()
    {
        this.resize();
        this.clear();

        for(let item of this._stack)
        {
            item.render();
        }

        if(this._playState === Renderer.playing)
        {
            window.requestAnimationFrame(() => this.loop());
        }
    }

    clear()
    {
        this.context.clearColor(0.0, 0.0, 0.0, 1.0);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
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
