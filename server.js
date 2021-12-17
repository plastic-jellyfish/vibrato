require("dotenv").config();
const express = require('express')
const moongoose = require('mongoose')
const Song = require('./models/songs')
const userLocation = require('./models/locations')
const app = express()

moongoose.connect(process.env.DATABASE, {
    useNewUrlParser:true, 
    useUnifiedTopology: true
})
.then(() =>{
    console.log("DB Connected!")
})

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req,res) => {
    res.render('index')
})

app.post('/tunes', async (req,res) => {
    const song = new Song({
        notes: req.body.songNotes
    })

    await song.save()
    res.json(song)
})

app.get('/tunes/:id', async (req,res) =>{
    let song
    try{
        song = await Song.findById(req.params.id)
    } catch(e){
        song = undefined
    }
    res.render('index', {song:song})
})

app.post('/userlocation', async (req,res) => {
    const location = new userLocation({
        location: req.body.userL
    })
    await location.save()
    res.json(location)
})

app.listen(process.env.PORT || 5000)