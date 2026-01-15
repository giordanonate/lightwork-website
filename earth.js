// Earth Canvas - Three.js Visualization
// Similar to nathangiordano.com's EarthCanvas component

let scene, camera, renderer, earth, clouds, composer;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let isDragging = false, touchStartX = 0, touchVelocityX = 0;

function initEarth() {
    const container = document.getElementById('earth-container');
    if (!container) return;

    // Scene setup
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Load textures using placeholder or solid colors
    const textureLoader = new THREE.TextureLoader();

    // Create Earth
    const earthGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
        specular: 0x333333,
        shininess: 25,
        map: null, // You can add texture: textureLoader.load('path/to/earth-texture.jpg')
    });

    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Create clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(1.51, 64, 64);
    const cloudsMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(clouds);

    // Post-processing (optional - simplified version)
    try {
        if (typeof THREE.EffectComposer !== 'undefined') {
            composer = new THREE.EffectComposer(renderer);
            const renderPass = new THREE.RenderPass(scene, camera);
            composer.addPass(renderPass);

            if (typeof THREE.BokehPass !== 'undefined') {
                const bokehPass = new THREE.BokehPass(scene, camera, {
                    focus: 2.6,
                    aperture: 0.025,
                    maxblur: 0.01
                });
                composer.addPass(bokehPass);
            }
        }
    } catch (e) {
        console.log('Post-processing not available, using standard renderer');
    }

    // Mouse interaction
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(earth);

        if (intersects.length > 0) {
            // Earth clicked - you can add custom behavior here
            console.log('Earth clicked!');
        }
    });

    // Handle cursor change on hover
    renderer.domElement.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(earth);

        renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    });

    // Resize handler
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onTouchStart(event) {
    if (event.touches.length === 1) {
        isDragging = true;
        touchStartX = event.touches[0].clientX;
        touchVelocityX = 0;
    }
}

function onTouchMove(event) {
    if (isDragging && event.touches.length === 1) {
        const touchX = event.touches[0].clientX;
        const deltaX = touchX - touchStartX;
        touchVelocityX = deltaX * 0.01;
        touchStartX = touchX;
        targetRotationX += touchVelocityX;
    }
}

function onTouchEnd() {
    isDragging = false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (!earth || !clouds) return;

    // Base rotation
    earth.rotation.y += 0.001;
    clouds.rotation.y += 0.0013; // Clouds rotate slightly faster

    // Mouse/touch interaction
    if (!isDragging) {
        // Smooth follow mouse
        targetRotationX += (mouseX * 0.5 - targetRotationX) * 0.05;
        targetRotationY += (mouseY * 0.5 - targetRotationY) * 0.05;
    } else {
        // Momentum decay for touch
        touchVelocityX *= 0.95;
        targetRotationX += touchVelocityX;
    }

    earth.rotation.x = targetRotationY * 0.2;
    earth.rotation.y += targetRotationX * 0.001;

    clouds.rotation.x = targetRotationY * 0.2;
    clouds.rotation.y = earth.rotation.y;

    // Update light position to follow mouse
    const light = scene.children.find(child => child instanceof THREE.PointLight);
    if (light) {
        light.position.x += (mouseX * 3 - light.position.x) * 0.05;
        light.position.y += (mouseY * 3 - light.position.y) * 0.05;
    }

    // Render
    if (composer) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

function destroyEarth() {
    if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('resize', onWindowResize);
}

// Initialize when home section is shown
function checkAndInitEarth() {
    const homeSection = document.getElementById('home-section');
    if (homeSection && !homeSection.classList.contains('hidden')) {
        if (!renderer) {
            initEarth();
        }
    }
}

// Export for use in main script
window.initEarth = initEarth;
window.destroyEarth = destroyEarth;
window.checkAndInitEarth = checkAndInitEarth;
