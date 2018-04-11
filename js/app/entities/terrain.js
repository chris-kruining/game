'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';
import Tile from './tile.js';

const RENDER_OFFSET = -1;

function sign(p1, p2, p3)
{
    return (p1.x - p3.x) * (p2.y - p3.y) * (p2.x - p3.x) * (p1.y - p3.y);
}

function pointInVertex(point, vertex)
{
    let b1 = sign(point, vertex[0], vertex[1]) < 0.0;
    let b2 = sign(point, vertex[1], vertex[2]) < 0.0;
    let b3 = sign(point, vertex[2], vertex[0]) < 0.0;
    
    if(b1 === b2 && b2 === b3)
    {
        console.log(
            sign(point, vertex[0], vertex[1]),
            sign(point, vertex[1], vertex[2]),
            sign(point, vertex[2], vertex[0])
        );
    }
    
    return b1 === b2 && b2 === b3;
}

export default class Terrain extends Rasher.Entity
{
    constructor(renderer, key, terrain, spriteDimensions, renderCallback = null)
    {
        super();

        this._key = key;
        this._tiles = {};
        this._renderer = renderer;
        this._terrain = terrain;
        this._peeked = new Array(4).fill(false);
        this._unit = 64;
        this._camPos = new Calculus.Vector3(0);
        this._dimensions = spriteDimensions;
        this._renderCallback = renderCallback;
        this.sprite = null;
        
        this._debug = document.createElement('span');
        this._debug.style.position = 'fixed';
        this._debug.style.top = '.33em';
        this._debug.style.left = '.33em';
        this._debug.style.fontSize = '3em';
        this._debug.style.color = '#eee';
        this._debug.style.zIndex = '1000';
        
        document.body.appendChild(this._debug);
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
        this._debug.innerHTML = this._camPos.toFixed(2);
        
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
                        let pos = new Calculus.Vector3(x, y, z);

                        this.sprite.position = new Calculus.Vector2(
                            x + this._camPos.y - y - this._camPos.x + RENDER_OFFSET,
                            .5 * (x - this._camPos.x + y - this._camPos.y + RENDER_OFFSET) - z + this._camPos.z,
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

                        if(this._renderCallback !== null && pos.equals(this._camPos.floor()))
                        {
                            this.sprite._srcPosition = new Calculus.Vector2(5, 8).multiply(this._unit);
                            
                            this._peek(x, y, z, renderer);

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
    
    _peek(x, y, z, renderer)
    {
        let draw = (v2, pIndex) => {
            let peek = this._camPos.add(...v2.map(v => v * -1), 0);

            this.sprite.position = new Calculus.Vector2(
                x + peek.y - y - peek.x + RENDER_OFFSET,
                .5 * (x - peek.x + y - peek.y + RENDER_OFFSET),
            )
                .multiply(this._unit)
                .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));

            peek = this._camPos.add(...v2, 0).floor();

            let tile;
            
            try
            {
                tile = this._terrain[peek.z][peek.y][peek.x];
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
        
        draw([-1,  0], 0);
        draw([ 0, -1], 1);
        draw([ 1,  0], 2);
        draw([ 0,  1], 3);
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
            let i = (Math.round(delta.angle) + 360) % 360 / 45;
            
            if([0, 1, 7].includes(i) && this._peeked[0] === false)
            {
                this._camPos.x = Math.max(Math.floor(this._camPos.x), vector3.x);
            }
            else if([3, 4, 5].includes(i) && this._peeked[2] === false)
            {
                this._camPos.x = Math.min(Math.ceil(this._camPos.x) - .0000001, vector3.x);
            }
            else
            {
                this._camPos.x = vector3.x;
            }
            
            if([1, 2, 3].includes(i) && this._peeked[1] === false)
            {
                this._camPos.y = Math.max(Math.floor(this._camPos.y), vector3.y);
            }
            else if([5, 6, 7].includes(i) && this._peeked[3] === false)
            {
                this._camPos.y = Math.min(Math.ceil(this._camPos.y) - .0000001, vector3.y);
            }
            else
            {
                this._camPos.y = vector3.y;
            }
            
            let floored = this._camPos.floor();
            let local = this._camPos.add(floored.multiply(-1));
            let tile = this._terrain[floored.z][floored.y][floored.x];
            
            if(tile !== undefined && this._tiles.hasOwnProperty(tile))
            {
                let vertices = this._tiles[tile].vertices;
    
                for(let i = 0; i < vertices.length; i += 3)
                {
                    let a = vertices[i + 0];
                    let b = vertices[i + 1];
                    let c = vertices[i + 2];
        
                    console.log(pointInVertex(
                        local,
                        [
                            new Calculus.Vector2(a[0], a[1]),
                            new Calculus.Vector2(b[0], b[1]),
                            new Calculus.Vector2(c[0], c[1]),
                        ]
                    ));
                }
            }
            
            this._camPos.z = vector3.z;
        }
        
    }
}
