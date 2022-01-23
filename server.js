if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');

// 署名検証
const crypto = require('crypto')
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
    switch(req.body.events[0].type){
        case "message":
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
            var dataString = JSON.stringify({
                replyToken:req.body.events[0].replyToken,
                messages: [
                    {
                        "type": "text",
                        "text": "Hello, user"
                    },
                    {
                        "type": "text",
                        "text": "this is audio"
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
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

