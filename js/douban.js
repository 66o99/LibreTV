function renderDoubanCards(data, container) {
    if (!container) return;
    container.innerHTML = ""; // 先清空容器

    // 容错处理：确保 data 和 subjects 存在
    if (!data || !data.subjects || data.subjects.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8"><div class="text-pink-500">❌ 暂无数据，请尝试其他分类或刷新</div></div>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    
    data.subjects.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md hover:shadow-lg";
        
        // 安全处理字符串
        const safeTitle = (item.title || "未知名称").replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeRate = (item.rate || "0.0");
        const rawUrl = item.cover || "";

        // --- 图片中转策略 ---
        // 方案 A: images.weserv.nl (目前最强，带上 &n=-1 关闭缓存检查)
        const nodeWeserv = `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}`;
        // 方案 B: 百度镜像
        const nodeBaidu = `https://image.baidu.com/search/down?url=${encodeURIComponent(rawUrl)}`;

        card.innerHTML = `
            <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="if(typeof fillAndSearchWithDouban === 'function') fillAndSearchWithDouban('${safeTitle}')">
                <img src="${nodeWeserv}" 
                    alt="${safeTitle}" 
                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    referrerpolicy="no-referrer"
                    onerror="this.onerror=null; this.src='${nodeBaidu}'; this.parentElement.innerHTML += '<div class=\"absolute inset-0 flex items-center justify-center bg-gray-900 text-xs text-gray-500\">图片加载中...</div>'">
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div class="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                    <span class="text-yellow-400">★</span> ${safeRate}
                </div>
                <div class="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-sm">
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();">豆瓣</a>
                </div>
            </div>
            <div class="p-2 text-center bg-[#111]">
                <button onclick="if(typeof fillAndSearchWithDouban === 'function') fillAndSearchWithDouban('${safeTitle}')" 
                        class="text-sm font-medium text-white truncate w-full hover:text-pink-400 transition">
                    ${safeTitle}
                </button>
            </div>
        `;
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
    
    // 移除加载遮罩（如果有的话）
    const loading = container.querySelector('.absolute.inset-0.bg-black/80');
    if (loading) loading.remove();
}
