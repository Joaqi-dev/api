var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
const server = require("http").Server(app);
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {debug: true});
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require("./routes/testAPI");
var connectRouter = require('./routes/connect')

var app = express();

app.use("/peerjs", peerServer);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('socketio', io);

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Middlewares
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
//app.use("/testAPI", testAPIRouter);
//app.use('/connect', connectRouter);

server.listen(8000);

io.on("connection", (socket) => {
  console.log("trying to connect...");
  socket.on("join-room", (roomId, userId) => {
      console.log("socket received");
      socket.join(roomId);
      socket.broadcast.emit("user-connected", userId);
      console.log("connected");
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
