/* =================================
   SYNTRIX DYNAMICS TECHNOLOGIES
   Interactive animation engine
================================= */

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* PARTICLE ANIMATION */

const canvas = document.getElementById("particle-canvas");

if (canvas && !reducedMotion) {

    const ctx = canvas.getContext("2d");

    let width;
    let height;
    let particles = [];

    const mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        const amount = width < 700 ? 22 : 45;

        particles = Array.from({ length: amount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            radius: Math.random() * 1.8 + 0.5
        }));
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
            }

            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
            }

            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120 && distance > 0) {
                particle.x -= dx * 0.001;
                particle.y -= dy * 0.001;
            }

            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(100, 160, 255, 0.65)";
            ctx.fill();

            for (let j = index + 1; j < particles.length; j++) {
                const other = particles[j];
                const lineX = particle.x - other.x;
                const lineY = particle.y - other.y;

                const lineDistance = Math.sqrt(
                    lineX * lineX + lineY * lineY
                );

                if (lineDistance < 115) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle =
                        `rgba(75, 130, 255, ${0.16 * (1 - lineDistance / 115)})`;

                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        });
    }

    let animationFrame;
    let animationRunning = false;

    function animate() {
        if (document.hidden || animationRunning) return;

        animationRunning = true;

        function frame() {
            if (document.hidden) {
                animationRunning = false;
                return;
            }

            drawParticles();
            animationFrame = requestAnimationFrame(frame);
        }

        frame();
    }

    function stopAnimation() {
        cancelAnimationFrame(animationFrame);
        animationRunning = false;
    }

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);

    window.addEventListener("pointermove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("pointerleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopAnimation();
        } else {
            animate();
        }
    });
}

/* SCROLL REVEAL */

const revealSections = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealSections.forEach((section) => {
        observer.observe(section);
    });
} else {
    revealSections.forEach((section) => {
        section.classList.add("visible");
    });
}

/* HOLOGRAPHIC MASCOT */

const hologram = document.querySelector(".hologram");

if (hologram && !reducedMotion) {
    hologram.addEventListener("pointermove", (event) => {
        const bounds = hologram.getBoundingClientRect();

        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;

        const rotateY = (x - 0.5) * 8;
        const rotateX = (0.5 - y) * 8;

        hologram.style.transform =
            `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    hologram.addEventListener("pointerleave", () => {
        hologram.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menu-toggle");
const mainNavigation = document.getElementById("main-navigation");

if (menuToggle && mainNavigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainNavigation.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    });

    mainNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mainNavigation.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        });
    });
}

console.log("SYNTRIX SYSTEM INITIALIZED");
