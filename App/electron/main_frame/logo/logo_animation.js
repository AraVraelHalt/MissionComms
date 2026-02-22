const turbulence = document.querySelector('feTurbulence');
const displacement = document.querySelector('feDisplacementMap');
const main_section = document.getElementById('main-section');
const polygon = document.querySelector('polygon');
const padlock = document.getElementById('padlock');
const padlock_shackle = document.getElementById('shackle');
const duration = 1800;

// Starting Conditions
polygon.style.opacity = 0;

// Animation
anime({
    targets: polygon,
    opacity: [0, 0.7],
    duration: 4000,     
    easing: 'easeOutQuad'
});

anime({
    targets: turbulence,
    baseFrequency: [0, 0.05],
    direction: 'alternate',
    loop: 6,
    duration: duration,
    easing: 'easeInOutSine'
});

anime({
    targets: displacement,
    scale: [1, 15],
    direction: 'alternate',
    loop: 6,
    duration: duration,
    easing: 'easeInOutSine'
});

anime({
    targets: polygon,
    points: [
        '64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96',
        '64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100'
    ],
    direction: 'alternate',
    loop: 6,
    duration: duration,
    easing: 'easeInOutSine',
    complete: function() { 
        anime({ 
            targets: padlock,
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeInOutQuad' 
        }).finished.then(() => {
            anime({
                targets: 'svg',
                scale: 0.2,
                duration: 1200,
                easing: 'easeInOutQuad'
            }).finished.then(() => {
                anime({
                    targets: padlock_shackle,
                    opacity: [0, 1],
                    duration: 500,
                    easing: 'easeInOutQuad'
                }).finished.then(() => {
                    anime({
                        targets: 'svg',
                        translateX: '-235vw',
                        translateY: '-225vh',
                        duration: 1000,
                        easing: 'easeInOutQuad',
                        complete: () => {
                            main_section.style.display = 'block';
                        }
                    });
                });
            });
        }); 
    }
});

anime({
    targets: 'body',
    color: [
        { value: '#ff0000' }, // red
        { value: '#0000ff' }, // blue
        { value: '#00ff00' }  // green
    ],
    duration: 10800,
    easing: 'linear'
});
