if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const line = require('@line/bot-sdk');
const express = require('express')

// 環境変数
const config = {
    channelAccessToken: process.env.CHANNEL_ACCSESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECLET,
    };

// LINEクライアントを生成
const client = new line.Client(config);

// const https = require('https')

//署名検証
const crypto = require('crypto');
function validateSignature(signature, body) {
    const LINE_CHANNEL_SECRET = process.env.CHANNEL_SECLET
    return signature == crypto.createHmac('sha256', LINE_CHANNEL_SECRET).update(Buffer.from(JSON.stringify(body))).digest('base64')
}

// Expressアプリを生成
const app = express()

app.post('/callback', line.middleware(config), (req, res) => {
    // if (validateSignature(req.headers['x-line-signature'], req.body) !== true) return
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// イベントハンドラー
function handleEvent(event){
    if (event.type !== 'message' || event.messages.type !== 'text') {
        // メッセージイベントではない場合、テキスト以外のメッセージの場合は何もしない
        return Promise.resolve(null);
    }

    // 返信用メッセージを作成
    const echo = { type: 'text', text: event.messages.text };

    // ReplyAPIを利用してリプライ
    return client.replyMessage(event.replyToken, echo);
}

// サーバー起動
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
