const mongoose = require("mongoose");

var postSchema = mongoose.Schema({
    image: String,
    userId:{type: mongoose.Schema.Types.ObjectId, ref: "users"},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "users"}],
    report: [{type: mongoose.Schema.Types.ObjectId, ref: "users"}],
    comments: [{text: String , postedBy: String}]
    
},{timestamps: true});

module.exports = mongoose.model("post",postSchema);