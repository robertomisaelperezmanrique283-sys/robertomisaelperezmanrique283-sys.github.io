const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/CountsView-zZL17OxO.js","/assets/index-BnEACkCX.js","/assets/index-rcLhPbrz.css","/assets/InventoryView-BmSG1SVX.js","/assets/ProductEditor-Comj83Fc.js","/assets/SalesView-Byudzfsf.js","/assets/ShiftView-DLu8VODk.js","/assets/EmptyState-Cpy-8Dxt.js","/assets/TeamView-C1phDKF2.js","/assets/shield-check-Prrmtzk_.js","/assets/Reports-BMYcAgZz.js","/assets/gem-B6JotdUZ.js","/assets/download-Dw2tcWEh.js","/assets/Settings-CvCisV2X.js",
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
