// functions/imgproxy/[[path]].js
// Cloudflare Pages Function —— 豆瓣海报免鉴权图片代理
// 作用：豆瓣图床现在对“无 Referer”的请求返回 418，导致 <img> 直连偶发失败。
// 该函数仅代理豆瓣图床域名（白名单），由服务端带上 Referer 拉取后回传图片。
// 与 server.mjs 中的 /imgproxy/:encodedUrl 路由保持一致（本文件用于 Cloudflare Pages 部署）。

const DOUBAN_HOST_RE = /(^|\.)(doubanio\.com|douban\.com)$/i;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

export async function onRequest(context) {
  const { params } = context;

  // catch-all 路由参数；前端用 encodeURIComponent 编码，斜杠已变成 %2F，
  // 正常情况下数组里只有一段，这里兼容未编码含 "/" 的情况。
  const raw = Array.isArray(params.path) ? params.path.join('/') : params.path;

  let targetUrl;
  try {
    targetUrl = decodeURIComponent(raw);
  } catch {
    return new Response('无效的 URL', { status: 400 });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return new Response('无效的 URL', { status: 400 });
  }

  // 安全：仅允许 https + 豆瓣域名，避免被当成开放代理 / SSRF
  if (parsed.protocol !== 'https:' || !DOUBAN_HOST_RE.test(parsed.hostname)) {
    return new Response('仅允许代理豆瓣图片', { status: 403 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': USER_AGENT,
        // 关键：带豆瓣 Referer，图床才返回图片而不是 418
        Referer: 'https://movie.douban.com/',
        Accept: 'image/avif,image/webp,image/*,*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });

    if (!upstream.ok) {
      return new Response(`上游错误: ${upstream.status}`, { status: 502 });
    }

    const headers = new Headers();
    headers.set('Content-Type', upstream.headers.get('content-type') || 'image/jpeg');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(upstream.body, {
      status: 200,
      headers,
    });
  } catch (err) {
    return new Response(`图片获取失败: ${err && err.message ? err.message : 'unknown'}`, {
      status: 502,
    });
  }
}
