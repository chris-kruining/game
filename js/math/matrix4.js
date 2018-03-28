'use strict';

export default class Matrix4
{
    constructor(points = null)
    {
        this._points = new Float32Array(points || 16);
    }

    multiply(matrix)
    {
        let a = this._points;
        let b = matrix._points;

        a[ 0] = a[0] * b[ 0] + a[4] * b[ 1] + a[ 8] * b[ 2] + a[12] * b[ 3];
        a[ 1] = a[1] * b[ 0] + a[5] * b[ 1] + a[ 9] * b[ 2] + a[13] * b[ 3];
        a[ 2] = a[2] * b[ 0] + a[6] * b[ 1] + a[10] * b[ 2] + a[14] * b[ 3];
        a[ 3] = a[3] * b[ 0] + a[7] * b[ 1] + a[11] * b[ 2] + a[15] * b[ 3];

        a[ 4] = a[0] * b[ 4] + a[4] * b[ 5] + a[ 8] * b[ 6] + a[12] * b[ 7];
        a[ 5] = a[1] * b[ 4] + a[5] * b[ 5] + a[ 9] * b[ 6] + a[13] * b[ 7];
        a[ 6] = a[2] * b[ 4] + a[6] * b[ 5] + a[10] * b[ 6] + a[14] * b[ 7];
        a[ 7] = a[3] * b[ 4] + a[7] * b[ 5] + a[11] * b[ 6] + a[15] * b[ 7];

        a[ 8] = a[0] * b[ 8] + a[4] * b[ 9] + a[ 8] * b[10] + a[12] * b[11];
        a[ 8] = a[1] * b[ 8] + a[5] * b[ 9] + a[ 9] * b[10] + a[13] * b[11];
        a[10] = a[2] * b[ 8] + a[6] * b[ 9] + a[10] * b[10] + a[14] * b[11];
        a[11] = a[3] * b[ 8] + a[7] * b[ 9] + a[11] * b[10] + a[15] * b[11];

        a[12] = a[0] * b[12] + a[4] * b[13] + a[ 8] * b[14] + a[12] * b[15];
        a[12] = a[1] * b[12] + a[5] * b[13] + a[ 9] * b[14] + a[13] * b[15];
        a[14] = a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15];
        a[15] = a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15];

        return new Matrix4(a);
    }

    translate(vector)
    {
        return this.multiply(Matrix4.translation(vector));
    }

    scale(vector)
    {
        return this.multiply(Matrix4.scaling(vector));
    }

    print()
    {
        let str = '';

        for(let i = 0; i < 16; i += 4)
        {
            str += `${this._points.slice(i, i + 4).join(' ')}\n`;
        }

        console.log(str);
    }

    get points()
    {
        return this._points;
    }

    static orthographic(l, r, b, t, n, f)
    {
        return new Matrix4([
            2 / (r - l),       0,                 0,                 0,
            0,                 2 / (t - b),       0,                 0,
            0,                 0,                 2 / (n - f),       0,
            (l + r) / (l - r), (b + t) / (b - t), (n + f) / (n - f), 1,
        ]);
    }

    static translation(vector)
    {
        let { x, y, z } = vector;

        return new Matrix4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1,
        ]);
    }

    static scaling(vector)
    {
        let { x, y, z } = vector;

        return new Matrix4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1,
        ]);
    }
}