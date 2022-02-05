const line = require('@line/bot-sdk');

const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

exports.make_richmenu = function(){
    const richmenu = {
        "size": {
            "width": 2500,
            "height": 1686
        },
        "selected": false,
        "name": "stopwatch",
        "chatBarText": "Tap to open",
        "areas": [
            {
                "bounds": {
                    "x": 0,
                    "y": 0,
                    "width": 2500,
                    "height": 1686
                },
                "action": {
                    "type":"message",
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