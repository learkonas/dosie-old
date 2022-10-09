import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from 'express'

const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.DB_ID

/*
async () => {
  try {
    const response = await notion.pages.create({
      "parent": {
        "type": "database_id",
        "database_id": databaseId
      },
      "properties": {
        "Name": {
          "title": [{
            "text": {
              "content": "Tuscan kale"
            }
          }]
        },
        "Description": {
          "rich_text": [{
            "text": {
              "content": "A dark green leafy vegetable"
            }
          }]
        },
        "Food group": {
          "select": {
            "name": "🥬 Vegetable"
          }
        }
      },
      "children": [
        {
          "object": "block",
            "heading_2": {
              "rich_text": [{
                "text": {
                  "content": "Lacinato kale"
                }
              }]
            }
        },
        {
          "object": "block",
            "paragraph": {
              "rich_text": [
                {
                  "text": {
                    "content": "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                    "link": {
                      "url": "https://en.wikipedia.org/wiki/Lacinato_kale"
                    }
                  },
                  "href": "https://en.wikipedia.org/wiki/Lacinato_kale"
                }
              ],
              "color": "default"
            }
        }
      ]
      "cover": {
        "type": "external",
        "external": {
          "url": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg"
        }
      },
      "icon": {
        "type": "emoji",
        "emoji": "🥬"
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  }
  catch (error) {
    console.log("Error.")
    console.error(error.body)
  }
}*/


async function addItem(text) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      /*"parent": {
        "type": "database_id",
        "database_id": databaseId
      },*/
      /*"properties": {
        "Name": {
          "title": [{
            "text": {
              "content": "Tuscan kale"
            }
          }]
        },*/
      properties: {
        "title": { 
          title:[{
            "text": {
              "content": text
            }
          }]
        }
      },
    })
    console.log(response)
    console.log("Success! Entry added.")
  } catch (error) {
    console.error(error.body)
  }
}

addItem("Yurts in Big Sur, California")