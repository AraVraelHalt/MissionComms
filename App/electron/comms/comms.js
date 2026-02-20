document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');

    logo.classList.add('fade-in');

    logo.addEventListener('animationend', function handleAnimationEnd(e) {
        if (e.animationName === 'fadeIn') {
            logo.classList.remove('fade-in');
            logo.classList.add('glitch');
        } 
        else if (e.animationName === 'glitch') {
            logo.classList.remove('glitch');
            logo.classList.add('shrink-move');
        } 
        else if (e.animationName === 'shrinkAndMove') {
            logo.classList.remove('shrink-move');
            logo.classList.add('final-position');
            // Remove the event listener after final animation
            logo.removeEventListener('animationend', handleAnimationEnd);
        }
    });
});
