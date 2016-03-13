var express             = require('express'),
    app                 = express(),
    mongoose            = require('mongoose'),
    tweetsController   = require('./server/controllers/twitter-controller');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/views/index.html');
});


app.use('/js', express.static(__dirname + '/client/js'));

//REST API
app.get('/api/tweets', tweetsController.list);
// app.post('/api/meetups', meetupsController.create);



app.listen(3000, function() {
    console.log("I'm listening...");
});
