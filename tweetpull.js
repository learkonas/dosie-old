import { Client } from "twitter-api-sdk";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { addItem } from "./index.js";

const TWEET_ID = "1576895984373993472";  // this is the crucial tweet ID that determines everything else

var tweet_author_username = "tweet_author_username";
var twitter_url = "https://twitter.com/"
var tweet_author_url = "https://twitter.com/"
var tweet_address_url = "https://twitter.com/i/status/"
var author_name = "author_name";
var tweet_text = "tweet_text";
var tweet_created = "tweet_created";
var tweet_author_id = "tweet_author_id";
var tweet_replying_to = "tweet_replying_to";
var tweet_author_pfp_url = "tweet_author_pfp_url";


// FIND TWEET BY ID
async function findTweetbyID(tweetID) {
    const client = new Client(process.env.TW_BEARER);
      const tweet_response = await client.tweets.findTweetsById({
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
    //console.log(tweet_response);
    //console.log(JSON.stringify(tweet_response, null, 2))
    tweet_text = tweet_response.data[0].text;
    tweet_created = tweet_response.data[0].created_at;
    tweet_author_id = tweet_response.data[0].author_id;
    tweet_replying_to = tweet_response.data[0].in_reply_to_user_id;
    tweet_author_pfp_url = tweet_response.includes.users[0].profile_image_url;

    // scaling up the profile image from _normal to _400x400
    if (tweet_author_pfp_url.endsWith("normal.jpg")) {
        tweet_author_pfp_url = tweet_author_pfp_url.substring(0, tweet_author_pfp_url.length - 10);
        tweet_author_pfp_url = tweet_author_pfp_url.concat("400x400.jpg");
    }
}
    
// FIND USER BY ID
async function findUserbyID(userID) {
    const client = new Client(process.env.TW_BEARER);
       const user_response = await client.users.findUserById(userID, );
    tweet_author_username = user_response.data.username;
    author_name = user_response.data.name;
    tweet_author_url = twitter_url+tweet_author_username
}


findTweetbyID(TWEET_ID).then(() => {
    findUserbyID(tweet_author_id).then(() => {
        tweet_author_username = tweet_author_username;
        tweet_author_url = twitter_url+tweet_author_username
        author_name = author_name;

        tweet_address_url = tweet_address_url+TWEET_ID;

        // removing reply-to tags from the start of a tweet. E.g if someone replies to a tweet, it comes up something like "@replied_to_account hello Replied To Account, I am replying to your tweet"
        while (tweet_text.startsWith("@")) {    // trigger this while the tweet_text begins with @ 
            let replied_to_username_length = tweet_text.indexOf(" ") + 1;  //find after how many characters the username ends, leading to a " ". If @replied_to_account, then we get 18 + 1 = 19
            tweet_text = tweet_text.substring(replied_to_username_length); //removes the first 19 characters from the reply, leaving us with "hello Replied To Account..."       We then search to see if there is another replied-to account as well. If not, we move on
        }       

        addItem(tweet_text, "Tag1", "Tag2", author_name, tweet_address_url, "Tweet", 1, tweet_created, tweet_author_pfp_url);
    })
})
