const CACHE_NAME = 'unear-v1';
const urlsToCache = ['/', '/index.html', '/favicon.svg', '/site.webmanifest'];

// 설치 시 캐시에 파일들 저장
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 네트워크 요청 시 캐시에서 먼저 찾기
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에서 찾으면 반환, 없으면 네트워크 요청
      return response || fetch(event.request);
    })
  );
});

// 캐시 업데이트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
