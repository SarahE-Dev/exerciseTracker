const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(logger('dev'))


const mongoose = require('mongoose')

const User = require('./model/User')


mongoose
    .connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('MONGO DB CONNECTED');
    })
    .catch(e=>{
        console.log(e);
    })



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });

app.post('/api/users', async (req, res)=>{
   const {username} = req.body
   let newUser = await User.findOne({username: username}).exec();
   if(newUser !== null){
    res.json({username: newUser.username, _id: newUser._id})
   }else{
    newUser = new User({username: username})
    await newUser.save()
    res.json({username: newUser.username, _id: newUser._id})
   }
})

app.get('/api/users', async (req, res)=>{
    try {
        const users = await User.find({});
        res.json(users)
    } catch (error) {
        res.json({"error": error.message})
    }
    

})

app.post('/api/users/:_id/exercises', async (req, res)=>{
    let {duration, description, date} = req.body;
    if(!date){
        let realDate = new Date()
    }else{
        let realDate = new Date(date)
    }
    let numberDur = parseInt(duration)
    let updatedUser = await User.findByIdAndUpdate({_id: req.params._id}, {description: description, duration: numberDur, date: realDate}, {new: true,
    runValidators: true})
    res.json({username, description, duration, date, _id})
})

app.get('/api/users/:_id/logs', async (req, res)=>{
    try {
        
    } catch (error) {
        
    }
})



app.listen(3000, ()=>{
    console.log('Server started on Port: 3000');
})