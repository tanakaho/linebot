const line = require('@line/bot-sdk');

const client = new line.Client({
    channelAccessToken:process.env.CHANNEL_ACCSESS_TOKEN
});

const richmenu = {
};

client.createRichMenu(richmenu)
    .then((richmenuId) => 
    console.log(richmenuId))