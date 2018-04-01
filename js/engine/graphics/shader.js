'use strict';

export default class Shader
{
    constructor(gl, type)
    {
        let glType;

        switch(type)
        {
            case 'vertexShader':
                glType = gl.VERTEX_SHADER;
                break;

            case 'fragmentShader':
                glType = gl.FRAGMENT_SHADER;
                break;
        }

        if(glType === undefined)
        {
            throw new Error('invalid shader type provided');
        }

        this.gl = gl;
        this._shader = gl.createShader(glType);

        gl.shaderSource(this._shader, Shader[type]);
        gl.compileShader(this._shader);
    
        console.log(gl.getShaderInfoLog(this._shader));

        if(!gl.getShaderParameter(this._shader, gl.COMPILE_STATUS))
        {
            this.delete();

            throw new Error('creation of shader went wrong');
        }
    }

    delete()
    {
        this.gl.deleteShader(this._shader);
    }

    get shader()
    {
        return this._shader;
    }

    static get vertexShader()
    {
        return `
            attribute vec4 a_position;
            attribute vec2 a_texcoord;
            
            uniform mat4 u_posMatrix;
            uniform mat4 u_texMatrix;
            
            varying vec2 v_texcoord;
            
            void main() {
                gl_Position = u_posMatrix * a_position;
                v_texcoord = (u_texMatrix * vec4(a_texcoord, 0, 1)).xy;
            }
        `;
    }

    static get fragmentShader()
    {
        return `
            precision mediump float;
            
            varying vec2 v_texcoord;
            
            uniform sampler2D u_texture;
            uniform float u_alpha;
            uniform vec4 u_filter;
            uniform vec4 u_filter_mask;
            
            void main() {
                gl_FragColor = texture2D(u_texture, v_texcoord);
                gl_FragColor.a *= u_alpha;
                gl_FragColor.rgba += u_filter * u_filter_mask;
                gl_FragColor.rgb *= gl_FragColor.a;
            }
        `;
    }
}
