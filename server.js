const express = require('express');
const line = require('@line/bot-sdk');
const { append } = require('express/lib/response');

const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: process.env.CHANNEL_SECLET,
    channelAccessToken: process.env.CHANNEL_ACCSESS_TOKEN
};

const lineClient = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
        .all(req.body.events.map(handEvent))
        .then((result) => res.json(result))
        .catch((error) => {
            if(error.response) {
                console.log(error.response);
            }
            console.log("Problem submitting New Post: ", error);
        });
});

function handleEvent(event) {
    const replyToken = event.replyToken;
    if (replyToken === '00000000000000000000000000000000') {
        console.log('this request is connection check.');
        return {
            statusCode: 200,
        };
    }

    if (event.message.type === 'audio') {
        console.log("this is voice messege");
    } else {
        console.log("this is not voice messege");
    }
}