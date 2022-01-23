// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// };

const line = require('@line/bot-sdk');
const express = require('express');

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
const express = require('express');
function validateSignature(signature, body) {
    const LINE_CHANNEL_SECRET = process.env.CHANNEL_SECLET
    return signature == crypto.createHmac('sha256', LINE_CHANNEL_SECRET).update(Buffer.from(JSON.stringify(body))).digest('base64')
}

// Expressアプリを生成
const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
    if (validateSignature(req.headers['x-line-signature'], req.body) !== true) return
    const events = req.body.events;
    Promise.all(events.map((event) => {
        // イベント1件を処理する・エラー時も例外を伝播しないようにしておく
        return handleEvent(event).catch(() => { return null; });
    })
        .then((result) => {
            // 全てのイベントの処理が終わったら LINE API サーバには 200 を返す
            res.status(200).json({}).end();
        })
)});


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
