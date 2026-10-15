const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-Dvut4pIu.js","/assets/CountsView-CCI0I516.js","/assets/index-DGi1OHMC.css","/assets/InventoryView-QEN7GXXn.js","/assets/SalesView-R26-8MQJ.js","/assets/ShiftView-Cxpg3-I5.js","/assets/ProductEditor-ZD_TLPVT.js","/assets/EmptyState-BVaOEaVJ.js","/assets/shield-check-eTg4zc3c.js","/assets/TeamView-Duk_3nf_.js","/assets/Reports-BjESTzIl.js","/assets/gem-BP3eGJu4.js","/assets/download-B1Xfkno6.js","/assets/Settings-CxKztX2y.js",
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
