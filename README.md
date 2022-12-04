Making a bot to subtly put Tweets in a human user's Notion (or Obsidian graph), either by pulling them from the bookmarks of the human account or by pulling them from the DM's that a bot has with that user.

## How does the Notion aspect work
Tweets are displayed with the cleaned version of the text, followed by whatever media is associated with the tweet (poll, image, not video), and then any embedded links. Then comes a divered, followed by an embedded version of the saved tweet.
For threads, the text of the entire thread is saved first, separated by dividers, with images from each tweet included where relevant. Then comes a list of any links included in the thread.

## How does the Twitter aspect work
I am building the following triggers:
1a. Tweet sent in a DM -> save in Notion
1b. Tweet sent in a DM followed by a message -> save in Notion, each word in following message used as a tag
1c. Tweet sent in a DM followed by message A and message B -> save in Notion; each word in message A is a tag; message B is saved as a comment
2. Tweet bookmarked -> save in Notion
3a. @DosieCo tagged under the tweet -> save in Notion
3b. @DosieCo tagged under the tweet with hashtags -> save in Notion with each hashtag used as a tag
3c. @DosieCo tagged under the tweet with hashtags and other text -> save in Notion with each hashtag used as a tag and the other text saved as a comment