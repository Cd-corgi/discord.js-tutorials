const mongoose = require('mongoose')

let Schema = new mongoose.Schema({
    guilldID: String,
    blacklist: [{
        word: String
    }]
});

module.exports = new mongoose.model("anti-word-video", Schema);