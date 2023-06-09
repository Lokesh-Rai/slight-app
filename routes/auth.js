const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')



router.post('/signup', (req, res)=>{
    const {name, email, password} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"All feilds are required!"})
        
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"Email already exists!"})
        }

        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            const user = new User({
                email:email,
                password:hashedpassword,
                name:name
            })

            user.save()
            .then(user=>{
                res.json({message:"saved successfully"})
            })
            .catch(error=>{
                console.log(error)
            })
        })
        
    })
    .catch(error=>{
        console.log(error)
    })
})



router.post('/', (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"All fields are important!"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            res.status(422).json({error:"Invalid Email or Passowrd"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const {_id,name,email}=savedUser
                const nam=savedUser.name
                res.json({token, user:{_id,name,email}, nam})
            }
            else{
                res.status(422).json({error:"Invalid Email or Passowrd"})
            }
        })
        .catch(error=>{
            console.log(error)
        })
           
    })
})

module.exports = router