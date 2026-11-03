const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-DC-eLHHe.js","/assets/CountsView-DYOdpRn4.js","/assets/index-Dth44uIG.css","/assets/InventoryView-Cc7qIiBC.js","/assets/SalesView-CLTPjxmA.js","/assets/ShiftView-D53x-MAU.js","/assets/ProductEditor-qflEhIBi.js","/assets/TeamView-CXq5IIKl.js","/assets/EmptyState-EUYuTjZr.js","/assets/shield-check-QcNpifuW.js","/assets/Reports-CamcDtUE.js","/assets/gem-CcM3GGli.js","/assets/download-DIvcd_UF.js","/assets/Settings-BZGLc5OD.js",
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
