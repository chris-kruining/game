'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';

export default class Terrain extends Rasher.Entity
{
    constructor(renderer, key, terrain, spriteDimensions)
    {
        super();
        
        this._terrain = terrain;
        this._unit = 64;
        this._camPos = new Calculus.Vector2(
            renderer.width - this._unit * (terrain[0].length + terrain[0][0].length),
            renderer.height - this._unit * .25 * terrain[0][0].length
        ).multiply(.5);
        this._dimensions = spriteDimensions;
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
                        
                        this.sprite.position = new Calculus.Vector2(
                            column + row,
                            .5 * (row - column - 2 * layer),
                        ).multiply(this._unit);
                        
                        this.sprite.position.x += this._camPos.x;
                        this.sprite.position.y += this._camPos.y;
                        
                        this.sprite.render();
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
}