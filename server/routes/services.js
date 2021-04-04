const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const paypal = require("paypal-rest-sdk");

global.totalAmount = 0;

const findUser = (userId, res) => {
  User.findOne({ _id: userId })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: userId })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((arr) => {
      return res.status(404).json({ error: "User not found" });
    });
};

const rateUser = (userId, rateId, res) => {
  User.findByIdAndUpdate(
    rateId,
    {
      $push: { rating: userId },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        userId,
        {
          $push: { myRating: rateId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
};

const unrateUser = (userId, unrateId, res) => {
    User.findByIdAndUpdate(
        unrateId,
        {
            $pull: { rating: userId },
        },
        {
            new: true,
        },
        (err, result) => {
            if (err) {
            return res.status(422).json({ error: err });
            }
            User.findByIdAndUpdate(
            userId,
            {
                $pull: { myRating: unrateId },
            },
            { new: true }
            )
            .select("-password")
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                return res.status(422).json({ error: err });
            });
        }
        );
}

const pay = (userId, res) => {
    User.findOne({ _id: userId })
    .then((user) => {
      var itemList = [];
      var total = 0;
      user.cart.map(async (item) => {
        Post.find({ _id: item }).then((post) => {
          var obj = {
            name: post[0].title,
            sku: post[0].price,
            price: post[0].price,
            currency: "ILS",
            quantity: 1,
          };
          total += post[0].price;
          itemList.push(obj);
        });
      });
      setTimeout(function () {
        global.totalAmount = total;
        const create_payment_json = {
          intent: "sale",
          payer: {
            payment_method: "paypal",
          },
          redirect_urls: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
          },
          transactions: [
            {
              item_list: {
                items: itemList,
              },
              amount: {
                currency: "ILS",
                total: global.totalAmount,
              },
              description: "This is the payment description.",
            },
          ],
        };

        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            throw error;
          } else {
            let i;
            console.log(payment);
            for (i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                res.json({
                  status: "Success",
                  redirect: payment.links[i].href,
                });
              }
            }
          }
        });
      }, 5000);
    })
    .catch((err) => {
      console.log(err);
    });
}

const completePayment = (payerId, paymentId, res) => {
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "ILS",
          total: global.totalAmount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.send("success");
      }
    }
  );
}

const getAllPosts = (res) => {
    Post.find()
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name")
    .sort('createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        res.status(422).json({ error: err });
    })
}

const createPost = (req,res) => {
    const {title,body,pic,price} = req.body

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
}

const updateProfilePicture = (userId, photo, res) => {
    User.findByIdAndUpdate(userId,{$set:{photo:photo}},{new:true},
        (err,result)=>{
            if(err){
                return res.status(422).json({error:"העלאת התמונה נכשלה"})
            }
            res.json(result)
        })
}

const addItem = (userId, item, res) => {
    if(!item){
        return res.status(422).json({error:"הכנס בבקשה את כל השדות הדרושים"})
    }
    Post.findByIdAndUpdate(item._id,{status:'לא זמין'},{useFindAndModify: false}, 
    function (err) { 
        if (err){ 
            return res.status(422).json({error:err})
        } 
    });
    
    User.findByIdAndUpdate(userId,{
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
}

const removeItem = (userId, item, res) => {
    if(!item){
        return res.status(422).json({error:"הכנס בבקשה את כל השדות הדרושים"})
    }
    
    Post.findByIdAndUpdate(item._id,{status:'זמין'},{useFindAndModify: false}, 
    function (err) { 
        if (err){ 
            return res.status(422).json({error:err})
        } 
    });

    User.findByIdAndUpdate(userId,{
        $pull:{cart:item._id}
    },{
        new:true
    }).exec((err)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(item._id)
        }
    })
}

const getUserPosts = (userId, res) => {
    Post.find({postedBy:userId})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
}

const getUserCart = (userId, res) => {
    User.findOne({_id:userId})
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
        return res.status(422).json({error:err})
    })
}

const likePost = (userId, postId, res) => {
    Post.findByIdAndUpdate(postId,{
        $push:{likes:userId}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
}

const unlikePost = (userId, postId, res) => {
    Post.findByIdAndUpdate(postId,{
        $pull:{likes:userId}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else {
            res.json(result)
        }
    })
}

const postComment = (userId, postId, text, res) => {
    const comment = {
        text:text,
        postedBy:userId
    }
    Post.findByIdAndUpdate(postId,{
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
}

const deletePost = (userId, postId, res) => {
    Post.findOne({_id:postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
                return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === userId.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                return res.status(422).json({error:err})
            })
        }
    })
}

const searchPost = (query, res) => {
    let postPattern = new RegExp("^"+query)
    Post.find({title:{$regex:postPattern}})
    .select("_id title body postedBy photo")
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
}

module.exports = {
  findUser,
  rateUser,
  unrateUser,
  pay,
  completePayment,
  getAllPosts,
  createPost,
  updateProfilePicture,
  addItem,
  removeItem,
  getUserPosts,
  getUserCart,
  likePost,
  unlikePost,
  postComment,
  deletePost,
  searchPost,
};
