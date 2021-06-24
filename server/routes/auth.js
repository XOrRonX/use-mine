const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const { NODEMAILER } = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:NODEMAILER
    }
}))

router.get('/',(req,res)=>{
    res.send("hello")
})

router.get('/protected',requireLogin,(req,res)=>{
    res.send("hello user")
})

/**
 * signup
 * get user data, ensure there is an email, pass, name
 * check if the user already exist if not then create a new user.
 */
router.post('/signup',(req,res)=> {
   const {name,email,password,photo,phone,id} = req.body
   if(!email || !password || !name){
       return res.status(422).json({error:"הכנס בבקשה את כל השדות הדרושים"})
   } 
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser){
           return res.status(422).json({error:"המייל המבוקש קיים במערכת"})
       }
       bcrypt.hash(password,12)
       .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                photo,
                phone,
                id
            })
    
            user.save()
            .then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"or.ron7@gmail.com",
                    subject:"UseMine - הרישום בוצע בהצלחה",
                    html:`
                    <p><h1>ברוך הבא ${name}!</h1><p>אנחנו כאן בצוות UseMine מאחלים לך שימוש מהנה באתר וכאן לכל שאלה או נושא.</p>
                    <p>בברכה,</p>
                    <img style="width:50px" src="https://res.cloudinary.com/dyiceswks/image/upload/v1618057929/UseMine_znnhow.png" alt="_blank" >
                    </img></p>`
                })
                res.json({message:"המשתמש נשמר בהצלחה"})
            })
            .catch(err=>{
                console.log(err)
            })
       })
       
   })

})

router.post('/signin',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"הכנס בבקשה מייל או סיסמא"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"מייל או סיסמא שגויים"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
            //    return res.json({message:"Successfully signed in"})
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email,photo,phone} = savedUser
                res.json({token,user:{_id,name,email,photo,phone}})
            } else {
                return res.status(422).json({error:"מייל או סיסמא שגויים"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res)=>{
   crypto.randomBytes(32,(err,buffer)=>{
       if(err){
           console.log(err)
       }
       const token = buffer.toString('hex')
       User.findOne({email:req.body.email})
       .then(user=>{
           if(!user){
               return res.status(422).json({error:"משתמש לא קיים"})
           }
           user.resetToken = token
           user.expireToken = Date.now() + 3600000
           user.save().then((result)=>{
               transporter.sendMail({
                   to:user.email,
                   from:"or.ron7@gmail.com",
                   subject:"UseMine - איפוס סיסמא",
                   html:`
                   <p>
                   ביקשת לאפס את סיסמתך
                   <h5><a href="http://localhost:3000/reset/${token}">איפוס סיסמא</a> לחץ על הלינק הבא בכדי לאפס את סיסמתך </h5>
                   בברכה,
                    <img style="width:100px" src="https://res.cloudinary.com/dyiceswks/image/upload/v1618057929/UseMine_znnhow.png" alt="_blank" >
                    </img>
                   </p>
                   `
               })
               res.json({message:"בדוק את תיבת המייל שלך"})
           })
       })
   })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"פג תוקף נסה שוב"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save().then((saveduser)=>{
                res.json({message:"הסיסמא עודכנה בהצלחה"})
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router