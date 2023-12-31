const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))


const mongoose = require('mongoose')


const User = require('./model/User')
const Exercise = require('./model/Exercise')


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
    try {
        const foundUser = await User.find({username: req.body.username})
        if(foundUser.length > 0){
            res.json(foundUser)
        }else{
            const userObject = new User({
                username: req.body.username
               })
            const user = await userObject.save()
            res.json(user)
        }
        
   } catch (error) {
    console.log(error);
   }
})

app.get('/api/users', async (req, res)=>{
    try {
        const users = await User.find({}).select("username _id");
        res.json(users)
    } catch (error) {
        res.json({"error": error.message})
    }
    

})

app.post('/api/users/:_id/exercises', async (req, res)=>{
    const {_id} = req.params
    const {description, duration, date} = req.body
    try {
        const user = await User.findById(_id)
        if(!user){
            res.json({message: 'could not find user'})
        }else{
            const exerciseObj = new Exercise({
                user_id: user._id,
                description,
                duration,
                date: date ? new Date(date) : new Date()
            })
            const exercise = await exerciseObj.save()
            res.json({
                username: user.username,
                description: exercise.description,
                duration: exercise.duration,
                date: new Date(exercise.date).toDateString(),
                _id: user._id
        })
        }
    } catch (error) {
        console.log(error);
    }
})

app.get('/api/users/:_id/logs', async (req, res)=>{
    const {from, to, limit} = req.query
    try {
        const id = req.params._id
        const user = await User.findById(id)
        if(!user){
            res.json({"message": "could not find user"})
        }
        let dateObj = {}
        if(from){
            dateObj["$gte"] = new Date(from)
        }
        if(to){
            dateObj["$lte"] = new Date(to)
        }
        let filter = {
            user_id: id
        }
        if(from || to){
            filter.date = dateObj
        }
        const exercises = await Exercise.find(filter).limit(+limit ?? 500)
        let log = exercises.map(e=>({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString()
        }))
        res.json({
            username: user.username,
            count: exercises.length,
            _id: user._id,
            log: log ? log : []
        })
    } catch (error) {
        console.log(error);
    }
})



app.listen(3000, ()=>{
    console.log('Server started on Port: 3000');
})