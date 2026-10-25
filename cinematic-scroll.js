// ======================================
// INFINITY EXPLORER — CINEMATIC SCROLL
// ======================================

document.addEventListener("DOMContentLoaded", () => {
    if (!window.THREE || !window.gsap || !window.ScrollTrigger) {
        console.error("Three.js or GSAP failed to load.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.querySelector("#space-canvas");

    if (!canvas) {
        console.error("Missing #space-canvas in index.html");
        return;
    }

    // Connect to the existing Three.js scene.
    // These variables must be exposed by cinematic.js.
    if (!window.spaceScene || !window.spaceCamera || !window.spacePlanets) {
        console.error(
            "Expose spaceScene, spaceCamera, and spacePlanets " +
            "from cinematic.js before enabling cinematic scroll."
        );
        return;
    }

    const camera = window.spaceCamera;
    const planets = window.spacePlanets;

    // Camera starts far away from the planetary system.
    camera.position.set(0, 2, 35);

    // Cinematic scroll progression.
    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        }
    });

    timeline
        .to(camera.position, {
            z: 22,
            y: 3,
            x: 2,
            ease: "none"
        }, 0)

        .to(camera.position, {
            z: 14,
            y: 1,
            x: -3,
            ease: "none"
        }, 0.25)

        .to(camera.position, {
            z: 8,
            y: 2,
            x: 3,
            ease: "none"
        }, 0.5)

        .to(camera.position, {
            z: 18,
            y: 5,
            x: 0,
            ease: "none"
        }, 0.75);

    // Give each planet a different rotation speed.
    planets.forEach((planet, index) => {
        if (!planet) return;

        gsap.to(planet.rotation, {
            y: Math.PI * 2,
            duration: 12 + index * 2,
            repeat: -1,
            ease: "none"
        });

        gsap.to(planet.position, {
            y: planet.position.y + 0.35,
            duration: 2 + index * 0.3,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    });

    // Refresh scroll measurements after layout changes.
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    console.log("Infinity Explorer cinematic scroll initialized.");
});
