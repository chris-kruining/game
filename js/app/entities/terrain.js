'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';
import Tile from './tile.js';

export default class Terrain extends Rasher.Entity
{
    constructor(renderer, key, terrain, spriteDimensions, renderCallback = null)
    {
        super();

        this._key = key;
        this._tiles = {};
        this._renderer = renderer;
        this._terrain = terrain;
        this._peeked = new Array(8).fill(false);
        this._unit = 64;
        this._camPos = new Calculus.Vector3(0);
        this._dimensions = spriteDimensions;
        this._renderCallback = renderCallback;
        this.sprite = null;
        
        console.log(this._peeked);
    }

    load()
    {
        return fetch(Rasher.Resources[this._key])
            .then(r => r.json())
            .then(({ src, tiles }) =>
            {
                let key = `Terrain_${this._key}_sptite`;
                Rasher.Resources[key] = src.file;

                this.sprite = new Rasher.Sprite(this._renderer, key);

                for(let [id, config] of Object.entries(tiles))
                {
                    this._tiles[id] = new Tile(config);
                }

                return this.sprite.load().then(img =>
                {
                    this.sprite.size = new Calculus.Vector2(src.unit * 2);
                    this.sprite._srcSize = new Calculus.Vector2(src.unit);
                });
            });
    }

    render(renderer)
    {
        if(this.sprite === null)
        {
            return;
        }

        for(let [z, rows] of Object.entries(this._terrain))
        {
            z = Number.parseInt(z);

            for(let [y, columns] of  Object.entries(rows))
            {
                y = Number.parseInt(y);

                for(let [x, stack] of  Object.entries(columns))
                {
                    x = Number.parseInt(x);

                    for(let tile of stack)
                    {
                        let pos = new Calculus.Vector3(y, x, z);

                        this.sprite.position = new Calculus.Vector2(
                            x + this._camPos.x - y - this._camPos.y - 1.25,
                            .5 * (x - this._camPos.x + y - this._camPos.y) - .9 - z + this._camPos.z,
                        )
                            .multiply(this._unit)
                            .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));
                        
                        if(x === 5 && y === 0)
                        {
                            this.sprite.filterMask.x = 1;
                            this.sprite.filterMask.z = 1;
                        }

                        for(let i of this._tiles[tile].stack)
                        {
                            this.sprite._srcPosition = new Calculus.Vector2(i.x, i.y).multiply(this._unit);
                            this.sprite.render();
                        }

                        if(this._renderCallback !== null && pos.equals(this._camPos.round()))
                        {
                            this.sprite._srcPosition = new Calculus.Vector2(5, 8).multiply(this._unit);
                            
                            let draw = (v2, pIndex) => {
                                let peek = this._camPos.add(...v2.map(v => v * -1), 0);
    
                                this.sprite.position = new Calculus.Vector2(
                                    x + peek.x - y - peek.y - 1.25,
                                    .5 * (x - peek.x + y - peek.y) - .9,
                                )
                                    .multiply(this._unit)
                                    .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));
    
                                peek = this._camPos.add(...v2, 0).round();
    
                                let tile;
                                
                                try
                                {
                                    tile = this._terrain[peek.z][peek.x][peek.y];
                                }
                                catch(e){}
                                
                                if(tile === undefined)
                                {
                                    return;
                                }
                                
                                vertexSearch:
                                for(let vertices of tile.map(t => this._tiles[t].vertices))
                                {
                                    for(let i = 0; i < vertices.length; i += 3)
                                    {
                                        let a = vertices[i + 0];
                                        let b = vertices[i + 1];
                                        let c = vertices[i + 2];
                                        
                                        if([a, b, c].map(v => Math.abs(v[2] + z - this._camPos.z)).some(v => v <= .25))
                                        {
                                            this.sprite.filterMask.y = 1;
                                            
                                            this._peeked[pIndex] = true;
                                            
                                            break vertexSearch;
                                        }
                                    }
                                }
                                
                                if(this.sprite.filterMask.y === 0)
                                {
                                    this.sprite.filterMask.x = 1;
    
                                    this._peeked[pIndex] = false;
                                }
                                
                                this.sprite.render();
                                this.sprite.filterMask = new Calculus.Vector4(0, 0, 0, 0);
                            };
                            
                            draw([-1, -1], 0);
                            draw([-1, 0], 1);
                            draw([-1, 1], 2);
                            draw([0, -1], 3);
                            draw([0, 1], 4);
                            draw([1, -1], 5);
                            draw([1, 0], 6);
                            draw([1, 1], 7);

                            this._renderCallback(pos);
                        }
                        
                        this.sprite.filterMask = new Calculus.Vector4(0, 0, 0, 0);
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
        let delta = this._camPos.subtract(vector3);
        
        if(delta.magnitude > 0)
        {
            let i;
    
            switch(Math.round(delta.angle))
            {
                case 0:
                    i = 1;
                    break;
                    
                case 45:
                    i = 0;
                    break;
                    
                case -45:
                    i = 2;
                    break;
                    
                case 90:
                    i = 3;
                    break;
                    
                case -90:
                    i = 4;
                    break;
                    
                case 135:
                    i = 5;
                    break;
                    
                case -135:
                    i = 7;
                    break;
                    
                case 180:
                    i = 6;
                    break;
            }
            
            if(this._peeked[i] === false)
            {
                if([0, 3, 5].includes(i))
                {
                    console.log(Math.floor(this._camPos.x), vector3.x);
                    
                    this._camPos.x = Math.max(Math.floor(this._camPos.x), vector3.x);
                }
                else if([2, 4, 7].includes(i))
                {
                    this._camPos.x = Math.min(Math.ceil(this._camPos.x), vector3.x);
                }
                else
                {
                    this._camPos.x = vector3.x;
                }
                
                if([0, 1, 2].includes(i))
                {
                    this._camPos.y = Math.max(Math.floor(this._camPos.y), vector3.y);
                }
                else if([5, 6, 7].includes(i))
                {
                    this._camPos.y = Math.min(Math.ceil(this._camPos.y), vector3.y);
                }
                else
                {
                    this._camPos.y = vector3.y;
                }
            }
            else
            {
                this._camPos = vector3;
            }
        }
        
    }
}
