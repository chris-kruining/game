'use strict';

import Texture from './texture.js';
import Vector2 from '../../../math/vector2.js';

export default class Sprite extends Texture
{
    constructor(renderer, key)
    {
        super(renderer, key);
    }

    load()
    {
        return super.load().then(img => {
            this._srcPosition = new Vector2(10, 11);
            this._srcSize = new Vector2(165, 161);
            this.size = this._srcSize.multiply(3);
        });
    }
}
