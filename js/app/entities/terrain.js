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
        this._unit = 64;
        this._delta = new Calculus.Vector3(0);
        this._camPos = new Calculus.Vector3(0);
        this._dimensions = spriteDimensions;
        this._renderCallback = renderCallback;
        this.sprite = null;
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
                            .5 * (x - this._camPos.x + y - this._camPos.y) - .5 - z + this._camPos.z,
                        )
                            .multiply(this._unit)
                            .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));

                        for(let i of this._tiles[tile].stack)
                        {
                            this.sprite._srcPosition = new Calculus.Vector2(i.x, i.y).multiply(this._unit);
                            this.sprite.render();
                        }

                        if(this._renderCallback !== null && pos.equals(this._camPos.round()))
                        {
                            let peek = this._camPos.add(this._delta.normalize().multiply(-1));

                            this.sprite._srcPosition = new Calculus.Vector2(5, 8).multiply(this._unit);
                            this.sprite.position = new Calculus.Vector2(
                                x + peek.x - y - peek.y - 1.25,
                                .5 * (x - peek.x + y - peek.y) - .5,
                            )
                                .multiply(this._unit)
                                .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));

                            this.sprite.render();

                            this._renderCallback(pos);
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
        let delta = vector3.subtract(this._camPos);

        this._delta = this._delta.angle !== delta.angle && delta.magnitude > 0
            ? delta
            : this._delta;
        this._camPos = vector3;
    }
}
