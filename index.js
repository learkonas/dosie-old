import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()


const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.DB_ID

var cover_image_url = "cover_image_url";
const cover_image_url_bank = [
    "https://live.staticflickr.com/5571/14763952742_5405536208_b.jpg",  // 1
    "https://live.staticflickr.com/3853/14751243442_f8b19e649f_b.jpg",  // 2
    "https://live.staticflickr.com/3904/14769858383_5f22e4cfc6_b.jpg",  // 3
    "https://live.staticflickr.com/5716/21117700952_d7733aaecf_b.jpg",  // 4
    "https://live.staticflickr.com/5572/14749675191_df312fd06b_b.jpg",  // 5
    "https://live.staticflickr.com/555/20386702806_85a7ff5470_b.jpg",   // 6
    "https://live.staticflickr.com/5568/14758775716_bb3c66cc97_b.jpg",  // 7
    "https://live.staticflickr.com/3881/14750109452_890b7989a4_b.jpg",  // 8
    "https://live.staticflickr.com/3888/14771092033_32a8e39865_b.jpg",  // 9
    "https://live.staticflickr.com/5643/20391509300_236c42c5c0_z.jpg",  // 10
    "https://live.staticflickr.com/5737/19957209674_360a99dff7_b.jpg",  // 11
    "https://live.staticflickr.com/614/19956900294_332cedbbf4_b.jpg",   // 12
    "https://live.staticflickr.com/5805/19933533444_be3160a125_b.jpg"   // 13 
  ]
  
let cover_bank_number = Math.floor(Math.random() * 13);
cover_image_url = cover_image_url_bank[cover_bank_number];


export async function addItem(tweet, tag1, tag2, source, url, type, length, tweet_date, author_pfp) {
  try {
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": databaseId
      },
      "icon": {
        "type": "external",
        "external": { //I need to figure out how to add local files // Oct 22: maybe not, I can just pull from Twitter
          "url": author_pfp
        }
      },
      "cover": {
        "type": "external",
        "external": {
          "url": cover_image_url
        },
      },
      properties: {
        "Tweet": {
          "title":[{
            "text": {
              "content": tweet
            }
          }]
        },
        "Source": {
          "rich_text": [{
            "text": {
              "content": source,
              "link": {
                "url": url
              }
            },
            "href": url
          }]
        },
        "Type": {
          "select": {
            "name": type
          }
        },
        "Length": {
          "number": length
        },
        "Tweeted": {
          "date": {
            "start": tweet_date
          }
        },
        "Tags": { 
          "multi_select": [
            {
              "name": tag1,
            },
            {
              "name": tag2,
            }
          ]
        },
      },
      "children": [
        {
          "object": "block",
            "heading_3": {
              "rich_text": [{
                "text": {
                  "content": "Heading 3"
                }
              }]
            }
        },
        {
          "object": "block",
            "paragraph": {
              "rich_text": [
                {
                  "text": { //this will need to be some kind of array to display the tweet or thread and will need an if statement
                    "content": tweet,
                  },
                }
              ],
              "color": "default"
            }
        }
      ]
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

//addItem("Tweet content goes here", "Tag1", "Tag2", "Author", "https://google.com", "Tweet", 1, "2022-10-03") 



/*
Tweet = Copy and paste the bookmarked tweet / top tweet in thread
TagX = hashtags in the call tweet
Author = name of author in the bookmarked tweet
Link = Link to the bookmarked tweet
Thread/Tweet = whether it is a tweet or thread being saved
Length = length of thread (incl. 1)
Tweet_date = the date the tweet was published 
ALSO, need vars for the bookmarked author's profile pic, something for the cover photo, and the objects for the bookmarked tweet
*/