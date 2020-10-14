"use strict";
const request = require("request-promise");
const BigCommerce = require("node-bigcommerce");

const bigCommerce = new BigCommerce({
  logLevel: "info",
  clientId: process.env.BC_CLIENT,
  accessToken: process.env.BC_TOKEN,
  storeHash: process.env.STORE_HASH,
  responseType: "json",
  apiVersion: "v2"
});

async function getOrderData(orderDataId) {
  var orderData = await bigCommerce.get(`/orders/${orderDataId}`);
  console.log("orderData", orderData);
  return orderData;
}

module.exports.twilioManager = async event => {
  let returnValue = {
    statusCode: 500,
    body: JSON.stringify({
      status: 500,
      message: `Something went wrong.`
    })
  };
  let data = JSON.parse(event.body);
  console.log("getOrderDataProducts", data);

  //get order order data
    const orderData = await getOrderData(data.data.orderId);
    console.log("twilio", `https://bigcommerce-9819.twil.io/order_sms?number=${orderData.billing_address.phone}`)

    //then send phone numbner to twiliio like https://bigcommerce-9819.twil.io/order_ms?number=+315-224-6874
    //get phone number into right format
// https://bigcommerce-9819.twil.io/order_sms?number=315-224-6874
const options = {
  method: "GET",
  uri: `https://bigcommerce-9819.twil.io/order_sms?number=+1${orderData.billing_address.phone}`
  };
  var twilioSMS = await request(options);
  console.log("twilioSMS", twilioSMS);


    returnValue = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify("Texted the customer")
    };

  return returnValue;
};
