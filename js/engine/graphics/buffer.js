'use strict';

export default class Buffer
{
    constructor(renderer, key)
    {
        this.gl = renderer.gl;
        this._key = key;
        this._renderer = renderer;
        this._buffer = this.gl.createBuffer();
    }

    bind()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffer);
    }

    activate()
    {
        this.bind();

        let attributes = this._renderer.program.info.locations.attributes;

        this.gl.enableVertexAttribArray(attributes[this._key]);
        this.gl.vertexAttribPointer(attributes[this._key], 2, this.gl.FLOAT, false, 0, 0);
    }
    
    get buffer()
    {
        return this._buffer;
    }

    set data(data)
    {
        this.bind();

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }
}
