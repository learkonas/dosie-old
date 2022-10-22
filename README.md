## Overview
Making a bot to subtly put Tweets in a human user's Notion (or Obsidian graph), either by pulling them from the bookmarks of the human account or by pulling them from the DM's that a bot has with that user.

## How does the Notion aspect work
Connect an integration with a database
Define a function to put something into that Notion database
Call that function with some variables

## How does the Twitter aspect work
Triggered when the bot gets a DM
Read the tweet DM'd to @DosieCo
Read the hashtags in the DM
Figure out if the Tweet is standalone or the bottom (top?) of a thread (may need to rely on user to do this)
IF standalone
    Take the data and plug it into Notion
ELSE
    Take the data in a different way and plug it into Notion
