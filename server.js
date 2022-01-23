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

app.get("/", (req, res) => {
    res.sendStatus(200)
})

app.post("/webhook", function(req, res) {
    res.send("HTTP POST request sent to the webhook URL!")
    if (validateSignature(req.headers['x-line-signature'], req.body) !== true) return
    switch(req.body.events[0].message.type){
        case "text":
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
            var audioData = fetchAudioMessage(req.body.events[0].message.id
                ).then(function (audioData) {
                    convert(audioData)
                        .then(function (audioBytes) {
                            return describe(audioBytes);
                        }).then(function (text) {
                            lineClient.replyMessage(req.body.events[0].replyToken, {
                                type: 'text',
                                text:text
                            });
                        });
                });
            function fetchAudioMessage(messageId){
                return new Promise((resolve, reject) => {
                    lineClient.getMessageContent(messageId).then((stream) => {
                        const content = [];
                        stream
                            .on('data', (chunk) => {
                                content.push(new Buffer(chunk));
                            })
                            .on('error', (err) => {
                                reject(err);
                            })
                            .on('end', function() {
                                resolve(Buffer.concat(content));
                            });
                    });
                });
            }
            function convert(audioData) {
                return new Promise((resolve, reject) => {
                    const decoder = new Fdkaac({
                        "output": "buffer",
                        "bitrate": 192
                    }).setBuffer(audioData);

                    decoder.decode()
                        .then(() => {
                            //Encoding finished
                            const buffer = decoder.getBuffer();
                            const audioBytes = buffer.toString('base64');
                            resolve(audioBytes);
                        })
                        .catch((error) => {
                            console.log("decode error:", error);
                        });
                });
            }
            const speech = require('@google-cloud/speech');
            const speechClient = new speech.SpeechClient();

            function describe(audioBytes) {
                return new Promise((resolve, reject) => {
                    const audio = {
                        content: audioBytes,
                    };
                    const config = {
                        encoding: 'LINEAR16',
                        sampleRateHertz: 16000,
                        languageCode: 'ja-JP',
                    };

                    speechClient
                        .recognize(Request)
                        .then(data => {
                            const response = data[0];
                            const transcription = response.results
                            .map(result => result.alternatives[0].transcript)
                            .join('\n');
                            resolve(transcription);
                        })
                        .catch(err => {
                            console.error('ERROR:',err);
                        });
                });
            }
            break;
    }
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

