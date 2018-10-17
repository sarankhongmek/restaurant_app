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

navigator.serviceWorker.register('./sw.js').then(function(registration) {
  if (registration.installing) {
      // Service Worker is Installing
      console.log('installing state')
  }
})