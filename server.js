if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');

// 署名検証
const crypto = require('crypto');
const { resolve } = require('path');
const { rejects } = require('assert');
const { Fdkaac } = require('node-fdkaac');
function validateSignature(signature, body) {
    const LINE_CHANNEL_SECRET = process.env.CHANNEL_SECLET
    return signature == crypto.createHmac('sha256', LINE_CHANNEL_SECRET).update(Buffer.from(JSON.stringify(body))).digest('base64')
}

const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

const config = {
    channelSecret:process.env.CHANNEL_SECLET,
    channelAccessToken:process.env.CHANNEL_ACCSESS_TOKEN
};

const lineClient = new line.Client(config);

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/webhook", function(req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    if (validateSignature(req.headers['x-line-signature'], req.body) !== true) return
    switch(req.body.events[0].message.type){
        case "text":
            process.stdout.write(req.body.events[0].replyToken);
        var dataString = JSON.stringify({
            replyToken:req.body.events[0].replyToken,
            messages: [
                {
                    "type": "text",
                    "text": "Hello, user"
                },
                {
                    "type": "text",
                    "text": "May I help you?"
                }
            ]
        })

        var headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        }

        var webhookOptions = {
            "hostname": "api.line.me",
            "path": "/v2/bot/message/reply",
            "method": "POST",
            "headers": headers,
            "body": dataString
        }

        var request = https.request(webhookOptions, (res) => {
            res.on("data", (d) => {
                process.stdout.write(d)
            })
        })

        request.on("error", (err) => {
            console.error(err)
        })

        request.write(dataString)
        request.end()
        break;
        
        case "audio":
            var replyToken = req.body.events[0].replyToken;
            var messageId = req.body.events[0].message.id;
            // 音声取得
            var headers = {
                "Authorization": "Bearer " + TOKEN
            }
            var webhookOptions = {
                "hostname": "api-data.line.me",
                "path": `/v2/bot/message/${messageId}/content`,
                "method": "GET",
                "headers": headers,
            }
            var request = https.request(webhookOptions, (res) => {
                res.on("data", (d) => {
                    process.stdout.write(d)
                })
            })
            console.log(process.stdout.write(d));
            request.on("error", (err) => {
                console.error(err)
            })
            request.end()
            
            // const speech = require('@google-cloud/speech');
            // const speechClient = new speech.SpeechClient();
            break;
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

