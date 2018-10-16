const appName = "restaurant-reviews"
const staticCacheName = appName + "-v1.0";
const contentImgsCache = appName + "-images";

var allCaches = [
    staticCacheName,
    contentImgsCache
  ];


  /** At Service Worker Install time, cache all static assets */
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll([
          '/', // this caches index.html
          '/restaurant.html',
          '/css/styles.css',
          '/css/styles-medium.css',
          '/css/styles-large.css',
          '/js/dbhelper.js',
          '/js/secret.js',
          '/js/main.js',
          '/js/restaurant_info.js',
          'js/register-sw.js',
          'data/restaurants.json'
        ]);
      })
    );
  });



self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith(appName) &&
                   !allCaches.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });



self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);


  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/restaurant.html')) {
      event.respondWith(caches.match('/restaurant.html'));
      return;
    }

    if (requestUrl.pathname.startsWith('/img')) {
      event.respondWith(serveImage(event.request));
      return;
    }
  }


    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });


function serveImage(request) {
  let imageStorageUrl = request.url;

  // Make a new URL with a stripped suffix and extension from the request url
  // i.e. /img/1-medium.jpg  will become  /img/1
  // we'll use this as the KEY for storing image into cache
  imageStorageUrl = imageStorageUrl.replace(/-small\.\w{3}|-medium\.\w{3}|-large\.\w{3}/i, '');

  return caches.open(contentImgsCache).then(function(cache) {
    return cache.match(imageStorageUrl).then(function(response) {
      // if image is in cache, return it, else fetch from network, cache a clone, then return network response
      return response || fetch(request).then(function(networkResponse) {
        cache.put(imageStorageUrl, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}