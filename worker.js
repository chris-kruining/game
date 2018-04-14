'use strict';

self.addEventListener('install', e => {
    e.waitUntil(caches.open('game-cache-static').then(c => c.addAll([
        'js/math/vector2.js',
        'js/math/vector3.js',
        'js/math/matrix3.js',
        'js/math/matrix4.js',
        'js/engine/game.js',
        'js/engine/scene.js',
        'js/main.js',
    ])));
});

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(
        names => Promise.all(names
            .filter(name => ['game-cache-static', 'game-cache-dynamic'].includes(name))
            .map(name => caches.delete(name))
        )
    ));
});

self.addEventListener('fetch', e => {
    e.respondWith(caches.open('game-cache-dynamic').then(c => c.match(e.request).then(r => {
        let f = fetch(e.request).then(r => {
            c.put(e.request, r.clone());
        
            return r;
        });
    
        return r || f;
    })));
});
