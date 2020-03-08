var request = require('request')

module.exports = (userRequest, userResponse) => {

  // Get the URL and strip any slashes
  let shortcode = userRequest.url
  shortcode = shortcode.replace('/', '')

  // If URL is blank, we want the default redirect
  if (shortcode=='') shortcode='__default__'

  // Load data from JSON Box
  jsonbox_fetch_url = 'https://jsonbox.io/' + process.env.urlshortener_jsonbox + '/' + shortcode
  request(jsonbox_fetch_url, { json: true }, (jsonbox_fetch_err, jsonbox_fetch_res, jsonbox_fetch_body) => {

    // If JSON Box has a response
    if (jsonbox_fetch_body.length>0) {

      // And the response has a destination
      if ('dest' in jsonbox_fetch_body[0]) {

        // Redirect
        userResponse.writeHead(301, {"Location": jsonbox_fetch_body[0].dest})
        userResponse.end()

      // No destination? Nothing to do
      } else {
        userResponse.send('Not found')
      }

    // No response? Nothing to do
    } else {
      userResponse.send('Not found')
    }

  });

}
