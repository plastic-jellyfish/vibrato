// const dotenv = require("dotenv").config();
const recordButton = document.querySelector('.record-button')
const playButton = document.querySelector('.play-button')
const aboutButton = document.querySelector('.about-button')
const songLink = document.querySelector('.save-button')
const keys = document.querySelectorAll('.key')
const overlay = document.querySelector('.overlay')
const share = document.querySelector('.share')
const title = window.document.title
let url = 'https://vibrato-app.herokuapp.com/'

const audioContext = new AudioContext()
const buffer = audioContext.createBuffer(1,audioContext.sampleRate*1, audioContext.sampleRate)
const channelData = buffer.getChannelData(0)
var randNote = Math.floor(Math.random()*10)
var freq =  Math.floor((Math.random() * 1000) + 1); 
var cut = audioContext.currentTime
var vibFreq = {vibrato: 4}
var bgVol = {BackVolume: .5}

let latitude = 29.677315
let longitude = 91.139156
let city= 'Lhasa'
let locality = 'Chabxi'
let ip = '0.0.0.0'
let ipCity = 'internet'
let ipCountry = 'WD'
let ipTime = 'NoTime'
let ipName = 'NoName'

// jQuery.get("http://ipinfo.io", function(e) {
//   console.log(e)
// },"jsonp")

// fetch('https://api.ipify.org/?format=json')
//   .then(results => results.json())
//   .then(data => console.log(data))

async function json(url) {
  const res = await fetch(url)
  return await res.json()
}

let apiKey = 'fd2fc840fdf2b920a39b2e7ace19e5d63f48630e172e1a3cd1c9c88e'
json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
  ip = data.ip
  ipCity = data.city
  ipCountry = data.country_code
  ipTime = data.time_zone.current_time
  ipName = data.asn.name
  // console.log(ip)
  // console.log(ipCity)
  // console.log(ipCountry)
  // console.log(ipTime)
  // console.log(ipName)
});


getLocation()

function getLocation(){
  navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true
  })
  
  function successLocation(position) {
  // console.log(position.coords.latitude,position.coords.longitude)
  latitude = position.coords.latitude
  longitude= position.coords.longitude
  const geoAPI = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  
  fetch(geoAPI)
  .then(res => res.json())
  .then(data => {
    // console.log(data.city, data.locality)
    city = data.city
    locality = data.locality
  })
  }

  function errorLocation() {
     console.log(error in location)
  }
}
  
for(let i=0 ; i<buffer.length; i++){
    channelData[i]= Math.random() *2 -1
}

const primaryGainControl = audioContext.createGain()
primaryGainControl.gain.setValueAtTime(0.05,0)
primaryGainControl.connect(audioContext.destination)

const keyMap = [...keys].reduce((map,key) => {
  map[key.dataset.note] = key
  return map
}, {})

let recordingStartTime
let songNotes = currentSong && currentSong.notes
let quote = []

getData()
async function getData(){
  const response = await fetch('/texture/antiworkquotes.csv')
  const data = await response.text()
  quote = data.split('\n')
}

const text = baffle('.spam')
text.set({
  characters: '▒▒▒ ▒▒█/█ █▓░▓▒ ▓░▒ ░░▓▓▓ ▒▒░/ <▒▓ ██░░ ▒▓<░', 
  speed: 150
})
text.start()
// text.reveal(4000)

document.querySelector('.spam').addEventListener('mouseover' || 'touchstart',() => {
  text.stop()  
  text.reveal(2000)
})
document.querySelector('.spam').addEventListener('mouseout' || 'touchend',() => {
  text.start()  
})

const asterisk = baffle('.about-button')
asterisk.set({
  characters: '#*^/\=+~', 
  speed: 200
})
asterisk.start()

keys.forEach(key => {
  key.addEventListener('click', () => playNote(key))
})

if(recordButton){
  recordButton.addEventListener('click', toggleRecording)
}

playButton.addEventListener('click', () => {
  if(playButton.classList.contains('show')) playsong()
})



overlay.addEventListener('click', () => {
  overlay.classList.remove('show-share')
  share.classList.remove('show-share')
  // resetURL()
})

function toggleRecording(){
  recordButton.classList.toggle('active')
  document.querySelector('.fas.fa-circle').classList.toggle('fa-times')
  if(isRecording()){
    startRecording()
  } else{
    stopRecording()
  }
}

function isRecording(){
  return recordButton != null && recordButton.classList.contains('active')
}

let saveFlag =0

function startRecording(){
  recordingStartTime = Date.now()
  songNotes = []
  userLocation = []
  playButton.classList.remove('show')
  songLink.classList.remove('show')
  document.getElementById('play1').classList.remove('show')
  saveFlag =1
}

function stopRecording(){
  // playsong()
  playButton.classList.add('show')
  songLink.classList.add('show')
  resetURL()
}

function playsong(){
  if (songNotes.length === 0) return
  let len = songNotes.length
  songNotes.forEach(note =>{
    setTimeout(() => {
      playButton.classList.add('active')
      playNote(keyMap[note.key])
      // console.log(note)
      len -= 1
      if (len === 0) playButton.classList.remove('active')
    }, note.startTime)
  })
}

function resetURL(){
  url = 'https://vibrato-app.herokuapp.com/'
}

function recordNote(note){
  songNotes.push({
    key: note,
    startTime: Date.now() - recordingStartTime
  })
  // console.table(songNotes)
}

let userLocation = []

function recordLocation(id){
  var today = new Date();
  var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' | '+time;
  userLocation.push({
    key: id,
    latitude: latitude,
    longitude: longitude,
    city: city,
    locality: locality,
    time: dateTime,
    ip: ip,
    ipCity: ipCity,
    ipCountry: ipCountry,
    ipTime: ipTime,
    ipName: ipName
  })
  // console.table(userLocation)
}

songLink.addEventListener('click', () => {
  // if(latitude != 29.677315){
    if((songLink.classList.contains('show')) && saveFlag ===1){
      saveSong()
      saveFlag =0
    }
    else shareTune()
  // }
  // else getLocation()
})

function shareTune(){
  if(url != 'https://vibrato-app.herokuapp.com/'){
      if(songLink.classList.contains('show')) {
        TelegramGameProxy.shareScore()
        // if(navigator.share){
        //     navigator.share({
        //       title: `${title}`, 
        //       text: 'Play my tune',
        //       quote: quote[Math.floor(Math.random()*30)],
        //       url: `${url}`
        //     }) .then(() => {
        //       // console.log('Thanks for sharing!')
        //       // console.log(quote[2])
        //     })
        //     .catch(console.error)
        // } else{
        //     console.log('No Navigator')
        //     overlay.classList.add('show-share')
        //     share.classList.add('show-share')
        //     document.getElementById('url').innerHTML = url
        //     document.getElementById('url').href = url 
        //     // document.getElementById('quote').innerText = quote[Math.floor(Math.random()*30)] 
        // }
      }
      // resetURL()
    }
}

async function saveSong(){
  await axios.post('/tunes',{ songNotes: songNotes }).then(res => {
    songLink.classList.add('show')
    url += 'tunes/' + res.data._id
    console.log(url)
    recordLocation(res.data._id)
  })
  await axios.post('/userlocation',{ userL: userLocation }).then(res => {
    // console.log(res.data)
  })
  shareTune()
}

function playNote(key){
      // console.log(key)
      if(isRecording()) recordNote(key.dataset.note)
      const noteOSC = audioContext.createOscillator()
      noteOSC.frequency.setValueAtTime(parseFloat(key.dataset.freq), audioContext.currentTime)
      noteOSC.type="sawtooth"
     
      const vibarato = audioContext.createOscillator()
      vibarato.frequency.setValueAtTime(vibFreq.vibrato  ,0)
      vibarato.type="square"
      const vibaratoGain = audioContext.createGain()
      vibaratoGain.gain.setValueAtTime(10,0)
      vibarato.connect(vibaratoGain)
      vibaratoGain.connect(noteOSC.frequency)
      // vibaratoGain.connect(vibaratoGain.gain)
      vibarato.start()

      const attackTime = 0.2
      const decayTime = 0.3
      const sustainLevel = 0.7
      const releaseTime = 0.2

      const now = audioContext.currentTime
      const noteGain = audioContext.createGain()
      noteGain.gain.setValueAtTime(0,0)      
      noteGain.gain.linearRampToValueAtTime(1, now + attackTime)
      noteGain.gain.linearRampToValueAtTime(sustainLevel, now + decayTime)
      noteGain.gain.setValueAtTime(sustainLevel, now+1 - releaseTime)
      noteGain.gain.linearRampToValueAtTime(0,now+2)

      noteOSC.connect(noteGain)
      noteGain.connect(primaryGainControl)
      noteOSC.start()
      noteOSC.stop(now + 2)
}

function playMelody(freq){
  const noteOSC = audioContext.createOscillator()
  noteOSC.frequency.setValueAtTime(freq, audioContext.currentTime)
  noteOSC.type="sine"
  // noteOSC.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + .5)

  const vibarato = audioContext.createOscillator()
  vibarato.frequency.setValueAtTime(10,0)
  // vibarato.type="square"
  const vibaratoGain = audioContext.createGain()
  vibaratoGain.gain.setValueAtTime(5,0)
  vibarato.connect(vibaratoGain)
  vibaratoGain.connect(noteOSC.frequency)
  // vibaratoGain.connect(vibaratoGain.gain)
  vibarato.start()

  const attackTime = 0.2
  const decayTime = 0.3
  const sustainLevel = bgVol.BackVolume * 0.7
  const releaseTime = 0.2

  const now = audioContext.currentTime
  const noteGain = audioContext.createGain()
  noteGain.gain.setValueAtTime(0,0)      
  noteGain.gain.linearRampToValueAtTime(bgVol.BackVolume, now + attackTime)
  noteGain.gain.linearRampToValueAtTime(sustainLevel, now + decayTime)
  noteGain.gain.setValueAtTime(sustainLevel, now+1 - releaseTime)
  noteGain.gain.linearRampToValueAtTime(0,now+5)

  noteOSC.connect(noteGain)
  noteGain.connect(primaryGainControl)
  noteOSC.start()
  noteOSC.stop(now + 10)
}

const loop = () => {
  if (audioContext.currentTime - cut > (Math.random()+1.5)){
    freq =  Math.floor((Math.random() * 300) + 100); 
    cut = audioContext.currentTime
    playMelody(freq)
    // console.log(freq)
  }
  window.requestAnimationFrame(loop)
}
loop()

aboutButton.addEventListener('click', () => {
  // document.location.href="https://flowmap.blue/1HrpeeqErr94Zu9cVuPviCCixRpuYb8EW-TTcH5vS4oA"
})