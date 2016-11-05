
var Hapi = require('hapi')
  , yar = require('yar')

var Grant = require('grant-hapi')
  , grant = new Grant()

var server = new Hapi.Server()
server.connection({host: 'localhost', port: 3000})

server.route({method: 'GET', path: '/', handler: function (req, res) {
  res({status:'ok'});
}})


server.route({method: 'GET', path: '/user', handler: function (req, res) {
  res({status:'ok'});
}})


server.route({method: 'GET', path: '/handle_openstreetmap_callback', handler: function (req, res) {
  console.log(req.query)
  res(JSON.stringify(req.query, null, 2))
}})

server.register([{
  register: grant,
  options: require('./config.json')
}, {
  register: yar,
  options: {
    cookieOptions: {
      password: '214343pass214343passwordsaqwjnurdeqwwordsaqwjnurdeqw',
      isSecure: false
    }
  }
}], function (err) {
  if (err) throw err
  server.start(function() {
    console.log(`Server running at: ${server.info.uri}`);
  })
})