// Cursor effect
const cursorDot = document.createElement('div');
const cursorOutline = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorOutline.className = 'cursor-outline';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorOutline);

// Background animation
const background = document.createElement('div');
background.className = 'background-animation';
document.body.appendChild(background);

// Mouse movement handling
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    
    // Update cursor
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
    cursorOutline.style.transform = `translate(${clientX}px, ${clientY}px)`;
    
    // Update background gradient
    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    background.style.background = `
        radial-gradient(circle at ${x * 100}% ${y * 100}%, 
            rgba(76, 0, 255, 0.15) 0%, 
            transparent 50%),
        radial-gradient(circle at ${100 - x * 100}% ${y * 100}%, 
            rgba(0, 255, 255, 0.15) 0%, 
            transparent 50%),
        radial-gradient(circle at ${x * 100}% ${100 - y * 100}%, 
            rgba(255, 0, 255, 0.15) 0%, 
            transparent 50%)
    `;
});

// Card tilt effect
document.querySelector('.card').addEventListener('mousemove', (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Update card transform
    const rotateY = (x - 50) * 0.1;
    const rotateX = (y - 50) * -0.1;
    card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateZ(10px)
    `;
    
    // Update glare effect
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
});

// Reset card position on mouse leave
document.querySelector('.card').addEventListener('mouseleave', (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
});
