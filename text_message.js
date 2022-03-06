if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const https = require("https")
const express = require("express")
const line = require('@line/bot-sdk');
const dayjs = require('dayjs');
const fs = require('fs');
const client = require('pg/lib/native/client');

const TOKEN = process.env.CHANNEL_ACCSESS_TOKEN

const config = {
    channelSecret:process.env.CHANNEL_SECLET,
    channelAccessToken:process.env.CHANNEL_ACCSESS_TOKEN
};

// データベース接続
const { Client } = require('pg');

    const db_client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });

    db_client.connect();


exports.textMessage = function(req,res){
    var replyToken = req.body.events[0].replyToken;
    var text_message = req.body.events[0].message.text;

    db_client.query(`SELECT gtext_name FROM get_text_messages where gtext_name = "${ text_message }";`, (err, res) => {
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
            process.stdout.write(JSON.stringify(row));

            var getMessage = JSON.stringify(row);
            var dataString = JSON.stringify({
                replyToken:replyToken,
                messages:[
                    {
                        "type": "text",
                        "text":`${getMessage}`
                    }
                ]
            });

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
        db_client.end();
    });
    }
