import { Client } from "@notionhq/client"
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const databaseId = process.env.DB_ID

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
var cover_image_url = cover_image_url_bank[cover_bank_number];


export async function addTweet({tweet, tag1, tag2, source, url, type, length, tweet_date, author_pfp, top_line}) {
   try {
      const response = await notion.pages.create({
         "parent": {
         "type": "database_id",
         "database_id": databaseId
         },
         "icon": {
            "type": "external",
            "external": {
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
                     "content": top_line
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
                  { "name": tag1, },
                  { "name": tag2, }
               ]
            },
         },
         "children": [
            {  "object": "block",
               "heading_3": {
                  "rich_text": [{
                     "text": {
                        "content": top_line
                     }
                  }]
               }
            },
            {  "object": "block",
               "paragraph": {
                  "rich_text": [{
                     "text": { //this may  need to be some kind of array to display the tweet or thread and may need an if statement
                        "content": tweet,
                     },
                  }],
                  "color": "default"
               }
            },
            {  "object": "block",
               "paragraph": {
                  "rich_text": [{
                     "text": {
                        "content": "Tap to read on Twitter",
                        "link": {
                           "url": url
                        }
                     }
                  }],
                  "color": "default"
               }
            }
         ]
      })
      //console.log(response)
      const tweetBlockId = response["id"] 
      const responseClosing = await notion.blocks.children.append({
         block_id: tweetBlockId,
         children: [
            {  "callout": {
                  "rich_text": [{
                     "text": {
                        "content": "Tap to read on Twitter",
                        "link": {
                           "url": url
                        }
                     }
                  }]
               }
            }
         ]
      })
      console.log("Success! Tweet added.")
   }
   catch (e) {
      console.error(e)
   }
}

export async function addThread(finalArray, coreStats) {
   try {
      const response = await notion.pages.create({
         "parent": {
         "type": "database_id",
         "database_id": databaseId
         },
         "icon": {
            "type": "external",
            "external": {
               "url": String(coreStats[0]) //tweet_author_pfp_url, scaled to 400x400
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
                     "content": String(coreStats[4]) //top_line
                  }
               }]
            },
            "Source": {
            "rich_text": [{
               "text": {
                  "content": String(coreStats[3]), // author_name
                  "link": {
                     "url": String(finalArray[0][4]) //tweet_address_url
                  }
               },
               "href": String(finalArray[0][4]) //tweet_address_url
            }]
            },
            "Type": {
               "select": {
                  "name": "Thread"
               }
            },
            "Length": {
               "number": finalArray.length
            },
            "Tweeted": {
               "date": {
               "start": String(finalArray[0][1])
               }
            },
            "Tags": { 
               "multi_select": [
                  { "name": "Tag1" },
                  { "name": "Tag2" }
               ]
            },
         },
         "children": [{
            "object": "block",
            "heading_3": {
               "rich_text": [{
                  "text": {
                     "content": String(coreStats[4]) //top_line
                  }
               }]
            }
         }]
      })
      const threadBlockId = response["id"]   
      for (var i = 0; i < finalArray.length; i++) {
         const responseTweet = await notion.blocks.children.append({
         block_id: threadBlockId,
            children: [
               {
                  "paragraph": {
                     "rich_text": [{
                        "type": "text",
                        "text": {
                           "content": String(finalArray[i][0]),
                        }
                  }],
               }
               },                
               /*{
                  "embed": {
                     "url": String(finalArray[i][4])
                  }
               }   */ 
            ],
         });
      }
      const responseClosing = await notion.blocks.children.append({
         block_id: threadBlockId,
         children: [
            {
               "paragraph": {
                  "rich_text": [{
                     "text": {
                        "content": "Click to read on Twitter",
                        "link": {
                           "url": String(finalArray[0][4])
                        }
                     }
                  }]
               }
            }
         ]
      })
      console.log("Success! Thread added.")
   }
   catch (e) {
      console.error(e)
   }
}