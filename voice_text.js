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

exports.voiceText = function(req){
    var replyToken = req.body.events[0].replyToken;
    var messageId = req.body.events[0].message.id;
    process.stdout.write(`messageID:${messageId}`);
}