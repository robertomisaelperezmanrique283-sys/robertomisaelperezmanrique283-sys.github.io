const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-rcLhPbrz.css","/assets/CountsView-D1HzQByW.js","/assets/InventoryView-Dwna94Vd.js","/assets/index-BPp--1qU.js","/assets/SalesView-sDKNUQil.js","/assets/Settings-CHvShroU.js","/assets/ShiftView-Bj_9DAuS.js","/assets/EmptyState-Cq6O-OLO.js","/assets/TeamView-Cf2b-aVw.js","/assets/Reports-BHf48rlL.js","/assets/gem-DeVcFg0q.js","/assets/shield-check-B_b0TuKX.js","/assets/download-C65J_GA8.js","/assets/ProductEditor-DSq3wNM9.js",
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
