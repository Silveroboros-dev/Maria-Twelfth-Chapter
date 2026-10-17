const CACHE="maria-chapter-twelve-v4";
const ASSETS=["./","index.html","styles.css?v=4","app.js?v=4","core.js?v=4","quest.js?v=4","rehearsal.js?v=4","music.js?v=4","keeper.js?v=4","assets/archive.svg"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("maria-chapter-twelve-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=="GET"||!/^https?:$/.test(url.protocol)||url.origin!==self.location.origin)return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached || (event.request.mode==="navigate"?caches.match("index.html"):Response.error()))));
});
