const fs = require('fs');
const puppeteer = require('puppeteer'); // 引入 Puppeteer
const marked = require('marked');
const baseUrl = 'https://mp.csdn.net/mp_blog/creation/editor';

let browser = null;
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time)
    });
}

async function init(headless) {
    browser = await puppeteer.launch({
        headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    if (!headless) {
        await page.setViewport(null);
    }

    // 监听 beforeunload 事件
    page.on('dialog', async dialog => {
        console.log('Dialog message:', dialog.message());
        await dialog.accept(); // 确认离开
    });

    page.on('request', interceptedRequest => {
        interceptedRequest.continue();
    });
    return page;
}



async function publishOfficial(page, url) {
    await page.goto(url);
    await delay(40000); // 等待预览图片上传
    await page.evaluate(() => { // 发布
        const publishArticleButton = document.querySelector('.btn-outline-danger');
        if (publishArticleButton) {
            publishArticleButton.click();
        }
    });

    // TODO: 可以添加更多的逻辑来确认发布成功,例如，等待页面跳转或检查某个元素是否存在    
    await page.waitForNavigation(); // 等待页面跳转
    const releaseUrl = page.url();
    return releaseUrl;

}

async function getArticleTitleAndContent(article) {
    const { article_content, article_title } = article;
    const title = article_title || '';
    let content = article_content;
    try {
        content = marked.parse(content);
    } catch (e) {
    }
    return {
        title,
        content
    }
}
function getCookies() {
    let cookies = {};
    try {
        let cookieData = '{}';
        if (process.env.cookies) {
            cookieData = process.env.cookies;
        } else if (fs.existsSync('cookies.json')) {
            cookieData = fs.readFileSync('cookies.json', 'utf-8');
        }
        cookies = JSON.parse(cookieData);
    } catch (e) {

    }
    return cookies;
}

async function setCookiesAfterHumanOption(page) {
    const cookies = await page.cookies();
    if (cookies.length > 0) {
        if (process.env.cookies) { // 线上
            // 重新写入到环境变量
        } else { // 本地调试写入本地文件
            fs.writeFileSync('cookies.json', JSON.stringify(cookies), 'utf-8');
        }
    } else {
        console.log('未能获取到 Cookie 信息，请检查页面是否正确加载。');
    }
}
async function publishDraft(page, article) {
    return new Promise(async (global_resolve, global_reject) => {
        try {
            try {
                const _cookies = await getCookies(); // 获取并设置cookie，避免每次登录
                await page.setCookie(..._cookies);
                const _response = await page.goto(baseUrl);
                try {
                    if (_response) {
                        const url = _response.url();
                        if (url !== baseUrl) {
                            await triggerUserLoginRequest(page); // 发送至用户的登录指令
                            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
                            await setCookiesAfterHumanOption(page); // 重新设置cookie
                        } else {
                            await delay(4000);
                        }
                    } else {
                        console.log('未获取到页面内容，请检查网络连接或页面是否正确加载。');
                    }
                } catch (e) {

                }
                const { title, content } = await getArticleTitleAndContent(article);
                const titleElementId = '#txtTitle';
                await page.waitForSelector(titleElementId, { timeout: 60000 });
                await page.type(titleElementId, title, { delay: 50 });
                await page.evaluate(async (_content) => {
                    const iframe = document.querySelector('iframe');
                    if (iframe) {
                        const contentDocument = await new Promise(resolve => {
                            const checkIframe = () => {
                                if (iframe.contentDocument) {
                                    resolve(iframe.contentDocument);
                                } else {
                                    setTimeout(checkIframe, 100);
                                }
                            };
                            checkIframe();
                        });

                        const body = contentDocument.body;
                        if (body) {
                            body.innerHTML = _content; // markdown 转html
                        }
                    }
                }, content);

                // 获取 class 是 tag__btn-tag active 的按钮（文本内容为“添加文章标签”）并点击
                await page.evaluate(() => {
                    const addButton = document.querySelector('.tag__btn-tag.active');
                    if (addButton) {
                        addButton.click();
                    }
                });

                // 获取 id 是 tab-11(人工智能) 的元素并点击
                await page.evaluate(() => {
                    const tabElement = document.getElementById('tab-11');
                    if (tabElement) {
                        tabElement.click();
                    }
                });

                // 获取 class 是 el-tag el-tag--light is-selected，内容是 “人工智能”的 span 标签并点击
                await page.evaluate(() => {
                    const aiTags = document.querySelectorAll('.el-tag.el-tag--light');
                    for (const tag of aiTags) {
                        if (tag.textContent.trim() === '人工智能') {
                            tag.click();
                            break;
                        }
                    }
                });

                // 监听保存草稿的响应获取草稿的id和访问地址
                page.on('response', async response => {
                    if (response.request().method() !== 'OPTIONS') { // 过滤预检请求
                        if (response.url().endsWith('saveArticle')) {
                            const responseText = await response.json();

                            if (responseText.code === 200) {
                                // const preview_url = responseText.data.url;
                                const articleId = responseText.data.article_id;
                                const url = `https://mp.csdn.net/mp_blog/creation/editor/${articleId}`
                                // 跳转到编辑页
                                global_resolve({ url });
                            }
                        }
                    }
                });

                // 点击保存草稿按钮
                await page.evaluate(() => {
                    const saveDraftButton = document.querySelector('.el-popover__reference');
                    if (saveDraftButton) {
                        saveDraftButton.click();
                    }
                });

            } catch (e) {
                console.log(e);
            }
        } catch (e) {
            global_reject(e);
        }
    })

}


async function invoke(article, headless = true) {
    const page = await init(headless);
    const response = { draftUrl: '', releaseUrl: '', message: '', success: true };
    try {
        const { url } = await publishDraft(page, article);
        response.draftUrl = url;
        if (headless) { // 以headless 作为生产环境的标识
            const releaseUrl = await publishOfficial(page, url);
            response.releaseUrl = releaseUrl;
        }
        response.message = '发布成功';

    } catch (e) {
        response.message = e.message;
        response.success = false;
    }
    if(browser) {
        await  browser.close();
     }
    return response;
}



module.exports = {
    invoke,
}