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

// changeIcon = (icon) => icon.classList.toggle('fa-times')
// jQuery.get("https://ipinfo.io", function(e) {
//   console.log(e)
// },"jsonp")

// fetch('https://api.ipify.org/?format=json')
//   .then(results => results.json())
//   .then(data => console.log(data.ip))

// mapButton.addEventListener('click', () => {
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
// })
  
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
  userLocation.push({
    key: id,
    latitude: latitude,
    longitude: longitude,
    city: city,
    locality: locality
  })
  // console.table(userLocation)
}

songLink.addEventListener('click', () => {
  if((songLink.classList.contains('show')) && saveFlag ===1){
    saveSong()
    saveFlag =0
  }
  else shareTune()
})

function shareTune(){
  if(url != 'https://vibrato-app.herokuapp.com/'){
      if(songLink.classList.contains('show')) {
        if(navigator.share){
            navigator.share({
              title: `${title}`, 
              text: 'Play my tune',
              quote: quote[Math.floor(Math.random()*30)],
              url: `${url}`
            }) .then(() => {
              // console.log('Thanks for sharing!')
              // console.log(quote[2])
            })
            .catch(console.error)
        } else{
            console.log('No Navigator')
            overlay.classList.add('show-share')
            share.classList.add('show-share')
            document.getElementById('url').innerHTML = url
            document.getElementById('url').href = url 
            document.getElementById('quote').innerText = quote[Math.floor(Math.random()*30)] 
        }
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