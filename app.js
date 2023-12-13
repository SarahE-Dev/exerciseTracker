const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('morgan')
require('dotenv').config()

app.use(cors())
app.use(logger('dev'))
app.use(express.urlencoded({extended: true}))


const mongoose = require('mongoose')

const {Schema} = mongoose;

const UserSchema = new Schema({
    username: String
})

const User = mongoose.model('User', UserSchema)

const ExerciseSchema = new Schema({
    user_id: {type: String, required: true},
    description: String,
    duration: Number,
    date: Date
})

const Exercise = mongoose.model('Exercise', ExerciseSchema)


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
   const userObject = new User({
    username: req.body.username
   })
   
   try {
    const user = await userObject.save()
    console.log(user);
    res.json(user)
   } catch (error) {
    console.log(error);
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
    const {id} = req.params._id
    const {description, duration, date} = req.body
    try {
        const user = await User.findById(id)
        if(!user){
            res.send('Could not find user.')
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
        res.send('there was an error')
    }
})

app.get('/api/users/:_id/logs', async (req, res)=>{
    const {from, to, limit} = req.query
    const {id} = req.params._id
    try {
        const user = await User.findById(id)
        if(!user){
            res.send('could not find user');
            return
        }
        let dateObj = {}
        if(from){
            dateObj['$gte'] = new Date(from)
        }
        if(to){
            dateObj['$lte'] = new Date(to)
        }
        let filter = {
            user_id: id
        }
        if(from || to){
            filter.date = dateObj
        }
        const exercises = await Exercise.find(filter).limit(+limit ?? 500)
        const log = exercises.map(e=>({
            description: e.description,
            duration: e.duration,
            date: e.date.toDateString()
        }))
        res.json({
            username: user.username,
            count: exercises.length,
            _id: user_id,
            log
        })
    } catch (error) {
        
    }
})



app.listen(3000, ()=>{
    console.log('Server started on Port: 3000');
})