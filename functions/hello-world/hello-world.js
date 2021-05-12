// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event, context) => {
  try {
    const subject = event.queryStringParameters.name || 'World';
    let mode = event.queryStringParameters['hub.mode'];
    let token = event.queryStringParameters['hub.verify_token'];
    let challenge = event.queryStringParameters['hub.challenge'];
    if (mode === 'subscribe' && token === 'hello@328adasdasdadadad') {
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
      return {
        statusCode: 200,
        body: JSON.stringify(challenge),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ messenger: 'this is default ' }),
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

// app.get('/webhook', (req, res) => {
//   // Your verify token. Should be a random string.
//   let VERIFY_TOKEN = '<YOUR_VERIFY_TOKEN>';

//   // Parse the query params
//   let mode = req.query['hub.mode'];
//   let token = req.query['hub.verify_token'];
//   let challenge = req.query['hub.challenge'];

//   // Checks if a token and mode is in the query string of the request
//   if (mode && token) {
//     // Checks the mode and token sent is correct
//     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
//       // Responds with the challenge token from the request
//       console.log('WEBHOOK_VERIFIED');
//       res.status(200).send(challenge);
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);
//     }
//   }
// });
