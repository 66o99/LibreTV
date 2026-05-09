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
            
            const rawUrl = item.cover;
            // 节点1: 百度镜像（目前国内最稳）
            const nodeBaidu = `https://image.baidu.com/search/down?url=${encodeURIComponent(rawUrl)}`;
            // 节点2: Weserv 缓存（全球加速）
            const nodeWeserv = `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}`;

            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${nodeBaidu}" 
                        alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                        onerror="if(!this.dataset.step){this.dataset.step=1; this.src='${nodeWeserv}';} else if(this.dataset.step=='1'){this.dataset.step=2; this.src='${rawUrl}';} else {this.src='https://img9.doubanio.com/f/movie/30c6269b302d51d70ed951336496924b10b037ba/pics/movie/movie_default_large.png';this.onerror=null;}">
                    
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
