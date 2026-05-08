/**
 * 终极修复版：解决豆瓣图片无法显示问题
 */
function renderDoubanCards(data, container) {
    const fragment = document.createDocumentFragment();
    
    // 移除可能存在的加载遮罩
    const loadingOverlay = container.querySelector('.absolute.inset-0');
    if (loadingOverlay) loadingOverlay.remove();

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
            
            // 关键修复：直接使用 weserv 代理，这是目前最稳定的绕过豆瓣防盗链的方法
            // 如果图片是 https://img9.doubanio.com/... 格式，weserv 会完美处理
            const rawUrl = item.cover;
            const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(rawUrl)}&w=300&t=letterbox&bg=black`;
            
            // 备用方案：如果 weserv 挂了，尝试使用百度镜像
            const fallbackUrl = `https://image.baidu.com/search/down?url=${encodeURIComponent(rawUrl)}`;

            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${proxiedUrl}" 
                        alt="${safeTitle}" 
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                        onerror="if(!this.src.includes('baidu')){this.src='${fallbackUrl}';}else{this.src='https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png';}">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                    <div class="absolute bottom-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        ★ ${safeRate}
                    </div>
                    <div class="absolute bottom-2 right-2 bg-black/60 text-white text-xs p-1 rounded-full hover:bg-pink-600 transition-colors">
                        <a href="${item.url}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" title="前往豆瓣">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                    </div>
                </div>
                <div class="p-2 text-center bg-[#111]">
                    <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                            class="text-xs font-medium text-gray-200 truncate w-full hover:text-pink-400 transition"
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
