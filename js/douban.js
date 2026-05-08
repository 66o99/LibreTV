// 修复后的渲染豆瓣卡片逻辑
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
            
            // 解决海报显示问题的核心：
            // 使用特定的 doubanio 替换，有时能绕过基础限制
            let imgUrl = item.cover;
            if (imgUrl.includes('doubanio.com')) {
                imgUrl = imgUrl.replace('img3.doubanio.com', 'img1.doubanio.com'); // 尝试切换节点
            }

            // 备用图片代理（请确保 PROXY_URL 已定义）
            const backupUrl = typeof PROXY_URL !== 'undefined' ? PROXY_URL + encodeURIComponent(item.cover) : '';
            
            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${imgUrl}" 
                        alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        loading="lazy" 
                        referrerpolicy="no-referrer"
                        onerror="if(!this.dataset.tried){this.dataset.tried=true; this.src='${backupUrl}';}else{this.src='https://img9.doubanio.com/f/movie/30c6269b302d51d70ed951336496924b10b037ba/pics/movie/movie_default_large.png';this.onerror=null;}"
                    >
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm">
                        <span class="text-yellow-400">★</span> ${safeRate}
                    </div>
                    <div class="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm hover:bg-[#333] transition-colors">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" title="在豆瓣查看" onclick="event.stopPropagation();">🔗</a>
                    </div>
                </div>
                <div class="p-2 text-center bg-[#111]">
                    <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                            class="text-sm font-medium text-white truncate w-full hover:text-pink-400 transition"
                            title="${safeTitle}">
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
