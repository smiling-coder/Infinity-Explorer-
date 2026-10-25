/* ==========================================
   INFINITY EXPLORER
   CINEMATIC SCROLL CONTROLLER
========================================== */

(() => {

    "use strict";

    if (!window.gsap || !window.ScrollTrigger) {

        console.error(
            "GSAP or ScrollTrigger could not be loaded."
        );

        return;

    }

    if (!window.InfinitySpace) {

        console.error(
            "The Three.js cinematic engine is unavailable."
        );

        return;

    }

    gsap.registerPlugin(ScrollTrigger);

    const space = window.InfinitySpace;

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const progressBar = document.getElementById(
        "scroll-progress"
    );

    const indicator = document.getElementById(
        "scroll-indicator"
    );

    /* SCROLL PROGRESS BAR */

    gsap.to(progressBar, {

        width: "100%",

        ease: "none",

        scrollTrigger: {

            trigger: ".cinematic-content",

            start: "top top",

            end: "bottom bottom",

            scrub: true

        }

    });

    /* INTRO TEXT */

    if (!reduceMotion) {

        gsap.from("#begin .scene-inner", {

            opacity: 0,

            y: 70,

            duration: 1.5,

            ease: "power3.out",

            delay: 0.4

        });

    }

    /* SCENE TRANSITIONS */

    const scenes = document.querySelectorAll(
        "[data-scene]"
    );

    scenes.forEach(section => {

        const sceneName = section.dataset.scene;

        ScrollTrigger.create({

            trigger: section,

            start: "top center",

            end: "bottom center",

            onEnter: () => {

                space.setScene(sceneName);

                if (indicator) {

                    indicator.style.opacity =
                        sceneName === "final" ? "0" : "1";

                }

            },

            onEnterBack: () => {

                space.setScene(sceneName);

                if (indicator) {

                    indicator.style.opacity =
                        sceneName === "final" ? "0" : "1";

                }

            }

        });

    });

    /* CINEMATIC CAMERA MOVEMENT */

    const cameraTimeline = gsap.timeline({

        scrollTrigger: {

            trigger: ".cinematic-content",

            start: "top top",

            end: "bottom bottom",

            scrub: 1.5,

            invalidateOnRefresh: true

        }

    });

    const cameraSequence = [

        "sun",

        "mercury",

        "venus",

        "earth",

        "mars",

        "jupiter",

        "saturn",

        "uranus",

        "neptune",

        "final"

    ];

    cameraSequence.forEach((sceneName, index) => {

        const target = space.cameraTargets[sceneName];

        if (!target) return;

        const destination = {

            x: target.position[0],

            y: target.position[1],

            z: target.position[2],

            lookX: target.lookAt[0],

            lookY: target.lookAt[1],

            lookZ: target.lookAt[2]

        };

        const proxy = { progress: 0 };

        cameraTimeline.to(

            proxy,

            {

                progress: 1,

                duration: 1,

                ease: "none",

                onUpdate: () => {

                    const progress = proxy.progress;

                    space.camera.position.set(

                        gsap.utils.interpolate(
                            index === 0
                                ? 0
                                : cameraSequence[index - 1]
                                    ? space.cameraTargets[
                                        cameraSequence[index - 1]
                                    ].position[0]
                                    : 0,
                            destination.x,
                            progress
                        ),

                        gsap.utils.interpolate(
                            index === 0
                                ? 0
                                : space.cameraTargets[
                                    cameraSequence[index - 1]
                                ].position[1],
                            destination.y,
                            progress
                        ),

                        gsap.utils.interpolate(
                            index === 0
                                ? 36
                                : space.cameraTargets[
                                    cameraSequence[index - 1]
                                ].position[2],
                            destination.z,
                            progress
                        )

                    );

                    space.camera.lookAt(

                        destination.lookX,

                        destination.lookY,

                        destination.lookZ

                    );

                }

            },

            index

        );

    });

    /* SECTION TEXT REVEALS */

    if (!reduceMotion) {

        document.querySelectorAll(
            ".scene-inner"
        ).forEach((element, index) => {

            if (element.closest("#begin")) return;

            gsap.from(element.children, {

                opacity: 0,

                y: 35,

                duration: 1,

                stagger: 0.12,

                ease: "power3.out",

                scrollTrigger: {

                    trigger: element,

                    start: "top 75%",

                    toggleActions: "play none none reverse"

                }

            });

        });

    }

    /* INITIAL SCROLL POSITION */

    window.addEventListener("load", () => {

        ScrollTrigger.refresh();

    });

    console.log(
        "∞ Infinity Explorer: cinematic scroll controller initialized."
    );

})();
