/* ==========================================
   INFINITY EXPLORER
   THREE.JS CINEMATIC ENGINE
========================================== */

(() => {

    "use strict";

    const canvas = document.getElementById("space-canvas");

    if (!canvas || !window.THREE) {
        console.error("Three.js or the space canvas is unavailable.");
        return;
    }

    const THREE = window.THREE;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const mobile = window.matchMedia(
        "(max-width: 700px)"
    ).matches;

    /* SCENE */

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#02030a");

    scene.fog = new THREE.FogExp2(
        "#02030a",
        0.0025
    );

    /* CAMERA */

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        3000
    );

    camera.position.set(0, 0, 36);

    /* RENDERER */

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !mobile,
        alpha: false,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.2;

    /* LIGHTING */

    const ambientLight = new THREE.AmbientLight(
        0x526b9b,
        1.1
    );

    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(
        0xffd9a0,
        240,
        500,
        1.5
    );

    sunLight.position.set(0, 0, 0);

    scene.add(sunLight);

    const blueFill = new THREE.DirectionalLight(
        0x739bff,
        1.1
    );

    blueFill.position.set(-20, 8, 12);

    scene.add(blueFill);

    /* WORLD */

    const world = new THREE.Group();

    scene.add(world);

    const planets = {};

    const planetDefinitions = {

        sun: {
            radius: 5.0,
            color: "#ffad46",
            position: [0, 0, -20],
            emissive: "#ff681c",
            roughness: 1
        },

        mercury: {
            radius: 1.0,
            color: "#96918a",
            position: [-3, -1, -8],
            roughness: 1
        },

        venus: {
            radius: 1.8,
            color: "#d5a36c",
            position: [3, 0, -12],
            roughness: 1
        },

        earth: {
            radius: 2.5,
            color: "#2768cc",
            position: [0, 0, -15],
            roughness: 0.85
        },

        mars: {
            radius: 1.6,
            color: "#c65335",
            position: [3, -1, -12],
            roughness: 1
        },

        jupiter: {
            radius: 4.2,
            color: "#c7a47f",
            position: [-3, 0, -20],
            roughness: 0.95
        },

        saturn: {
            radius: 3.6,
            color: "#d4bd8a",
            position: [3, 0, -17],
            roughness: 0.9
        },

        uranus: {
            radius: 2.5,
            color: "#8bdde1",
            position: [-3, 0, -14],
            roughness: 0.9
        },

        neptune: {
            radius: 2.4,
            color: "#3157dc",
            position: [3, 0, -16],
            roughness: 0.9
        }

    };

    /* CREATE A GLOWING SUN */

    const sunGlowMaterial = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        color: "#ff9b45",
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const sunGlow = new THREE.Sprite(sunGlowMaterial);

    sunGlow.scale.set(19, 19, 1);

    sunGlow.position.set(0, 0, -20);

    world.add(sunGlow);

    /* PLANET MATERIALS AND SPHERES */

    Object.entries(planetDefinitions).forEach(([name, data]) => {

        const geometry = new THREE.SphereGeometry(
            data.radius,
            mobile ? 32 : 64,
            mobile ? 32 : 64
        );

        const material = name === "sun"
            ? new THREE.MeshBasicMaterial({
                color: data.color
            })
            : new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: data.roughness,
                metalness: 0
            });

        if (data.emissive) {
            material.emissive = new THREE.Color(data.emissive);
            material.emissiveIntensity = 0.8;
        }

        const mesh = new THREE.Mesh(
            geometry,
            material
        );

        mesh.position.set(...data.position);

        mesh.userData.basePosition = mesh.position.clone();

        mesh.userData.planetName = name;

        world.add(mesh);

        planets[name] = mesh;

        /* ATMOSPHERIC HALO */

        if (["earth", "venus", "uranus", "neptune"].includes(name)) {

            const atmosphereGeometry = new THREE.SphereGeometry(
                data.radius * 1.07,
                mobile ? 24 : 48,
                mobile ? 24 : 48
            );

            const atmosphereMaterial = new THREE.MeshBasicMaterial({
                color: name === "earth"
                    ? "#42a5ff"
                    : name === "venus"
                        ? "#e8a66a"
                        : name === "uranus"
                            ? "#8bffff"
                            : "#5478ff",

                transparent: true,
                opacity: 0.13,
                side: THREE.BackSide,
                depthWrite: false
            });

            const atmosphere = new THREE.Mesh(
                atmosphereGeometry,
                atmosphereMaterial
            );

            mesh.add(atmosphere);

        }

    });

    /* SATURN'S RINGS */

    const saturn = planets.saturn;

    const ringGeometry = new THREE.RingGeometry(
        4.4,
        7.1,
        128
    );

    const positions = ringGeometry.attributes.position;

    const uv = ringGeometry.attributes.uv;

    for (let i = 0; i < positions.count; i++) {

        const x = positions.getX(i);

        const y = positions.getY(i);

        const radius = Math.sqrt(x * x + y * y);

        const normalizedRadius = (radius - 4.4) / (7.1 - 4.4);

        uv.setXY(
            i,
            normalizedRadius,
            0.5
        );

    }

    const ringMaterial = new THREE.MeshStandardMaterial({
        color: "#c8b18b",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
        roughness: 1,
        metalness: 0
    });

    const rings = new THREE.Mesh(
        ringGeometry,
        ringMaterial
    );

    rings.rotation.x = Math.PI * 0.36;

    saturn.add(rings);

    /* STARFIELD */

    const starCount = mobile ? 1800 : 4500;

    const starPositions = new Float32Array(
        starCount * 3
    );

    const starColors = new Float32Array(
        starCount * 3
    );

    for (let i = 0; i < starCount; i++) {

        const i3 = i * 3;

        starPositions[i3] = (Math.random() - 0.5) * 1100;

        starPositions[i3 + 1] = (Math.random() - 0.5) * 1100;

        starPositions[i3 + 2] = (Math.random() - 0.5) * 1100;

        const tint = Math.random();

        starColors[i3] = 0.65 + tint * 0.35;

        starColors[i3 + 1] = 0.75 + tint * 0.25;

        starColors[i3 + 2] = 1;

    }

    const starGeometry = new THREE.BufferGeometry();

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(starPositions, 3)
    );

    starGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(starColors, 3)
    );

    const starMaterial = new THREE.PointsMaterial({
        size: mobile ? 0.8 : 1.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true
    });

    const stars = new THREE.Points(
        starGeometry,
        starMaterial
    );

    scene.add(stars);

    /* NEBULA BACKGROUND */

    const nebula = new THREE.Mesh(
        new THREE.SphereGeometry(900, 24, 24),
        new THREE.MeshBasicMaterial({
            color: "#11163e",
            side: THREE.BackSide,
            transparent: true,
            opacity: 0.16
        })
    );

    scene.add(nebula);

    /* GLOW TEXTURE */

    function createGlowTexture() {

        const glowCanvas = document.createElement("canvas");

        glowCanvas.width = 256;

        glowCanvas.height = 256;

        const ctx = glowCanvas.getContext("2d");

        const gradient = ctx.createRadialGradient(
            128, 128, 5,
            128, 128, 128
        );

        gradient.addColorStop(0, "rgba(255,220,140,0.95)");

        gradient.addColorStop(0.2, "rgba(255,150,60,0.35)");

        gradient.addColorStop(0.55, "rgba(255,100,20,0.08)");

        gradient.addColorStop(1, "rgba(255,80,0,0)");

        ctx.fillStyle = gradient;

        ctx.fillRect(0, 0, 256, 256);

        const texture = new THREE.CanvasTexture(glowCanvas);

        texture.colorSpace = THREE.SRGBColorSpace;

        return texture;

    }

    /* CAMERA TARGETS */

    const cameraTargets = {

        begin: {
            position: [0, 0, 36],
            lookAt: [0, 0, 0]
        },

        sun: {
            position: [0, 2, -2],
            lookAt: [0, 0, -20]
        },

        mercury: {
            position: [-1, 0, -2],
            lookAt: [-3, -1, -8]
        },

        venus: {
            position: [4, 1, 0],
            lookAt: [3, 0, -12]
        },

        earth: {
            position: [0, 1, -5],
            lookAt: [0, 0, -15]
        },

        mars: {
            position: [3, 1, -3],
            lookAt: [3, -1, -12]
        },

        jupiter: {
            position: [-3, 2, -8],
            lookAt: [-3, 0, -20]
        },

        saturn: {
            position: [4, 2, -5],
            lookAt: [3, 0, -17]
        },

        uranus: {
            position: [-3, 1, -2],
            lookAt: [-3, 0, -14]
        },

        neptune: {
            position: [3, 1, -4],
            lookAt: [3, 0, -16]
        },

        final: {
            position: [0, 0, 40],
            lookAt: [0, 0, -10]
        }

    };

    /* CAMERA CONTROLS */

    const cameraPosition = new THREE.Vector3();

    const cameraLookAt = new THREE.Vector3();

    let activeScene = "begin";

    function updateCamera(sceneName, progress = 0) {

        const target = cameraTargets[sceneName];

        if (!target) return;

        const position = new THREE.Vector3(
            ...target.position
        );

        const lookAt = new THREE.Vector3(
            ...target.lookAt
        );

        if (progress === 0) {

            cameraPosition.copy(position);

            cameraLookAt.copy(lookAt);

        } else {

            cameraPosition.lerp(position, progress);

            cameraLookAt.lerp(lookAt, progress);

        }

        camera.position.copy(cameraPosition);

        camera.lookAt(cameraLookAt);

    }

    /* PUBLIC CONTROLS FOR SCROLL SCRIPT */

    window.InfinitySpace = {

        scene,

        camera,

        renderer,

        planets,

        stars,

        world,

        cameraTargets,

        setScene(name) {

            if (!cameraTargets[name]) return;

            activeScene = name;

        },

        moveCamera(name, progress = 1) {

            const target = cameraTargets[name];

            if (!target) return;

            const p = new THREE.Vector3(
                ...target.position
            );

            const l = new THREE.Vector3(
                ...target.lookAt
            );

            camera.position.lerp(p, progress);

            camera.lookAt(l);

        },

        getActiveScene() {

            return activeScene;

        }

    };

    /* ANIMATION LOOP */

    const clock = new THREE.Clock();

    function animate() {

        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        if (!reduceMotion) {

            stars.rotation.y = elapsed * 0.002;

            Object.entries(planets).forEach(([name, planet]) => {

                if (name === "sun") {

                    planet.rotation.y = elapsed * 0.05;

                } else {

                    planet.rotation.y = elapsed * 0.08;

                }

            });

            sunGlow.material.opacity =
                0.9 + Math.sin(elapsed * 1.2) * 0.08;

        }

        renderer.render(scene, camera);

    }

    /* RESIZE */

    window.addEventListener("resize", () => {

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75)
        );

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    });

    /* INITIAL CAMERA */

    updateCamera("begin");

    animate();

    /* LOADING SCREEN */

    window.addEventListener("load", () => {

        const loading = document.getElementById("loading-screen");

        if (loading) {

            setTimeout(() => {

                loading.classList.add("hidden");

            }, 500);

        }

    });

    console.log(
        "∞ Infinity Explorer: Three.js cinematic engine initialized."
    );

})();
