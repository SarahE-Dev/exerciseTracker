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

app.post('/api/users', (req, res)=>{
   let newUser = new User({username: req.body.username})
   newUser
        .save()
        .then((doc)=>{
            res.json(doc)
        })
        .catch(err=>{
            console.log(err);
        })
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
        date = new Date()
        date = date.toDateString()
    }
    
    let updated = {duration, description, date}
    let foundUser = await User.findByIdAndUpdate({_id: req.params._id}, updated, {new: true})
    res.json({foundUser})
})

app.get('/api/users/:_id/logs', async (req, res)=>{
    try {
        
    } catch (error) {
        
    }
})



app.listen(3000, ()=>{
    console.log('Server started on Port: 3000');
})