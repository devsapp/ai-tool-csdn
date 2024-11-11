const express = require('express');
const bodyParser = require('body-parser');
const { invoke } = require('./csdn');

const app = express();


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.raw());

app.use('/', (req, res, next) => {
    if (req.method === 'POST') {
        req.url = '/invoke';
        next();
    } else {
        next();
    }
});

// 针对sdk 调用
app.post('/invoke', async (req, res) => {
    let bodyData = req.body.toString();
    let article_url = '';
    let article_content = '';
    let article_title = ''
    try {
        let article = JSON.parse(bodyData);
        article_url = article.article_url;
        article_content = article.article_content;
        article_title = article.article_title;
    } catch (e) {
        try {
            article_url = req.body.article_url;
            article_content = req.body.article_content;
            article_title = req.body.title;
        } catch (e) {
            console.log(e);
        }
    }
    if (!article_url && !article_content) {
        res.send('输入原文章信息');
        return;
    }
    const result = await invoke({ article_url, article_content, article_title });
    res.json(result);
})


app.listen(9000, () => {
    console.log('start success.');
}).on('error', (e) => {
    console.error(e.code, e.message)
})