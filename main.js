import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { FontLoader } from 'jsm/loaders/FontLoader.js';
import { TextGeometry } from 'jsm/geometries/TextGeometry.js';


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
camera.position.set(-16.5, 25.4, -188.1);
controls.target.set(-10, 25.6, -187.1);
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

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3.0);
directionalLight2.position.set(0, -1000, 500);
directionalLight2.target.position.set(0, -200, 100);
scene.add(directionalLight2);
scene.add(directionalLight2.target);

const churchLight = new THREE.DirectionalLight(0xffffff, 1.0);
churchLight.position.set(-15.5, 25, -187);
churchLight.target.position.set(-13, 25, -187);
scene.add(churchLight);
scene.add(churchLight.target);

// Viewpoints with names
const viewpoints = [
    { 
        name: 'Chapelle Des Praz (Rhino) - 1',
        position: new THREE.Vector3(-16.5, 25.4, -188.1), 
        lookAt: new THREE.Vector3(-10, 25.6, -187.1)
    },
    { 
        name: 'Patch (Nomad Sculpt) - 2',
        position: new THREE.Vector3(31.5, 42.8, -179.4), 
        lookAt: new THREE.Vector3(32.8, 42.8, -179)
    },
    { 
        name: 'Vulture (Blender) - 3',
        position: new THREE.Vector3(152.3, 131.1, -8.0), 
        lookAt: new THREE.Vector3(165.9, 122.5, -49.8)
    },
    { 
        name: 'Aiguille du Midi (Photogrammetry) - 4',
        position: new THREE.Vector3(-21.1, 114.8, -57.8), 
        lookAt: new THREE.Vector3(-26.9, 113.9, -58.8)
    },
    { 
        name: 'Resume & Contact - 5',
        position: new THREE.Vector3(-77, 154, 42), 
        lookAt: new THREE.Vector3(-2, 78, -58)
    }
];

// Load the font and create 3D text near Viewpoint 5
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    // Create the text geometry
    const textGeometry = new TextGeometry('Hello, Viewpoint 5!', {
        font: font,
        size: 5, // Size of the text
        height: 0.5, // Depth of the text
        curveSegments: 12, // Smoothness of curves
        bevelEnabled: true, // Add bevel to the text
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // Center the text geometry
    textGeometry.center();

    // Create a material for the text
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });

    // Create a mesh for the text
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    // Create a plane geometry for the background
    const planeGeometry = new THREE.PlaneGeometry(100, 10); // Adjust size as needed
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // Position the text and plane near Viewpoint 5
    textMesh.position.set(-77,-42,150); // Adjust position as needed
    planeMesh.position.copy(textMesh.position); // Place the plane behind the text

    // Rotate the plane and text to face the camera
    planeMesh.rotation.x = 0; // Rotate the plane to face upwards
    textMesh.rotation.x = 0; // Rotate the text to match the plane

    planeMesh.rotation.y = 0; // Rotate the plane to face upwards
    textMesh.rotation.y = 0; // Rotate the text to match the plane


    // Add the text and plane to the scene
    scene.add(textMesh);
    scene.add(planeMesh);

    console.log('3D text and plane added near Viewpoint 5');
});

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
        startInterpolation(viewpoints[4]); // Move to viewpoint 5
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


// Create a container for the viewpoint overlays
const overlayContainer = document.createElement('div');
overlayContainer.style.position = 'absolute';
overlayContainer.style.top = '10px';
overlayContainer.style.left = '10px';
overlayContainer.style.color = 'white';
overlayContainer.style.fontFamily = 'Arial, sans-serif';
overlayContainer.style.fontSize = '14px';
overlayContainer.style.zIndex = '1000';
document.body.appendChild(overlayContainer);

// Create a div for each viewpoint
const viewpointOverlays = viewpoints.map((viewpoint, index) => {
    const div = document.createElement('div');
    div.id = `viewpoint-overlay-${index + 1}`;
    div.style.display = 'none'; // Hide all divs initially
    overlayContainer.appendChild(div);
    return div;
});

// Create a new div for initial instructions
const initialInstructionsDiv = document.createElement('div');
initialInstructionsDiv.id = 'initial-instructions';
initialInstructionsDiv.style.position = 'absolute';
initialInstructionsDiv.style.bottom = '10px';
initialInstructionsDiv.style.left = '10px';
initialInstructionsDiv.style.color = 'white';
initialInstructionsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
initialInstructionsDiv.style.padding = '10px';
initialInstructionsDiv.style.fontFamily = 'Arial, sans-serif';
initialInstructionsDiv.style.fontSize = '14px';
initialInstructionsDiv.style.borderRadius = '5px';
initialInstructionsDiv.style.zIndex = '1000';
initialInstructionsDiv.innerHTML = 'Press 1, 2, 3, 4, or 5, or select from buttons on top to switch viewpoints.<br>Press SPACE to toggle flying mode.<br>Use W, A, S, D, Q, Z to fly.';
document.body.appendChild(initialInstructionsDiv);


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

    // Hide all viewpoint overlays
    viewpointOverlays.forEach(div => div.style.display = 'none');

    // Show the overlay corresponding to the selected viewpoint
    const viewpointIndex = viewpoints.indexOf(viewpoint);
    if (viewpointIndex !== -1) {
        viewpointOverlays[viewpointIndex].style.display = 'block';
    }
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

// Function to load and position the GLB model (replacing scene.gltf with aiguille.glb)
function loadGLTFModel() {
    const modelUrl = 'aiguille.glb'; // Replace with your GLB file path
    const modelPosition = new THREE.Vector3(-25.5, 57, 111.5); // Adjust Y to place above terrain
    const modelScale = new THREE.Vector3(.5, .5, .5); // Adjust scale as needed
    const modelRotation = new THREE.Vector3(0, -Math.PI / 2,  -Math.PI / 2); // Adjust rotation as needed

    gltfLoader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        model.position.copy(modelPosition);
        model.scale.set(modelScale.x, modelScale.y, modelScale.z);
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
        scene.add(model);
        console.log('GLB model (aiguille.glb) loaded successfully:', model);
    }, undefined, (error) => {
        console.error('An error occurred while loading the GLB model (aiguille.glb):', error);
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
            // Stop the default animation (clipAction2)
            clipAction2.stop();

            // Reset and play the first animation (clipAction1)
            clipAction1.reset(); // Reset the animation to the beginning
            clipAction1.play(); // Play the animation from the start

            // Listen for when clipAction1 finishes
            clipAction1.getMixer().addEventListener('finished', () => {
                // When clipAction1 finishes, resume the default animation (clipAction2)
                clipAction2.play();
            });
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

// // Create a div for the text overlay
// const overlayDiv = document.createElement('div');
// overlayDiv.style.position = 'absolute';
// overlayDiv.style.top = '10px';
// overlayDiv.style.left = '10px';
// overlayDiv.style.color = 'white';
// overlayDiv.style.fontFamily = 'Arial, sans-serif';
// overlayDiv.style.fontSize = '14px';
// overlayDiv.style.zIndex = '1000';
// overlayDiv.innerHTML = 'Press 1, 2, 3, 4, or 5 to switch viewpoints.<br>Press SPACE to toggle flying mode.<br>Use W, A, S, D, Q, Z to fly.<br>Press G to start the animation.';
// document.body.appendChild(overlayDiv);



// Create buttons for viewpoints
const buttonContainer = document.createElement('div');
buttonContainer.style.position = 'absolute';
buttonContainer.style.top = '5px';
buttonContainer.style.left = '10px';
buttonContainer.style.zIndex = '1000';
document.body.appendChild(buttonContainer);

viewpoints.forEach((viewpoint, index) => {
    const button = document.createElement('button');
    button.innerText = `${viewpoints[index].name}`;
    button.style.margin = '5px';
    button.addEventListener('click', () => startInterpolation(viewpoint));
    buttonContainer.appendChild(button);
});

// Add detailed content to each viewpoint overlay div
viewpointOverlays[0].innerHTML = `
    <h3>Chapelle Des Praz (Rhino) - 1</h3>
    <p>This viewpoint showcases the Chapelle Des Praz model created in Rhino.</p>
`;

viewpointOverlays[1].innerHTML = `
    <h3>Patch (Nomad Sculpt) - 2</h3>
    <p>This viewpoint highlights the Patch model sculpted in Nomad Sculpt.</p>
`;

// Add detailed content to Viewpoint Overlay 3 with a button to start the animation
viewpointOverlays[2].innerHTML = `
    <h3>Vulture (Blender) - 3</h3>
    <p>This viewpoint features the Vulture model created in Blender.</p>
    <button id="start-animation-button">Start Animation</button>
    <p>Click the button or press <strong>G</strong> to start the animation.</p>
`;

// Add an event listener to the button in Viewpoint Overlay 3
const startAnimationButton = document.getElementById('start-animation-button');
if (startAnimationButton) {
    startAnimationButton.addEventListener('click', () => {
        if (clipAction1 && clipAction2) {
            // Stop the default animation (clipAction2)
            clipAction2.stop();

            // Reset and play the first animation (clipAction1)
            clipAction1.reset(); // Reset the animation to the beginning
            clipAction1.play(); // Play the animation from the start

            // Listen for when clipAction1 finishes
            clipAction1.getMixer().addEventListener('finished', () => {
                // When clipAction1 finishes, resume the default animation (clipAction2)
                clipAction2.play();
            });
        }
    });
}

viewpointOverlays[3].innerHTML = `
    <h3>Aiguille du Midi (Photogrammetry) - 4</h3>
    <p>This viewpoint displays the Aiguille du Midi model generated using photogrammetry.</p>
`;

viewpointOverlays[4].innerHTML = `
    <h3>Resume & Contact - 5</h3>
    <p>This viewpoint provides information about the creator and contact details.</p>
`;

// Add some basic styling to the overlay divs
viewpointOverlays.forEach(div => {
    div.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    div.style.padding = '10px';
    div.style.borderRadius = '5px';
    div.style.marginBottom = '10px';
    div.style.fontFamily = 'Arial, sans-serif';
    div.style.fontSize = '14px';
    div.style.color = 'white';
});