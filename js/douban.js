// 1. 确保全局变量存在，防止 fetch 崩溃
if (typeof PROXY_URL === 'undefined') window.PROXY_URL = 'https://api.allorigins.win/raw?url=';

// 2. 核心请求函数：增加异常捕获
async function fetchDoubanData(url) {
    try {
        const targetUrl = PROXY_URL + encodeURIComponent(url);
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('网络响应失败');
        return await response.json();
    } catch (err) {
        console.error("请求失败，尝试备用线路...", err);
        // 备用线路：allorigins 直接模式
        const fallback = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(fallback);
        const json = await res.json();
        return JSON.parse(json.contents);
    }
}

// 3. 渲染函数：极简稳定版
function renderDoubanCards(data, container) {
    // 安全检查：如果 data 格式不对，直接报错不执行
    if (!data || !data.subjects) {
        container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">数据格式错误</div>';
        return;
    }

    let html = '';
    data.subjects.forEach(item => {
        const title = (item.title || '未知名称').replace(/"/g, '&quot;');
        const rate = item.rate || '0.0';
        const cover = item.cover || '';
        
        // 方案：使用 images.weserv.nl 绕过防盗链，最稳
        const displayCover = `https://images.weserv.nl/?url=${encodeURIComponent(cover)}&w=300`;

        html += `
            <div class="bg-[#111] rounded-lg overflow-hidden flex flex-col shadow-lg border border-white/5">
                <div class="relative w-full aspect-[2/3] cursor-pointer" onclick="fillAndSearchWithDouban('${title}')">
                    <img src="${displayCover}" 
                         alt="${title}" 
                         class="w-full h-full object-cover"
                         loading="lazy"
                         onerror="this.src='https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div class="absolute bottom-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        ★ ${rate}
                    </div>
                </div>
                <div class="p-2 text-center bg-[#111]">
                    <button onclick="fillAndSearchWithDouban('${title}')" 
                            class="text-xs font-medium text-gray-200 truncate w-full hover:text-pink-400">
                        ${title}
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 4. 入口函数：增加加载状态清理
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    // 清空内容并显示一个简单的加载文字（非 HTML 遮罩，防止阻塞）
    container.innerHTML = '<div class="col-span-full text-center py-20 text-pink-500 animate-pulse">正在连接豆瓣...</div>';
    
    const target = `https://movie.douban.com/j/search_subjects?type=${doubanMovieTvCurrentSwitch}&tag=${tag}&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`;
    
    fetchDoubanData(target)
        .then(data => renderDoubanCards(data, container))
        .catch(error => {
            console.error("最终失败:", error);
            container.innerHTML = `<div class="col-span-full text-center py-20 text-red-400">❌ 加载失败，请检查网络或更换代理</div>`;
        });
}
