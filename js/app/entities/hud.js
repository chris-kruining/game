'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';

export default class HUD extends Rasher.Entity
{
    constructor(renderer, key)
    {
        super();
        
        this.scale = .75;
        this.renderer = renderer;
        this.sprite = new Rasher.Sprite(renderer, key);
        this.sections = [
            // 0 - top-left
            [
                [ new Calculus.Vector4(0, 0, 400, 600), false ],
            ],
            
            // 1 - top
            [
                [ new Calculus.Vector4(400, 0, 1, 100), true ],
                [ new Calculus.Vector4(401, 0, 100, 100), false ],
                [ new Calculus.Vector4(702, 0, 1, 100), true ],
            ],
            
            // 2 - top-right
            [
                [ new Calculus.Vector4(2200, 0, 360, 360), false ],
            ],
            
            // 3 - right
            [
                [ new Calculus.Vector4(2360, 360, 200, 1), true ],
            ],
            
            // 4 - bottom-right
            [
                [ new Calculus.Vector4(2200, 1000, 360, 440), false ],
            ],
            
            // 5 - bottom
            [
                [ new Calculus.Vector4(800, 940, 10, 500), true ],
            ],
            
            // 6 - bottom-left
            [
                [ new Calculus.Vector4(0, 1000, 800, 440), false ],
            ],
            
            // 7 - left
            [
                [ new Calculus.Vector4(0, 600, 400, 1), true ],
            ],
        ];
    }
    
    load()
    {
        return this.sprite.load();
    }
    
    render(renderer)
    {
        let corners = [];
        for(let i = 0; i < 7; i += 2)
        {
            corners.push(new Calculus.Vector2(...this.sections[i].reduce(
                (t, s) => [ Math.max(t[0], s[0].z), Math.max(t[1], s[0].w) ],
                [0, 0]
            )));
        }
        
        let scalar = 1 / Math.max(
            1,
            (corners[0].x + corners[1].x) / renderer.width * this.scale,
            (corners[2].x + corners[3].x) / renderer.width * this.scale,
            (corners[0].y + corners[3].y) / renderer.height * this.scale,
            (corners[1].y + corners[2].y) / renderer.height * this.scale
        ) * this.scale;
        
        corners = corners.map(c => c.multiply(scalar));
        
        for(let [ i, section ] of Object.entries(this.sections))
        {
            i = Number.parseInt(i);
            section = Object.entries(section);
            section.forEach(s => s[0] = Number.parseInt(s[0]));
            
            let maxNonStretchable = -1;
            let availableSpace = 0;
            let stretchables = 0;
            let stretchSize = 0;
            let prop = 'x';
            let drawn = 0;
    
            if(i % 2 === 1)
            {
                prop = i % 4 === 1
                    ? 'x'
                    : 'y';
                let dir = prop === 'x'
                    ? 'width'
                    : 'height';
    
                availableSpace = renderer[dir] - corners[(i - 1) / 2][prop] - corners[(i + 1) / 2 % 4][prop];
                
                stretchables = section.filter(([i, e]) =>
                {
                    if(e[1] === false)
                    {
                        let spaceLeft = availableSpace - e[0].zw[prop] * scalar;
                        
                        if(spaceLeft > 0)
                        {
                            availableSpace = spaceLeft;
                            maxNonStretchable = i;
                        }
                    }
    
                    return e[1];
                }).length;
                
                stretchSize = availableSpace / Math.max(1, stretchables);
            }
            
            for(let [ j, [ src, stretch ] ] of section)
            {
                if(i % 2 === 1 && stretch === false && j > maxNonStretchable)
                {
                    continue;
                }
    
                this.sprite._srcPosition = src.xy;
                this.sprite._srcSize = src.zw;
                
                src = src.multiply(scalar);
                
                let posX = 0;
                let posY = 0;
                
                if(i >= 2 && i <= 4)
                {
                    posX = this.renderer.width - src.z;
                }
                
                if(i >= 4 && i <= 6)
                {
                    posY = this.renderer.height - src.w;
                }
                
                switch(i)
                {
                    case 1:
                        posX = corners[0].x + drawn;
                        break;
                        
                    case 3:
                        posY = corners[1].y + drawn;
                        break;
                        
                    case 5:
                        posX = corners[3].x + drawn;
                        break;
                        
                    case 7:
                        posY = corners[0].y + drawn;
                        break;
                }
                
                this.sprite.position = new Calculus.Vector2(posX, posY);
                this.sprite.size = src.zw;
                
                if(i % 2 === 1)
                {
                    if(stretch)
                    {
                        this.sprite.size[prop] = stretchSize;
                    }
                    
                    drawn += this.sprite.size[prop];
                }
        
                this.sprite.render();
            }
        }
    }
    
    loop()
    {
    }
}
