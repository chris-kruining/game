'use strict';

import Texture from './texture.js';
import Vector2 from '../../../math/vector2.js';

export default class Sprite extends Texture
{
    constructor(renderer, key)
    {
        super(renderer, key);
    }

    render(renderer, scalar = null)
    {
        let pos = this.position;
        let size = this.size;

        this.position = this.position.multiply(scalar || 1);
        this.size = this.size.multiply(scalar || 1);

        super.render(renderer);

        this.position = pos;
        this.size = size;
    }
}
