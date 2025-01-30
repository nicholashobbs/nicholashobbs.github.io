import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);

// Controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.0;
controls.panSpeed = 1.0;
controls.minDistance = 1;
controls.maxDistance = 2000;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2;
controls.enablePan = true;
controls.enableZoom = true;

// Terrain setup
const terrainWidth = 1500;
const terrainDepth = 2000;
const terrainGeometry = new THREE.PlaneGeometry(terrainWidth, terrainDepth, terrainWidth - 1, terrainDepth - 1);
const textureLoader = new THREE.TextureLoader();
const heightmapImageUrl = 'heightmap.jpg';
let zScale = 150;

textureLoader.load(heightmapImageUrl, function (texture) {
  const img = texture.image;
  generateHeightmapFromImage(img);
});

function generateHeightmapFromImage(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const heightmap = new Float32Array(terrainWidth * terrainDepth);

  for (let i = 0; i < terrainWidth; i++) {
    for (let j = 0; j < terrainDepth; j++) {
      const pixelIndex = (i + j * canvas.width) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const grayscale = (r + g + b) / 3;
      heightmap[i + j * terrainWidth] = grayscale / 255 * zScale;
    }
  }

  for (let i = 0; i < terrainGeometry.attributes.position.count; i++) {
    const x = i % terrainWidth;
    const z = Math.floor(i / terrainWidth);
    terrainGeometry.attributes.position.setZ(i, heightmap[x + z * terrainWidth]);
  }

  const terrainMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true });
  const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
  terrainMesh.rotation.x = -Math.PI / 2;
  scene.add(terrainMesh);
}

// Lighting setup
scene.add(new THREE.AmbientLight(0x404040, 3.1));
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(100, 100, 100);
directionalLight.target.position.set(0, 0, 0);
scene.add(directionalLight);

// Camera initial position
camera.position.set(0, 500, 1000);
camera.lookAt(0, 0, 0);

// Viewpoints
const viewpoints = [
  { 
    position: new THREE.Vector3(334.71, 59.80, -617.18), 
    lookAt: new THREE.Vector3(310.96, 55.56, -573.39)
  },
  { 
    position: new THREE.Vector3(236.23, 95.23, -471.50), 
    lookAt: new THREE.Vector3(268.22, 81.35, -435.67)
  },
  { 
    position: new THREE.Vector3(410.08, 97.10, -410.56), 
    lookAt: new THREE.Vector3(374.61, 92.35, -375.64)
  },
  { 
    position: new THREE.Vector3(240.23, 141.00, -350.59), 
    lookAt: new THREE.Vector3(186.47, -41.09, -397.03)
  }
];

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

// Animation loop
let previousTime = 0;
function animate(currentTime) {
  const deltaTime = (currentTime - previousTime) / 1000; // Convert to seconds
  previousTime = currentTime;

  requestAnimationFrame(animate);
  controls.update();
  updateInterpolation(deltaTime);
  updateCameraInfo();
  renderer.render(scene, camera);
}

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
overlayDiv.innerHTML = 'Press 1, 2, 3, or 4 to switch viewpoints.<br>';
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