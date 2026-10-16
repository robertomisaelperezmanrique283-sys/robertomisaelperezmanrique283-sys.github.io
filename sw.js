const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-Bx8PhRzA.js","/assets/CountsView-CNs7DYk5.js","/assets/index-rcLhPbrz.css","/assets/InventoryView-WwqLkR9S.js","/assets/SalesView-GN_Ez68N.js","/assets/EmptyState-aFR-_VYq.js","/assets/ShiftView-BI5-Kydr.js","/assets/ProductEditor-DgD5cN54.js","/assets/Reports-IphibxAN.js","/assets/shield-check-CYGYdjMs.js","/assets/TeamView-DB31q4RH.js","/assets/gem-a12Rq3_O.js","/assets/download-rc4VWYaB.js","/assets/Settings-CgjQ3clp.js",
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
