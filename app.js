require('dotenv').config();
const PAGE_ACCESS_TOKEN = {
  573537602700846:process.env.PAGE_ACCESS_TOKEN_573537602700846, // Moon Hàng Mỹ
  949373165137938:process.env.PAGE_ACCESS_TOKEN_949373165137938 // Rôm Rốp
};
const BADGE_IMAGE_URL=process.env.BADGE_IMAGE_URL;
const BOT_VERIFY_TOKEN= process.env.BOT_VERIFY_TOKEN;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

const DiscordLogger = require('discord-logger');
const options = {
  endpoint: DISCORD_WEBHOOK,
  botUsername: 'Logger'
} 
const logger = new DiscordLogger(options);

const Website = require("./core/moon.js").Website;
// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 3000, () => console.log("webhook is listening"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", (req, res) => {
  // Parse the request body from the POST
  let body = req.body;
  // Check the webhook event is from a Page subscription
  if (body.object === "page") {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach((entry)=> {
      // Get the webhook event. entry.messaging is an array, but
      // will only ever contain one event, so we get index 0
      let webhook_event = entry.messaging[0];

      // Lấy Page ID của page nhận msg
      let page_id= entry.id;

      // Lấy Sender ID
      let sender_psid = webhook_event.sender.id;

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(page_id, sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(page_id, sender_psid, webhook_event.postback);
      }
    });

    // Return a '200 OK' response to all events
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint
app.get("/webhook", (req, res) => {

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === BOT_VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Handles messages events
async function handleMessage(page_id, sender_psid, received_message) { 
  // Check if the message contains text
  if (received_message.text) {
    var website= new Website(received_message.text);
    // Nếu có trong list website thì mới trả lời
    if (website.found === true){      
      var item = await Website.getItem(website);
      var log=item.toLog();
      if (log.type==="error") logger.error(log.content);
      else logger.success(log.content);
      // Nếu ko lấy được giá thì có thể là 3rd Seller (Amazon)
      if (item.price.value==0 && item.redirect!==""){
        website= new Website(item.redirect);
        item = await Website.getItem(website,item);
        var log=item.toLog();
        if (log.type==="error") logger.error(log.content);
        else logger.success(log.content);
      }
      if (website.att.SILENCE===false || (website.att.SILENCE === true && item.total>0))
        callSendAPI(page_id, sender_psid, item.toFBResponse(BADGE_IMAGE_URL));
    }
    else if (["help","menu","list"].includes(received_message.text)){
      let response = { "text": "Moon hỗ trợ báo giá các web sau: " + Website.getAvailableWebsite() }
      callSendAPI(page_id, sender_psid, response);
    }
  }
  
}

// Handles messaging_postbacks events
function handlePostback(page_id, sender_psid, received_postback) {
  let response;
  
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'chat') {
    response = { "text": "[Auto] Vui lòng chờ giây lát, nhân viên Moon sẽ liên hệ lại ngay" }
  } 
  // Send the message to acknowledge the postback
  callSendAPI(page_id, sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(page_id, sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN[page_id] },
      method: "POST",
      json: request_body
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

// For Test only

async function testurl() {
  var url="https://www.jomashop.com/costa-del-mar-sunglasses-lr-64-ogp.html";
  url="https://www.amazon.com/Anker-Qi-Certified-Compatible-Fast-Charging-PowerWave/dp/B07DBXZZN3/ref=br_msw_pdt-6?_encoding=UTF8&smid=A294P4X9EWVXLJ&pf_rd_m=ATVPDKIKX0DER&pf_rd_s=&pf_rd_r=RJ1MJ4F47B2HVXEMH96Q&pf_rd_t=36701&pf_rd_p=28ea8511-ea82-4cfd-a17d-cb45137bb8ed&pf_rd_i=desktop";
  var website= new Website(url);
    // Nếu có trong list website thì mới trả lời
    if (website.found === true){      
      var item = await Website.getItem(website);
      var log=item.toLog();
      if (log.type==="error") logger.error(log.content);
      else logger.success(log.content);
      // Nếu ko lấy được giá thì có thể là 3rd Seller (Amazon)
      if (item.price.value==0 && item.redirect!==""){
        website= new Website(item.redirect);
        item = await Website.getItem(website,item);
        var log=item.toLog();
        if (log.type==="error") logger.error(log.content);
        else logger.success(log.content);
      }
    }
}
//testurl();