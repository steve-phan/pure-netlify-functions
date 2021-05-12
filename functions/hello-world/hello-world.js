// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
require('dotenv').config();
const handler = async (event, context) => {
  let VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
  try {
    const subject = event.queryStringParameters.name || 'World';
    let mode = event.queryStringParameters['hub.mode'];
    let token = event.queryStringParameters['hub.verify_token'];
    let challenge = event.queryStringParameters['hub.challenge'];
    let response;
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      // res.status(200).send(challenge);
      response = {
        statusCode: 200,
        body: challenge,
      };
    }
    let body = JSON.parse(event.body);
    console.log(body);

    console.log(typeof body);

    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
      // console.log('we have body');
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Get the webhook event. entry.messaging is an array, but
        // will only ever contain one event, so we get index 0

        let webhook_event = entry.messaging[0];
        // console.log(webhook_event);

        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        // console.log('Sender PSID: ' + sender_psid);
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
      });
      return {
        statusCode: 200,
        body: 'EVENT_RECEIVED',
      };
      // Return a '200 OK' response to all events
      // res.status(200).send('EVENT_RECEIVED');
    }
    return response;
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ messenger: 'this is default ' }),
    // };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

function handleMessage(sender_psid, received_message) {
  console.log('i am sending back messeage hehe');
  let response;
  console.log('message nhan duoc, ', received_message.text);
  console.log('the loai ', typeof received_message.text);

  // Check if the message contains text
  if (!!received_message.text && received_message.text.includes('iphone')) {
    response = {
      text: `o mai got hey hey i have not iphone`,
    };
  } else {
    // Create the payload for a basic text message
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an image!`,
    };
  }

  // Sends the response message
  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { text: 'Thanks!' };
  } else if (payload === 'no') {
    response = { text: 'Oops, try sending another image.' };
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  console.log('starting ...send http request ....');
  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: 'https://graph.facebook.com/v7.0/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log('message sent!');
      } else {
        console.error('Unable to send message:' + err);
      }
    }
  );
}
