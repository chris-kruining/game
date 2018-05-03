'use strict';

import * as Rasher from '../../rasher.js';
import * as Calculus from '../../math/exports.js';
import Terrain from '../entities/terrain.js';
import Joystick from '../entities/joystick.js';
import Player from '../entities/player.js';

let cameraDelta = new Calculus.Vector2(0);

export default class Exploring extends Rasher.Scene
{
    setup(game)
    {
        this.joystick = new Rasher.UI.Joystick(this.renderer, 'joystick');
        this.player = new Player(this.renderer, 'player');
        this.terrain = new Terrain(
            this.renderer,
            'forrest',
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
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [36], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [36], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [36], [73], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [72], [71], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                ],
                [
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [ 9], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [ 9], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [ 9], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 9], [ 9], [ 9], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 9], [ 9], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                    [[ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0], [ 0]],
                ],
            ],
            new Calculus.Vector2(10),
            (pos) => {
                this.player.draw(this.renderer);
            }
        );

        this.add(this.terrain);
        this.add(this.player);
        this.add(this.joystick);
    
        this.terrain.camera = this.player.position;

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
        if(this.terrain === null)
        {
            return;
        }

        let delta = cameraDelta.add(this.joystick.movement.multiply(-1)).max();
        let movement = delta.clone;
        movement.angle -= 45;
    
        this.terrain.moveTo(this.terrain.camera.add(new Calculus.Vector3(...movement.multiply(-.25), 0)));
        this.player.movement = delta;
    }

    static get config()
    {
        return {
            resources: {
                forrest: 'js/app/resources/tiles/forrest.json',
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
