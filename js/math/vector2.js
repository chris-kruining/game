'use strict';

export default class Vector2 {
    constructor(x, y)
    {
        this._x = x;
        this._y = y !== undefined
            ? y
            : x;
    }
    
    normalize()
    {
        if(this.magnitude === 0)
        {
            return Vector2.normalized;
        }
        
        let f = this.magnitude;
        return new Vector2(this.x / f, this.y / f);
    }
    
    max(max = 1)
    {
        return this.multiply(
            1 / Math.max(1, this.magnitude / this.clone.normalize().multiply(max).magnitude)
        );
    }
    
    add(x, y)
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            x = x.x;
        }
        else if(Number.isInteger(x) && y === undefined)
        {
            y = x;
        }
        
        return new Vector2(this.x + x, this.y + y);
    }
    
    multiply(x, y)
    {
        if(x instanceof Vector2)
        {
            y = x.y;
            x = x.x;
        }
        else if(!Number.isNaN(x) && y === undefined)
        {
            y = x;
        }
        
        return new Vector2(this.x * x, this.y * y);
    }
    
    *[Symbol.iterator]()
    {
        yield this.x;
        yield this.y;
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
    
    get magnitude()
    {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    
    get angle()
    {
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }
    
    get clone()
    {
        return new Vector2(this.x, this.y);
    }
    
    static get normalized()
    {
        return new Vector2(Math.sqrt(1));
    }
}