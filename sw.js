// Sky Explorer offline cache (works in Safari/WebKit and Chrome). Navigations: network first, cached page offline. Data/assets: cache first.
// Sky Explorer 1.0.0
const CACHE='sky-v18';
const CORE=['./','index.html','manifest.webmanifest','stars.json','star-names.json','constellations.json','moon_color_2k.webp','moon_elev_4ppd.webp','icon.svg','icon-192.png','icon-512.png','apple-touch-icon.png','deepsky.json','cards.json','visibility.json','tle-snapshot.txt','constellation_art.json','constellation_anim.json','rigs.json','rudedog/parts/head.webp','rudedog/parts/jaw.webp','rudedog/parts/body.webp','rudedog/parts/tail.webp','rudedog/parts/front_legs.webp','rudedog/parts/back_legs.webp','conart/LICENSE-FreeArtLicense-1.3.txt',
 'tex/earth_clouds.webp','tex/earth_daymap.webp','tex/jupiter.webp','tex/mars.webp','tex/mercury.webp','tex/neptune.webp','tex/saturn.webp','tex/saturn_ring_alpha.webp','tex/sun.webp','tex/uranus.webp','tex/venus_atmosphere.webp'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))));});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// the page sends the list of files it loaded (hashed JS/CSS) so the very first visit already works offline
self.addEventListener('message',e=>{const l=e.data&&e.data.cache;if(Array.isArray(l))e.waitUntil(caches.open(CACHE).then(c=>Promise.all(l.filter(u=>new URL(u).origin===location.origin).map(u=>c.match(u).then(h=>h||c.add(u).catch(()=>{}))))));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{if(res.ok&&!res.redirected){const cl=res.clone();caches.open(CACHE).then(c=>c.put('index.html',cl));}return res;}).catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));return;}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(h=>h||fetch(r).then(res=>{if(res.ok&&res.type==='basic'){const cl=res.clone();caches.open(CACHE).then(c=>c.put(r,cl));}return res;})));});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window'}).then(w=>w[0]?w[0].focus():self.clients.openWindow('./')));});
