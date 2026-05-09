// --- 稳定性增强逻辑（修复防盗链）---
const rawUrl = item.cover;
// 节点1：Weserv 全球缓存（优先）
const nodeWeserv = `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&w=300&h=450&fit=cover&default=https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png`;
// 节点2：PicCDN 镜像
const nodePicCdn = `https://pic.baike.soso.com/ugc/baikepic2/0/20240520190448_58321.jpg/0?url=${encodeURIComponent(rawUrl)}`;
// 节点3：豆瓣原图（备用）
const nodeDirect = rawUrl;

card.innerHTML = `
    <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
        <img src="${nodeWeserv}" alt="${safeTitle}" 
            class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            referrerpolicy="no-referrer"
            loading="lazy"
            /* 降级策略：Weserv → PicCDN → 原图 → 默认图 */
            onerror="if(this.src.includes('weserv')) { this.src='${nodePicCdn}'; } else if(this.src.includes('pic.baike')) { this.src='${nodeDirect}'; } else { this.src='assets/img/default-cover.png'; }">
        
        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm">
            <span class="text-yellow-400">★</span> ${safeRate}
        </div>
        <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm hover:bg-[#333] transition-colors">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">🔗</a>
        </div>
    </div>
    <div class="p-2 text-center bg-[#111]">
        <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                class="text-sm font-medium text-white truncate w-full hover:text-pink-400 transition">
            ${safeTitle}
        </button>
    </div>
`;
