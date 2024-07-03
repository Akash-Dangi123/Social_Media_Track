const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/PersonalApp");

const userschema = mongoose.Schema({

    username: String,
    mobile: Number,
    email: String,
    password: String,
    postId: [ {type: mongoose.Schema.Types.ObjectId, ref: "post"} ],
    profilePic: [{type: String}]
    
    },{timestamps: true});

    userschema.plugin(plm);
 module.exports = mongoose.model("users",userschema);