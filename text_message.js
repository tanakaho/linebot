const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');
const dayjs = require('dayjs');

const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

const config = {
    channelSecret:process.env.CHANNEL_SECLET,
    channelAccessToken:process.env.CHANNEL_ACCSESS_TOKEN
};

exports.textMessage = function(req,res){
    var replyToken = req.body.events[0].replyToken;
    switch(req.body.events[0].message.text){
        case "スタート":
            var startTime = req.body.events[0].timestamp;
            startTime = dayjs(startTime).format('YYYY-MM-DD-HH時mm分');
            
            var dataString = JSON.stringify({
                replyToken:replyToken,
                messages:[
                    {
                        "type": "text",
                        "text": `${startTime}`
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
    }
}