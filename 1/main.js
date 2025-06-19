import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import vertex from './glsl/vertex.vert'
import fragment from './glsl/fragment.frag'



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
    wireframe: false,
    // transparent: true,
    // opacity: 0,

    uniforms: {
        utime: { value: 0 }
    },
    vertexShader: vertex,
    fragmentShader: fragment,


})


const plane = new three.Mesh(new three.PlaneGeometry(100, 100, 500, 500), material)
scene.add(plane)
plane.rotation.x = -Math.PI / 3

new OrbitControls(camera, canvas)



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