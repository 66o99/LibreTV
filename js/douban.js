function renderDoubanCards(data, container) {
    const fragment = document.createDocumentFragment();
    
    // 清除加载动画
    container.innerHTML = "";
    container.classList.remove("relative");

    if (!data || !data.subjects || data.subjects.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 text-pink-500">❌ 暂无数据，请尝试其他分类</div>`;
        return;
    }

    data.subjects.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md";
        
        const safeTitle = item.title.replace(/"/g, '&quot;');
        const safeRate = item.rate || "0.0";
        const rawUrl = item.cover;

        // 核心修复：使用最稳的三个镜像节点顺序
        // 1. 百度镜像 (最快)
        // 2. Weserv 镜像 (最稳)
        // 3. 默认占位图
        const imgUrl = `https://image.baidu.com/search/down?url=${encodeURIComponent(rawUrl)}`;
        const backupUrl = `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}`;

        card.innerHTML = `
            <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                <img src="${imgUrl}" 
                    alt="${safeTitle}" 
                    class="w-full h-full object-cover"
                    referrerpolicy="no-referrer"
                    onerror="this.onerror=null; this.src='${backupUrl}';">
                
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                <div class="absolute bottom-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ★ ${safeRate}
                </div>
            </div>
            <div class="p-2 text-center bg-[#111]">
                <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                        class="text-xs font-medium text-gray-200 truncate w-full hover:text-pink-400 transition">
                    ${safeTitle}
                </button>
            </div>
        `;
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}
