## What does this application do?

The application is using BigCommerce webhooks to send Order data to a serverless function to trigger an SMS notification using Twilio functions.

## Contributing
George FitzGibbons (@gje4)

Uriel Reyes

### Running the project

To get started you will need to have a BigCommerce Store and a Twilio account with an SMS capable phone number.

You will need to have +v10 node.

You will need Serverless

```https://serverless.com/

In this example the serverless.yml is configured for AWS.
https://serverless.com/framework/docs/providers/aws/guide/installation/

You can easily update the yml for your desired FAAS providers
```

You will need to generate BigCommerce API keys, these keys need to have read permissions for orders.

In the serverless.yml file update the environment with your site API Keys

```
environment:
  STORE_HASH: {YOUR STORE HASH}
  BC_CLIENT: {BC CLIENT ID}
  BC_TOKEN: {BC TOKEN ID}

```
And your AWS Path:
```
 events:
      - http: https://ZZZZZ.execute-api.us-east-1.amazonaws.com/dev/bigcommerceTwilioSMS
          path: twilioManager
          method: post
          cors: true
```


Now in postman create the webhook to send order created to endpoints
https://developer.bigcommerce.com/api-docs/getting-started/webhooks/webhook-events#orders

```
curl --location --request POST 'https://api.bigcommerce.com/stores/{STORE HASH}/v2/hooks' \
--header 'X-Auth-Client: XXXXX' \
--header 'X-Auth-Token: YYYYYY' \
--data-raw '{
 "scope": "store/cart/converted",
 "destination": "https://ZZZZZ.execute-api.us-east-1.amazonaws.com/dev/bigcommerceTwilioSMS",
 "is_active": true
}'
```


### Twilio Setup
```
Setup a Twilio account and register for a phone number (free)
Setup a Twilio Service in the "Functions" section of Twilio
Add a function to the Twilio Service 
Set the "Function" to "public"
```

### Twilio Function Code
```

// This is your new function. To start, set the name and path on the left.

exports.handler = function(context, event, callback) {
  
  const twilioClient = context.getTwilioClient();

  //This is where the webhook is going to send the event data
  console.log('BigCommerce OrderID: ', context);
  console.log('Event', event);
  
  //Make this your Twilio, SMS capable, phone number
   let from = '+19285638218';
  // If passing in To, make sure to validate, to avoid sending SMS to unexpected locations, also replace with your number
  let to = event.number || '+12813308004';
  let body = 'Thanks for your order!';
  twilioClient.messages
    .create({
      body: body,
      to: to,
      from: from,
    })
    .then((message) => {
      console.log('SMS successfully sent');
      console.log(message.sid);
      return callback(null, 'success');
    })
    .catch((error) => {
      console.log(error);
      return callback(error);
    });
};
```
