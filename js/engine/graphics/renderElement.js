'use strict';

import Renderer from './renderer.js';
import Buffer from './buffer.js';
import Vector2 from '../../math/vector2.js';

export default class RenderElement
{
    constructor(renderer, position, size)
    {
        if(!renderer instanceof Renderer)
        {
            throw new Error('argument "renderer" is not an instance of the Renderer class');
        }

        if(!position instanceof Vector2)
        {
            throw new Error('argument "position" is not an instance of the Vector2 class');
        }

        if(!size instanceof Vector2)
        {
            throw new Error('argument "size" is not an instance of the Vector2 class');
        }

        this.gl = renderer.gl;
        this._renderer = renderer;
        this._position = position;
        this._size = size;

        this._positionBuffer = new Buffer(renderer, 'position');
        this._positionBuffer.data = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
    }

    render()
    {

    }

    get width()
    {
        return this._size.x;
    }

    get height()
    {
        return this._size.y;
    }

    get position()
    {
        return this._position;
    }

    set position(position)
    {
        this._position = position;
    }

    get size()
    {
        return this._size;
    }

    set size(size)
    {
        this._size = size;
    }

    get info()
    {
        return {
            x: this._position.x,
            y: this._position.y,
            width: this._size.x,
            height: this._size.y,
        };
    }
}