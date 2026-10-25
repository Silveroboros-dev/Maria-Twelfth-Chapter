const CACHE="maria-chapter-twelve-v11";
const ASSETS=["./","index.html","styles.css?v=11","app.js?v=11","core.js?v=11","quest.js?v=11","rehearsal.js?v=11","music.js?v=11","effects.js?v=11","keeper.js?v=11","assets/archive.svg?v=11","assets/cobweb.svg?v=11","assets/pumpkin.svg?v=11","assets/castle-door.mp3?v=11","assets/dawn-gate.mp3?v=11","assets/locked-door.mp3?v=11"];
async function audioRange(response, range) {
  if (!range || response.status !== 200) return response;
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match || (!match[1] && !match[2]))return response;
  const bytes=await response.arrayBuffer(),size=bytes.byteLength;
  const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
  const end=match[1]&&match[2]?Math.min(Number(match[2]),size-1):size-1;
  if(start>=size || end<start || (!match[1] && Number(match[2])===0))return new Response(null,{status:416,headers:{"Content-Range":`bytes */${size}`}});
  const headers=new Headers(response.headers);
  headers.delete("Content-Encoding");headers.set("Accept-Ranges","bytes");
  headers.set("Content-Range",`bytes ${start}-${end}/${size}`);headers.set("Content-Length",String(end-start+1));
  return new Response(bytes.slice(start,end+1),{status:206,headers});
}
async function castleAudio(request) {
  // Safari requests audio in byte ranges. Cache the full original, then serve its requested slice.
  const fullRequest=new Request(request.url);
  let response=await caches.match(fullRequest);
  if(!response){response=await fetch(fullRequest);if(response.status===200){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(fullRequest,copy)).catch(()=>{});}}
  return audioRange(response,request.headers.get("Range"));
}
self.addEventListener("install",event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("maria-chapter-twelve-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=="GET"||!/^https?:$/.test(url.protocol)||url.origin!==self.location.origin)return;
  if(/\/assets\/(castle-door|dawn-gate|locked-door)\.mp3$/.test(url.pathname)){event.respondWith(castleAudio(event.request));return;}
  event.respondWith(fetch(event.request).then(response=>{
    if(response.status===200){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});}
    return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached || (event.request.mode==="navigate"?caches.match("index.html"):Response.error()))));
});
