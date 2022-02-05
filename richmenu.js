const line = require('@line/bot-sdk');

const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

exports.make_richmenu = function(){
    const richmenu = {
        "size": {
            "width": 1040,
            "height": 1040
        },
        "selected": true,
        "name": "ue",
        "chatBarText": "Tap to open",
        "areas": [
            {
                // スタート
                "bounds": {
                    "x": 0,
                    "y": 521,
                    "width": 520,
                    "height": 520
                },
                "action": {
                    "type": "message",
                    "text": "こんにちは"
                }
            },
            {
                // 合計金額
                "bounds": {
                    "x": 522,
                    "y": 521,
                    "width": 518,
                    "height": 520
                },
                "action": {
                    "type": "camera",
                    "label":"Camera"
                }
            },
            {
                // 買い物リスト
                "bounds": {
                    "x": 522,
                    "y": 0,
                    "width": 518,
                    "height": 520
                },
                "action": {
                    "type": "uri",
                    "uri": "https://developers.line.biz/"
                }
            },
            {
                // リセット
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 520,
                    "height": 520
                },
                "action": {
                    "type": "uri",
                    "uri": "https://www.hal.ac.jp/nagoya"
                }
            }
        ]
    };

    var headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + TOKEN
    }
    var webhookOptions = {
        "hostname": "api.line.me",
        "path": `/v2/bot/richmenu`,
        "method": "POST",
        "headers": headers,
        "body": richmenu
    }

    var request = https.request(webhookOptions, (res) => {
        res.on("data", (d) => {
            process.stdout.write(d);
        })
    })
    request.on("error", (err) => {
        process.stdout.write(`richmanuErrer:${err}`)
    })
    request.end()
}