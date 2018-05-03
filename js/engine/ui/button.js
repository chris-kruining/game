'use strict';

import Sprite from '../graphics/elements/sprite.js';
import * as Calculus from '../../math/exports.js';

export default class Button extends Sprite
{
    constructor(renderer, key)
    {
        super(renderer, key);
    }
    
    render(renderer, scalar = null)
    {
        super.render(renderer, scalar);
    }
}