// 1. 确保全局常量存在（如果没有定义，请在脚本顶部添加）
const PROXY_URL = window.PROXY_URL || 'https://images.weserv.nl/?url='; // 示例：使用开源代理

async function fetchDoubanData(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // 优先尝试：使用 JSONP 风格或特定的 CORS 代理
    // 注意：豆瓣 search_subjects 接口目前对直接 fetch 限制极严
    const proxiedUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(proxiedUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        // Allorigins 返回的数据在 contents 字段中，是字符串格式
        return typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
    } catch (err) {
        console.error("豆瓣数据抓取重试失败：", err);
        throw err;
    }
}

function renderDoubanCards(data, container) {
    const fragment = document.createDocumentFragment();
    
    // 移除加载状态
    const loader = container.querySelector('.absolute.inset-0');
    if (loader) loader.remove();

    if (!data || !data.subjects || data.subjects.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 text-gray-400">暂无内容，请切换标签试试</div>`;
        return;
    }

    data.subjects.forEach(item => {
        const card = document.createElement("div");
        card.className = "bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md";
        
        const safeTitle = item.title.replace(/"/g, '&quot;');
        const safeRate = item.rate || "N/A";
        
        // 优化：使用 weserv.nl 处理豆瓣图片防盗链，比直接引用更稳
        const imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(item.cover)}&default=https://via.placeholder.com/200x300?text=No+Poster`;

        card.innerHTML = `
            <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                <img src="${imageUrl}" alt="${safeTitle}" 
                    class="w-full h-full object-cover"
                    loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-2 left-2 text-white text-xs px-2 py-1 bg-pink-600/80 rounded">
                    ★ ${safeRate}
                </div>
            </div>
            <div class="p-2 text-center">
                <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                        class="text-sm font-medium text-gray-200 truncate w-full hover:text-pink-400 transition">
                    ${safeTitle}
                </button>
            </div>
        `;
        fragment.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(fragment);
}
