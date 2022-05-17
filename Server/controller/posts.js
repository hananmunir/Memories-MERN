import PostDesc from '../models/postDescription.js'
import mongoose from 'mongoose'
//get posts method
export const getPost = async (req, res) =>{
   try {
       const post = await PostDesc.find()
       res.status(200).json(post)
   } catch (error) {
       res.status(404).json( {message : error.message})
   }
}

export const createPost = async (req, res) =>{
    const post = req.body
    const newPost = new PostDesc({...post, creator: req.userId, createdAt: new Date().toISOString})
    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json( {message : error.message})
    }
}

export const updatePost = async(req,res) =>{
    
    const {id : _id} = req.params
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("Object not found")

    const updatePost = await PostDesc.findByIdAndUpdate(_id, {...post, _id},{new : true})
   
    res.json(updatePost)
}

export const deletePost = async(req,res) =>{
    
    const {id : _id} = req.params
    
    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("Object not found")

    await PostDesc.findByIdAndRemove(_id)

    res.json({message : "Post Deleted Successfully"})
}

export const likePost = async(req,res) =>{
    
    const {id : _id} = req.params
    
    if(!req.userId)
        return res.status(400).json({ message : "Unauthenticated User"})
    if(!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send("Object not found")

    const post = await PostDesc.findById(_id)
    const index = post.likes.findIndex((id) => id === String(req.userId))
    if( index == -1){
        post.likes.push(req.userId)
    }else{
        post.likes.filter((id) => id !== String(req.userId) )
    }
    const updatedPost = await PostDesc.findByIdAndUpdate(_id, post, { new: true})

    res.json(updatedPost)
}