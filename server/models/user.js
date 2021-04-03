const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        resetToken:String,
        expireToken:Date,
        cart:[{type:ObjectId,ref:"Post"}],
        photo:{
            type:String,
            default:"https://www.regionalsan.com/sites/main/files/imagecache/lightbox/main-images/vacant_placeholder.gif"
        },
        rating:[{type:ObjectId,ref:"User"}],
        myRating:[{type:ObjectId,ref:"User"}],

})

mongoose.model("User", userSchema)