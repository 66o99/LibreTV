// 1. 确保基础变量存在，防止代码崩溃
if (typeof PROXY_URL === 'undefined') var PROXY_URL = "https://api.allorigins.win/raw?url=";

// 2. 强力数据获取函数
async function fetchDoubanData(url) {
    try {
        // 优先使用 allorigins 代理
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        // allorigins 返回的是字符串，需要解析
        return JSON.parse(data.contents);
    } catch (err) {
        console.error("豆瓣请求失败:", err);
        return null;
    }
}

// 3. 稳健渲染函数（移除所有复杂逻辑）
function renderDoubanCards(data, container) {
    if (!data || !data.subjects || data.subjects.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">未能加载到内容，请检查网络或稍后再试</div>';
        return;
    }

    let html = '';
    data.subjects.forEach(item => {
        const title = item.title.replace(/"/g, '&quot;');
        const rate = item.rate || '0.0';
        
        // 关键：使用无需 Referer 的百度镜像或 Weserv 代理图片
        // 百度镜像：https://image.baidu.com/search/down?url=
        // Weserv：https://images.weserv.nl/?url=
        const cover = `https://images.weserv.nl/?url=${encodeURIComponent(item.cover)}&w=300`;

        html += `
            <div class="bg-[#1a1a1a] rounded-lg overflow-hidden flex flex-col border border-white/5 shadow-lg">
                <div class="relative w-full aspect-[2/3] cursor-pointer" onclick="if(typeof fillAndSearchWithDouban === 'function') fillAndSearchWithDouban('${title}')">
                    <img src="${cover}" 
                         alt="${title}" 
                         class="w-full h-full object-cover"
                         referrerpolicy="no-referrer"
                         onerror="this.src='https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                    <div class="absolute bottom-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ★ ${rate}
                    </div>
                </div>
                <div class="p-2 text-center">
                    <div class="text-xs font-medium text-gray-200 truncate w-full">${title}</div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// 4. 入口函数：强制清空状态并显示文字
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    // 先显示文字，确保你看到“加载中”说明 JS 还在跑
    container.innerHTML = '<div class="col-span-full text-center py-20 text-pink-500">正在获取豆瓣推荐...</div>';
    
    const type = (typeof doubanMovieTvCurrentSwitch !== 'undefined') ? doubanMovieTvCurrentSwitch : 'movie';
    const target = `https://movie.douban.com/j/search_subjects?type=${type}&tag=${encodeURIComponent(tag)}&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`;
    
    fetchDoubanData(target).then(data => {
        renderDoubanCards(data, container);
    });
}
