'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';

export default class Joystick extends Rasher.Entity
{
    constructor(renderer, key)
    {
        super();
        
        this.renderer = renderer;
        this.sprite = new Rasher.Sprite(renderer, key);
        
        this.pointerid = null;
        this.startPoint = null;
        this.delta = new Calculus.Vector2(0);
        
        let handlers = {
            down: e =>
            {
                if(
                    this.pointerid === null &&
                    e.x >= this.sprite.position.x &&
                    e.x <= this.sprite.position.x + this.sprite.size.x &&
                    e.y >= this.sprite.position.y &&
                    e.y <= this.sprite.position.y + this.sprite.size.y
                ){
                    this.pointerid = e.pointerId;
                    this.startPoint = new Calculus.Vector2(e.x, e.y);
                }
            },
            move: e =>
            {
                if(e.pointerId === this.pointerid)
                {
                    this.delta = new Calculus.Vector2(this.startPoint.x - e.x, this.startPoint.y - e.y).multiply(-1);
                }
            },
            up: e =>
            {
                if(e.pointerId === this.pointerid)
                {
                    this.pointerid = null;
                    
                    let delta = this.delta.clone;
                    
                    Rasher.Animation.ease(f => this.delta = delta.multiply(1 - f), { duration: 100, easing: 'easeOut' })
                        .then(() => this.delta = new Calculus.Vector2(0));
                }
            },
        };
        
        window.addEventListener('pointerdown', handlers.down);
        window.addEventListener('pointermove', handlers.move);
        window.addEventListener('pointerup', handlers.up);
    }
    
    load()
    {
        return this.sprite.load().then(img =>
        {
            this.sprite.size = new Calculus.Vector2(128);
            this.sprite.position = new Calculus.Vector2(24, this.renderer.height - 152);
            this.sprite._srcSize = new Calculus.Vector2(512);
        });
    }
    
    render(renderer)
    {
        this.sprite._srcPosition.x = 0;
        this.sprite.render();
    
        let origin = this.sprite.position.clone;
        
        this.sprite.position = this.sprite.position.add(this.delta.max(48));
        this.sprite._srcPosition.x = 512;
        this.sprite.render();
    
        this.sprite.position = origin;
    }
    
    loop()
    {
    }
    
    get movement()
    {
        return this.delta;
    }
}