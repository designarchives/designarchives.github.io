const version = '20200205012445';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/typography/design%20education/2020/02/04/typographic-quest-6/","/typography/design%20education/2020/02/04/typographic-quest-5/","/typography/design%20education/2020/02/04/typographic-quest-4/","/typography/design%20education/2020/02/04/typographic-quest-3/","/typography/design%20education/2020/02/04/typographic-quest-2/","/typography/design%20education/2020/02/04/typographic-quest-1/","/typography/type%20specimens/2020/02/04/chromatic-wood-type/","/editorial/trade%20journal/2020/02/04/canadaink-4/","/about/","/categories/","/latest/","/","/manifest.json","/assets/search.json","/search/","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/latest/page2/","/feed.xml","", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
  ]
}

const updateStaticCache = () => {
  return caches.open(cacheName).then(cache => {
    return cache.addAll(buildContentBlob());
  });
};

const clearOldCache = () => {
  return caches.keys().then(keys => {
    // Remove caches whose name is no longer valid.
    return Promise.all(
      keys
        .filter(key => {
          return key !== cacheName;
        })
        .map(key => {
          console.log(`Service Worker: removing cache ${key}`);
          return caches.delete(key);
        })
    );
  });
};

self.addEventListener("install", event => {
  event.waitUntil(
    updateStaticCache().then(() => {
      console.log(`Service Worker: cache updated to version: ${cacheName}`);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(clearOldCache());
});

self.addEventListener("fetch", event => {
  let request = event.request;
  let url = new URL(request.url);

  // Only deal with requests from the same domain.
  if (url.origin !== location.origin) {
    return;
  }

  // Always fetch non-GET requests from the network.
  if (request.method !== "GET") {
    event.respondWith(fetch(request));
    return;
  }

  // Default url returned if page isn't cached
  let offlineAsset = "/offline/";

  if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
    // If url requested is an image and isn't cached, return default offline image
    offlineAsset = "/assets/default-offline-image.png";
  }

  // For all urls request image from network, then fallback to cache, then fallback to offline page
  event.respondWith(
    fetch(request).catch(async () => {
      return (await caches.match(request)) || caches.match(offlineAsset);
    })
  );
  return;
});
