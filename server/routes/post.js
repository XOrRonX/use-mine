const express = require('express')
const router = express.Router()
const requireLogin = require('../middleware/requireLogin')
const services = require("./services");

/**
 * get all posts
 */
router.get('/allpost',requireLogin,(req,res)=>{
  return services.getAllPosts(res);
})

router.post('/createpost',requireLogin,(req,res)=>{
  return services.createPost(req,res);
})

router.put('/updatephoto',requireLogin,(req,res)=>{
  return services.updateProfilePicture(req.user._id, req.body.photo, res);
})

router.put('/addproduct/:id',requireLogin,(req,res)=>{
  return services.addItem(req.params.id, req.body.item, res);
})

router.put('/removeitem/:id',requireLogin,(req,res)=>{
  return services.removeItem(req.params.id, req.body.item, res);
})

router.get('/mypost',requireLogin,(req,res)=>{
  return services.getUserPosts(req.user._id, res);
})

router.get('/mycart',requireLogin,(req,res)=>{
  return services.getUserCart(req.user._id, res);
})

router.put('/like',requireLogin,(req,res)=>{
  return services.likePost(req.user._id, req.body.postId, res);
})

router.put('/unlike',requireLogin,(req,res)=>{
  return services.unlikePost(req.user._id, req.body.postId, res);
})

router.put('/comment',requireLogin,(req,res)=>{
  return services.postComment(req.user._id, req.body.postId, req.body.text, res);
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
  return services.deletePost(req.user._id, req.params.postId, res);
})

router.post('/search-post',(req,res)=>{
  return services.searchPost(req.body.query, res);
})

module.exports = router