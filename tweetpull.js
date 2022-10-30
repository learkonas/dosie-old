import { Client } from "twitter-api-sdk";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import { addItem } from "./index.js"; // bringing over the code from index.js, which is what adds pages to the Notion DB

const TWEET_ID = "1586294774587305984";  // this is the crucial tweet ID that determines everything else
var finalArray = []; // this will be the final array of all the tweets etc that we use to populate a page in the Notion DB

var tweet_author_username = "tweet_author_username";           // defining global variables
var twitter_url = "https://twitter.com/"
var tweet_author_url = "https://twitter.com/"
var tweet_address_url = "https://twitter.com/i/status/"
var author_name = "author_name";
var tweet_text = "tweet_text";
var tweet_title = "tweet_title";
var tweet_created = "tweet_created";
var tweet_author_id = "tweet_author_id";
var tweet_replying_to_author = "tweet_replying_to_author";
var tweet_replying_to_tweet = "tweet_replying_to_tweet";
var tweet_author_pfp_url = "tweet_author_pfp_url";
var tweet_thread_status = "Tweet";
var replied_to_tweet_ID = "replied_to_tweet_ID";
var tweet_response_storage = "tweet_response_storage";
const client = new Client(process.env.TW_BEARER);  // establishing authentication for Twitter API

// FIND TWEET BY ID
async function findTweetbyID(tweetID) {                                  // defining find Tweet by ID function
    const tweet_response_original = await client.tweets.findTweetsById({
        "ids": [
            tweetID
        ],

        "tweet.fields": [
            "author_id",
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
    //console.log(tweet_response_original);                                               //print response
    //console.log(JSON.stringify(tweet_response_original, null, 2))                       //print response in string form
    tweet_response_storage = tweet_response_original;
    tweet_text = tweet_response_original.data[0].text;                                    //pulling the text of the saved tweet
    tweet_created = tweet_response_original.data[0].created_at;                           //pulling when the saved tweet was written, something like 2022-10-03T11:24:34.000Z
    tweet_created = tweet_created.substring(0, tweet_created.length - 14);       //adjust the created date to just the date w/o the time by removing the last 14 chars
    tweet_author_id = tweet_response_original.data[0].author_id;                          //pulling the author's User ID
    tweet_replying_to_author = tweet_response_original.data[0].in_reply_to_user_id;       //pulling the User ID  to which the saved tweet is replying to
    tweet_replying_to_tweet = tweet_response_original.data[0].referenced_tweets[0].id;    //pulling the Tweet ID to which the saved tweet is replying to
    tweet_author_pfp_url = tweet_response_original.includes.users[0].profile_image_url;   //pulling pfp url of the author
    tweet_address_url = tweet_address_url+TWEET_ID; // combining the generic address for tweets (twitter.com/i/status/) with the specific tweet_ID, to make twitter.com/i/status/tweet_ID

    // scaling up the profile image from _normal to _400x400
    if (tweet_author_pfp_url.endsWith("normal.jpg")) {                                                  // is this image 'normal'
        tweet_author_pfp_url = tweet_author_pfp_url.substring(0, tweet_author_pfp_url.length - 10);     // if so, let's change that. Get rid of the normal.jpg ending by removing the last 10 chars
        tweet_author_pfp_url = tweet_author_pfp_url.concat("400x400.jpg");                              // and make it bigger by adding 400x400.jpg to the end instead
    }

    // removing reply-to tags from the start of a tweet. E.g if someone replies to a tweet, it comes up something like "@replied_to_account hello Replied To Account, I am replying to your tweet"
    while (tweet_text.startsWith("@")) {    // trigger this while the tweet_text begins with @ 
        let replied_to_username_length = tweet_text.indexOf(" ") + 1;  //find after how many characters the username ends, leading to a " ". If @replied_to_account, then we get 18 + 1 = 19
        tweet_text = tweet_text.substring(replied_to_username_length); //removes the first 19 characters from the reply, leaving us with "hello Replied To Account..."       We then search to see if there is another replied-to account as well. If not, we move on
    }

    let baseArray = [[tweet_text], [tweet_created], [tweet_author_id], [tweet_replying_to_author], [tweet_address_url]];
    finalArray.push(baseArray);
    let last_tweet_location_in_array = finalArray.length - 1;
}

// FIND USER BY ID
async function findUserbyID(userID) {

    const user_response = await client.users.findUserById(userID,);  // calling the Twitter API for User with the User ID
    tweet_author_username = user_response.data.username;   //  getting the Handle of the author of the saved tweet
    author_name = user_response.data.name;                 //  getting the Name   of the author of the saved tweet
    tweet_author_url = twitter_url+tweet_author_username   //  combining the generic twitter url (twitter.com/) with the author's specific handle tweet_author_url to produce twitter.com/tweet_author_url
}


findTweetbyID(TWEET_ID).then(() => {
    findUserbyID(tweet_author_id).then(() => {


       // figure out if we are dealing with a Tweet or a Thread by seeing if the saved tweet author User ID matches the User ID of the tweet being replied to. If true, it is a thread. Else (e.g. if false or null (i.e. it doesn't reply to anything)) it is a Tweet. Users have to save the bottom of a thread if they want the thread, and automatically getting any tweets above it. Even if they don't want the thread, this adds context

        if (tweet_author_id==tweet_replying_to_author) {
            var tweet_thread_status = "Thread";     // if the authorID matches that of the tweet which the saved tweet replies to, it is a thread
            replied_to_tweet_ID = tweet_response_storage.data[0].referenced_tweets[0].id;   //pull the tweetID above the saved tweet, in the thread
        } else {
            tweet_thread_status = "Tweet";          
        }    
        addItem(tweet_text, "Tag1", "Tag2", author_name, tweet_address_url, tweet_thread_status, 2, tweet_created, tweet_author_pfp_url, tweet_text); //add the item to Notion DB
    })
})

            //going to bed now, but this is how the logic could work for figuring out the length
            /*

                ID of the saved tweet is given, as is the full API response. This is tweet0
                get the ID of the tweet above it from the API response. This is tweet1. We already know it's the same author because we're in the true part of the if statememnt
                query that new tweetID (tweet1) with our function
                store and clean the text of tweet1 and get the author ID of tweet above it (tweet2, or i+1) (which we get from above query)

                                let i = 1
                while:  authorID of tweet1(i) == authorID tweet2(i+1)
                query tweet2(i+1)
                store and clean text of tweet2(i+1)
                i = i + 1
                get the authorID of tweet3(i+1)

                // upon reflection: this should be how I get all the tweets. Get an ID. Query it. While author ID matches the above tweet, query etc
                        //      ie: rather than tucking it at the back separately

                // use a do/while loop ... more info here: https://www.w3schools.com/js/js_loop_while.asp#:~:text=crash%20your%20browser.-,The%20Do%20While%20Loop,the%20condition%20is%20true.,-Syntax
                
                let i = 1
            try {    
                do {  
                    query tweet(i)
                    if i = 1 {
                        save some standalone things, like the pfp url, the title, the source, the created date, thread/tweet status, etc
                    }
                    save the text and any media/polls etc - stuff we need for every tweet in the thread
                    i++
                }
                while (authorID of tweet(i-1) == authorID of tweet(i))
                        // need to figure out what to do when there is no tweet above it to be compared to. If this turns out to just have a value of 'undefined' or null, we're okay. But if it causes an error, then we could use try/catch(/finally)
            }
            catch {    
                length of chain = i-1
                if i = 2 {
                    status = tweet
                }
                else {
                    status = thread
                }
            }

        */