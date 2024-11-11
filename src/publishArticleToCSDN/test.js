const fetch = require('node-fetch');
const { invoke} = require('./csdn');
const DEFAULT_TOKE = 'xxxxxxxxxxxxxxxx';
const DEFAULT_BASE_YUQUE_API_URL = 'https://www.yuque.com/api/v2';
const DEFAULT_BASE_YUQUE_ARTICLE_URL = 'https://cn-ai.yuque.com/';


async function getYuqueArticle(url) {
    const _url = new URL(url);
    // 需要将url 进行内容提取取后面的三个路径值 group_login=espk1z，book_slug=qg1dvf，id=rla4yfsyibgibb5d
    // baseArticleUrl 验证一下是否是语雀地址
    if (!url.startsWith(DEFAULT_BASE_YUQUE_ARTICLE_URL)) {
        return null
    }
    const pathname = _url.pathname;
    const yuqueUrlPath = pathname.split('/');
    const [empty_path, group_login, book_slug, id] = yuqueUrlPath;
    const response = await fetch(`${DEFAULT_BASE_YUQUE_API_URL}/repos/${group_login}/${book_slug}/docs/${id}?page_size=100&page=1`, {
        method: 'GET',
        headers: {
            'X-Auth-Token': process.env.YUQUE_TOKEN || DEFAULT_TOKE,
        },
    }).then(res => res.json());
    return response.data;
}


(async () => {
    const yuque_url = "https://cn-ai.yuque.com/akymfr/bc0ekv/dvxaio4gfgfshqq8";
    const { title, body } = await getYuqueArticle(yuque_url);
    const data = await invoke({ article_title: title, article_content: body },false);
    console.log(data);
})()

