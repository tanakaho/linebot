const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');
const dayjs = require('dayjs');
const fs = require("fs");

const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

const config = {
    channelSecret:process.env.CHANNEL_SECLET,
    channelAccessToken:process.env.CHANNEL_ACCSESS_TOKEN
};

exports.textMessage = function(req,res){
    var replyToken = req.body.events[0].replyToken;
    switch(req.body.events[0].message.text){
        case "スタート":
            // 日時取得とフォーマット
            var startTime = req.body.events[0].timestamp;
            startTime = dayjs(startTime).format('M月D日HH時mm分');
            // リクエストボディ
            var dataString = JSON.stringify({
                replyToken:replyToken,
                messages:[
                    {
                        "type": "text",
                        "text": "スタート"
                    },
                    {
                        "type": "text",
                        "text": `開始時間${startTime}`
                    }
                ]
            })
            // ファイル書き込み
            fs.writeFileSync("startTimeSave.txt", startTime);
            break;
        case "ストップ":
            // スタートがあるかどうかのチェック
            if(saveStartTime != null){
                process.stdin.write(`saveStartTime:${saveStartTime}`);
                // スタートがある場合
                // 日時取得とフォーマット
                var endTime = req.body.events[0].timestamp;
                endTime = dayjs(endTime).format('M月D日HH時mm分');
                // スタートとストップの時間の差を割り出す
                var diffTime = endTime.diff(saveStartTime);
                diffTime = dayjs(diffTime).format('M月D日HH時mm分');
                // スタート初期化
                var saveStartTime = null;
                // リクエストボディ
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": "ストップしました"
                        },
                        {
                            "type": "text",
                            "text": `かかった時間は${diffTime}です`
                        }
                    ]
                })
            }else{
                // スタートがない場合
                // リクエストボディ
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": "”スタート”が入力されていないようなので計測できませんでした"
                        },
                    ]
                })
            }
            break;
    }
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