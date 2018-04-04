'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';

export default class Terrain extends Rasher.Entity
{
    constructor(renderer, key, terrain, spriteDimensions, renderCallback = null)
    {
        super();
        
        this._terrain = terrain;
        this._unit = 64;
        this._camPos = new Calculus.Vector3(0).multiply(.5);
        this._dimensions = spriteDimensions;
        this._renderCallback = renderCallback;
        this.sprite = new Rasher.Sprite(renderer, key);
    }
    
    load()
    {
        return this.sprite.load().then(img => {
            this.sprite.size = new Calculus.Vector2(64 * 2);
            this.sprite._srcSize = new Calculus.Vector2(64);
        });
    }
    
    render(renderer)
    {
        for(let [layer, rows] of Object.entries(this._terrain))
        {
            layer = Number.parseInt(layer);
    
            for(let [row, columns] of  Object.entries(rows))
            {
                row = Number.parseInt(row);
                
                for(let [column, stack] of  Object.entries(columns).reverse())
                {
                    column = Number.parseInt(column);
                    
                    for(let tile of stack)
                    {
                        this.sprite._srcPosition = new Calculus.Vector2(
                            tile % this._dimensions.x,
                            Math.floor(tile / this._dimensions.x)
                        ).multiply(this._unit);
                        
                        let camera = new Calculus.Vector2(...this._camPos);
                        camera.angle += 45;
                        camera = camera.multiply(2, 1);
                        
                        this.sprite.position = new Calculus.Vector2(
                            column + row - camera.x,
                            .5 * (row - column - camera.y) - .9 - layer + this._camPos.z,
                        )
                            .multiply(this._unit)
                            .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));
                        
                        this.sprite.render();
                        
                        if(this._renderCallback !== null)
                        {
                            this._renderCallback(new Calculus.Vector3(row, column, layer));
                        }
                    }
                }
            }
        }
    }
    
    loop()
    {
    }
    
    get camera()
    {
        return this._camPos;
    }
    
    set camera(vector3)
    {
        this._camPos = vector3;
    }
}