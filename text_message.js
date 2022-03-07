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
            startTime = dayjs(startTime).format('M月D日HH時mm分ss秒');
            // ファイル書き込み
            // fs.writeFileSync("startTimeSave.txt", startTime);
            // リクエストボディ
            var dataString = JSON.stringify({
                replyToken:replyToken,
                messages:[
                    {
                        "type": "text",
                        "text": `スタート(サンプルデータ)\n開始時間:${startTime}`
                    },
                ]
            })
            // var saveTime = dayjs(startTime).toString();
            // fs.writeFileSync('hoge.txt',saveTime);
            break;
        case "ストップ":
            // スタートがあるかどうかのチェック
            // if(saveStartTime != null){
                // スタートがある場合
                var samplestartTime = req.body.events[0].timestamp;
                samplestartTime = dayjs(samplestartTime).subtract(10, 'second');
                // 日時取得とフォーマット
                var endTime = req.body.events[0].timestamp;
                endTime = dayjs(endTime);
                var endTime_f = dayjs(endTime).format('M月D日HH時mm分ss秒');
                // スタートとストップの時間の差を割り出す
                var diffTime = dayjs(dayjs(endTime)).diff(dayjs(samplestartTime));
                diffTime = dayjs(diffTime).format('mm分ss秒');
                // スタート初期化
                // var saveStartTime = null;
                // リクエストボディ
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `ストップしました\n${endTime_f}`
                        },
                        {
                            "type": "text",
                            "text": `かかった時間は\n${diffTime}`
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
            case "月曜日":
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `起きる時間：9時00分\n家出る時間：13時00分\n電車：13時43分5番線`
                        },
                        {
                            "type": "text",
                            "text": "やること\n・洗濯\n・IH31の授業\n・IPの授業"
                        }
                    ]
                });
            break;
            case "火曜日":
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `起きる時間：9時00分\n家出る時間：11時30分\n電車：11時58分5番線`
                        },
                    ]
                });
            break;
            case "水曜日":
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `起きる時間：8時00分\nバイトだよ`
                        },
                    ]
                });
            break;
            case "木曜日":
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `起きる時間：9時00分\n家出る時間：16時30分\n電車：16時58分5番線\nバイトだよ`
                        },
                    ]
                });
            break;
                case "金曜日":
                var dataString = JSON.stringify({
                    replyToken:replyToken,
                    messages:[
                        {
                            "type": "text",
                            "text": `起きる時間：6時30分\n家出る時間：8時00分\n電車：8時44分1番線`
                        },
                    ]
                });
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