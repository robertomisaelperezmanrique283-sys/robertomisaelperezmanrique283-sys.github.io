const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-CyBrW-qP.js","/assets/CountsView-B3m0n982.js","/assets/index-Dth44uIG.css","/assets/InventoryView-CHpf8A3m.js","/assets/SalesView-B9hl03L4.js","/assets/ShiftView-jvzn1nGN.js","/assets/Settings-Bgheh1EQ.js","/assets/EmptyState-Bhuu4tdT.js","/assets/TeamView-L9jUBvbM.js","/assets/shield-check-BWDXjox4.js","/assets/Reports-Dwdu8pDN.js","/assets/gem-eZfnWXbM.js","/assets/download-iEi6H0Dx.js","/assets/ProductEditor-oJltO8Bg.js",
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/brand.svg",
  "/templates/ventas-original.xlsm",
];
self.addEventListener("install", (e) =>
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE))),
);
self.addEventListener("activate", (e) =>
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k.startsWith("mideli-control-") && k !== CACHE)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  ),
);
self.addEventListener("fetch", (e) => {
  if (
    e.request.method !== "GET" ||
    new URL(e.request.url).origin !== self.location.origin
  )
    return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        if (r.ok) {
          const copy = r.clone();
          e.waitUntil(caches.open(CACHE).then((c) => c.put(e.request, copy)));
        }
        return r;
      })
      .catch(async () => {
        const cached = await caches.match(e.request, { ignoreVary: true });
        if (cached) return cached;
        if (e.request.mode === "navigate")
          return (await caches.match("/index.html")) || Response.error();
        return Response.error();
      }),
  );
});
