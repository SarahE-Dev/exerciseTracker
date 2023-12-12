const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(logger('dev'))

const mongoose = require('mongoose')

mongoose
    .connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log('MONGO DB CONNECTED');
    })
    .catch(e=>{
        console.log(e);
    })

const exerciseSchema = new mongoose.Schema({
    username: {
        type: String
    },
    __v: {
        type: Number,
        select: false
    }
})

const User = mongoose.model('Exercise', exerciseSchema)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });

app.post('/api/users', async (req, res)=>{
    try {
        const {username} = req.body;
        const newUser = new User({
            username
        })
        await newUser.save()
        res.json({"username": newUser.username, "_id": newUser._id})
    } catch (error) {
        res.json({"error": error.message})
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

app.post('/api/users/:id/exercises', async (req, res)=>{
    try {
        const {description, duration, date} = req.body
        if(!date)date=new Date();
        let newStuff = {
            description, duration, date
        }
        let updatedUser = await User.findByIdAndUpdate({_id: req.params.id}, newStuff, {new: true})
        res.json({"username": updatedUser.username, "description": updatedUser.description, "duration": updatedUser.duration, "date": updatedUser.date, "_id": updatedUser._id})
    } catch (error) {
        res.json({"error": error.message})
    }
    
    
})

app.listen(3000, ()=>{
    console.log('Server started on Port: 3000');
})