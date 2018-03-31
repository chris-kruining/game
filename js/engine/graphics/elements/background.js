'use strict';

import Texture from './texture.js';
import Vector2 from '../../../math/vector2.js';

export default class Background extends Texture
{
    constructor(renderer, key)
    {
        super(renderer, key);
    }

    load()
    {
        return super.load().then(img => {
            this._srcSize = new Vector2(img.width, img.height);
        });
    }

    render()
    {
        this.size = new Vector2(this._renderer.width, this._renderer.height);

        return super.render();
    }
}
