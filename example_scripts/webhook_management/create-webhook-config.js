var nconf = require('nconf')
var request = require('request')


// load config
nconf.file({ file: 'config.json' }).env()

// twitter authentication
var twitter_oauth = {
  consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
  consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
  token: nconf.get('TWITTER_ACCESS_TOKEN'),
  token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET')
}

var WEBHOOK_URL = 'dosie.onrender.com/webhooks/twitter'


// request options
var request_options = {
  url: 'https://eolt4a2y2twsw7o.m.pipedream.net/webhooks/twitter',
  oauth: twitter_oauth,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  },
  form: {
    url: WEBHOOK_URL
  }
}

// POST request to create webhook config
request.post(request_options, function (error, response, body) {
  console.log(body)
})