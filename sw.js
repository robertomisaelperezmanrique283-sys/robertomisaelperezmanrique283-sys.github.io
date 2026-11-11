const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-m8QHWDrL.css","/assets/index-CFyYdUwF.js","/assets/CountsView-CPAkiA6E.js","/assets/InventoryView-CdLVDDzX.js","/assets/ProductEditor-CpuRVVuY.js","/assets/EmptyState-6hF3aDUj.js","/assets/SalesView-Cai-1wuM.js","/assets/ShiftView-BPjKfZB6.js","/assets/TeamView-B3BM-e4E.js","/assets/download-DSTKY0km.js","/assets/Reports-B8zQx6Ar.js","/assets/shield-check-R2hZ-JQM.js","/assets/gem-DBzPg6Az.js","/assets/Settings-DCJDJXgX.js",
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
