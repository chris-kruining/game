'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';
import Terrain from '../entities/terrain.js';
import Joystick from '../entities/joystick.js';
import Player from '../entities/player.js';

let cameraDelta = new Calculus.Vector2(0);
let joystick = null;
let terrain = null;
let player = null;

export default class Exploring extends Rasher.Scene
{
    setup(game)
    {
        terrain = new Terrain(
            this.renderer,
            'forrest',
            [[
                [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                [[84], [84], [97], [82], [82], [82], [82], [99], [84], [84]],
                [[84], [84], [88], [74], [77], [77], [79], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [72], [75], [75], [78], [81], [84], [84]],
                [[84], [84], [88], [71], [73], [73], [76], [81], [84], [84]],
                [[84], [84], [96], [87], [87], [87], [87], [98], [84], [84]],
                [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
            ]],
            new Calculus.Vector2(10)
        );
        joystick = new Joystick(this.renderer, 'joystick');
        player = new Player(this.renderer, 'player');

        this.add(terrain);
        this.add(player);
        this.add(joystick);

        this.input.listen({
            forward: state => {
                cameraDelta.y += state === true ? 1 : -1;
            },
            backward: state => {
                cameraDelta.y += state === true ? -1 : 1;
            },
            left: state => {
                cameraDelta.x += state === true ? 1 : -1;
            },
            right: state => {
                cameraDelta.x += state === true ? -1 : 1;
            },
        })
    }

    loop(game)
    {
        if(terrain === null)
        {
            return;
        }

        let delta = cameraDelta.add(joystick.movement.multiply(-1)).max();
        let movement = delta.multiply(2, 1).max().multiply(7.5);

        terrain.camera.x += movement.x;
        terrain.camera.y += movement.y;
        player.movement = delta;
    }

    static get config()
    {
        return {
            resources: {
                forrest: 'img/digimon/maps/forrest.png',
                joystick: 'img/joystick.png',
                player: 'img/digimon/characters/male_red.png',
                music: 'audio/digimon/dawn/battle_02.mp3',
            },
            input: {
                forward: [87, 38],    // key: w
                backward: [83, 40],   // key: s
                left: [65, 37],       // key: a
                right: [68, 39],      // key: d
            },
        };
    }
}
