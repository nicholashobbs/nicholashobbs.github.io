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
camera.position.set(-17, 25.5, -188);
controls.target.set(-10, 28, -188);
controls.update();

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
let heightmapData;

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
        loadGLBModel(); // Load the GLB model with animations
        loadPatchModel(); // Load the patch model
        loadChurchModel(); // Load the church model
    });
}

// Lighting setup
scene.add(new THREE.AmbientLight(0x404040, 2.0));

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 5.0);
directionalLight2.position.set(0, -1000, 500);
directionalLight2.target.position.set(0, -200, 100);
scene.add(directionalLight2);
scene.add(directionalLight2.target);

const churchLight = new THREE.DirectionalLight(0xffffff, 1.0);
churchLight.position.set(-15.5, 25, -187);
churchLight.target.position.set(-13, 25, -187);
scene.add(churchLight);
scene.add(churchLight.target);

// Viewpoints
const viewpoints = [
    { 
        position: new THREE.Vector3(-17, 25.5, -188), 
        lookAt: new THREE.Vector3(-10, 28, -188)
    },
    { 
        position: new THREE.Vector3(31.5,42.8,-179.4), 
        lookAt: new THREE.Vector3(32.8,42.8,-179)
    },
    { 
        position: new THREE.Vector3(132.4, 126, -33.5), 
        lookAt: new THREE.Vector3(165, 121, -49)
    },
    { 
        position: new THREE.Vector3(-22, 117, -58), 
        lookAt: new THREE.Vector3(-26.8, 113.6, -58.1)
    },
    { 
        position: new THREE.Vector3(-77, 154, 42), 
        lookAt: new THREE.Vector3(-2, 78, -58)
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

// Animation loop with flying controls
const moveSpeed = 100; // Adjust the speed as needed

function animate(currentTime) {
    const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
    previousTime = currentTime;

    // Update the animation mixer if it exists
    if (mixer) {
        mixer.update(deltaTime); // This is required for animations to play
    }

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
    const modelPosition = new THREE.Vector3(-24.5, 57.5, 112.27); // Adjust Y to place above terrain
    const modelScale = new THREE.Vector3(.5, .5, .5); // Adjust scale as needed
    const modelRotation = new THREE.Vector3(0,  -Math.PI/2, -Math.PI/2); // Adjust rotation as needed

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

// Function to load and position the patch model
function loadPatchModel() {
    const modelUrl = 'patch.glb'; // Replace with your GLTF file path
    const modelPosition = new THREE.Vector3(32.5, 179, 42.95); // Adjust position as needed
    const modelScale = new THREE.Vector3(0.2, 0.2, 0.2); // Adjust scale as needed
    const modelRotation = new THREE.Vector3(Math.PI/2, Math.PI*0.8, 0); // Adjust rotation as needed

    gltfLoader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelPosition);
        model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
        scene.add(model);
        console.log('Patch model loaded successfully:', model);
    }, undefined, (error) => {
        console.error('An error occurred while loading the patch model:', error);
    });
}

// Function to load and position the church model
function loadChurchModel() {
    const modelUrl = 'church.gltf'; // Replace with your GLTF file path
    const modelPosition = new THREE.Vector3(0, 195, 24.7); // Adjust position as needed
    const modelScale = new THREE.Vector3(0.2, 0.2, 0.2); // Adjust scale as needed
    const modelRotation = new THREE.Vector3( Math.PI/2, Math.PI, 0); // Adjust rotation as needed

    gltfLoader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelPosition);
        model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
        scene.add(model);
        console.log('Church model loaded successfully:', model);

        // Traverse the model's scene graph and modify materials
        model.traverse((child) => {
            if (child.isMesh) {
                // Create a new dark matte black material
                const MatteWhiteMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF, // Black color
                    roughness: 1.0,  // Fully rough for a matte finish
                    metalness: 0.0   // Non-metallic
                });

                // Assign the new material to the mesh
                child.material = MatteWhiteMaterial;
            }
        });

    }, undefined, (error) => {
        console.error('An error occurred while loading the church model:', error);
    });
}

// Animation mixer and actions for the GLB model
let mixer;
let clipAction1; // First animation
let clipAction2; // Second animation

function loadGLBModel() {
    const modelUrl = 'vulture.glb'; // Replace with your GLB file path
    const modelPosition = new THREE.Vector3(172.7, 37.7, 130); // Adjust position as needed
    const modelScale = new THREE.Vector3(.5, .5, .5); // Adjust scale as needed
    const modelRotation = new THREE.Vector3(0.4 * Math.PI, -0.9 * Math.PI, 0 * Math.PI); // Adjust rotation as needed

    gltfLoader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelPosition);
        model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
        scene.add(model);
        console.log('GLB model loaded successfully:', model);

        // Traverse the model's scene graph and modify materials
        model.traverse((child) => {
            if (child.isMesh) {
                // Create a new dark matte black material
                const darkMatteBlackMaterial = new THREE.MeshStandardMaterial({
                    color: 0x000000, // Black color
                    roughness: 1.0,  // Fully rough for a matte finish
                    metalness: 0.0   // Non-metallic
                });

                // Assign the new material to the mesh
                child.material = darkMatteBlackMaterial;
            }
        });

        // Set up the animation mixer
        mixer = new THREE.AnimationMixer(model);
        if (gltf.animations.length > 0) {
            clipAction1 = mixer.clipAction(gltf.animations[0]); // First animation
            clipAction1.setLoop(THREE.LoopOnce); // Play the first animation once when toggled
            clipAction1.clampWhenFinished = true; // Pause at the end of the animation

            if (gltf.animations.length > 1) {
                clipAction2 = mixer.clipAction(gltf.animations[1]); // Second animation
                clipAction2.play(); // Start the second animation by default
                clipAction2.setLoop(THREE.LoopRepeat); // Loop the second animation indefinitely
            }
        }
    }, undefined, (error) => {
        console.error('An error occurred while loading the GLB model:', error);
    });
}

// Add key listener for toggling the first animation
window.addEventListener('keydown', (event) => {
    if (event.key === 'g' || event.key === 'G') {
        if (clipAction1 && clipAction2) {
            if (clipAction1.isRunning()) {
                // If the first animation is running, stop it and resume the second animation
                clipAction1.stop();
                clipAction2.play();
            } else {
                // If the first animation is not running, reset its time to 0 and play it
                clipAction1.stop(); // Stop the animation if it's already running
                clipAction1.reset(); // Reset the animation to the beginning
                clipAction1.play(); // Play the animation from the start
                clipAction2.stop(); // Stop the second animation

                // Listen for when clipAction1 finishes
                clipAction1.getMixer().addEventListener('finished', () => {
                    // When clipAction1 finishes, resume clipAction2
                    clipAction2.play();
                });
            }
        }
    }
});


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
overlayDiv.innerHTML = 'Press 1, 2, 3, or 4 to switch viewpoints.<br>Press SPACE to toggle flying mode.<br>Use W, A, S, D, Q, Z to fly.<br>Press G to start the animation.';
document.body.appendChild(overlayDiv);

// Create buttons for viewpoints
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'absolute';
buttonContainer.style.top = '50px';
buttonContainer.style.left = '10px';
buttonContainer.style.zIndex = '1000';
document.body.appendChild(buttonContainer);

viewpoints.forEach((viewpoint, index) => {
    const button = document.createElement('button');
    button.innerText = `Viewpoint ${index + 1}`;
    button.style.margin = '5px';
    button.addEventListener('click', () => startInterpolation(viewpoint));
    buttonContainer.appendChild(button);
});