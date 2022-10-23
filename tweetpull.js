import { Client } from "twitter-api-sdk";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { addItem } from "./index.js"; // bringing over the code from index.js, which is what adds pages to the Notion DB

const TWEET_ID = "1576895984373993472";  // this is the crucial tweet ID that determines everything else

var tweet_author_username = "tweet_author_username";           // defining global variables
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
async function findTweetbyID(tweetID) {                                  // defining find Tweet by ID function
    const client = new Client(process.env.TW_BEARER);                    // establishing authentication for Twitter API
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
      });    //querying the Twitter API for the tweet by the tweet ID
    //console.log(tweet_response);                                               //print response
    //console.log(JSON.stringify(tweet_response, null, 2))                       //print response in string form
    tweet_text = tweet_response.data[0].text;                                    //pulling the text of the saved tweet
    tweet_created = tweet_response.data[0].created_at;                           //pulling when the saved tweet was written, something like 2022-10-03T11:24:34.000Z
    tweet_created = tweet_created.substring(0, tweet_created.length - 14);       //adjust the created date to just the date w/o the time by removing the last 14 chars
    tweet_author_id = tweet_response.data[0].author_id;                          //pulling the author's User ID
    tweet_replying_to = tweet_response.data[0].in_reply_to_user_id;              //pulling the User ID of the author which the saved tweet is replying to
    tweet_author_pfp_url = tweet_response.includes.users[0].profile_image_url;   //pulling pfp url of the author

    // scaling up the profile image from _normal to _400x400
    if (tweet_author_pfp_url.endsWith("normal.jpg")) {                                                  // is this image 'normal'
        tweet_author_pfp_url = tweet_author_pfp_url.substring(0, tweet_author_pfp_url.length - 10);     // if so, let's change that. Get rid of the normal.jpg ending by removing the last 10 chars
        tweet_author_pfp_url = tweet_author_pfp_url.concat("400x400.jpg");                              // and make it bigger by adding 400x400.jpg to the end instead
    }
}
    
// FIND USER BY ID
async function findUserbyID(userID) {
    const client = new Client(process.env.TW_BEARER);                    // establishing authentication for the Tw API
       const user_response = await client.users.findUserById(userID, );  // calling the Twitter API for User with the User ID
    tweet_author_username = user_response.data.username;   //  getting the Handle of the author of the saved tweet
    author_name = user_response.data.name;                 //  getting the Name   of the author of the saved tweet
    tweet_author_url = twitter_url+tweet_author_username   //  combining the generic twitter url (twitter.com/) with the author's specific handle tweet_author_url to produce twitter.com/tweet_author_url
}


findTweetbyID(TWEET_ID).then(() => {
    findUserbyID(tweet_author_id).then(() => {
        tweet_address_url = tweet_address_url+TWEET_ID; // combining the generic address for tweets (twitter.com/i/status/) with the specific tweet_ID, to make twitter.com/i/status/tweet_ID

        // removing reply-to tags from the start of a tweet. E.g if someone replies to a tweet, it comes up something like "@replied_to_account hello Replied To Account, I am replying to your tweet"
        while (tweet_text.startsWith("@")) {    // trigger this while the tweet_text begins with @ 
            let replied_to_username_length = tweet_text.indexOf(" ") + 1;  //find after how many characters the username ends, leading to a " ". If @replied_to_account, then we get 18 + 1 = 19
            tweet_text = tweet_text.substring(replied_to_username_length); //removes the first 19 characters from the reply, leaving us with "hello Replied To Account..."       We then search to see if there is another replied-to account as well. If not, we move on
        }    
        
        

        addItem(tweet_text, "Tag1", "Tag2", author_name, tweet_address_url, "Tweet", 1, tweet_created, tweet_author_pfp_url); //add the item to Notion DB
    })
})
