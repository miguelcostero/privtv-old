var request = require('request');

request('http://api-privtv.rhcloud.com/main/getempleados/bbfa29a387567a26a34ba1e5d871f722', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  } else {
    alert(error)
    console.error(error)
  }
})
