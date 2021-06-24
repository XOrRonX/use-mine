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
        phone:{
            type:String
        },
        id: {
            type:String
        },
        resetToken:String,
        expireToken:Date,
        cart:[{type:ObjectId,ref:"Post"}],
        photo:{
            type:String,
            default:"https://res.cloudinary.com/dyiceswks/image/upload/v1624106602/profile_uhxas6.gif"
        },
        rating:[{type:ObjectId,ref:"User"}],
        myRating:[{type:ObjectId,ref:"User"}],

})

mongoose.model("User", userSchema)