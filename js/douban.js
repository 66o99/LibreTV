/**
 * 极速纯净版：放弃图片渲染，改用纯文字卡片列表
 * 彻底告别防盗链困扰，提升加载速度 100%
 */
function renderDoubanCards(data, container) {
    if (!container) return;
    const fragment = document.createDocumentFragment();
    
    if (!data.subjects || data.subjects.length === 0) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "col-span-full text-center py-12";
        emptyEl.innerHTML = `<div class="text-pink-500 font-medium">❌ 暂无数据，请尝试切换标签或刷新</div>`;
        fragment.appendChild(emptyEl);
    } else {
        data.subjects.forEach(item => {
            const card = document.createElement("div");
            // 调整为扁平化的文字条目样式
            card.className = "bg-[#161616] hover:bg-[#252525] border border-[#333] hover:border-pink-600/50 transition-all duration-200 rounded-md p-4 flex flex-col justify-between group shadow-sm";
            
            const safeTitle = item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeRate = (item.rate || "N/A").replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            card.innerHTML = `
                <div class="flex justify-between items-start mb-3">
                    <span class="text-xs font-bold px-2 py-0.5 rounded bg-pink-600/10 text-pink-500 border border-pink-600/20">
                        评分 ${safeRate}
                    </span>
                    <a href="${item.url}" target="_blank" rel="noopener noreferrer" 
                       class="opacity-40 hover:opacity-100 transition-opacity" title="查看豆瓣详情"
                       onclick="event.stopPropagation();">
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                    </a>
                </div>
                
                <h3 class="text-sm font-semibold text-gray-100 line-clamp-2 mb-4 group-hover:text-pink-400 transition-colors">
                    ${safeTitle}
                </h3>
                
                <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                        class="w-full py-2 bg-[#222] hover:bg-pink-600 text-white text-xs font-medium rounded transition-colors duration-300">
                    立即搜索资源
                </button>
            `;
            fragment.appendChild(card);
        });
    }
    
    container.innerHTML = "";
    // 如果之前图片是网格布局，这里确保容器样式依然匹配（建议 4 列或更多）
    container.className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"; 
    container.appendChild(fragment);
}
