'use strict';

import Shader from './shader.js';

export default class ShaderProgram
{
    constructor(gl)
    {
        this.gl = gl;
        this._program = gl.createProgram();

        this.attach(new Shader(gl, 'vertexShader'));
        this.attach(new Shader(gl, 'fragmentShader'));

        this.link();

        this._info = {
            program: this._program,
            locations: {
                attributes: {
                    position: this.getAttribLocation('a_position'),
                    texture: this.getAttribLocation('a_texcoord'),
                },
                uniform: {
                    posMatrix: this.getUniformLocation('u_posMatrix'),
                    texMatrix: this.getUniformLocation('u_texMatrix'),
                    texture: this.getUniformLocation('u_texture'),
                },
            },
        };
    }

    attach(shader)
    {
        this.gl.attachShader(this._program, shader.shader);
    }

    link()
    {
        this.gl.linkProgram(this._program);
    }

    getAttribLocation(loc)
    {
        return this.gl.getAttribLocation(this._program, loc);
    }

    getUniformLocation(loc)
    {
        return this.gl.getUniformLocation(this._program, loc);
    }

    get program()
    {
        return this._program;
    }

    get info()
    {
        return this._info;
    }
}