const CACHE = "mideli-control-premium-v2";
const PRECACHE=["/assets/index-DTmZF_XY.css","/assets/index-JziHlh1R.js","/assets/CountsView-CwLkcO-E.js","/assets/InventoryView-DWjvy7lg.js","/assets/SalesView-CNLv1BnF.js","/assets/ShiftView-DLQde6XT.js","/assets/EmptyState-Bs6JLALE.js","/assets/ProductEditor-CakdpgHx.js","/assets/TeamView-D0HXocV5.js","/assets/shield-check-e7fSlU7N.js","/assets/Reports-CWX4bYXq.js","/assets/gem-CMx9g5rO.js","/assets/download-BwWNlsPd.js","/assets/Settings-DuxiF92c.js",
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
