var douban = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },

    search: function (key) {
        var url = "https://www.douban.com/search?cat=1002&q=" + encodeURIComponent(key);
        var html = http.get(url, { headers: this.headers });
        var list = [];
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
            
            // --- 核心修复：使用代理绕过防盗链 ---
            var picMatch = html.match(/<img src="(.*?)" title="点击看更多海报"/);
            if (picMatch) {
                var rawPic = picMatch[1];
                // 方案：使用 weserv.nl 代理，并将协议去掉
                movie.pic = "https://images.weserv.nl/?url=" + rawPic.replace(/https?:\/\//, "");
            }

            movie.director = (html.match(/rel="v:directedBy">([\s\S]*?)<\/a>/) || ["", "未知"])[1];
            movie.actor = (html.match(/<a href="\/celebrity\/\d+\/" rel="v:starring">([\s\S]*?)<\/a>/g) || [])
                            .slice(0, 3).map(i => i.match(/>(.*?)<\/a>/)[1]).join("/");
            movie.type = (html.match(/<span property="v:genre">([\s\S]*?)<\/span>/g) || [])
                            .map(i => i.match(/>(.*?)<\/span>/)[1]).join("/");
            movie.area = (html.match(/<span class="pl">制片国家\/地区:<\/span>\s*(.*?)<br\/>/) || ["", "未知"])[1];
            movie.year = (html.match(/<span class="year">\((.*?)\)<\/span>/) || ["", ""])[1];
            movie.remark = (html.match(/<strong class="ll rating_num" property="v:average">(.*?)<\/strong>/) || ["", "暂无"])[1];
            movie.desc = (html.match(/<span property="v:summary" class="">([\s\S]*?)<\/span>/) || ["", "暂无简介"])[1]
                            .replace(/<br \/>/g, "").replace(/\s+/g, "").trim();
        } catch (e) {
            console.log("解析出错");
        }
        return movie;
    }
};
