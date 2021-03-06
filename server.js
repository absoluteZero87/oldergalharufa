var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysql = require('mysql');
var connection = require('express-myconnection');

//routes declaration
var users = require('./routes/usuarios');
var casting = require('./routes/casting');
var servicos = require('./routes/servicos');
var quemsomos = require('./routes/quemsomos');
var contato = require('./routes/contato');

var app = express();

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // if (req.headers['x-forwarded-proto'] != 'https') {
  //   // checa se o header é HTTP ou HTTPS
  //   res.redirect("https://" + req.headers.host + req.url);
  //   // faz o redirect para HTTPS
  // } else {
  next();
  // }
});

// app.use(
//   connection(
//     mysql,
//     {
//       host: 'mysql669.umbler.com',
//       user: 'admagencia',
//       password: 'agenciagalharufa',
//       port: 41890, //port mysql
//       database: 'galharufa',
//       typeCast: function castField(field, useDefaultTypeCasting) {
//         if (field.type === 'BIT' && field.length === 1) {
//           var bytes = field.buffer();
//           return bytes[0] === 1;
//         }
//         return useDefaultTypeCasting();
//       },
//     },
//     'request',
//   ),
// );

app.use(
  connection(
    mysql,
    {
      host: 'us-cdbr-east-04.cleardb.com',
      user: 'bb1a698543b12c',
      password: 'cf9010587f0ec8c',
      port: 3306, //port mysql
      database: 'heroku_1360f6def34c55d',
      typeCast: function castField(field, useDefaultTypeCasting) {
        if (field.type === 'BIT' && field.length === 1) {
          var bytes = field.buffer();
          return bytes[0] === 1;
        }
        return useDefaultTypeCasting();
      },
    },
    'request',
  ),
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'www')));

// API
app.use('/api/usuarios', users);
app.use('/api/casting', casting);
app.use('/api/servicos', servicos);
app.use('/api/quemsomos', quemsomos);
app.use('/api/contato', contato);

app.use('/js', express.static(path.join(__dirname, 'www/js')));
app.use('/shared', express.static(path.join(__dirname, 'www/shared')));
app.use('/styles', express.static(path.join(__dirname, 'www/styles')));
app.use('/images', express.static(path.join(__dirname, 'www/images/casting')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/www/index.html');
});

app.use(express.static(__dirname + '/www'));

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// app.listen(port, function () {
//   console.log('Listening on port ' + port);
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

//var http = require('http');
//var server = http.createServer(function (req, res) {
//  res.writeHead(200, { 'Content-Type': 'text/plain' });
//  res.end('Hello world!');
//});
//server.listen(process.env.PORT);

app.listen(process.env.PORT, () => console.log(`Listening on ${ process.env.PORT }`))

module.exports = app;
