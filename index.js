import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.DB_ID

export async function addItem(tweet, tag1, tag2, source, url, type, length, tweet_date) {
  try {
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": databaseId
      },
      "icon": {
        "type": "external",
        "external": { //I need to figure out how to add local files // Oct 22: maybe not, I can just pull from Twitter
          "url": "https://static.wixstatic.com/media/902875_3f8a4aad38054fe085f75894377ffe62~mv2.png/v1/fill/w_471,h_471,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/EB_1mb.png"
        }
      },
      "cover": {
        "type": "external",
        "external": {
          "url": "https://static.wixstatic.com/media/902875_b14b82f8c6ea4d5cbf901639f07ac1db~mv2.jpg/v1/fill/w_1248,h_498,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/header%20strikingly.jpg"
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