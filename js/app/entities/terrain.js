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

                        this.sprite._srcPosition = new Calculus.Vector2(
                            tile % this._dimensions.x,
                            Math.floor(tile / this._dimensions.x)
                        ).multiply(this._unit);

                        this.sprite.position = new Calculus.Vector2(
                            x + this._camPos.x - y - this._camPos.y - 1.25,
                            .5 * (x - this._camPos.x + y - this._camPos.y) - .5 - z + this._camPos.z,
                        )
                            .multiply(this._unit)
                            .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));

                        // this.sprite.position = new Calculus.Vector2(
                        //     x - this._camPos.x - y - this._camPos.y,
                        //     .5 * (x - this._camPos.x + y - this._camPos.y)// - .9 - z + this._camPos.z,
                        // )
                        //     .multiply(this._unit)
                        //     .add(new Calculus.Vector2(renderer.width, renderer.height).multiply(.5));

                        this.sprite.render();

                        if(this._renderCallback !== null && pos.equals(this._camPos.floor()))
                        {
                            this.sprite._srcPosition = new Calculus.Vector2(1, 11).multiply(this._unit);
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
        this._camPos = vector3;
    }
}
