const version = '20200316185247';
const cacheName = `static::${version}`;

const buildContentBlob = () => {
  return ["/type%20specimens/2020/03/16/tubbs-wood-type/","/type%20specimens/2020/03/16/george-bruce-specimens-1848/","/type%20specimens/2020/03/16/baltimore-type-catalogue/","/information%20design/2020/02/11/nycta-subway-map/","/standards%20manual/2020/02/11/nasa-standards-manual/","/editorial/2020/02/11/emigre-23/","/editorial/2020/02/11/emigre-22/","/editorial/2020/02/11/emigre-21/","/editorial/2020/02/11/emigre-20/","/editorial/2020/02/11/emigre-19/","/about/","/categories/","/latest/","/","/manifest.json","/assets/search.json","/search/","/assets/styles.css","/redirects.json","/sitemap.xml","/robots.txt","/latest/page2/","/latest/page3/","/latest/page4/","/latest/page5/","/latest/page6/","/latest/page7/","/latest/page8/","/latest/page9/","/latest/page10/","/latest/page11/","/feed.xml","", "/assets/default-offline-image.png", "/assets/scripts/fetch.js"
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
