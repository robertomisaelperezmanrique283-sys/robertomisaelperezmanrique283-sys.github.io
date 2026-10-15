const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-DPWwpAM6.js","/assets/index--ygnFXFu.css","/assets/CountsView-TifTRoWA.js","/assets/InventoryView-DxwEd7y_.js","/assets/SalesView-DxQpCTm9.js","/assets/ProductEditor-Bw8V37Er.js","/assets/ShiftView-aFkDQ9B8.js","/assets/EmptyState-BBiDrLD_.js","/assets/TeamView-DqJVYRCJ.js","/assets/shield-check-CjcpbzTe.js","/assets/Reports-CQQ20U8g.js","/assets/gem-sblrdTfs.js","/assets/download-SZcfdtv_.js","/assets/Settings-CEiAv8X3.js",
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
