import { Client } from "twitter-api-sdk";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const client = new Client({
  consumer_key: process.env.TW_API_KEY,
  consumer_secret: process.env.TW_API_SECRET,
  access_token_key: process.env.TW_ACCESS_TOKEN,
  access_token_secret: process.env.TW_ACCESS_TOKEN_SECRET
});
/*
- we receive a CRC when: a webhook URL is registered, hourly to validate the webhook URL, and manually by making a PUT request with the webhook id
- When a CRC is sent, Twitter will make a GET request of your web app with a crc_token parameter
- When received, webapp needs to build an encrypted response_token based on the crc_token parameter and the Consumer Secret
- response_token must be generated in JSON 
- when successful, a webhook ID will be returned
https://developer.twitter.com/en/docs/twitter-api/enterprise/account-activity-api/guides/getting-started-with-webhooks
https://developer.twitter.com/en/docs/twitter-api/enterprise/account-activity-api/guides/securing-webhooks
https://github.com/twitterdev/Twitter-API-v2-sample-code
https://hevodata.com/learn/twitter-webhook/
https://www.wix.com/velo/reference/wix-http-functions/post
https://www.wix.com/velo/reference/wix-http-functions/wixhttpfunctionresponse
*/

import crypto from "crypto";

function createCrcResponseToken(crcToken) {
  const hmac = crypto
    .createHmac("sha256", process.env.consumer_secret)
    .update(crcToken)
    .digest("base64");
  return `sha256=${hmac}`;
}

function getHandler(req, res) {
  const crcToken = req.query.crc_token;
  if (crcToken) {
    res.status(200).send({
      response_token: createCrcResponseToken(crcToken)
    });
  } else {
    res.status(400).send({
      message: "Error: crc_token missing from request."
    });
  }
}

function postHandler(req, res) {
  const body = req.body;
  console.log(body);
  res.status(200).json(body);
}

export default (req, res) => {
  try {
    switch (req.method) {
      case "GET":
        return getHandler(req, res);
      case "POST":
        return postHandler(req, res);
      default:
        return res.status(410).json({ message: "Unsupported Request Method" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send();
  }
};