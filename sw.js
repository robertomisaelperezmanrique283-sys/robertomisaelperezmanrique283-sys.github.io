const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-Dth44uIG.css","/assets/CountsView-eUe2XF1K.js","/assets/index-C4276vvH.js","/assets/InventoryView-Io1RrGT4.js","/assets/SalesView-B8nnHLmz.js","/assets/ShiftView-IKEK6HbL.js","/assets/EmptyState-TUktj576.js","/assets/ProductEditor-ChX1goxm.js","/assets/TeamView-D3AzoL2i.js","/assets/shield-check-DyPibx6c.js","/assets/gem-R0dgGtUa.js","/assets/Reports-BGdi9gnM.js","/assets/download-DOfHz_Ia.js","/assets/Settings-CYw3lMfS.js",
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
