const PAGE_ACCESS_TOKEN = {
  573537602700846:process.env.PAGE_ACCESS_TOKEN_573537602700846, // Moon Hàng Mỹ
  949373165137938:process.env.PAGE_ACCESS_TOKEN_949373165137938 // Rôm Rốp
};
const BOT_VERIFY_TOKEN= process.env.BOT_VERIFY_TOKEN;
const Website = require("./core/moon.js").Website;
const Item = require("./core/moon.js").Item;
const logger = require('./core/logger.js').logger;
// Imports dependencies and set up http server
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

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
function handleMessage(page_id, sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {
    var website= new Website(received_message.text);
    // Nếu có trong list website thì mới trả lời
    if (website.found === true){      
      var requestOptions = {
        method: "GET",
        url: website.url,
        gzip: true
      };
      request(requestOptions, function(error, response, body) {
        // Đưa html raw vào website
        website.setHtmlRaw(body);
        var item = new Item(website);   

        // Log to file
        var logtype='info';
        if (item.weight.value===0 || item.category.ID === "UNKNOWN") {logtype='error';}
        logger.log(logtype,'{\n"URL":"%s",\n"PRICE":"%s",\n"SHIPPING":"%s",\n"WEIGHT":"%s",\n"CATEGORY":"%s",\n"TOTAL":"%s",\n"CATEGORYSTRING":"%s"\n}', website.url, item.price.string, item.shipping.string,item.weight.current,item.category.att.ID,item.totalString,item.category.string);

        response=item.toFBResponse();
        callSendAPI(page_id, sender_psid, response);
      });           
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

// function testurl() {
//   var url="https://www.amazon.com/%F0%9F%8D%92Jonerytime%F0%9F%8D%92Eye-Padded-Travel-Sleeping-Blindfold/dp/B07JNMGJS8/ref=bbp_bb_9ea285_st_9gcl_w_62?psc=1&smid=A1XSX0P82J8LUG&fbclid=IwAR08HFMeIcOaANSIgZ9GlwH_MEj2KzcxypE5isoYnhW4k0RjvE1bgrYv1GY";
//   var website= new Website(url);
//     if (website.name!==null){      
//       var requestOptions = {
//         method: "GET",
//         url: website.url,
//         gzip: true
//       };
//       request(requestOptions, function(error, response, body) {
//         website.setHtmlRaw(body);
//         var item = new Item(website);
//         console.log('{\n"URL":"%s",\n"PRICE":"%s",\n"SHIPPING":"%s",\n"WEIGHT":"%s",\n"CATEGORY":"%s",\n"TOTAL":"%s",\n"CATEGORYSTRING":"%s"\n}', website.url, item.price.string, item.shipping.string,item.weight.current,item.category.att.ID,item.totalString,item.category.string);
//       });           
//     }
// }
//testurl();