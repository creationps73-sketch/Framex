/* ==========================================================================
   FRAMEX - Three.js WebGL 3D Rotating Showcase
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Check if THREE is loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js is not loaded. Cannot initialize 3D Showcase.');
    return;
  }

  initThreeShowcase();
});

function initThreeShowcase() {
  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  // 1. Scene, Camera, Renderer
  const scene = new THREE.Scene();
  
  // Custom subtle fog to fade deep objects
  scene.fog = new THREE.FogExp2(0xf8f5ef, 0.05);

  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  // 2. Lights
  // Soft ambient fill light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  // Key directional light representing a soft studio panel
  const studioLight = new THREE.DirectionalLight(0xffebd8, 0.85);
  studioLight.position.set(5, 5, 4);
  studioLight.castShadow = true;
  studioLight.shadow.mapSize.width = 1024;
  studioLight.shadow.mapSize.height = 1024;
  studioLight.shadow.bias = -0.001;
  scene.add(studioLight);

  // Dynamic interactive White Spotlight
  const goldSpotlight = new THREE.SpotLight(0xffffff, 8.0);
  goldSpotlight.position.set(0, 0, 5);
  goldSpotlight.angle = Math.PI / 4;
  goldSpotlight.penumbra = 0.8;
  goldSpotlight.decay = 1.5;
  goldSpotlight.distance = 15;
  goldSpotlight.castShadow = true;
  goldSpotlight.shadow.mapSize.width = 1024;
  goldSpotlight.shadow.mapSize.height = 1024;
  scene.add(goldSpotlight);

  // Spotlight target to point light
  const spotlightTarget = new THREE.Object3D();
  scene.add(spotlightTarget);
  goldSpotlight.target = spotlightTarget;

  // 3. Create the 3D Luxury Photo Frame Group
  const frameGroup = new THREE.Group();
  scene.add(frameGroup);

  // Materials
  // Premium Matte Black wood border
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.35,
    metalness: 0.1,
    bumpScale: 0.02,
    name: 'goldBorder'
  });

  // Soft Ivory fine textured paper matting
  const matMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8f5ef,
    roughness: 0.9,
    metalness: 0.0
  });

  // Backing material (wood textured or black matte)
  const backMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
    metalness: 0.1
  });

  // Mesh creation
  // A. The Gold Outer Frame Bevels (Beveled border)
  const frameWidth = 3.6;
  const frameHeight = 4.8;
  const frameDepth = 0.25;

  const outerFrameGeo = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
  const outerFrameMesh = new THREE.Mesh(outerFrameGeo, goldMaterial);
  outerFrameMesh.castShadow = true;
  outerFrameMesh.receiveShadow = true;
  frameGroup.add(outerFrameMesh);

  // B. Recessed White Matting Paper
  const matWidth = 3.2;
  const matHeight = 4.4;
  const matDepth = 0.05;
  const matGeo = new THREE.BoxGeometry(matWidth, matHeight, matDepth);
  const matMesh = new THREE.Mesh(matGeo, matMaterial);
  // Recess it slightly forward from the back center
  matMesh.position.z = frameDepth / 2 - 0.02;
  matMesh.receiveShadow = true;
  frameGroup.add(matMesh);

  // C. The Core Photographic Art Texture Loading
  const textureLoader = new THREE.TextureLoader();
  const photoPlaneWidth = 2.4;
  const photoPlaneHeight = 3.4;
  const photoPlaneGeo = new THREE.PlaneGeometry(photoPlaneWidth, photoPlaneHeight);

  // Default empty colored placeholder in case image fails to load
  let photoMaterial = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.35,
    metalness: 0.15
  });

  // Load our generated hero portrait as the artwork inside the 3D Frame
  textureLoader.load(
    'assets/hero_portrait.png',
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      photoMaterial.map = texture;
      photoMaterial.needsUpdate = true;
    },
    undefined,
    (err) => {
      console.warn('Could not load hero_portrait.png for Three.js showcase, using placeholder.', err);
    }
  );

  const photoMesh = new THREE.Mesh(photoPlaneGeo, photoMaterial);
  photoMesh.position.z = frameDepth / 2 + 0.01; // Slightly floating over mat
  photoMesh.receiveShadow = true;
  frameGroup.add(photoMesh);

  // D. Subtle Reflective Glass Pane
  const glassGeo = new THREE.PlaneGeometry(matWidth, matHeight);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.9,
    ior: 1.5,
    thickness: 0.1,
    depthWrite: false
  });
  const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
  glassMesh.position.z = frameDepth / 2 + 0.02;
  frameGroup.add(glassMesh);

  // E. Backplate
  const backGeo = new THREE.BoxGeometry(frameWidth - 0.1, frameHeight - 0.1, 0.05);
  const backMesh = new THREE.Mesh(backGeo, backMaterial);
  backMesh.position.z = -frameDepth / 2 - 0.01;
  frameGroup.add(backMesh);

  // 4. Mouse Move Tracking Interactivity
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener('mousemove', (e) => {
    // Standard normalized device coordinates [-1, 1]
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    mouse.targetX = (clientX / container.clientWidth) * 2 - 1;
    mouse.targetY = -(clientY / container.clientHeight) * 2 + 1;
  });

  // 5. Scroll Interaction (Slow rotating frame on scroll)
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Apply soft scroll spin
    frameGroup.rotation.y += scrollDelta * 0.001;
  });



  // 7. Animation Tick Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth lerp for frame rotation toward mouse
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // Base floating rotation + mouse hover rotation
    frameGroup.rotation.y = mouse.x * 0.35 + Math.sin(elapsedTime * 0.6) * 0.04;
    frameGroup.rotation.x = -mouse.y * 0.25 + Math.cos(elapsedTime * 0.6) * 0.03;

    // Floating vertical hover height translation
    frameGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

    // Update gold spotlight tracking target
    spotlightTarget.position.x = mouse.x * 2.5;
    spotlightTarget.position.y = mouse.y * 2.5;
    spotlightTarget.position.z = 0;

    // Spotlight tracks the frame slightly
    goldSpotlight.position.x = mouse.x * 1.5;
    goldSpotlight.position.y = mouse.y * 1.5;

    renderer.render(scene, camera);
  }

  animate();

  // 8. Handle Window Resizing
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  });
}
