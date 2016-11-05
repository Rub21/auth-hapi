var Hapi = require('hapi');
var yar = require('yar');

var Grant = require('grant-hapi');
var grant = new Grant();

var server = new Hapi.Server()
server.connection({
  host: 'localhost',
  port: 3000
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(req, res) {
    res({
      status: 'ok'
    });
  }
});

server.route({
  method: 'GET',
  path: '/handle_openstreetmap_callback',
  handler: function(req, res) {
    var response = (req.session || req.yar).get('grant').response
    console.log(response)
    res(JSON.stringify(response, null, 2))
  }
});


server.route({
  method: 'GET',
  path: '/status',
  handler: function(req, res) {
    var response = (req.session || req.yar).get('grant').response;
    if (response) {
      res(JSON.stringify(response, null, 2));
    } else {
      res({
        status: 'bad'
      });
    }
  }
});

server.register([
  {
    register: yar,
    options: {
      maxCookieSize: 0,
      cache: {
        expiresIn: 24 * 60 * 60 * 1000
      },
      cookieOptions: {
        password: 'abcdefghigklmnopqrsdasdasdadadadsdtuvwxyz123456', // min 32 chars
        isSecure: false
      }
    }
  }, {
    register: grant,
    options: require('./config.json')
  }
], function(err) {
  if (err) {
    throw err
  }
  server.start(function() {
    console.log(`Server running at: ${server.info.uri}`);
  });
});