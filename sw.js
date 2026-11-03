const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-D5q4H7-b.js","/assets/CountsView-BAfbf3Rw.js","/assets/index-Dth44uIG.css","/assets/InventoryView-BpeMerxl.js","/assets/SalesView-iYwsfAdN.js","/assets/ShiftView-BQyCpkUq.js","/assets/EmptyState-Cqtc-POg.js","/assets/ProductEditor-DeHn_mvZ.js","/assets/TeamView-B-wwG2Ta.js","/assets/shield-check-YBukDipB.js","/assets/Reports-C2r_UHhk.js","/assets/gem-DTds3Kh4.js","/assets/download-BIfyeJ_5.js","/assets/Settings-Bwc1Smzc.js",
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
