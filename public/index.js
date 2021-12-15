import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js'
import { OrbitControls } from 'https://cdn.skypack.dev/@three-ts/orbit-controls'

//loader
const loader = new THREE.TextureLoader()
const cross = loader.load('/texture/cross.png')
const slash = loader.load('/texture/equal.png')
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.BoxGeometry( 2,2,2 );
const torus = new THREE.TorusKnotGeometry( .4, .07, 100, 16 )
const particlesGeometry = new THREE.BufferGeometry;
const particlesGeometry1 = new THREE.BufferGeometry;
const particlescount = 2000;

const posArray = new Float32Array(particlescount * 3)
const posArray1 = new Float32Array(particlescount * 3)

for(let i=0; i < particlescount*3 ; i++){
    // posArray[i] = (Math.random() - .5) *5
    posArray[i] = (Math.random() - .5) * (Math.random() * 5)
}

for(let i=0; i < particlescount*3 ; i++){
    // posArray[i] = (Math.random() - .5) *5
    posArray1[i] = (Math.random() - .5) * (Math.random() * 5)
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray,3))

particlesGeometry1.setAttribute('position', new THREE.BufferAttribute(posArray1,3))
// Materials

const material = new THREE.MeshPhongMaterial({
    wireframe:true,
    color: 'black'
})

const particlesMaterial = new THREE.PointsMaterial({
    map: cross,
    size: .01,
    transparent: true,
    color: 'pink'
})

const particlesMaterial1 = new THREE.PointsMaterial({
    map: slash,
    size: .01,
    transparent: true,
    color: 'pink'
})
const wireframe = new THREE.WireframeGeometry( torus );

const line = new THREE.LineSegments( wireframe );
line.material.depthTest = false;
line.material.opacity = 0.25;
line.material.transparent = true;

scene.add( line );

line.position.y =1.75    
line.rotation.x =90

// Mesh

const box = new THREE.Mesh(geometry,material)
// const plane = new THREE.Mesh(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
const particlesMesh1 = new THREE.Points(particlesGeometry1, particlesMaterial1)
// scene.add(plane)
scene.add(box, particlesMesh,particlesMesh1)

fetch("/texture/instances.json").then(r => r.json()).then(instanceData => {
    let geometry = new THREE.BoxGeometry(0.005, 0.005, 0.005)
    let material = new THREE.MeshPhongMaterial()
    let mesh = new THREE.InstancedMesh(geometry, material, instanceData.length)
    
    let matrix = new THREE.Matrix4() // init matrix to assign transforms from
    for (let i = 0; i < instanceData.length; i++) {
        let inst = instanceData[i]
        let pos = new THREE.Vector3(inst["tx"], inst["ty"], inst["tz"])
        matrix.setPosition(pos)
        mesh.setMatrixAt(i, matrix)
    }

    scene.add(mesh)
   
    // mesh.rotation.y= .4
    mesh.position.y= .5
})




// Lights

        const light1 = new THREE.PointLight(0x00ff00,10);
        light1.position.set(0,300,500);
        scene.add(light1);
        const light2 = new THREE.PointLight(0x0000ff,10);
        light2.position.set(500,100,0);
        scene.add(light2);
        const light3 = new THREE.PointLight(0xff0000,10);
        light3.position.set(0,100,-500);
        scene.add(light3);
        const light4 = new THREE.PointLight(0x00ff00,10);
        light4.position.set(-500,300,500);
        scene.add(light4);

// gui.add(pointLight.position, 'x').min(-10).max(10)
// gui.add(pointLight.position, 'y').min(-10).max(10)
// gui.add(pointLight.position, 'z').min(-10).max(10)

// const col = {color:'#00ff00'}
// gui.addColor(col,'color').onChange(() => {
//     light3.color.set(col.color)
//     particlesMaterial.color.set(col.color)
// })

// const light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 )
// 	scene.add( light )
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight 
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight 

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 0.1, 4000)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = .1

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#000000'), 1)
// renderer.shadowMap.enabled = true
// renderer.gammaOutput = true

/**
//gui controls
*/
gui.add(vibFreq, 'vibrato', 1, 10,1)
gui.add(bgVol, 'BackVolume', 0, 1, .1)
// gui.add(camera.position, 'x').min(-3).max(3)
// gui.add(camera.position, 'y').min(-3).max(3)
// gui.add(camera.position, 'z').min(-3).max(3)
// gui.add(vibFreq.position, 'y').min(-10).max(10)
// gui.add(pointLight.position, 'z').min(-10).max(10)

// notes.forEach(({name,frequency}) => {
//     document.getElementById(name).addEventListener("click", () => {
//         camera.position.set( 
//             ((Math.random()*4) - 2), 
//             ((Math.random()*4) - 2),
//             ((Math.random()*4) - 2) + 3
//             )
//     })
// })

keys.forEach(key => {
    key.addEventListener('click', () => {
        camera.position.set( 
            ((Math.random()*4) - 2), 
            ((Math.random()*4) - 2),
            ((Math.random()*4) - 2) + 3
            )
    })
})

playButton.addEventListener('click', () => {
    if(playButton.classList.contains('show')){
        if (songNotes.length === 0) return
        songNotes.forEach(note =>{
            setTimeout(() => {
                camera.position.set( 
                    ((Math.random()*4) - 2), 
                    ((Math.random()*4) - 2),
                    ((Math.random()*4) - 2) + 3
                    )
            }, note.startTime)
        })
    }
})

/**
 * Animate
 */

 document.addEventListener('mousemove', particleAnimate)
 let mouseX = 0
 let mouseY = 0
 
 function particleAnimate(event){
     mouseX = event.clientX
     mouseY = event.clientY
 }

const clock = new THREE.Clock()



  

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    box.rotation.y = .5 * elapsedTime
    box.rotation.x = .3 * elapsedTime
    line.rotation.z = .5 * elapsedTime
    
    particlesMesh.rotation.z = elapsedTime * -.1
    particlesMesh.rotation.y = elapsedTime * -.1
    particlesMesh.position.z = 1
 
    particlesMesh1.rotation.z = elapsedTime * .1
    particlesMesh1.rotation.y = elapsedTime * .1
    particlesMesh1.position.z = 1
    // particlesMesh.position.z = elapsedTime * -.01
    
    if(mouseX > 0){
        particlesMesh.rotation.x = -mouseY * elapsedTime *.0001
        particlesMesh.rotation.y = -mouseX * elapsedTime *.0001
        particlesMesh.rotation.z = -mouseX * elapsedTime *.0001

        particlesMesh1.rotation.x = -mouseY * elapsedTime *.0001
        particlesMesh1.rotation.y = -mouseX * elapsedTime *.0001
        particlesMesh1.rotation.z = -mouseX * elapsedTime *.0001
        // particlesMesh.position.z =  mouseX * elapsedTime *.00005
    }

    // Update Orbital Controls
    controls.update()
    // controls.reset()

    // Render
    renderer.render(scene, camera)

    // Date Time
    var today = new Date();
    var day = today.getDay();
    var daylist = ["Sunday","Monday","Tuesday","Wednesday ","Thursday","Friday","Saturday"];
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' | '+time;
    
    document.getElementById("displayDateTime").innerHTML = dateTime;

     // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()