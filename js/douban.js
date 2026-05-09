// 1. 核心请求处理：增加变量检查和备用接口
async function fetchDoubanData(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // 自动补全可能缺失的 PROXY_URL
    const currentProxy = (typeof PROXY_URL !== 'undefined') ? PROXY_URL : 'https://api.allorigins.win/get?url=';

    try {
        const fullUrl = currentProxy.includes('allorigins') ? 
            currentProxy + encodeURIComponent(url) : 
            currentProxy + encodeURIComponent(url);
            
        const response = await fetch(fullUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        const data = await response.json();
        // 处理 allorigins 这种代理返回的特殊格式
        return data.contents ? JSON.parse(data.contents) : data;
    } catch (err) {
        console.error("代理请求失败，尝试备用线路:", err);
        // 最后的倔强：尝试直接请求（大概率跨域，但万一呢）
        const fallback = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const json = await fallback.json();
        return JSON.parse(json.contents);
    }
}

// 2. 推荐渲染：增加防御性代码
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    // 清除旧内容并显示加载中
    container.innerHTML = `<div class="col-span-full text-center py-8 text-pink-500 animate-pulse">📡 正在调取豆瓣数据...</div>`;
    
    const target = `https://movie.douban.com/j/search_subjects?type=${doubanMovieTvCurrentSwitch}&tag=${encodeURIComponent(tag)}&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`;
    
    fetchDoubanData(target)
        .then(data => {
            if (data) {
                renderDoubanCards(data, container);
            } else {
                throw new Error("Data is empty");
            }
        })
        .catch(error => {
            console.error("渲染失败：", error);
            container.innerHTML = `<div class="col-span-full text-center py-8 text-red-500">❌ 数据加载失败，请检查网络或代理设置</div>`;
        });
}

// 3. 终极渲染卡片：完全隔离 Referrer
function renderDoubanCards(data, container) {
    if (!container) return;
    
    const subjects = data.subjects || [];
    if (subjects.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-8 text-gray-400">暂无相关资源</div>`;
        return;
    }

    const html = subjects.map(item => {
        const safeTitle = item.title.replace(/"/g, '&quot;');
        const safeRate = item.rate || '0.0';
        // 重点：使用 images.weserv.nl 加上 &p=0 处理防盗链
        const imgUrl = `https://images.weserv.nl/?url=${encodeURIComponent(item.cover)}&w=200&h=300&fit=cover`;

        return `
            <div class="bg-[#111] rounded-lg overflow-hidden flex flex-col shadow-md border border-gray-800">
                <div class="relative aspect-[2/3] cursor-pointer group" onclick="if(window.fillAndSearchWithDouban) fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${imgUrl}" 
                         alt="${safeTitle}" 
                         referrerpolicy="no-referrer"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                         onerror="this.src='https://img3.doubanio.com/f/movie/30c6263b6a2d5d07daec2c1fb456710773d7894d/pics/movie/movie_default_large.png'">
                    <div class="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black text-[10px]">
                        <span class="text-yellow-500">★ ${safeRate}</span>
                    </div>
                </div>
                <div class="p-2 text-center">
                    <div class="text-xs text-gray-200 truncate cursor-pointer hover:text-pink-500" 
                         onclick="if(window.fillAndSearchWithDouban) fillAndSearchWithDouban('${safeTitle}')">
                        ${item.title}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}
