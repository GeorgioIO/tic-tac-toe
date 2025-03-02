particlesJS('particles-js', {
    particles: {
        number: { value: 200 },
        color: { value: '#ff4500' },
        shape: { type: 'circle' },
        opacity: { value: 1, random: false },
        size: { value: 6, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#4b0082',
            opacity: 1,
            width: 1
        },
        move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: true,
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
        }
    },
    retina_detect: true
});

