'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';

export default class Player extends Rasher.Entity
{
    constructor(renderer, key)
    {
        super();
        
        this.size = 100;
        this._movement = new Calculus.Vector2(0);
        this.renderer = renderer;
        this.frame = Math.floor(Math.random() * 3);
        this.sprite = new Rasher.Sprite(renderer, key);
    }
    
    load()
    {
        return this.sprite.load().then(img =>
        {
            this.sprite.size = new Calculus.Vector2(this.size, this.size * 2);
            this.sprite.position = new Calculus.Vector2(
                this.renderer.width + this.sprite.size.x,
                this.renderer.height + this.sprite.size.y
            ).multiply(.5);
            this.sprite._srcSize = new Calculus.Vector2(20, 38);
    
            let frameBlender = () => Rasher.Animation.ease(f =>
            {
                // console.log([ 1 - f, f ]);
                //
                // monster.alphas = [ 1 - f, f ];
            }, {
                duration: 300,
                easing: 'linear',
            }).then(() =>
            {
                // this.sprite._srcPosition.x = (this.frame + 1) * this.sprite._srcSize.x;
                this.frame = ++this.frame % 2;
        
                frameBlender();
            });
    
            frameBlender();
        });
    }
    
    render(renderer)
    {
        let t = new Calculus.Vector4(0, 0, 0, 0);
        
        if(this._movement.magnitude > 0)
        {
            switch(Math.round(this._movement.angle))
            {
                case 0:
                case 180:
                    t.y = 2;
                    break;
                    
                case -27:
                case -153:
                    t.y = 1;
                    break;
                    
                case 27:
                case 153:
                    t.y = 3;
                    break;
        
                default:
                    t.y = 0;
            }
        }
        else
        {
            t.x = 0;
        }
        
        let size = this.sprite.size.clone;
        let position = this.sprite.position.clone;
        
        if(this._movement.angle > 90 || this._movement.angle < -90)
        {
            this.sprite.position.x += this.size;
            this.sprite.size.x *= -1;
        }
        
        this.sprite._srcPosition.x = 0;
        this.sprite._srcPosition.y = t.y * this.sprite._srcSize.y;
        
        this.sprite.render();
        
        this.sprite.size = size;
        this.sprite.position = position;
    }
    
    loop()
    {
    }
    
    set movement(movement)
    {
        this._movement = movement;
    }
}