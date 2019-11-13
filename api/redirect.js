var request = require('request')

module.exports = (req, res) => {

  // Get the URL and strip any slashes
  let url = req.url
  url = url.replace('/', '')

  // If URL is blank, we want the default redirect
  if(url=='') url='__default__'

  // Load data from JSON Box
  url = 'https://jsonbox.io/' + process.env.urlshortener_jsonbox + '/' + url
  request(url, { json: true }, (jb_err, jb_res, jb_body) => {

    // If JSON Box has a response
    if(jb_body.length>0) {

      // And the response has a destination
      if('dest' in jb_body[0]) {
        res.writeHead(302, {"Location": jb_body[0].dest})
        res.end()

      // No destination? Nothing to do
      } else {
        res.send('Not found')
      }

    // No response? Nothing to do
    } else {
      res.send('Not found')
    }
  });

}
