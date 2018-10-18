// Register service worker only if supported
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js')
	.then(function(registration) {
		console.log("Service Worker Registered", registration);
	})
	.catch(function(err) {
		console.log("Service Worker Failed to Register", err);
	})
}

/** Hijack fetch requests and respond accordingly */
self.addEventListener('fetch', function(event) {

  // Default behavior: respond with cached elements, if any, falling back to network.
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});