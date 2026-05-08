function initDouban() {
    console.log("豆瓣功能初始化开始...");
    
    // 1. 加载标签数据
    loadUserTags();

    // 2. 处理开关逻辑（增加安全检查）
    const doubanToggle = document.getElementById('doubanToggle');
    if (doubanToggle) {
        const isEnabled = localStorage.getItem('doubanEnabled') === 'true';
        doubanToggle.checked = isEnabled;
        
        // 更新开关 UI
        const toggleBg = doubanToggle.nextElementSibling;
        const toggleDot = toggleBg ? toggleBg.nextElementSibling : null;
        if (isEnabled && toggleBg && toggleDot) {
            toggleBg.classList.add('bg-pink-600');
            toggleDot.classList.add('translate-x-6');
        }

        doubanToggle.addEventListener('change', function(e) {
            const isChecked = e.target.checked;
            localStorage.setItem('doubanEnabled', isChecked);
            if (toggleBg && toggleDot) {
                toggleBg.classList.toggle('bg-pink-600', isChecked);
                toggleDot.classList.toggle('translate-x-6', isChecked);
            }
            updateDoubanVisibility();
        });
    }

    // 3. 渲染基础 UI
    renderDoubanMovieTvSwitch();
    renderDoubanTags();
    setupDoubanRefreshBtn();
    
    // 4. 强制更新显示状态
    updateDoubanVisibility();

    // 5. 如果开启了，直接加载内容
    if (localStorage.getItem('doubanEnabled') === 'true') {
        renderRecommend(doubanCurrentTag, doubanPageSize, doubanPageStart);
    }
}
