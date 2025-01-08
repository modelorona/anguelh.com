---
title: Simple Firebase function to keep a Heroku dyno alive
pubDate: 2020-10-11T14:52:47.813Z
description: In this post, I show a very simple Firebase function that can keep
  a Heroku free server online.
---

Recently I decided to take some time off and create a very simple Discord bot. The bot would have the task of playing an audio file at random in whatever voice channel I am in. This was accomplished rather quickly with the [discord.js](https://discord.js.org/#/) library, and I started looking at how to host it.

After some research I decided on [Heroku](https://www.heroku.com/), as I had never used it before. Their free server offering captured my attention, and I figured I could get it running continuously. The problem was that Heroku would put my server to sleep after 30 minutes of inactivity, and I did not expect the bot to be used so often.

The solution to this was to create a very simple [Firebase Function](https://firebase.google.com/products/functions) that would send a request to the server every 28 minutes, thus keeping it alive.

The function is as follows:

```javascript
"use strict";

const functions = require("firebase-functions");
const https = require("https");

exports.wakeUpHeroku = functions
  .region("europe-west2")
  .pubsub.schedule("every 28 minutes")
  .timeZone("Europe/London")
  .onRun(async _ => {
    sendReq();
    return null;
  });

async function sendReq() {
  https.get(process.env.BOT_URL, res => {
    res.on("done", console.log);
  });
}
```

The function above is created in the European region, in the London timezone, and is set to run every 28 minutes using [Google Pub/Sub](https://cloud.google.com/pubsub/docs/overview). When it runs, it sends a simple request to the bot URL, and finishes.
