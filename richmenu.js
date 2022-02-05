const line = require('@line/bot-sdk');

const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

exports.make_richmenu = function(){
    const richmenu = {
        "size": {
            "width": 2500,
            "height": 1686
        },
        "selected": true,
        "name": "ue",
        "chatBarText": "Tap to open",
        "areas": [
            {
                // リセット
                "bounds": {
                    "x": 0,
                    "y": 843,
                    "width": 1250,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "label": "",
                    "text": "こんにちは"
                }
            },
            {
                // 買い物リスト
                "bounds": {
                    "x": 1250,
                    "y": 843,
                    "width": 1250,
                    "height": 843
                },
                "action": {
                    "type": "uri",
                    "label":"買い物リスト",
                    "uri": "https://line.me/R/nv/camera/"
                }
            },
            {
                // カメラ電卓
                "bounds": {
                    "x": 1250,
                    "y": 0,
                    "width": 1250,
                    "height": 843
                },
                "action": {
                    "type": "uri",
                    "label":"カメラ電卓",
                    "uri": "https://line.me/R/nv/camera/"
                }
            },
            {
                //スタート・ストップ
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 1250,
                    "height": 843
                },
                "action": {
                    "type": "message",
                    "lebel": "ストップウォッチ",
                    "text": "スタート"
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

