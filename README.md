## What does this application do?

The application is using BigCommerce webhooks to send Order data to a serverless function to trigger an SMS notification using Twilio functions.

## Contributing
George FitzGibbons

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


### TODO
```
Setup a Twilio account and register for a phone number
```
