import { Client } from "twitter-api-sdk";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config() // The code below sets the bearer token from your environment variables


// FIND TWEET BY ID
// this is pulling Tweet content, 
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
      
      console.log("response", JSON.stringify(response, null, 2));
    }
    
findTweetbyID("1576895984373993472");


// FIND USER BY ID
async function findUserbyID(userID) {
    const client = new Client(process.env.TW_BEARER);
   
    const response = await client.users.findUserById(userID, );
        
    console.log("response", JSON.stringify(response, null, 2));
}
        
findUserbyID("285327473");
