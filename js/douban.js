/**
 * 修复后的渲染函数 - 强化防盗链穿透
 */
function renderDoubanCards(data, container) {
    const fragment = document.createDocumentFragment();
    
    if (!data.subjects || data.subjects.length === 0) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "col-span-full text-center py-8";
        emptyEl.innerHTML = `<div class="text-pink-500">❌ 暂无数据，请尝试其他分类或刷新</div>`;
        fragment.appendChild(emptyEl);
    } else {
        data.subjects.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md hover:shadow-lg";
            
            const safeTitle = item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeRate = (item.rate || "暂无").replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            // --- 强化稳定性逻辑 ---
            const rawUrl = item.cover;
            // 策略：直接使用 weserv.nl 并在 URL 后添加随机参数绕过缓存，同时强制不发送 referrer
            // 节点1: Weserv (目前最稳)
            const nodeWeserv = `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&default=https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png`;
            // 节点2: 百度镜像 (作为备选)
            const nodeBaidu = `https://image.baidu.com/search/down?url=${encodeURIComponent(rawUrl)}`;

            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${nodeWeserv}" alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                        onerror="if(this.src.includes('weserv')) { this.src='${nodeBaidu}'; } else { this.src='https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png'; }">
                    
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
            fragment.appendChild(card);
        });
    }
    container.innerHTML = "";
    container.appendChild(fragment);
}
