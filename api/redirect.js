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

        // Get info about the user's IP address
        let iplookup_url = 'https://api.ipgeolocation.io/ipgeo?apiKey=' + process.env.ipgeolocation_apikey + '&ip='  + userRequest.headers['x-forwarded-for']
        request(iplookup_url, {}, (iplookup_err, iplookup_res, iplookup_body) => {

          // Build default log message
          let logdata = {
            shortcode: shortcode,
            referrer: userRequest.headers['referer'],
            user_agent: userRequest.headers['user-agent'],
            ip_address: userRequest.headers['x-forwarded-for'],
            click_time: new Date().toISOString()
          }

          // If info available
          if (iplookup_res.statusCode == 200) {
            logdata.userinfo = JSON.parse(iplookup_body)
          }

          // Log the request
          jsonbox_log_url = 'https://jsonbox.io/' + process.env.urlshortener_jsonbox + '/__log__'
          request.post(jsonbox_log_url, {json: true, body: logdata}, (jsonbox_log_err, jsonbox_log_res, jsonbox_log_body) => {

            // Redirect
            userResponse.writeHead(301, {"Location": jsonbox_fetch_body[0].dest})
            userResponse.end()

          })

        })


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
