const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    description: {
          type: String,
    },
    duration: {
          type: Number,
    },
    date: {
          type: Date,
    }
    
})

module.exports = mongoose.model('Exercise', exerciseSchema)