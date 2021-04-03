const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")
const User = mongoose.model("User")

router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name")
    .sort('createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic,price} = req.body
    console.log(title,body,pic)
    if(!title || !body || !pic || !price){
        return res.status(422).json({error:"הכנס בבקשה את כל השדות הדרושים"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user,
        status:"זמין",
        price
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/updatephoto',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{photo:req.body.photo}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"העלאת התמונה נכשלה"})
            }
            res.json(result)
        })

})

router.put('/addproduct/:id',requireLogin,(req,res)=>{
    const {item} = req.body
    if(!item){
        return res.status(422).json({error:"הכנס בבקשה את כל השדות הדרושים"})
    }
    Post.findByIdAndUpdate(item._id,{status:'לא זמין'},{useFindAndModify: false}, 
    function (err, docs) { 
        if (err){ 
        console.log(err) 
        } 
        else{ 
        console.log("Updated Post : ", docs); 
        } 
    });
    
    User.findByIdAndUpdate(req.params.id,{
        $push:{cart:item._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})

router.put('/removeitem/:id',requireLogin,(req,res)=>{
    const {item} = req.body
    if(!item){
        return res.status(422).json({error:"הכנס בבקשה את כל השדות הדרושים"})
    }
    
    Post.findByIdAndUpdate(item._id,{status:'זמין'},{useFindAndModify: false}, 
    function (err, docs) { 
        if (err){ 
        console.log(err) 
        } 
        else{ 
        console.log("Updated Post : ", docs); 
        } 
    });

    User.findByIdAndUpdate(req.params.id,{
        $pull:{cart:item._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(item._id)
        }
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mycart',requireLogin,(req,res)=>{
    User.findOne({_id:req.user._id})
    .populate("postedBy","_id name")
    .then(user=>{
        var cart = []
        user.cart.map(async item => {
            Post.find({_id:item}).then(post=>{
                cart.push(post[0])
            })
        })
        setTimeout(function(){ res.json({cart}) }, 1000);
    })
    .catch(err=>{
        console.log(err)
    })
})


router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
                return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

// search-post
router.post('/search-post',(req,res)=>{
    let postPattern = new RegExp("^"+req.body.query)
    Post.find({title:{$regex:postPattern}})
    .select("_id title body postedBy photo")
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router