import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import vertex from './glsl/vertex.vert'
import fragment from './glsl/fragment.frag'
import { PitchDetector, } from 'pitchy'


const canvas = document.querySelector("#canvas")
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 8;



const material = new three.ShaderMaterial({
    side: three.DoubleSide,
    wireframe: true,
    vertexColors: true,

    // transparent: true,
    // opacity: 0,

    uniforms: {
        utime: { value: 0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,


})


const plane = new three.Points(new three.PlaneGeometry(10, 10, 150, 150), material)

scene.add(plane)
plane.rotation.x = -Math.PI / 3

new OrbitControls(camera, canvas)




// const audioContext = new AudioContext();
// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {
//         const source = audioContext.createMediaStreamSource(stream);
//         const analyser = audioContext.createAnalyser();
//         analyser.fftSize = 2048;
//         source.connect(analyser);

//         const dataArray = new Float32Array(analyser.fftSize);
//         const pitchDetector = new PitchDetector(analyser.fftSize, audioContext.sampleRate);

//         function update() {
//             analyser.getFloatTimeDomainData(dataArray);
//             const pitch = pitchDetector.detectPitch(dataArray);
//             if (pitch) console.log("Pitch:", pitch.toFixed(2), "Hz");
//             requestAnimationFrame(update);
//         }

//         update();
//     })
//     .catch(console.error);





// import { detectPitch } from 'https://cdn.jsdelivr.net/npm/pitchy@3.1.0/+esm';
// import { PitchDetector } from 'pitchy';

// navigator.mediaDevices.enumerateDevices().then(devices => {
//     console.log(devices.filter(d => d.kind === 'audioinput'));
// });


// const audioContext = new AudioContext()
// const analyser = audioContext.createAnalyser();
// analyser.fftSize = 2048;

// // Create a detector with buffer length matching analyser
// const detector = PitchDetector.forFloat32Array(analyser.fftSize);
// const inputBuffer = new Float32Array(detector.inputLength);

// // new three.AudioAnalyser()

// navigator.mediaDevices.getUserMedia({ audio: true })
//     .then(stream => {

//         const source = audioContext.createMediaStreamSource(stream);
//         source.connect(analyser);

//         function update() {
//             analyser.getFloatTimeDomainData(inputBuffer);
//             const [pitch, clarity] = detector.findPitch(inputBuffer, audioContext.sampleRate);

//             console.log(Math.floor(pitch));


//             // if (clarity > 0.9 && pitch) {
//             // console.log(`Pitch: ${pitch} Hz — Clarity: ${clarity}`);
//             // console.log(`Pitch: ${pitch.toFixed(2)} Hz — Clarity: ${clarity.toFixed(2)}`);
//             // }

//             requestAnimationFrame(update);
//         }

//         update();
//     })
//     .catch(err => console.error('Audio error:', err));





const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

function animate() {
    renderer.render(scene, camera);

    material.uniforms.utime.value += .01



    window.requestAnimationFrame(animate)
}
animate()