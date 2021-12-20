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
    },
    time: {
        type: String,
        required: true
    },
    ip:{
        type: String,
        required: true
    },
    ipCity:{
        type: String,
        required: true
    },
    ipCountry:{
        type: String,
        required: true
    },
    ipTime:{
        type: String,
        required: true
    },
    ipName:{
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    location: [locationSchema]
})

module.exports = mongoose.model('UserLocation', userSchema)