const { Client } = require('twitter-api-sdk')
require('dotenv').config() // see https://github.com/motdotla/dotenv

var tweetpush = require('./tweetpush')

const TWEET_ID = "1598678416777093121";  // Tweet: 1596887480027869189; Thread: 1575762790325047298. This is the crucial tweet ID that determines everything else
var finalArray = []; // this will be the final array of all the tweets etc that we use to populate a page in the Notion DB
var coreStats = [];  // this will be the final array of the core data we add into that Notion DB page

var tweet_author_username = "tweet_author_username";           // defining global variables
var twitter_url = "https://twitter.com/"
var tweet_author_url = "https://twitter.com/"
var tweet_address_url_base = "https://twitter.com/i/status/"
var author_name = "author_name";
var tweet_text = "tweet_text";
var tweet_title = "tweet_title";
var tweet_created = "tweet_created";
var tweet_author_id = "tweet_author_id";
var tweet_replying_to_author = "tweet_replying_to_author"; //User ID
var replied_to_tweet_ID = "replied_to_tweet_ID";           //Tweet ID
var tweet_author_pfp_url = "tweet_author_pfp_url";
var tweet_thread_status = "Tweet";
var originalTweet = [];
var top_line = "";   //top line to be the title of the page
var tweet_link = "";
var tweet_link_twt = "";
var poll_options = "start";
var poll_close_date = "start";
var images_in_tweet = [];

const client = new Client(process.env.TW_BEARER);  // establishing authentication for Twitter API

var length = 0;

// FIND TWEET BY ID
async function findTweetbyID(tweetID) {                                  // defining find Tweet by ID function
   const tweet_response_current = await client.tweets.findTweetsById({
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
         //"height",
         //"media_key",
         "preview_image_url",
         "type",
         "url",
         //"width"
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
         "profile_image_url",
         "protected",
         "url",
         "username",
         "withheld"
      ]
   });    //querying the Twitter API for the tweet by the tweet ID
   //console.log(tweet_response_current.includes.polls);                                               //print response
   //console.log(JSON.stringify(tweet_response_current, null, 2))                       //print response in string form
   tweet_text = tweet_response_current.data[0].text;                                   //pulling the text of the saved tweet
   tweet_created = tweet_response_current.data[0].created_at;                           //pulling when the saved tweet was written, something like 2022-10-03T11:24:34.000Z
   tweet_created = tweet_created.substring(0, tweet_created.length - 14);       //adjust the created date to just the date w/o the time by removing the last 14 chars
   tweet_author_id = tweet_response_current.data[0].author_id;                          //pulling the author's User ID
   tweet_replying_to_author = tweet_response_current.data[0].in_reply_to_user_id;       //pulling the User ID to which the saved tweet is replying to
   try { replied_to_tweet_ID = tweet_response_current.data[0].referenced_tweets[tweet_response_current.data[0].referenced_tweets.length-1].id; } catch {} // pulling the Tweet ID to which the saved tweet is replying to
   let tweet_address_url = tweet_address_url_base+tweetID;                            // combining the generic address for tweets (twitter.com/i/status/) with the specific tweet_ID, to make twitter.com/i/status/tweet_ID
   tweet_author_pfp_url = tweet_response_current.includes.users[0].profile_image_url;   //pulling pfp url of the author
   
   // removing reply-to tags from the start of a tweet. E.g if someone replies to a tweet, it comes up something like "@replied_to_account hello Replied To Account, I am replying to your tweet"
   while (tweet_text.startsWith("@")) {    // trigger this while the tweet_text begins with @ 
      let replied_to_username_length = tweet_text.indexOf(" ") + 1;  //find after how many characters the username ends, leading to a " ". If @replied_to_account, then we get 18 + 1 = 19
      tweet_text = tweet_text.substring(replied_to_username_length); //removes the first 19 characters from the reply, leaving us with "hello Replied To Account..."       We then search to see if there is another replied-to account as well. If not, we move on
   }     //it also removes when tweets start with an @, which is an edge case

   try {
      if (tweet_response_current.data[0].referenced_tweets[0].type == 'quoted') {   // if there is a quoted tweeted (auto-placed t.co link at end, always)
         tweet_text = tweet_text.substring(0, tweet_text.length-24)                 // ...then cut it out from the main text
      }
   }
   catch {}

   if (tweet_response_current.includes.hasOwnProperty('media')) {              // checks if there is media in the tweet
      if (tweet_response_current.includes.media.type == 'photo') {                  // checks is media is photo. If video, we ignore
         for (var i = 0; i < tweet_response_current.includes.media.length; i++) {   // adds every media link to a bank (to be embedded later if a tweet, but if a thread))
            images_in_tweet.push(tweet_response_current.includes.media[i].url)
         }
      }
      tweet_text = tweet_text.substring(0, tweet_text.length-24)                 // removes the t.co link (it's always at the end, unless there is a QT, which is removed above
   }
   if (tweet_text.substring(tweet_text.length-23, tweet_text.length).includes("https://t.co/")) {  // if, after image link removal, there is still a t.co link
      tweet_link = tweet_text.substring(tweet_text.length-23, tweet_text.length)                 // save that link (to be embedded later)
      tweet_link_twt = tweet_link;
      tweet_text = tweet_text.substring(0, tweet_text.length-24)                                  // cut it out from the main text
   }
   if (tweet_text.endsWith("\n")) {                                  // if tweet ends with a line break, delete the line break
      tweet_text = tweet_text.substring(0, tweet_text.length-2) 
   }
   if (tweet_response_current.includes.hasOwnProperty('polls')) {          // check if there is a poll
      poll_options = tweet_response_current.includes.polls[0].options      // adds poll to an array
      let T_at = tweet_response_current.includes.polls[0].end_datetime.indexOf("T")
      if (tweet_response_current.includes.polls[0].voting_status == 'closed') {
         poll_close_date = "This poll closed on "
      }
      else {
         poll_close_date = "This poll closes on "
      }
      poll_close_date = poll_close_date + (tweet_response_current.includes.polls[0].end_datetime.substring(0, T_at)) + "."
   }

   let baseArray = [[tweet_text],[tweet_created],
                    [tweet_author_id], [tweet_replying_to_author],
                    [tweet_address_url],
                    [TWEET_ID], [replied_to_tweet_ID],
                    [tweet_link_twt], images_in_tweet, poll_options, [poll_close_date]];
   tweet_link = "";
   finalArray.push(baseArray);
   length = finalArray.length;
   if (length == 1) { originalTweet = baseArray; }
    
   if (Number(baseArray[2]) == Number(baseArray[3])) {     //if the tweet author ID matches the ID of the tweet author above it, then...
      tweetID = replied_to_tweet_ID       //take the ID of the tweet above it and make that the tweetID
      findTweetbyID(tweetID);
   }
   else {  
      finalArray.reverse(finalArray);

      let top_line_ends = String(finalArray[0][0]).indexOf("\n");    //cleaning up the title for the page on Notion
      if (top_line_ends < 0) {                
         top_line = String(finalArray[0][0]).substring(0, 32); 
         top_line = top_line+"..." 
      }
      else if (top_line_ends < 35){
         top_line = String(finalArray[0][0]).substring(0, top_line_ends);
      }
      else {          
         top_line = String(finalArray[0][0]).substring(0, 45); 
         top_line = top_line+"..."
      }

      if (length == 1) {
         tweet_thread_status = "Tweet";
         //console.log("There is", String(length), "tweet.")
         findUserbyID(tweet_author_id).then(() => {
            tweetpush.addTweet({tweet: String(originalTweet[0]), tag1: "Tag1", tag2: "Tag2", source: String(coreStats[3]), url: String(originalTweet[4]), type: tweet_thread_status, length: length, tweet_date: String(originalTweet[1]), author_pfp: String(coreStats[0]), top_line: top_line, tweet_link: tweet_link_twt, images_in_tweet: images_in_tweet, poll_options, poll_close_date: poll_close_date}); //add the item, here an individual tweet, to Notion DB
         })
         return;
      }
      else {
         tweet_thread_status = "Thread";
         //console.log("There are", String(length), "tweets.")  
         findUserbyID(tweet_author_id).then(() => {  
            tweetpush.addThread(finalArray, coreStats); //add the item, here a multi-tweet thread, to Notion DB   
         })
         return;
      }
   }
}
// FIND USER BY ID
async function findUserbyID(userID) {
   // scaling up the profile image from _normal to _400x400
   if (tweet_author_pfp_url.endsWith("normal.jpg")) {                                                  // is this image 'normal'
      tweet_author_pfp_url = tweet_author_pfp_url.substring(0, tweet_author_pfp_url.length - 10);     // if so, let's change that. Get rid of the normal.jpg ending by removing the last 10 chars
      tweet_author_pfp_url = tweet_author_pfp_url.concat("400x400.jpg");                            // and make it bigger by adding 400x400.jpg to the end instead
   }
   const user_response = await client.users.findUserById(userID,);  // calling the Twitter API for User with the User ID
   author_name = user_response.data.name;                 //  getting the Name   of the author of the saved tweet
   tweet_author_username = user_response.data.username;   //  getting the Handle of the author of the saved tweet
   tweet_author_url = twitter_url+tweet_author_username   //  combining the generic twitter url (twitter.com/) with the author's specific handle tweet_author_url to produce twitter.com/tweet_author_url
   coreStats = [[tweet_author_pfp_url], [tweet_author_id],
                [tweet_author_url], [author_name], [top_line]];
}
findTweetbyID(TWEET_ID);