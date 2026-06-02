// NeuroLearn Platform — Background Service Worker for Web Push notifications

self.addEventListener('push', (event) => {
  if (!event.data) {
    console.warn('[Service Worker] Received push event with no payload data.');
    return;
  }

  try {
    const payload = event.data.json();
    const title = payload.title || "⚡ Review Today's Concepts";
    const body = payload.body || "Take 5 minutes to perform bedtime active recall review now!";
    const url = payload.url || '/dashboard';

    const options = {
      body: body,
      icon: '/icons/logo-teal.png', // Fallback icon path (can customize)
      badge: '/icons/badge-teal.png', // Fallback badge path
      vibrate: [100, 50, 100],
      data: {
        url: url
      },
      tag: 'bedtime-review-alert', // Prevents double alerting by collapsing matches
      renotify: true
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (e) {
    console.error('[Service Worker] Failed to parse push notification payload:', e);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open with our site
      for (const client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a fresh window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
