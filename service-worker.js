// LibreTV Service Worker
// 仅对【同源 GET】请求做网络优先(network-first)，不缓存任何站点页面/脚本，
// 避免电视浏览器长期使用旧版本；跨域请求(如视频 m3u8/分片)一律放行默认，绝不拦截。
// install 立即接管；activate 清理任何历史缓存。

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        try {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        } catch (e) {}
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    // 跨域请求（视频CDN、豆瓣图床等）完全交给浏览器默认处理，避免破坏播放/跨域
    if (url.origin !== self.location.origin) return;

    // 同源请求：网络优先，失败不返回陈旧缓存，直接透传错误
    event.respondWith(fetch(req, { cache: 'no-store' }).catch(err => {
        return Response.error();
    }));
});
