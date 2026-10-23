const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/CountsView-Di5dUwIQ.js","/assets/index-DcyPhj2b.js","/assets/index-B6bTLfHG.css","/assets/InventoryView-BmcswBqP.js","/assets/SalesView-Cl04sQJH.js","/assets/ShiftView-CJnzUICc.js","/assets/EmptyState-cqa-0gNq.js","/assets/ProductEditor-BoZSEEnY.js","/assets/TeamView-Dd_Q8z54.js","/assets/shield-check-ChVmXBwO.js","/assets/Reports-C3aAyRRk.js","/assets/gem-C1BDpXAp.js","/assets/Settings-BjzNq01E.js","/assets/download-BxvvoZ-A.js",
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
