// ȫ�ֳ�������
const PROXY_URL = '/proxy/';    // ������ Cloudflare, Netlify (����д), Vercel (����д)
// const HOPLAYER_URL = 'https://hoplayer.com/index.html';
const SEARCH_HISTORY_KEY = 'videoSearchHistory';
const MAX_HISTORY_ITEMS = 5;

// ���뱣������
const PASSWORD_CONFIG = {
    localStorageKey: 'passwordVerified',  // �洢��֤״̬�ļ���
    verificationTTL: 90 * 24 * 60 * 60 * 1000,  // ��֤��Ч�ڣ�90�죬Լ3���£�
    adminLocalStorageKey: 'adminPasswordVerified'  // �����Ĺ���Ա��֤״̬�ļ���
};

// ��վ��Ϣ����
const SITE_CONFIG = {
    name: 'LibreTV',
    url: 'https://libretv.is-an.org',
    description: '���������Ƶ������ۿ�ƽ̨',
    logo: 'image/logo.png',
    version: '1.0.3'
};

// APIվ������
const API_SITES = {
    dyttzy: {
        api: 'http://caiji.dyttzyapi.com/api.php/provide/vod',
        name: '��Ӱ������Դ',
        detail: 'http://caiji.dyttzyapi.com', 
    },
    ruyi: {
        api: 'https://cj.rycjapi.com/api.php/provide/vod',
        name: '������Դ',
    },
    bfzy: {
        api: 'https://bfzyapi.com/api.php/provide/vod',
        name: '������Դ',
    },
    tyyszy: {
        api: 'https://tyyszy.com/api.php/provide/vod',
        name: '������Դ',
    },
    // xiaomaomi: {
    //     api: 'https://zy.xiaomaomi.cc/api.php/provide/vod',
    //     name: 'Сè����Դ',
    // },
    ffzy: {
        api: 'http://ffzy5.tv/api.php/provide/vod',
        name: '�Ƿ�Ӱ��',
        detail: 'http://ffzy5.tv', 
    },
    heimuer: {
        api: 'https://json.heimuer.xyz/api.php/provide/vod',
        name: '��ľ��',
        detail: 'https://heimuer.tv', 
    },
    zy360: {
        api: 'https://360zy.com/api.php/provide/vod',
        name: '360��Դ',
    },
    iqiyi: {
        api: 'https://www.iqiyizyapi.com/api.php/provide/vod',
        name: 'iqiyi��Դ',
    },
    wolong: {
        api: 'https://wolongzyw.com/api.php/provide/vod',
        name: '������Դ',
    }, 
    hwba: {
        api: 'https://cjhwba.com/api.php/provide/vod',
        name: '��Ϊ����Դ',
    },
    jisu: {
        api: 'https://jszyapi.com/api.php/provide/vod',
        name: '������Դ',
        detail: 'https://jszyapi.com', 
    },
    dbzy: {
        api: 'https://dbzy.tv/api.php/provide/vod',
        name: '������Դ',
    },
    mozhua: {
        api: 'https://mozhuazy.com/api.php/provide/vod',
        name: 'ħצ��Դ',
    },
    mdzy: {
        api: 'https://www.mdzyapi.com/api.php/provide/vod',
        name: 'ħ����Դ',
    },
    zuid: {
        api: 'https://api.zuidapi.com/api.php/provide/vod',
        name: '�����Դ'
    },
    yinghua: {
        api: 'https://m3u8.apiyhzy.com/api.php/provide/vod',
        name: 'ӣ����Դ'
    },
    baidu: {
        api: 'https://api.apibdzy.com/api.php/provide/vod',
        name: '�ٶ�����Դ'
    },
    wujin: {
        api: 'https://api.wujinapi.me/api.php/provide/vod',
        name: '�޾���Դ'
    },
    wwzy: {
        api: 'https://wwzy.tv/api.php/provide/vod',
        name: '�����̾�'
    },
    ikun: {
        api: 'https://ikunzyapi.com/api.php/provide/vod',
        name: 'iKun��Դ'
    },
    testSource: {
        api: 'https://www.example.com/api.php/provide/vod',
        name: '�����ݲ���Դ',
        adult: true
    },
    // ������һЩ�������ݵ�APIԴ��Ĭ�����أ�ʹ�ñ���Ŀ�����ɫ����Υ����Ŀ����
    // �������ϴ�����ɫ�����ݽ��˳��׿��廯�����߻������Ա��ź�����ƽ�ȵ�·�ϵľ޴��ϰ���
    // ��Щ��ɫӰƬ���ʱ����常Ȩ��ѹ�ȵ�������֣�����������������Ʒ������̤�˵����ϣ����ܺ�������޷��������˺�������������ϵ��
    // �ʱ�Ϊ�����󣬲�ϧ����ӵİ������������ܺ��ߺͱ����ߵİ������ͱ�����Ʒ����
    // ���Ա��������ɡ������ܡ���Թ��ڵ���ʶ��ת�����Ƕ���ʵ������ì�ܺ�ѹ�ȵ�ע������
    // ��ЩӰƬ�ͱ���Ĳ�ҵ�Ѿ�ʹ��������Ů���º����������Լ������壬�����Դ�Ϊ���ơ�
    // ����Ϊ�����޹��𣿺������ʣ����Ǵٳ��˻�ɫ��ҵ������������
    // �����ṩ�˾��棬��ϣ������������Щ���ݵı��ʡ���������ѹ�Ⱥ�ū�۵Ĺ��ߣ��������֡�
    // ckzy: {
    //     api: 'https://www.ckzy1.com',
    //     name: 'CK��Դ',
    //     adult: true
    // },
    // jkun: {
    //     api: 'https://jkunzyapi.com',
    //     name: 'jkun��Դ',
    //     adult: true
    // },
    // bwzy: {
    //     api: 'https://api.bwzym3u8.com',
    //     name: '������Դ',
    //     adult: true
    // },
    // souav: {
    //     api: 'https://api.souavzy.vip',
    //     name: 'souav��Դ',
    //     adult: true
    // },
    // r155: {
    //     api: 'https://155api.com',
    //     name: '155��Դ',
    //     adult: true
    // },
    // lsb: {
    //     api: 'https://apilsbzy1.com',
    //     name: 'lsb��Դ',
    //     adult: true
    // },
    // huangcang: {
    //     api: 'https://hsckzy.vip',
    //     name: '��ɫ�ֿ�',
    //     adult: true,
    //     detail: 'https://hsckzy.vip'
    // },
    // yutu: {
    //     api: 'https://yutuzy10.com',
    //     name: '������Դ',
    //     adult: true
    // },

    // ��������ԴʧЧ�ʸߵ�APIԴ��������ʹ��
    // subo: {
    //     api: 'https://subocaiji.com/api.php/provide/vod',
    //     name: '�ٲ���Դ'
    // },
    // fczy: {
    //     api: 'https://api.fczy888.me/api.php/provide/vod',
    //     name: '�䳲��Դ'
    // },
    // ukzy: {
    //     api: 'https://api.ukuapi88.com/api.php/provide/vod',
    //     name: 'U����Դ'
    // },
};

// ��Ӿۺ�����������ѡ��
const AGGREGATED_SEARCH_CONFIG = {
    enabled: true,             // �Ƿ����þۺ�����
    timeout: 8000,            // ����Դ��ʱʱ�䣨���룩
    maxResults: 10000,          // ���������
    parallelRequests: true,   // �Ƿ�����������Դ
    showSourceBadges: true    // �Ƿ���ʾ��Դ����
};

// ����API��������
const API_CONFIG = {
    search: {
        // ֻƴ�Ӳ������֣����ٰ��� /api.php/provide/vod/
        path: '?ac=videolist&wd=',
        pagePath: '?ac=videolist&wd={query}&pg={page}',
        maxPages: 50, // ����ȡҳ��
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    },
    detail: {
        // ֻƴ�Ӳ�������
        path: '?ac=videolist&ids=',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'application/json'
        }
    }
};

// �Ż����������ʽģʽ
const M3U8_PATTERN = /\$https?:\/\/[^"'\s]+?\.m3u8/g;

// ����Զ��岥����URL
const CUSTOM_PLAYER_URL = 'player.html'; // ʹ�����·�����ñ���player.html

// ������Ƶ�����������
const PLAYER_CONFIG = {
    autoplay: true,
    allowFullscreen: true,
    width: '100%',
    height: '600',
    timeout: 15000,  // ���������س�ʱʱ��
    filterAds: true,  // �Ƿ����ù�����
    autoPlayNext: true,  // Ĭ�������Զ���������
    adFilteringEnabled: true, // Ĭ�Ͽ�����Ƭ������
    adFilteringStorage: 'adFilteringEnabled' // �洢���������õļ���
};

// ���Ӵ�����Ϣ���ػ�
const ERROR_MESSAGES = {
    NETWORK_ERROR: '�������Ӵ���������������',
    TIMEOUT_ERROR: '����ʱ����������Ӧʱ�����',
    API_ERROR: 'API�ӿڷ��ش����볢�Ը�������Դ',
    PLAYER_ERROR: '����������ʧ�ܣ��볢��������ƵԴ',
    UNKNOWN_ERROR: '����δ֪������ˢ��ҳ������'
};

// ��ӽ�һ����ȫ����
const SECURITY_CONFIG = {
    enableXSSProtection: true,  // �Ƿ�����XSS����
    sanitizeUrls: true,         // �Ƿ�����URL
    maxQueryLength: 100,        // �����������
    // allowedApiDomains ������Ҫ����Ϊ��������ͨ���ڲ�����
};

// ��Ӷ���Զ���APIԴ������
const CUSTOM_API_CONFIG = {
    separator: ',',           // �ָ���
    maxSources: 5,            // ���������Զ���Դ����
    testTimeout: 5000,        // ���Գ�ʱʱ��(����)
    namePrefix: 'Custom-',    // �Զ���Դ����ǰ׺
    validateUrl: true,        // ��֤URL��ʽ
    cacheResults: true,       // ������Խ��
    cacheExpiry: 5184000000,  // �������ʱ��(2����)
    adultPropName: 'isAdult' // ���ڱ�ǳ������ݵ�������
};

// �������û�ɫ�ɼ�վAPI�ı���
const HIDE_BUILTIN_ADULT_APIS = false;
