'use strict';

import Texture from './texture.js';

export default class Sprite extends Texture
{
    constructor(renderer, key)
    {
        super(renderer, key);
    }

    load()
    {
        return super.load().then(img => {
            // this.position = new Vector2(10, 10);
            // this.size = this.size.multiply(3);
        });
    }
}
