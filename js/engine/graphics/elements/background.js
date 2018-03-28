'use strict';

import Texture from './texture.js';
import Vector2 from '../../../math/vector2.js';

export default class Background extends Texture
{
    constructor(renderer, url)
    {
        super(renderer, url);
    }

    // load()
    // {
    //     return super.load().then(img => {});
    // }

    render()
    {
        this.size = new Vector2(this._renderer.width, this._renderer.height);

        return super.render();
    }
}