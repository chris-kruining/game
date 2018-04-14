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
        joystick = new Joystick(this.renderer, 'joystick');
        player = new Player(this.renderer, 'player');
        terrain = new Terrain(
            this.renderer,
            'forrestTiles',
            [
                [
                    [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                    [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                    [[84], [84], [99], [81], [81], [81], [81], [98], [84], [84]],
                    [[84], [84], [82], [79], [78], [78], [76], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [77], [75], [75], [73], [87], [84], [84]],
                    [[84], [84], [82], [74], [72], [72], [71], [87], [84], [84]],
                    [[84], [84], [97], [88], [88], [88], [88], [96], [84], [84]],
                    [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                    [[84], [84], [84], [84], [84], [84], [84], [84], [84], [84]],
                ],
                [
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [79], [78], [78], [76], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [77], [75], [75], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [77], [75], [75], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [77], [75], [75], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [51], [31], [43], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [52], [ 9], [ 9], [36], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 9], [ 9], [ 9], [36], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [36], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [72], [71], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                ],
            ],
            new Calculus.Vector2(10),
            (pos) => {
                player.draw(this.renderer);
            }
        );

        this.add(terrain);
        this.add(player);
        this.add(joystick);

        terrain.camera = player.position;

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
        let movement = delta.clone;
        movement.angle -= 45;

        terrain.moveTo(terrain.camera.add(new Calculus.Vector3(...movement.multiply(-.25), 0)));
        player.movement = delta;
    }

    static get config()
    {
        return {
            resources: {
                forrest: 'img/digimon/maps/forrest.png',
                forrestTiles: 'js/app/resources/tiles/forrest.json',
                joystick: 'img/joystick.png',
                player: 'img/digimon/characters/female_red.png',
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
