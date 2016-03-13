var express             = require('express'),
    app                 = express(),
    mongoose            = require('mongoose'),
    tweetsController   = require('./server/controllers/twitter-controller');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});


app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));

//REST API
app.get('/api/tweets', tweetsController.list);
// app.post('/api/meetups', meetupsController.create);


var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("I'm listening on port: " + port);
});
