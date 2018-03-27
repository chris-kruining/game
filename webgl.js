'use strict';

class Vector2 {
    constructor(x, y)
    {
        this._x = x;
        this._y = y;
    }
    
    normalize()
    {
        if(this.magnitude === 0)
        {
            return (new Vector2(1, 1)).normalize();
        }
        
        let f = this.magnitude;
        return new Vector2(this.x / f, this.y / f);
    }
    
    max(max = 1)
    {
        let top = this.clone.normalize();
        top.x *= max;
        top.y *= max;
        
        return new Vector2(Math.min(this.x, top.x), Math.min(this.y, top.y));
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
        else if(Number.isInteger(x) && y === undefined)
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
    
    get clone()
    {
        return new Vector2(this.x, this.y);
    }
}

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

class Rectangle {
    constructor(x, y, w, h)
    {
        this._x = x;
        this._y = y;
        this._w = w;
        this._h = h;
    }
    
    static clone(rectangle)
    {
        return new Rectangle(
            rectangle._x,
            rectangle._y,
            rectangle._w,
            rectangle._h
        );
    }
    
    *[Symbol.iterator]()
    {
        yield this.x;
        yield this.y;
        yield this.width;
        yield this.height;
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
    
    get width()
    {
        return this._w;
    }
    
    set width(w)
    {
        return this._w = w;
    }
    
    get height()
    {
        return this._h;
    }
    
    set height(h)
    {
        return this._h = h;
    }
    
    get position()
    {
        return new Vector2(this._x, this._y);
    }
    
    get size()
    {
        return new Vector2(this._w, this._h);
    }
}

class Matrix4
{
    constructor(points = null)
    {
        this._points = new Float32Array(points || 16);
    }
    
    translate(vector)
    {
        let points = this._points;
        let { x, y, z } = vector;
        
        points[12] = points[0] * x + points[4] * y + points[8]  * z + points[12];
        points[13] = points[1] * x + points[5] * y + points[9]  * z + points[13];
        points[14] = points[2] * x + points[6] * y + points[10] * z + points[14];
        points[15] = points[3] * x + points[7] * y + points[11] * z + points[15];
        
        return new Matrix4(points);
    }
    
    scale(vector)
    {
        let points = this._points;
        let {x, y, z} = vector;
        
        points[0] *= x;
        points[1] *= x;
        points[2] *= x;
        points[3] *= x;
        
        points[4] *= y;
        points[5] *= y;
        points[6] *= y;
        points[7] *= y;
        
        points[8]  *= z;
        points[9]  *= z;
        points[10] *= z;
        points[11] *= z;
        
        return new Matrix4(points);
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
}

class Shader
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
            
            uniform mat4 u_matrix;
            
            varying vec2 v_texcoord;
            
            void main() {
                gl_Position = u_matrix * a_position;
                v_texcoord = a_texcoord;
            }
        `;
    }
    
    static get fragmentShader()
    {
        return `
            precision mediump float;
            
            varying vec2 v_texcoord;
            
            uniform sampler2D u_texture;
            
            void main() {
                gl_FragColor = texture2D(u_texture, v_texcoord);
            }
        `;
    }
}

class ShaderProgram
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
                    matrix: this.getUniformLocation('u_matrix'),
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

class Buffer
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
    
    set data(data)
    {
        this.bind();
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    }
}

class RenderElement
{
    constructor(renderer, position, size)
    {
        if(!renderer instanceof Renderer)
        {
            throw new Error('argument "renderer" is not an instance of the Renderer class');
        }
        
        if(!position instanceof Vector2)
        {
            throw new Error('argument "position" is not an instance of the Vector2 class');
        }
        
        if(!size instanceof Vector2)
        {
            throw new Error('argument "size" is not an instance of the Vector2 class');
        }
    
        this.gl = renderer.gl;
        this._renderer = renderer;
        this._position = position;
        this._size = size;
        
        this._positionBuffer = new Buffer(renderer, 'position');
        this._positionBuffer.data = [
            0, 0,
            0, 1,
            1, 0,
            1, 0,
            0, 1,
            1, 1,
        ];
    }
    
    render()
    {
    
    }
    
    get width()
    {
        return this._size.x;
    }
    
    get height()
    {
        return this._size.y;
    }
    
    get position()
    {
        return this._position;
    }
    
    get size()
    {
        return this._size;
    }
    
    get info()
    {
        return {
            x: this._position.x,
            y: this._position.y,
            width: this._size.x,
            height: this._size.y,
        };
    }
}

class Texture extends RenderElement
{
    constructor(renderer, url)
    {
        super(renderer, new Vector2(0, 0), new Vector2(1, 1));
        
        this._texture = this.gl.createTexture();
        this._url = url;
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
        
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
        this.gl.useProgram(program.program);
        
        this._positionBuffer.activate();
        this._textureBuffer.activate();
        
        let matrix = Matrix4.orthographic(0, this._renderer.width, this._renderer.height, 0, -1, 1)
            .translate(new Vector3(this.info.x, this.info.y, 0))
            .scale(new Vector3(this.info.width, this.info.height, 0));
        
        this.gl.uniformMatrix4fv(program.locations.uniform.matrix, false, matrix.points);
        this.gl.uniform1i(program.locations.uniform.texture, 0);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
    
    get info()
    {
        return Object.assign(super.info, {
            texture: this._texture,
        });
    }
}

class Sprite extends Texture
{
    constructor(renderer, url)
    {
        super(renderer, url);
    }
    
    load()
    {
        return super.load().then(img => console.log(img));
    }
}

class Renderer
{
    constructor()
    {
        this.canvas = document.createElement('canvas');
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = 0;
    
        document.body.appendChild(this.canvas);
        
        this._stack = [];
        this._playState = Renderer.stopped;
        
        this.context = this.canvas.getContext('webgl');
        
        this._program = new ShaderProgram(this.context);
    }
    
    play()
    {
        this._playState = Renderer.playing;
        this.loop();
    }
    
    pause()
    {
        this._playState = Renderer.paused;
    }
    
    stop()
    {
        this._playState = Renderer.stopped;
    }
    
    loop()
    {
        this.resize();
        this.clear();
        
        for(let item of this._stack)
        {
            item.render();
        }
        
        if(this._playState === Renderer.playing)
        {
            window.requestAnimationFrame(() => this.loop());
        }
    }
    
    clear()
    {
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
    }
    
    resize()
    {
        if(
            this.canvas.width !== document.documentElement.clientWidth ||
            this.canvas.height !== document.documentElement.clientHeight
        ){
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
    
            this.context.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    
    add(element)
    {
        this._stack.push(element);
    }
    
    get width()
    {
        return this.canvas.width;
    }
    
    get height()
    {
        return this.canvas.height;
    }
    
    get gl()
    {
        return this.context;
    }
    
    get program()
    {
        return this._program;
    }
    
    static get playing()
    {
        return 'playing';
    }
    
    static get paused()
    {
        return 'paused';
    }
    
    static get stopped()
    {
        return 'stopped';
    }
}

class Scene
{
    constructor()
    {
        this.renderer = new Renderer();
        this.renderer.add(new Sprite(this.renderer, 'img/digimon/armagemon.png'));
        // this.renderer.add(new Sprite(this.renderer, 'img/digimon/maps/forrest.png'));
        this.renderer.play();
    }
}

let scene = new Scene();