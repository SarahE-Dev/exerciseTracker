const mongoose = require('mongoose')

const ExerciseSchema = new mongoose.Schema({
    user_id: {type: String, required: true},
    description: {
        type: String
    },
    duration: {
        type: Number
    },
    date: {
        type: Date 
    }
})

module.exports = mongoose.model('Exercise', ExerciseSchema)