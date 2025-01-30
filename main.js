import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the sky texture
const skyTextureUrl = 'sky.jpg'; // Path to your sky texture
const skyTexture = new THREE.TextureLoader().load(skyTextureUrl);
skyTexture.wrapS = THREE.RepeatWrapping; // Ensure the texture wraps correctly
skyTexture.wrapT = THREE.RepeatWrapping;
skyTexture.repeat.set(4, 4);

// Create a sky sphere
const skyGeometry = new THREE.SphereGeometry(5000, 32, 32); // Large radius to encompass the scene
const skyMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide // Render the texture on the inside of the sphere
});

const skySphere = new THREE.Mesh(skyGeometry, skyMaterial);
scene.add(skySphere);

// Rotate the sky sphere by 90 degrees around the X-axis
skySphere.rotation.x = Math.PI / 2;



// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000); // Increased far clipping plane
camera.up.set(0, 1, 0); // Reset the camera's up vector to Y-up

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.0;
controls.panSpeed = 1.0;
controls.minDistance = 1;
controls.maxDistance = 2000;

// Adjust the polar angle limits to prevent the camera from getting "stuck"
controls.minPolarAngle = 0; // Allow the camera to look straight down
controls.maxPolarAngle = Math.PI; // Allow the camera to look straight up

// Enable smooth panning and zooming
controls.enablePan = true;
controls.enableZoom = true;

// Set the initial camera position and look-at point
camera.position.set(230, 125, -440);
controls.target.set(114,95, 207);
controls.update();1

// Rotate the scene to make Z the up direction
scene.rotation.x = -Math.PI / 2;

// Terrain setup
const terrainWidth = 2000;
const terrainDepth = 1400;
const terrainGeometry = new THREE.PlaneGeometry(terrainWidth, terrainDepth, terrainWidth - 1, terrainDepth - 1);
const textureLoader = new THREE.TextureLoader();
const heightmapImageUrl = 'heightmap.jpg'; // Path to your heightmap image
const landsatImageUrl = 'landsat.jpg'; // Path to your satellite image
let zScale = 150;

let terrainMesh;
let heightmapData; // Store heightmap data for later use

// Load heightmap and satellite image
textureLoader.load(heightmapImageUrl, function (heightmapTexture) {
    const heightmapImage = heightmapTexture.image;
    generateHeightmapFromImage(heightmapImage);
});

function generateHeightmapFromImage(heightmapImage) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = heightmapImage.width;
    canvas.height = heightmapImage.height;
    ctx.drawImage(heightmapImage, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    heightmapData = new Float32Array(terrainWidth * terrainDepth);

    for (let i = 0; i < terrainWidth; i++) {
        for (let j = 0; j < terrainDepth; j++) {
            const pixelIndex = (i + j * canvas.width) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            const grayscale = (r + g + b) / 3;
            heightmapData[i + j * terrainWidth] = grayscale / 255 * zScale;
        }
    }

    for (let i = 0; i < terrainGeometry.attributes.position.count; i++) {
        const x = i % terrainWidth;
        const y = Math.floor(i / terrainWidth);
        terrainGeometry.attributes.position.setZ(i, heightmapData[x + y * terrainWidth]);
    }

    terrainGeometry.attributes.position.needsUpdate = true;
    terrainGeometry.computeVertexNormals();

    // Load the satellite image and create a material
    textureLoader.load(landsatImageUrl, function (landsatTexture) {
        // Create a material with the satellite texture
        const terrainMaterial = new THREE.MeshPhongMaterial({
            map: landsatTexture, // Use the satellite image as the texture
        });

        // Create the terrain mesh
        terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
        scene.add(terrainMesh);

        // Load the GLTF model after the terrain is generated
        loadGLTFModel();
    });
}

// Lighting setup (reduced intensity to avoid washing out the sky)
scene.add(new THREE.AmbientLight(0x404040, 5.0)); // Reduced intensity from 3.1 to 1.0


const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4.0);
directionalLight2.position.set(0, -1000, 500);
directionalLight2.target.position.set(0,-200,100);
scene.add(directionalLight2);
scene.add(directionalLight2.target);

// Add a helper to visualize the directional light
//const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight2, 5); // Second argument is the size of the helper
//scene.add(directionalLightHelper);

// Viewpoints
const viewpoints = [
    { 
        position: new THREE.Vector3(-7, 28, -194), 
        lookAt: new THREE.Vector3(140,135,-171)
    },
    { 
        position: new THREE.Vector3(170,170,-225), 
        lookAt: new THREE.Vector3(164,128,-146)
    },
    { 
        position: new THREE.Vector3(210,215,-25), 
        lookAt: new THREE.Vector3(6,-60,-120)
    },
    { 
        position: new THREE.Vector3(-21, 128,-54), 
        lookAt: new THREE.Vector3(-50,-50,-83)
    },
    { 
        position: new THREE.Vector3(-89,173,51), 
        lookAt: new THREE.Vector3(-21,60,-59)
    }
];

// Event listeners for viewpoint switching
window.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        startInterpolation(viewpoints[0]); // Move to viewpoint 1
    } else if (event.key === '2') {
        startInterpolation(viewpoints[1]); // Move to viewpoint 2
    } else if (event.key === '3') {
        startInterpolation(viewpoints[2]); // Move to viewpoint 3
    } else if (event.key === '4') {
        startInterpolation(viewpoints[3]); // Move to viewpoint 4
    } else if (event.key === '5') {
        startInterpolation(viewpoints[4]); // Move to viewpoint 4
    }
});

// Variables for interpolation
let isAnimating = false;
let startPosition = new THREE.Vector3();
let startLookAt = new THREE.Vector3();
let targetPosition = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
let animationProgress = 0;
const animationDuration = 2; // Duration in seconds

// Function to start interpolation
function startInterpolation(viewpoint) {
    isAnimating = true;
    animationProgress = 0;

    // Set start points to current camera position and look-at point
    startPosition.copy(camera.position);
    startLookAt.copy(controls.target);

    // Set target points to the selected viewpoint
    targetPosition.copy(viewpoint.position);
    targetLookAt.copy(viewpoint.lookAt);
}

// Function to update the interpolation
function updateInterpolation(deltaTime) {
    if (!isAnimating) return;

    animationProgress += deltaTime / animationDuration;

    if (animationProgress >= 1) {
        animationProgress = 1;
        isAnimating = false;
    }

    // Interpolate position and look-at point
    camera.position.lerpVectors(startPosition, targetPosition, animationProgress);
    controls.target.lerpVectors(startLookAt, targetLookAt, animationProgress);
    controls.update();
}

// Key state tracking for flying controls
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    q: false,
    z: false
};

// Event listeners for keydown and keyup
window.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 's': keys.s = true; break;
        case 'a': keys.a = true; break;
        case 'd': keys.d = true; break;
        case 'q': keys.q = true; break;
        case 'z': keys.z = true; break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 's': keys.s = false; break;
        case 'a': keys.a = false; break;
        case 'd': keys.d = false; break;
        case 'q': keys.q = false; break;
        case 'z': keys.z = false; break;
    }
});

// Toggle flying mode
let isFlying = false;

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') { // Spacebar to toggle flying mode
        isFlying = !isFlying;
        controls.enabled = !isFlying;
    }
});

// Event listeners for viewpoint switching
window.addEventListener('keydown', (event) => {
    if (event.key === '1') {
      startInterpolation(viewpoints[0]);
    } else if (event.key === '2') {
      startInterpolation(viewpoints[1]);
    } else if (event.key === '3') {
      startInterpolation(viewpoints[2]);
    } else if (event.key === '4') {
      startInterpolation(viewpoints[3]);
    }
});

// Animation loop with flying controls
const moveSpeed = 100; // Adjust the speed as needed

function animate(currentTime) {
    const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
    previousTime = currentTime;

    if (isFlying) {
        // Calculate movement direction in the camera's local space
        const direction = new THREE.Vector3();

        if (keys.w) direction.z -= 1; // Forward
        if (keys.s) direction.z += 1; // Backward
        if (keys.a) direction.x -= 1; // Left
        if (keys.d) direction.x += 1; // Right
        if (keys.q) direction.y += 1; // Up
        if (keys.z) direction.y -= 1; // Down

        // Normalize the direction vector and apply speed
        if (direction.length() > 0) {
            direction.normalize();
            direction.multiplyScalar(moveSpeed * deltaTime);

            // Transform the direction vector to world space
            camera.translateX(direction.x);
            camera.translateY(direction.y);
            camera.translateZ(direction.z);
        }
    }

    requestAnimationFrame(animate);
    controls.update();
    updateInterpolation(deltaTime);
    updateCameraInfo();
    renderer.render(scene, camera);
}

// Display camera info
const infoDiv = document.createElement('div');
infoDiv.style.position = 'absolute';
infoDiv.style.top = '10px';
infoDiv.style.right = '10px';
infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
infoDiv.style.color = 'white';
infoDiv.style.padding = '10px';
infoDiv.style.fontFamily = 'Arial, sans-serif';
infoDiv.style.fontSize = '12px';
infoDiv.style.borderRadius = '5px';
document.body.appendChild(infoDiv);

function updateCameraInfo() {
    const position = camera.position;
    const lookAt = controls.target;

    infoDiv.innerHTML = `Camera Position: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})<br>
        LookAt Point: (${lookAt.x.toFixed(2)}, ${lookAt.y.toFixed(2)}, ${lookAt.z.toFixed(2)})`;
}

// GLTF Loader setup
const gltfLoader = new GLTFLoader();

// Function to load and position the GLTF model
function loadGLTFModel() {
    const modelUrl = 'scene.gltf'; // Replace with your GLTF file path
    const modelPosition = new THREE.Vector3(226, 113, -358); // Adjust Y to place above terrain
    const modelScale = new THREE.Vector3(.3, .3, .3); // Adjust scale as needed
    const modelRotation = new THREE.Vector3(0, -1.5, 0); // Adjust rotation as needed

    gltfLoader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelPosition);
        model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
        scene.add(model);
        console.log('GLTF model loaded successfully:', model);
    }, undefined, (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
    });
}

// Animation loop
let previousTime = 0;
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Create a div for the text overlay
const overlayDiv = document.createElement('div');
overlayDiv.style.position = 'absolute';
overlayDiv.style.top = '10px';
overlayDiv.style.left = '10px';
overlayDiv.style.color = 'white';
overlayDiv.style.fontFamily = 'Arial, sans-serif';
overlayDiv.style.fontSize = '14px';
overlayDiv.style.zIndex = '1000';
overlayDiv.innerHTML = 'Press 1, 2, 3, or 4 to switch viewpoints.<br>Press SPACE to toggle flying mode.<br>Use W, A, S, D, Q, Z to fly.';
document.body.appendChild(overlayDiv);

// Create buttons for viewpoints
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'absolute';
buttonContainer.style.top = '50px';
buttonContainer.style.left = '10px';
buttonContainer.style.zIndex = '1000';
document.body.appendChild(buttonContainer);1

viewpoints.forEach((viewpoint, index) => {
    const button = document.createElement('button');
    button.innerText = `Viewpoint ${index + 1}`;
    button.style.margin = '5px';
    button.addEventListener('click', () => startInterpolation(viewpoint));
    buttonContainer.appendChild(button);
});