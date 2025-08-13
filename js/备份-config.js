// ȫ�ֳ�������
const PROXY_URL = '/proxy/';    // ������ Cloudflare, Netlify (����д), Vercel (����д)
// const HOPLAYER_URL = 'https://hoplayer.com/index.html';
const SEARCH_HISTORY_KEY = 'videoSearchHistory';
const MAX_HISTORY_ITEMS = 5;

// ���뱣������
// ע�⣺PASSWORD ���������Ǳ���ģ����в��𶼱�������������ȷ����ȫ
const PASSWORD_CONFIG = {
    localStorageKey: 'passwordVerified',  // �洢��֤״̬�ļ���
    verificationTTL: 90 * 24 * 60 * 60 * 1000  // ��֤��Ч�ڣ�90�죬Լ3���£�
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
    xiaomaomi: {
        api: 'https://zy.xmm.hk/api.php/provide/vod',
        name: 'Сè����Դ',
    },
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
    lzi: {
        api: 'https://cj.lziapi.com/api.php/provide/vod/',
        name: '������Դվ'
    },

    testSource: {
        api: 'https://www.example.com/api.php/provide/vod',
        name: '�����ݲ���Դ',
        adult: true
    }
    //ARCHIVE https://telegra.ph/APIs-08-12
};

// ����ϲ�����
function extendAPISites(newSites) {
    Object.assign(API_SITES, newSites);
}

// ��¶��ȫ��
window.API_SITES = API_SITES;
window.extendAPISites = extendAPISites;


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

// �Զ���Դ����ҳ����Զ���API�õģ�������������
// ����Ӱ��  https://www.fantuan.tv/api.php/provide/vod/
// Ӱ�ӹ���  https://cj.lziapi.com/api.php/provide/vod/
// ������Դ  https://www.qiqidys.com/api.php/provide/vod/