const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');

const app = express()
const PORT = process.env.PORT || 3000
const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

const config = {
    channelSecret:process.env.CHANNEL_SECLET,
    channelAccessToken:process.env.CHANNEL_ACCSESS_TOKEN
};

const lineClient = new line.Client(config);

// var server = require('./server');
// app.get('/', server.getdata);

exports.voiceText = function(req,res){
    var replyToken = req.body.events[0].replyToken;
    var messageId = req.body.events[0].message.id;

    // 音声データ(コンテンツ)取得(バイナリデータ)
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
            var export_gcpSpeechText = require('./gcp_speechtext');
            export_gcpSpeechText.gcp_speechText(d);
        })
    })
    request.on("error", (err) => {
        process.stdout.write(`voiceTextErrer:${err}`)
    })
    request.end()
    // process.stdout.write(`messageID:${d}`);
}