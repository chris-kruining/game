'use strict';

export default

class Vector3
{
    constructor(x, y, z)
    {
        this._x = x;
        this._y = y;
        this._z = z;
    }

    normalize()
    {
        if(this.magnitude === 0)
        {
            return (new Vector3(1, 1, 1)).normalize();
        }

        let f = this.magnitude;
        return new Vector3(this.x / f, this.y / f, this.z / f);
    }

    max(max = 1)
    {
        let top = this.clone.normalize();
        top.x *= max;
        top.y *= max;

        return new Vector2(Math.min(this.x, top.x), Math.min(this.y, top.y));
    }

    add(x, y, z)
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            z = x.z;
            x = x.x;
        }
        else if(Number.isInteger(x) && y === undefined)
        {
            y = x;
            z = x;
        }

        return new Vector3(this.x + x, this.y + y, this.z + z);
    }

    multiply(x, y, z)
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            z = x.z;
            x = x.x;
        }
        else if(Number.isInteger(x) && y === undefined)
        {
            y = x;
            z = x;
        }

        return new Vector3(this.x * x, this.y * y, this.z * z);
    }

    *[Symbol.iterator]()
    {
        yield this.x;
        yield this.y;
        yield this.z;
    }

    get x()
    {
        return this._x;
    }

    set x(x)
    {
        this._x = x;
    }

    get y()
    {
        return this._y;
    }

    set y(y)
    {
        this._y = y;
    }

    get z()
    {
        return this._z;
    }

    set z(z)
    {
        this._z = z;
    }

    get magnitude()
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
    }

    get clone()
    {
        return new Vector3(this.x, this.y, this.z);
    }
}