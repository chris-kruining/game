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
    e.respondWith(
        self.clients.matchAll({includeUncontrolled: true})
            .then(c => c[0].url.split('?').pop())
            .then(q => q.includes('no-cache'))
            .then(r => {
                if(r === true)
                {
                    return fetch(e.request);
                }
                else
                {
                    return caches.open('game-cache-dynamic').then(c => c.match(e.request).then(r => {
                        return r || fetch(e.request).then(r => {
                            c.put(e.request, r.clone());

                            return r;
                        });
                    }));
                }
            })
    );
});

self.addEventListener('push', e => {
    if (e.data.text() == 'update-available')
    {
        // event.waitUntil(caches.keys().then(
        //     names => Promise.all(names
        //         .filter(name => ['game-cache-static', 'game-cache-dynamic'].includes(name))
        //         .map(name => caches.delete(name))
        //     )
        // ).then());
        let p;

        console.log(self.Notification);

        if(self.Notification.permission !== 'denied')
        {
            p = self.Notification.requestPermission();
        }
        else if(self.Notification.permission === 'granted')
        {
            p = Promise.resolve('granted');
        }

        p.then(permission => {
            if(permission === 'granted')
            {
                new self.Notification('update available', {
                    icon: 'img/logo-192.png',
                    vibrate: true,
                    tag: 'update available',

                });
            }
        });
    }
});

// self.addEventListener('notificationclick', function(event) {
//     if (event.notification.tag == 'new-email') {
//         // Assume that all of the resources needed to render
//         // /inbox/ have previously been cached, e.g. as part
//         // of the install handler.
//         new WindowClient('/inbox/');
//     }
// });
