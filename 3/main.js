import * as three from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { GUI } from 'lil-gui';
// import vertex from './glsl/vertex.vert'
// import fragment from './glsl/fragment.frag'
// import { PitchDetector, } from 'pitchy'

const gui = new GUI()


const canvas = document.querySelector("#canvas")
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}
const scene = new three.Scene();
scene.background = new three.Color("#111")
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
// camera.position.x = 0
camera.position.y = 20
camera.position.z = 6

// camera.lookAt(0, 50, 0)

gui.add(camera.position, "x", 0, 10, 1)
gui.add(camera.position, "y", 0, 100, 1)
gui.add(camera.position, "z", 0, 100, 1)


let material


// let uniforms = {
//     uProgress: { value: 0 },
//     // uTexture: { value: null }
// }

const animatedUniforms = []
function model_to_point(model) {

    const color = model.name == 1 ? new three.Color("#90EE90") : new three.Color("white")

    // if (model.name == 1) {
    //     model.material.color = new three.Color("green")
    // }

    const uniforms = {
        uProgress: { value: 0 },
        uTexture: { value: model.material.map || null },
        ucolor: { value: color },
    };


    // console.log(model.material.map);
    // if (model.material.map) {
    // uniforms.uTexture.value = model.material.map
    // }

    const geometry = model.geometry.clone()
    geometry.applyMatrix4(model.matrixWorld);

    const position = geometry.attributes.position
    const count = position.count;
    // console.log(petel.material);


    const startPositions = new Float32Array(count * 3);
    // const targetPositions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        // random start positions
        startPositions[i * 3 + 0] = (Math.random() - 0.5) * 100;
        startPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        startPositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }

    // const bufferGeometry = new three.BufferGeometry();
    geometry.setAttribute('startPosition', new three.BufferAttribute(startPositions, 3));
    // geometry.setAttribute('targetPosition', new three.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('targetPosition', position);
    // const colorAttr = geometry.attributes.color;
    // geometry.setAttribute('color', new three.BufferAttribute(colorAttr.array, 3));

    material = new three.ShaderMaterial({
        uniforms,
        vertexShader: `
      attribute vec3 startPosition;
      attribute vec3 targetPosition;
      uniform float uProgress;
      varying vec3 vColor;
      varying vec2 vuv;
      void main() {


        // Interpolate position in model space
        vec3 pos = mix(startPosition, targetPosition, uProgress);

        // Transform position to view space
        // vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

        // Size attenuation (based on distance to camera)
        // float size = 4.0 / -mvPosition.z;
        gl_PointSize = 2.0;

        // Final projected position
        // gl_Position = projectionMatrix * mvPosition;


        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        vColor = vec3(1.0,0.0,0.0);
        vuv=uv;
        
      }
    `,
        fragmentShader: `
      varying vec3 vColor;
      uniform sampler2D uTexture;
      varying vec2 vuv;
      uniform vec3 ucolor;

        void main() {
        float dist = distance(gl_PointCoord, vec2(0.5));
        if (dist > 0.5) discard;
        // gl_FragColor = vec4(1.0, 1.0, 0.9, 1.0);
        // gl_FragColor = vec4(vColor, 1.0);

        vec4 texColor = texture2D(uTexture, vuv);
        
        vec4 final=mix(texColor,vec4(ucolor,1.0),.2);

        gl_FragColor = final;

      }
    `,
        transparent: true,
        vertexColors: true,
        // depthWrite: false,
    });

    animatedUniforms.push(uniforms);

    const newmesh = new three.Points(geometry, material)
    newmesh.scale.set(100, 100, 100)
    scene.add(newmesh)

}






// let material

const loader = new GLTFLoader()
loader.load("flower.glb", (gltf) => {
    gltf.scene.children.forEach(each => {
        // uniforms.uTexture.value = each.material.map
        // uniforms.uTexture.value = each.material.map
        console.log(each);
        // if (material) {
        // }

        model_to_point(each);
        // material.uTexture.value = each.material.map
    });

    // model_to_point(gltf.scene.children[0]);
    // model_to_point(gltf.scene.children[1]);


})



const particles = new three.BufferGeometry();
const count = 10000;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 50;
}
particles.setAttribute('position', new three.BufferAttribute(positions, 3));

const particleMaterial = new three.PointsMaterial({
    size: 0.05,
    color: 0xffffff,
    transparent: true,
    opacity: 0.2,
});
const particleSystem = new three.Points(particles, particleMaterial);
scene.add(particleSystem);




scene.add(new three.AmbientLight("white", 10))

const orbitcontrol = new OrbitControls(camera, canvas)
console.log(orbitcontrol);
orbitcontrol.target.set(0, 15, 0)






const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);


let current = 0;
const target = .99999;
const speed = 0.01;
function animate() {
    window.requestAnimationFrame(animate)
    renderer.render(scene, camera);

    orbitcontrol.update()

    // orbitcontrol.target.set(0, 5, 0)




    // current = three.MathUtils.lerp(current, target, speed);
    if (material) {
        current = three.MathUtils.lerp(current, target, speed);
        // console.log(current);
        animatedUniforms.forEach(uniform => {
            uniform.uProgress.value = current;
        })
        // material.uniforms.uProgress.value = current;
        // material.uniforms.uTexture.value.needsUpdate = true;
        // console.log(material.uniforms.uTexture.value);
        // material.uniforms.uTexture.value.updateMatrix()
    }
    // console.log(material);

    // material.uniforms.utime.value += .01



}
animate()