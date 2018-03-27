'use strict';

const renderMode = 'blended'; //'default|blended';
const tickSpeed = 100;
const volumes = {
    master: 0,
    music: .5,
    effects: 1,
};

navigator.serviceWorker.register('/worker.js')
    .then(r => console.log(e), e => console.error(e));

function ease(callback, options = {})
{
    let {duration, easing} = Object.assign({
        duration: 300,
        easing: 'easeInOutCubic',
    }, options);
    
    let easingFunctions = {
        linear: t => t,
        easeInQuad: t => easingFunctions.easeIn(t, 2),
        easeOutQuad: t => easingFunctions.easeOut(t, 2),
        easeInOutQuad: t => easingFunctions.easeInOut(t, 2),
        easeInCubic: t => easingFunctions.easeIn(t, 3),
        easeOutCubic: t => easingFunctions.easeOut(t, 3),
        easeInOutCubic: t => easingFunctions.easeInOut(t, 3),
        easeInQuart: t => easingFunctions.easeIn(t, 4),
        easeOutQuart: t => easingFunctions.easeOut(t, 4),
        easeInOutQuart: t => easingFunctions.easeInOut(t, 4),
        easeInQuint: t => easingFunctions.easeIn(t, 5),
        easeOutQuint: t => easingFunctions.easeOut(t, 5),
        easeInOutQuint: t => easingFunctions.easeInOut(t, 5),
        easeIn: (t, d = 2) => t ** d,
        easeOut: (t, d = 2) => 1 - (1 - t) ** d,
        easeInOut: (t, d = 2) => t ** d / (t ** d + (1 - t) ** d),
    };
    
    let match = easing.match(/(.+)-(\d+)/);
    
    if(easingFunctions.hasOwnProperty(easing))
    {
        easing = easingFunctions[easing];
    }
    else if(match !== null && easingFunctions.hasOwnProperty(match[1]))
    {
        easing = t => easingFunctions[match[1]](t, match[2]);
    }
    else
    {
        throw new Error('easing is not valid');
    }
    
    return new Promise(r => {
        let start;
        let elapsed;
    
        let animation = (time = 0) =>
        {
            if(!start)
            {
                start = time;
            }
        
            elapsed = duration === 1
                ? duration
                : time - start;
        
            callback(easing(elapsed / duration));
        
            if(elapsed < duration)
            {
                requestAnimationFrame(time => animation(time));
            }
            else
            {
                r();
            }
        };
    
        animation();
    });
}

class Vector2
{
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
        return Math.sqrt(this.x**2 + this.y**2);
    }
    
    get clone()
    {
        return new Vector2(this.x, this.y);
    }
}

class Rectangle
{
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

let InputInstance = null;

class Input
{
    constructor()
    {
        this.bindings = {};
        
        Input.__proto__ = new Proxy(this, {
            get: (container, property) => (property in container)
                ? container[property]
                : property in container.bindings
                    ? container.bindings[property].status
                    : undefined
        });
        
        window.addEventListener('keydown', e => {
            for(let binding of Input)
            {
                if(binding.key === e.keyCode && !binding.active)
                {
                    binding.active = true;
                    
                    if(binding.toggleable)
                    {
                        binding.status = !binding.status;
                    }
                    else
                    {
                        binding.status = true;
                    }
                    
                }
            }
        });
        
        window.addEventListener('keyup', e => {
            for(let binding of Input)
            {
                if(binding.key === e.keyCode)
                {
                    binding.active = false;
                    
                    if(!binding.toggleable)
                    {
                        binding.status = false;
                    }
                }
            }
        });
    }
    
    static *[Symbol.iterator]()
    {
        for(var binding in this.bindings)
        {
            yield this.bindings[binding];
        }
    }
    
    static get instance()
    {
        if(InputInstance == null)
        {
            InputInstance = new Input();
        }
        
        return InputInstance
    }
    
    static register(bindings)
    {
        let inst = Input.instance;
        
        for(let binding in bindings)
        {
            if(inst.bindings.hasOwnProperty(binding.substr(binding[0] === '_')))
            {
                throw 'Can\'t bind key, binding already exists'
            }
    
            inst.bindings[binding.substr(binding[0] === '_')] = {
                key: bindings[binding],
                active: false,
                status: false,
                toggleable: binding[0] === '_'
            };
        }
    }
}

class Sound
{
    constructor(src, type, volume = 1)
    {
        this.audio = new Audio();
        this.audio.src = 'audio/digimon/' + src + '.mp3';
        this.audio.autoplay = false;
        this.audio.loop = true;
        this.audio.volume = volumes.master * volumes[type] * volume;
        this.playing = false;
    }
    
    play()
    {
        this.audio.play();
        this.playing = true;
    }

    pause()
    {
        this.audio.pause();
        this.playing = false;
    }

    toggle()
    {
        if(this.playing)
        {
            this.pause();
        }
        else
        {
            this.play();
        }
    }
}

class RenderElement
{
    constructor(pos, src, path)
    {
        if(new.target === RenderElement)
        {
            throw new TypeError('Cannot construct RenderElement instances directly');
        }
        
        if(typeof this.createFrames !== 'function')
        {
            throw new TypeError('Must implement cacheFrames');
        }
        
        this.path = path;
        this.pos = pos;
        this.src = src;
        this.attributes = [];
        this.filters = [];
        this._renders = [];
        this._frame = null;
    }
    
    load(renderer)
    {
        return new Promise((resolve, reject) => {
            this._image = new Image();
            this._image.src = this.path;
            this._image.onload = resolve;
            this._image.onerror = reject;
        }).then(() => {
            this._renders = this.createFrames(renderer);
            
            this.start(renderMode);
        });
    }
    
    start()
    {
        this._frame = this._renders[0];
    }
    
    get srcRect()
    {
        return this.src;
    }
    
    get drawRect()
    {
        return this.pos;
    }
    
    get drawVec()
    {
        return this.pos.position;
    }
    
    get width()
    {
        return this.pos.width;
    }
    
    get height()
    {
        return this.pos.height;
    }
    
    get image()
    {
        return this._image;
    }
    
    get frame()
    {
        return this._frame;
    }
    
    draw()
    {
        console.log('draw me!');
        
        return {
            data: null,
            pos: new Vector2(0, 0)
        };
    }
}

class Background extends RenderElement
{
    constructor(size, src, name)
    {
        super(new Rectangle(0, 0, size.x, size.y), src, 'img/digimon/scenes/' + name + '.png');
    }
    
    createFrames(renderer)
    {
        return [
            renderer.getDataFromImage(this).data
        ];
    }
}

class Terrain extends RenderElement
{
    constructor(name, spriteSize, terrain)
    {
        let unit = 64;
        let scale = 4;
        
        super(
            new Rectangle(
                0,
                0,
                scale * unit,
                scale * unit
            ),
            new Rectangle(0, 0, unit, unit),
            'img/digimon/maps/' + name + '.png'
        );
        
        this._renderer = null;
        this._camPos = new Vector2(-32 * scale, -48 * scale);
        this._width = spriteSize.x;
        this._height = spriteSize.y;
        this._scale = scale;
        this._unit = 64;
        this._tiles = [];
        this._terrain = terrain;
    }
    
    renderFrame(renderer)
    {
        renderer.context.clearRect(0, 0, renderer.width, renderer.height);
        
        for(let [layer, rows] of Object.entries(this._terrain))
        {
            for(let [row, columns] of Object.entries(rows))
            {
                for(let [column, stack] of Object.entries(columns))
                {
                    for(let tile of [ 3, ...stack ])
                    {
                        let x = (row % 2 * this._unit * .5 + column * this._unit) * this._scale + this._camPos.x;
                        let y = row * .25 * this._unit * this._scale + this._camPos.y;
                        let blendData = renderer.context.getImageData(x, y, this._unit * this._scale, this._unit * this._scale);
    
                        let imageData = renderer.context.createImageData(this._unit * this._scale, this._unit * this._scale);
                        imageData.data.set(this._tiles[tile].data);
    
                        for(let i = 0; i < imageData.data.length; i += 4)
                        {
                            let f = imageData.data[i + 3] / 255;
                            imageData.data[i]     = f * imageData.data[i]     + (1 - f) * blendData.data[i];
                            imageData.data[i + 1] = f * imageData.data[i + 1] + (1 - f) * blendData.data[i + 1];
                            imageData.data[i + 2] = f * imageData.data[i + 2] + (1 - f) * blendData.data[i + 2];
                            imageData.data[i + 3] = f * imageData.data[i + 3] + (1 - f) * blendData.data[i + 3];
                        }
    
                        renderer.context.putImageData(imageData, x, y);
                    }
                }
            }
        }
        
    
        this.src.width = this._unit * this._terrain[0].length * this._scale;
        this.src.height = this._unit * this._terrain.length * this._scale;
        
        this._renderer = renderer;
    
        return renderer.context.getImageData(...this.drawRect).data;
    }
    
    createFrames(renderer)
    {
        renderer.context.clearRect(0, 0, renderer.width, renderer.height);
        
        for(let y = 0; y < this._height; y++)
        {
            this.src.y = y * this._unit;
        
            for(let x = 0; x < this._width; x++)
            {
                this.src.x = x * this._unit;
    
                renderer.context.clearRect(0, 0, renderer.width, renderer.height);
                renderer.context.drawImage(this.image, ...this.srcRect, ...this.drawRect);
                this._tiles.push(renderer.context.getImageData(...this.drawRect));
            }
        }
    
        this.src.x = 0;
        this.src.y = 0;
        
        this.pos = new Rectangle(0, 0, ...renderer.size);
        
        return [ this.renderFrame(renderer) ];
    }
    
    get frame()
    {
        return this._renderer === null
            ? super.frame
            : this.renderFrame(this._renderer);
    }
    
    get camera()
    {
        return this._camPos;
    }
    
    set camera(newPos)
    {
        this._camPos = newPos;
        
        this._camPos.x = Math.round(this._camPos.x);
        this._camPos.y = Math.round(this._camPos.y);
    }
}

class Character extends RenderElement
{
    constructor(pos, size, src, space, rank, name, speed, bias)
    {
        let scale = (size.x / 7) / 100;
        
        super(
            new Rectangle(
                size.x / 7 * (pos + 1) + 40 * (pos - 2),
                size.y / 20 * 14 - (src.height * scale - 20),
                src.width * scale,
                src.height * scale
            ),
            src,
            'img/digimon/' + rank + '/' + name + '.png'
        );
        
        this._frames = [0, 1];
        this._frameCounter = Math.floor(Math.random() * 3);
        this.space = space;
        this.speed = speed * 2;
        this.bias = bias;
        
        let f = 1;
        
        this.attributes.push([
            'ellipse',
            this.drawRect.x + this.drawRect.width / 2,
            this.drawRect.y + this.drawRect.height - this.drawRect.width / 12,
            this.drawRect.width / 4 * f,
            this.drawRect.width / 12 * f,
            0,
            2 * Math.PI,
            false
        ]);
        
        // this.filters.push({
        //     color: [ 255, 255, 255],
        //     weight: [ 1, 1, 1, 1],
        // });
        //
        // let animation = () => ease(t => {
        //     this.filters[0].weight[0] = 1 - t;
        //     this.filters[0].weight[1] = 1 - t;
        //     this.filters[0].weight[2] = 1 - t;
        // }, {
        //     duration: Math.random() * 5000,
        //     easing: 'easeOutCubic',
        // }).then(() => ease(t => {
        //     this.filters[0].weight[0] = t;
        //     this.filters[0].weight[1] = t;
        //     this.filters[0].weight[2] = t;
        // }, {
        //     duration: Math.random() * 5000,
        // }).then(() => animation()));
        //
        // animation();
    }
    
    start(mode = 'default')
    {
        let frameBlender = () => ease(f =>
        {
            let frame = this._renders[this._frames[0]];
            let nextFrame = this._renders[this._frames[1]];
        
            for(let i = 0; i < frame.length; i += 4)
            {
                frame[i]     = f * nextFrame[i]     + (1 - f) * frame[i];
                frame[i + 1] = f * nextFrame[i + 1] + (1 - f) * frame[i + 1];
                frame[i + 2] = f * nextFrame[i + 2] + (1 - f) * frame[i + 2];
                frame[i + 3] = f * nextFrame[i + 3] + (1 - f) * frame[i + 3];
            }
        
            this._frame = frame;
        }, { duration: this.speed, easing: 'linear' }).then(() =>
        {
            this._frames[0] = Math.abs(((this._frameCounter + 2) % 4) - 2);
            this._frameCounter = ++this._frameCounter % 4;
            this._frames[1] = Math.abs(((this._frameCounter + 2) % 4) - 2);
        
            frameBlender();
        });
    
        switch(mode)
        {
            case 'default':
                setInterval(() =>
                {
                    this._frame = this._renders[Math.abs(((this._frameCounter + 2) % 4) - 2)];
                    this._frameCounter = ++this._frameCounter % 4;
                }, this.speed);
                break;
                
            case 'blended':
                frameBlender();
                break;
        }
    }
    
    createFrames(renderer)
    {
        let frames = [];
        let orig = Rectangle.clone(this.srcRect);
        
        for(let i = 0; i < 3; i++)
        {
            this.src.x = orig.x + i * (orig.width + this.space);
    
            frames.push(renderer.getDataFromImage(this).data);
        }
        
        this.src.x = orig.x;
        
        return frames;
    }
}

class Renderer
{
    constructor()
    {
        this.canvas = document.createElement("canvas");
        this.canvas.width = document.documentElement.clientWidth;
        this.canvas.height = document.documentElement.clientHeight;
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = 0;
        
        this.context = this.canvas.getContext('2d');
        
        this.renderElements = [];
        this.playing = false;
        
        document.body.appendChild(this.canvas);
    }
    
    registerElement(element, order = 0)
    {
        if(!(element instanceof RenderElement))
        {
            throw new TypeError('element must be an intstance of RenderElement');
        }
    
        element.load(this).then(() => {
            this.renderElements.push({ order, element });
            
            this.renderElements = this.renderElements.sort(({order: a}, {order: b}) => a > b ? 1 : (a < b ? -1 : 0));
        });
    }
    
    start()
    {
        if(this.playing === false)
        {
            this.playing = true;
            
            this.loop();
        }
    }
    
    stop()
    {
        this.playing = false;
        this.context.clearRect(0, 0, this.width, this.height);
    }
    
    loop()
    {
        if(this.playing === false)
        {
            return;
        }
    
        this.context.clearRect(0, 0, this.width, this.height);
        
        for(let { element } of this.renderElements)
        {
            if(element.frame === null || element.frame === undefined)
            {
                continue;
            }
            
            let blendData = this.context.getImageData(...element.drawRect);
            let imageData = this.context.createImageData(element.width, element.height);
            imageData.data.set(element.frame);

            for(let i = 0; i < imageData.data.length; i += 4)
            {
                for(let {color, weight} of element.filters)
                {
                    imageData.data[i]     += weight[0] * color[0];
                    imageData.data[i + 1] += weight[1] * color[1];
                    imageData.data[i + 2] += weight[2] * color[2];
                    imageData.data[i + 3] -= (1 - weight[3]) * 255;
                }
                
                let f = imageData.data[i + 3] / 255;
                imageData.data[i]     = f * imageData.data[i]     + (1 - f) * blendData.data[i];
                imageData.data[i + 1] = f * imageData.data[i + 1] + (1 - f) * blendData.data[i + 1];
                imageData.data[i + 2] = f * imageData.data[i + 2] + (1 - f) * blendData.data[i + 2];
                imageData.data[i + 3] = f * imageData.data[i + 3] + (1 - f) * blendData.data[i + 3];
            }

            this.context.putImageData(
                imageData,
                element.drawVec.x,
                element.drawVec.y
            );
        }
        
        window.requestAnimationFrame(() => this.loop());
    }
    
    get width()
    {
        return this.canvas.width;
    }
    
    get height()
    {
        return this.canvas.height;
    }
    
    get size()
    {
        return new Vector2(
            this.width,
            this.height
        );
    }
    
    getDataFromImage(element)
    {
        this.context.clearRect(0, 0, this.width, this.height);
    
        this.context.fillStyle = 'rgba(0, 0, 0, .5)';
        
        for(let [method, ...args] of element.attributes)
        {
            this.context.beginPath();
            this.context[method](...args);
            this.context.fill();
        }
        
        this.context.drawImage(
            element.image,
            element.srcRect.x,
            element.srcRect.y,
            element.srcRect.width,
            element.srcRect.height,
            element.drawRect.x,
            element.drawRect.y,
            element.drawRect.width,
            element.drawRect.height
        );
    
        let data = this.context.getImageData(element.drawRect.x, element.drawRect.y, element.drawRect.width, element.drawRect.height);

        this.context.clearRect(0, 0, this.width, this.height);

        return data;
    }
}

class Game
{
    constructor(config)
    {
        this.scenes = [];
        this.currentScene = null;
        
        Input.register(config.keys);
    }
    
    addScene(scene)
    {
        this.scenes.push(scene);
        scene._owner = this;
        
        return this.scenes.length - 1;
    }
    
    selectScene(id)
    {
        if(id < 0 || id >= this.scenes.length)
        {
            throw new TypeError('Out of bound');
        }
        
        if(this.currentScene !== null)
        {
            this.currentScene.stop();
        }
        
        this.currentScene = this.scenes[id];
        this.currentScene.play();
    }
}

class Scene
{
    constructor(setupCallback, loopCallback)
    {
        this.isPlaying = false;
        this.isPaused = false;
    
        this.renderer = new Renderer();
        this.loopInterval = null;
        this.loopCallback = loopCallback;
        this.setupCallback = setupCallback;
        
        this._owner = null;
        this.variables = {};
    
        this.oldProto = this.__proto__;
        
        this.__proto__ = new Proxy(this, {
            get: (container, property) => (property in container.oldProto)
                ? container.oldProto[property]
                : (container.hasOwnProperty(property)
                    ? container[property]
                    : (container.variables.hasOwnProperty(property)
                        ? container.variables[property]
                        : undefined
                    )
                ),
            set: (container, property, value) => container.oldProto.hasOwnProperty(property)
                ? (container.oldProto[property] = value)
                : (container.hasOwnProperty(property)
                    ? (container[property] = value)
                    : (container.variables[property] = value)
                )
        });
        
        this.setupCallback.apply(this, [ this ]);
    }
    
    loop()
    {
        if(!this.isPlaying)
        {
            clearInterval(this.loopInterval);
        }

        if(!this.isPaused)
        {
            this.loopCallback.apply(this, [ this ]);
        }
    }
    
    play()
    {
        this.isPlaying = true;
        this.isPaused = false;
    
        this.loopInterval = setInterval(() => this.loop(), tickSpeed);
        this.renderer.start();
    }
    
    pause()
    {
        this.isPaused = true;
    }
    
    stop()
    {
        this.isPlaying = false;
        this.isPaused = false;
        
        this.renderer.stop();
    }
    
    set owner(owner)
    {
        if(!(owner instanceof Game))
        {
            throw new TypeError('_owner must be instance of Game');
        }
        
        this._owner = owner;
    }
}

let game = new Game({
    keys: {
        _toggleConsole: 192, // key: `
        forward: 87, // key: w
        backward: 83, // key: s
        left: 65, // key: a
        right: 68, // key: d
        scene1: 49, // key: 1
        scene2: 50, // key: 2
        _toggle: 51, // key: 3
    }
});

game.addScene(new Scene(scene => {
    let data = {
        enemies: [
            [ 5, 10, 10, 129, 175, 'giga', 'beelzemon_blast_mode', 225, 0 ],
            [ 0, 0, 2, 127, 156, 'giga', 'imperaildramon_paladin_ mode', 200, 0 ],
            [ 10, 11, 6, 165, 161, 'giga', 'miragegaogamon_burst_mode', 175, 0 ],
            [ 35, 10, 20, 134, 180, 'giga', 'shinegreymon_burst_mode', 225, -10 ],
            [ 0, 4, 12, 78, 110, 'giga', 'rosemon_burst_mode', 175, 0 ],
        ],
        party: [],
        items: []
    };
    
    scene.enemies = [];
    
    for(let [i, [x, y, s, w, h, r, n, a, b]] of Object.entries(data.enemies))
    {
        scene.enemies.push(new Character(
            Number.parseInt(i),
            scene.renderer.size,
            new Rectangle(x, y, w, h),
            s,
            r,
            n,
            a,
            b
        ));
    }
    
    scene.background = new Background(
        scene.renderer.size,
        new Rectangle(0, 0, 472, 256),
        'backgrounds/accessglacier'
    );
    
    scene.renderer.registerElement(scene.background, 1);
    
    for(let [i, enemy] of Object.entries(scene.enemies))
    {
        scene.renderer.registerElement(enemy, 10 + Number.parseInt(i) + enemy.bias);
    }
    
    let music = new Sound('dawn/battle_02', 'music');
    music.play()
}, scene => {
    if(Input.toggleConsole)
    {
        console.log('toggle the console');
    }
    
    if(Input.scene2)
    {
        game.selectScene(1);
    }
    
    if(!Input.toggle && scene.renderer.playing === false)
    {
        scene.renderer.start();
    }
    else if(Input.toggle && scene.renderer.playing === true)
    {
        scene.renderer.stop();
    }
}));
game.addScene(new Scene(scene => {
    scene.terrain = new Terrain(
        'forrest',
        new Vector2(10,  12),
        [[
            [[84], [84], [84], [84], [84], [84], [84]],
            [[84], [84], [84], [84], [84], [84], [84]],
            [[84], [84], [84], [84], [84], [84], [84]],
            [[84], [84], [84], [84], [84], [84], [84]],
            [[84], [84], [82], [79], [84], [84], [84]],
            [[84], [82], [77], [78], [84], [84], [84]],
            [[84], [82], [77], [34], [78], [81], [84]],
            [[82], [77], [34], [34], [76], [98], [84]],
            [[97], [74], [34], [34], [73], [87], [84]],
            [[88], [72], [34], [73], [87], [84], [84]],
            [[84], [88], [72], [73], [87], [84], [84]],
            [[84], [88], [71], [87], [84], [84], [84]],
            [[84], [84], [88], [87], [84], [84], [84]],
            [[84], [84], [96], [84], [84], [84], [84]],
            [[84], [84], [84], [84], [84], [84], [84]],
        ]]
    );
    
    scene.renderer.registerElement(scene.terrain);
}, scene => {
    if(Input.toggleConsole)
    {
        console.log('toggle the console');
    }
    
    if(Input.scene1)
    {
        game.selectScene(0);
    }
    
    let movement = new Vector2(0, 0);
    
    if(Input.forward)
    {
        movement.y += 1;
    }
    
    if(Input.backward)
    {
        movement.y -= 1;
    }
    
    if(Input.left)
    {
        movement.x += 1;
    }
    
    if(Input.right)
    {
        movement.x -= 1;
    }
    
    movement = movement.multiply(5).max(5);
    let start = scene.terrain.camera;
    
    ease(f => {
        scene.terrain.camera.x = start.x + movement.x * f;
        scene.terrain.camera.y = start.y + movement.y * f;
    }, { duration: 100 });
}));
game.selectScene(1);