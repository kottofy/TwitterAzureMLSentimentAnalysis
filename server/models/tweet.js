function Tweet (id, user, text, score) {
    this.id = id;
    this.user = user;
    this.text = text;
    this.score = score;
    
    function setScore (score) {
        this.score = score;
    }
}

// var mongoose = require('mongoose');

// module.exports = mongoose.model('Tweet', {
//     id: {type: String, required: true},
//     user: { type: String, required: true},
//     text: { type: String, required: true},
//     score: { type: String, required: true}
// });

