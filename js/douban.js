var douban = {
    // 修复思路：添加 Headers 模拟浏览器，并处理图片防盗链
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://movie.douban.com/'
    },

    search: function (key) {
        var url = "https://www.douban.com/search?cat=1002&q=" + encodeURIComponent(key);
        var html = http.get(url, { headers: this.headers });
        var list = [];
        // 更新了搜索结果的正则匹配
        var reg = /<a class="nbg" href="(https:\/\/movie\.douban\.com\/subject\/\d+\/)"[\s\S]*?title="(.*?)"/g;
        var match;
        while ((match = reg.exec(html)) !== null) {
            list.push({
                title: match[2],
                url: match[1]
            });
        }
        return list;
    },

    detail: function (url) {
        var html = http.get(url, { headers: this.headers });
        var movie = {};

        try {
            movie.title = html.match(/<span property="v:itemreviewed">([\s\S]*?)<\/span>/)[1];
            
            // --- 图片修复方案 ---
            // 获取原始图片 URL
            var rawPic = html.match(/<img src="(.*?)" title="点击看更多海报"/)[1];
            // 解决防盗链：1. 替换域名（有时有效） 2. 使用 no-referrer 策略
            // 在 LibreTV 等环境中，最稳妥的是在请求头处理，或者通过特定的代理链接
            movie.pic = rawPic.replace("img3.doubanio.com", "img1.doubanio.com"); 

            movie.director = (html.match(/rel="v:directedBy">([\s\S]*?)<\/a>/) || ["", "未知"])[1];
            
            // 优化演员抓取，防止因为 HTML 换行导致失败
            var actorMatch = html.match(/<a href="\/celebrity\/\d+\/" rel="v:starring">([\s\S]*?)<\/a>/g);
            movie.actor = actorMatch ? actorMatch.slice(0, 3).map(i => i.match(/>(.*?)<\/a>/)[1]).join("/") : "未知";

            movie.type = (html.match(/<span property="v:genre">([\s\S]*?)<\/span>/g) || []).map(i => i.match(/>(.*?)<\/span>/)[1]).join("/");
            
            movie.area = (html.match(/<span class="pl">制片国家\/地区:<\/span>\s*(.*?)<br\/>/) || ["", "未知"])[1];
            
            movie.year = (html.match(/<span class="year">\((.*?)\)<\/span>/) || ["", ""])[1];
            
            var rating = html.match(/<strong class="ll rating_num" property="v:average">(.*?)<\/strong>/);
            movie.remark = rating ? rating[1] : "暂无评分";

            var descMatch = html.match(/<span property="v:summary" class="">([\s\S]*?)<\/span>/);
            movie.desc = descMatch ? descMatch[1].replace(/<br \/>/g, "").replace(/\s+/g, "").trim() : "暂无简介";
            
        } catch (e) {
            console.log("解析失败: " + e.message);
        }
        
        return movie;
    }
};
