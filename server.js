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

exports.getdata = app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/webhook", function(req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    if (validateSignature(req.headers['x-line-signature'], req.body) !== true) return
    switch(req.body.events[0].message.type){
        case "text":
            var export_textMessage = require('./text_message');
            export_textMessage.textMessage(req,res);
            break;
        
        case "audio":
            var export_voiceText = require('./voice_text');
            export_voiceText.voiceText(req,res);
            // Speech-to-Text API
            // ライブラリ達
            break;
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

