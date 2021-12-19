require("dotenv").config();
const express = require('express')

const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true } );
const gameName = process.env.GAMENAME;
let url = 'https://vibrato-app.herokuapp.com/';

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
    url = 'https://vibrato-app.herokuapp.com/';
    // console.log(song._id)
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
    // console.log(req.body.userL)
    url += 'tunes/' + req.body.userL[0].key
    console.log(url)
    await location.save()
    res.json(location)
})

// Matches /start
bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendGame(msg.chat.id, gameName);
});
  
// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, {url: url, show_alert: true});
});

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This is an amusing sound message app"));

app.listen(process.env.PORT || 5000)