const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
    key:{   
        type: String,
        required: true
    },
    latitude:{
        type: Number,
        required: true
    },
    longitude:{
        type: Number,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    locality:{
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    location: [locationSchema]
})

module.exports = mongoose.model('UserLocation', userSchema)