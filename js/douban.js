detail: function (url) {
        // 1. 尝试使用 mobile 端链接，有时爬取更宽松
        var mobileUrl = url.replace("movie.douban.com", "m.douban.com/movie");
        var html = http.get(url, { 
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
                'Referer': 'https://movie.douban.com/'
            } 
        });
        
        var movie = {};
        try {
            // 匹配标题
            movie.title = html.match(/<span property="v:itemreviewed">([\s\S]*?)<\/span>/)[1];

            // --- 图片修复：强制使用 pstatic 代理 ---
            var picMatch = html.match(/<img src="(.*?)" title="点击看更多海报"/);
            if (picMatch) {
                var rawPic = picMatch[1];
                // 关键修复：将 https 换成 http，并使用 pstatic 绕过防盗链
                var cleanUrl = rawPic.replace("https://", "").replace("http://", "");
                movie.pic = "https://img.pstatic.net/repository/static/proxy/douban/" + cleanUrl;
            }

            // 其他信息匹配（加入空值保护）
            movie.director = (html.match(/rel="v:directedBy">([\s\S]*?)<\/a>/) || [0, "未知"])[1];
            movie.actor = (html.match(/<a href="\/celebrity\/\d+\/" rel="v:starring">([\s\S]*?)<\/a>/g) || [])
                            .slice(0, 3).map(i => i.match(/>(.*?)<\/a>/)[1]).join("/");
            movie.type = (html.match(/<span property="v:genre">([\s\S]*?)<\/span>/g) || [])
                            .map(i => i.match(/>(.*?)<\/span>/)[1]).join("/");
            movie.area = (html.match(/<span class="pl">制片国家\/地区:<\/span>\s*(.*?)<br\/>/) || [0, "未知"])[1];
            movie.year = (html.match(/<span class="year">\((.*?)\)<\/span>/) || [0, ""])[1];
            movie.remark = (html.match(/<strong class="ll rating_num" property="v:average">(.*?)<\/strong>/) || [0, "0.0"])[1];
            
            var desc = html.match(/<span property="v:summary" class="">([\s\S]*?)<\/span>/);
            movie.desc = desc ? desc[1].replace(/<br \/>/g, "").replace(/\s+/g, "").trim() : "暂无简介";

        } catch (e) {
            // 如果报错，返回一个基础对象防止程序崩溃
            movie.title = "解析失败";
            movie.pic = "";
        }
        return movie;
    }
