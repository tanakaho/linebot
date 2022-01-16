const express = require('express');
const app = express();
const line = require('@line/bot-sdk');
const { append } = require('express/lib/response');

const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: 'U58d9565fb4cfd70cdfdcc90d43d8fe95',
    channelAccessToken: 'QebSKgAi8ISn6lyVjPTTScx+2IdzOu5MnySD2nLfZCzPhMPqRE9zQyRrgfuIrH/x4DeSv0wgzZwfyUo/YT0k+Q3drcKQst2ps/9QQ8QnwdSXTmMujY9vWIRguDlwNYG7k45fEuMta8PPWjAOguq4NQdB04t89/1O/w1cDnyilFU='
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