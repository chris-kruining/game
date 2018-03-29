'use strict';

import RenderElement from '../renderElement.js';
import Buffer from '../buffer.js';
import Vector2 from '../../../math/vector2.js';
import Vector3 from '../../../math/vector3.js';
import Matrix4 from '../../../math/matrix4.js';
import Resources from '../../network/resources.js';

export default class Texture extends RenderElement
{
    constructor(renderer, key)
    {
        super(renderer, new Vector2(0, 0), new Vector2(1, 1));

        this._srcPosition = new Vector2(10, 10);
        this._srcSize = new Vector2(100, -100);
        this._texture = this.gl.createTexture();
        this._url = Resources[key];
        this._textureBuffer = new Buffer(renderer, 'texture');
        this._textureBuffer.data = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];

        this.bind();
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([ 0, 0, 255, 255 ]));

        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

        this.load();
    }

    load()
    {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = this._url;
        })
            .then(img => {
                this._size = new Vector2(img.width, img.height);
                this._srcSize = new Vector2(img.width, img.height);

                this.bind();
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);

                return img;
            })
            .catch(e => console.error(e));
    }

    bind()
    {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
    }

    render()
    {
        let program = this._renderer.program.info;
        let { source, target } = this.info;

        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
        this.gl.useProgram(program.program);

        this._positionBuffer.activate();
        this._textureBuffer.activate();

        let posMatrix = Matrix4.orthographic(0, this._renderer.width, this._renderer.height, 0, -1, 1)
            .translate(new Vector3(target.x, target.y, 0))
            .scale(new Vector3(target.x, target.y, 1));

        this.gl.uniformMatrix4fv(program.locations.uniform.posMatrix, false, posMatrix.points);

        let texMatrix = Matrix4.translation(new Vector3(source.x / target.width, source.y / target.height, 0))
            .scale(new Vector3(source.width / target.width, source.height / target.height, 1));

        // texMatrix.print();

        // 0.08774691075086594 0 0 0
        // -0 -0.16758786141872406 -0 -0
        // 0 0 1 0
        // 0.4825766682624817 0.44382011890411377 0 1

        // 0.49999943375587463 0 0 0
        // 0 0.49999943375587463 0 0
        // 0 0 1 0
        // 0.049999941140413284 0.049999941140413284 0 1


        this.gl.uniformMatrix4fv(program.locations.uniform.texMatrix, false, texMatrix.points);
        this.gl.uniform1i(program.locations.uniform.texture, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    get info()
    {
        return {
            target: super.info,
            source: {
                x: this._srcPosition.x,
                y: this._srcPosition.y,
                width: this._srcSize.x,
                height: this._srcSize.y,
            },
            texture: this._texture,
        };
    }
}
