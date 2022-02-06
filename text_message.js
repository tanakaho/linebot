if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');
const dayjs = require('dayjs');
const fs = require('fs');

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
            // ファイル書き込み
            // fs.writeFileSync("startTimeSave.txt", startTime);
            // リクエストボディ
            var dataString = JSON.stringify({
                replyToken:replyToken,
                messages:[
                    {
                        "type": "text",
                        "text": "スタート(サンプルデータ)"
                    },
                    {
                        "type": "text",
                        "text": `開始時間:${startTime}`
                    }
                ]
            })
            var saveTime = dayjs(startTime).toString();
            fs.writeFileSync('hoge.txt',saveTime);
            break;
        case "ストップ":
            // スタートがあるかどうかのチェック
            // if(saveStartTime != null){
                // スタートがある場合
                var samplestartTime = dayjs('2022-02-05-11-30');
                samplestartTime = dayjs(samplestartTime).format('M月D日HH時mm分');
                var sampleEndTime = dayjs('2022-02-05-16-37');
                sampleEndTime = dayjs(sampleEndTime).format('M月D日HH時mm分');
                // 日時取得とフォーマット
                var endTime = req.body.events[0].timestamp;
                endTime = dayjs(endTime).format('M月D日HH時mm分');
                // スタートとストップの時間の差を割り出す
                var diffTime = dayjs(sampleEndTime).diff(samplestartTime);
                diffTime = dayjs(diffTime).format('M月D日HH時mm分');
                process.stdout.write(diffTime);
                // スタート初期化
                // var saveStartTime = null;
                // リクエストボディ
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `ストップしました${sampleEndTime}`
                        },
                        {
                            "type": "text",
                            "text": `かかった時間は${diffTime}です`
                        }
                    ]
                })
            // }else{
                // スタートがない場合
                // リクエストボディ
                // var dataString = JSON.stringify({
                //     replyToken:replyToken,
                //     messages:[
                //         {
                //             "type": "text",
                //             "text": "”スタート”が入力されていないようなので計測できませんでした"
                //         },
                //     ]
                // })
            // }
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