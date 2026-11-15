const V='skm-v3',CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const SKIP=['www.googleapis.com','accounts.google.com','oauth2.googleapis.com','apis.google.com'];
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);if(SKIP.includes(u.hostname)||u.hostname.endsWith('.supabase.co'))return;
const own=u.origin==location.origin;
if(own){ /* app files: internet ho to hamesha naya, warna cache */
 e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const k=res.clone();caches.open(V).then(c=>c.put(r,k))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('./index.html'))));return}
/* CDN libraries: cache first */
e.respondWith(caches.open(V).then(async c=>{const hit=await c.match(r);const net=fetch(r).then(res=>{if(res&&(res.ok||res.type=='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);return hit||net}))});
