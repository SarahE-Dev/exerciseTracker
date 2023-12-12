const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()

app.use(cors())
app.use(express.json())
app.use(logger('dev'))


const mongoose = require('mongoose')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

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
        type: String,
        required: true
    },
    log: [{
        description: {
          type: String,
          required: true
        },
        duration: {
          type: Number,
          required: true
        },
        date: {
          type: Date,
          required: true
        }
      }]
})

const User = mongoose.model('Exercise', exerciseSchema)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
  });

app.post('/api/users',(req, res)=>{
    User.findOne({username: req.body.username}, (err, doc)=>{
        if (doc) {
          res.json({
            userame: doc.username,
            _id: doc._id
          })
        } else {
          User.create({
            username: req.body.username,
            log: []
          })
            .then(savedDoc=>{
            res.json({
              username: savedDoc.username,
              _id: savedDoc._id
            });
          });
        }
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
    try {
        let {description, duration, date} = req.body
        if(!date)date=new Date().toDateString();
        let newStuff = {
            description,
            duration,
            date
        }
        
        let updatedUser = await User.findByIdAndUpdate({_id: req.params._id}, newStuff, {new: true})
        let ObjectToSend = {
            username: updatedUser.username,
            description: updatedUser.description,
            duration: parseInt(updatedUser.duration),
            date: updatedUser.date,
            _id: updatedUser._id
        }
        res.json(ObjectToSend)
    } catch (error) {
        res.json({"error": error.message})
    }
    
    
})

app.get('/api/users/:_id/logs', async (req, res)=>{
    try {
        let foundUser = User.findById
    } catch (error) {
        
    }
})



app.listen(3000, ()=>{
    console.log('Server started on Port: 3000');
})