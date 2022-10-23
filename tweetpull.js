import { Client } from "twitter-api-sdk";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
var username = "username";
var twitter_url = "https://twitter.com/"
var user_url = "https://twitter.com/"
var author_name = "author_name";
var tweet_text = "tweet_text";


// FIND TWEET BY ID
async function findTweetbyID(tweetID) {
    const client = new Client(process.env.TW_BEARER);
      const response = await client.tweets.findTweetsById({
        "ids": [
            tweetID
        ],

        "tweet.fields": [
            "author_id",
            "conversation_id",
            "created_at",
            "id",
            "in_reply_to_user_id",
            "possibly_sensitive",
            "text",
            "withheld"
        ],
        
        "expansions": [
            "attachments.media_keys",
            "attachments.poll_ids",
            "author_id",
            "entities.mentions.username",
            "in_reply_to_user_id",
            "referenced_tweets.id",
            "referenced_tweets.id.author_id"
        ],

        "media.fields": [
            "height",
            "media_key",
            "preview_image_url",
            "type",
            "url",
            "width"
        ],
        "poll.fields": [
            "end_datetime",
            "id",
            "options",
            "voting_status"
        ],
        "user.fields": [
            "id",
            "name",
            "profile_image_url",  // this produces a link in the form: https://pbs.twimg.com/profile_images/19_DIGIT_NUMBER/8_(NON)CAPS_LETTERS_normal.jpg but I would like it to be this, but ending _400x400.jpg... might not be worth the effort
            "protected",
            "url",
            "username",
            "withheld"
        ]
      });
    
    console.log(response);
    console.log("response", JSON.stringify(response, null, 2));
    tweet_text = response.data.text;
    //console.log(tweet_text); // RETURNS undefined, not expected. '@culture3xyz Hello friends 👋 https://t.co/eKb5XLqQaM' was expected
    }
    
findTweetbyID("1576895984373993472");

// FIND USER BY ID
async function findUserbyID(userID) {
    const client = new Client(process.env.TW_BEARER);
       const response = await client.users.findUserById(userID, );
    //console.log(response);
    username = response.data.username;
    author_name = response.data.name;
    //console.log(username); // RETURNS 'bassil_taleb', as expected
}


//findUserbyID("285327473");



import { addItem } from "./index.js";
findUserbyID("285327473").then(() => {
    username = username;
    user_url = twitter_url+username
    author_name = author_name;
    
    //addItem("IMPORTED", "Tag1", "Tag2", author_name, user_url, "Tweet", 1, "2022-10-03");
})


