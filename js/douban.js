// 1. 核心请求处理：彻底解决变量未定义和跨域问题
async function fetchDoubanData(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // 使用 allorigins 提供的开源中转，不需要任何配置变量
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(proxyUrl, { signal: controller.signal });
        if (!response.ok) throw new Error('网络响应异常');
        
        const data = await response.json();
        // allorigins 返回的内容在 contents 字段里，需要二次解析
        const doubanData = typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
        
        clearTimeout(timeoutId);
        return doubanData;
    } catch (err) {
        console.error("豆瓣数据抓取失败:", err);
        return null;
    }
}

// 2. 推荐渲染：增加状态反馈
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    // 显式显示加载状态，如果没显示这个，说明 initDouban 就没跑通
    container.innerHTML = `<div class="col-span-full text-center py-10 text-pink-500">正在同步豆瓣热榜...</div>`;
    
    const target = `https://movie.douban.com/j/search_subjects?type=${doubanMovieTvCurrentSwitch}&tag=${encodeURIComponent(tag)}&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`;
    
    fetchDoubanData(target).then(data => {
        if (data && data.subjects) {
            renderDoubanCards(data, container);
        } else {
            container.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">❌ 接口暂时失联，请稍后再试</div>`;
        }
    });
}

// 3. 渲染卡片：纯文字极简风格，规避图片所有问题
function renderDoubanCards(data, container) {
    const subjects = data.subjects || [];
    if (subjects.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-10 text-gray-500">该分类下暂无内容</div>`;
        return;
    }

    // 使用 join 拼接字符串，防止 DOM 操作报错
    const html = subjects.map(item => {
        const safeTitle = item.title.replace(/'/g, "\\'");
        const rate = item.rate || '0.0';
        
        return `
            <div class="bg-[#1a1a1a] border border-[#333] hover:border-pink-500 rounded-lg p-4 transition-all group">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-yellow-500 text-xs font-bold">★ ${rate}</span>
                    <a href="${item.url}" target="_blank" class="text-gray-500 hover:text-white text-xs">豆瓣 ↗</a>
                </div>
                <div class="text-gray-100 font-medium text-sm mb-3 truncate" title="${item.title}">
                    ${item.title}
                </div>
                <button onclick="fillAndSearchWithDouban('${safeTitle}')" 
                        class="w-full py-1.5 bg-[#333] group-hover:bg-pink-600 text-white text-xs rounded transition-colors">
                    找资源
                </button>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}
