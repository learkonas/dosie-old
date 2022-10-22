import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.DB_ID

async function addItem(tweet, tag1, tag2, source, url, type, length) {
  try {
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": databaseId
      },
      "icon": {
        "type": "external",
        "external": { //I need to figure out how to add local files
          "url": "https://static.wixstatic.com/media/902875_3f8a4aad38054fe085f75894377ffe62~mv2.png/v1/fill/w_471,h_471,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/EB_1mb.png"
        }
      },
      "cover": {
        "type": "external",
        "external": {
          "url": "https://static.wixstatic.com/media/902875_b14b82f8c6ea4d5cbf901639f07ac1db~mv2.jpg/v1/fill/w_1248,h_498,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/header%20strikingly.jpg"
        }
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
        "URL": {
          "url": url
        },
        /*"Tags": {           //Tags but only select not multi-select          
          "select": {
            "name": tag1
          }
        }, */
        "Tags": {             //Multi-select doesn't work: code. Error: 'validation_error',  message: 'body failed validation. Fix one:\n' + .... (full error here: https://prnt.sc/ehwby0K-kUZV)
          //"object": "property_item",
          //"type": "multi_select",
          "multi_select":{
            "options": [
            {
              "name": tag1, 
              "color": "red"
            },
            {
              "name": tag2,
              "color": "grey"
            }
          ]},
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
                    "content": "Content.",
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

addItem("Tweet", "Tag1", "Tag2", "Source", "https://google.com", "Thread", 5)