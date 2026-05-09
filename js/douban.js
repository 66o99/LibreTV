/**
 * 1. 修复请求逻辑：增加多层容错，防止脚本崩溃
 */
async function fetchDoubanData(url) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    // 自动判断代理前缀
    const baseUrl = (typeof PROXY_URL !== 'undefined' && PROXY_URL) ? PROXY_URL : '';

    try {
        const proxiedUrl = typeof window.ProxyAuth?.addAuthToProxyUrl === 'function' ? 
            await window.ProxyAuth.addAuthToProxyUrl(baseUrl + encodeURIComponent(url)) :
            baseUrl + encodeURIComponent(url);
            
        const response = await fetch(proxiedUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error('Primary Proxy Failed');
        return await response.json();
    } catch (err) {
        console.warn("主代理失败，尝试备用代理...", err);
        // 备用代理：使用 allorigins (自带跨域处理)
        try {
            const fallbackUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
            const fallbackResponse = await fetch(fallbackUrl);
            const data = await fallbackResponse.json();
            // 关键修复：判断 contents 是否为字符串
            return typeof data.contents === 'string' ? JSON.parse(data.contents) : data.contents;
        } catch (fallbackErr) {
            console.error("所有代理均失效");
            throw fallbackErr;
        }
    }
}

/**
 * 2. 修复渲染逻辑：彻底移除所有干扰注释，确保图片显示
 */
function renderDoubanCards(data, container) {
    if (!container) return;
    const fragment = document.createDocumentFragment();
    
    // 容错处理：确保 data 和 subjects 存在
    const subjects = (data && data.subjects) ? data.subjects : [];

    if (subjects.length === 0) {
        const emptyEl = document.createElement("div");
        emptyEl.className = "col-span-full text-center py-8";
        emptyEl.innerHTML = `<div class="text-pink-500">❌ 暂时无法获取内容，请尝试切换标签或刷新</div>`;
        fragment.appendChild(emptyEl);
    } else {
        subjects.forEach(item => {
            const card = document.createElement("div");
            card.className = "bg-[#111] hover:bg-[#222] transition-all duration-300 rounded-lg overflow-hidden flex flex-col transform hover:scale-105 shadow-md hover:shadow-lg";
            
            const safeTitle = item.title.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const safeRate = (item.rate || "0.0");
            
            // 图片备用方案：百度中转 (最稳) > Weserv (国外稳) > 豆瓣原链 (配合no-referrer)
            const imgBaidu = `https://image.baidu.com/search/down?url=${encodeURIComponent(item.cover)}`;
            const imgWeserv = `https://images.weserv.nl/?url=${encodeURIComponent(item.cover)}&w=300`;

            card.innerHTML = `
                <div class="relative w-full aspect-[2/3] overflow-hidden cursor-pointer" onclick="fillAndSearchWithDouban('${safeTitle}')">
                    <img src="${imgBaidu}" 
                        alt="${safeTitle}" 
                        class="w-full h-full object-cover"
                        referrerpolicy="no-referrer"
                        loading="lazy"
                        onerror="if(!this.dataset.tried){this.dataset.tried='1';this.src='${imgWeserv}';}else if(this.dataset.tried=='1'){this.dataset.tried='2';this.src='${item.cover}';}else{this.src='https://img9.doubanio.com/f/movie/30c6269b302d51d70ed951336496924b10b037ba/pics/movie/movie_default_large.png';this.onerror=null;}">
                    
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div class="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded border border-white/10">
                        <span class="text-yellow-400">★</span> ${safeRate}
                    </div>
                </div>
                <div class="p-2 text-center bg-[#111]">
                    <div class="text-sm font-medium text-gray-200 truncate w-full hover:text-pink-400 transition cursor-pointer" 
                         onclick="fillAndSearchWithDouban('${safeTitle}')">
                        ${safeTitle}
                    </div>
                </div>
            `;
            fragment.appendChild(card);
        });
    }
    
    // 渲染前清除状态
    container.innerHTML = "";
    container.classList.remove("relative"); // 移除加载层的相对定位
    container.appendChild(fragment);
}

/**
 * 3. 增强推荐入口：确保即使 API 报错，转圈动画也会消失
 */
function renderRecommend(tag, pageLimit, pageStart) {
    const container = document.getElementById("douban-results");
    if (!container) return;

    // 清除旧内容，显示加载中
    container.innerHTML = `
        <div id="douban-loading" class="col-span-full flex flex-col items-center justify-center py-12">
            <div class="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-gray-400 mt-4 text-sm">正在同步豆瓣数据...</span>
        </div>
    `;
    
    const target = `https://movie.douban.com/j/search_subjects?type=${doubanMovieTvCurrentSwitch}&tag=${encodeURIComponent(tag)}&sort=recommend&page_limit=${pageLimit}&page_start=${pageStart}`;
    
    fetchDoubanData(target)
        .then(data => {
            renderDoubanCards(data, container);
        })
        .catch(error => {
            console.error("Final Error:", error);
            container.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="text-red-400 mb-2">⚠️ 网络连接超时</div>
                    <div class="text-gray-500 text-xs">请检查代理设置或尝试刷新页面</div>
                    <button onclick="location.reload()" class="mt-4 px-4 py-1 border border-pink-500 text-pink-500 rounded-full text-xs hover:bg-pink-500 hover:text-white transition">刷新页面</button>
                </div>
            `;
        });
}
