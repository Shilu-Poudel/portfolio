// ==========================================
// Dashboard.js - Protected Dashboard Logic
// ==========================================

const auth = firebase.auth();
const dashboardLoading = document.getElementById('dashboard-loading');
const dashboardContainer = document.getElementById('dashboard-container');

// Set year
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================
// AUTH STATE - Protect Dashboard
// ==========================================

auth.onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        // User is signed in and verified
        loadDashboard(user);
    } else {
        // Not signed in or not verified — redirect to login
        window.location.href = 'portal.html';
    }
});

// ==========================================
// LOAD DASHBOARD
// ==========================================

function loadDashboard(user) {
    // Set user info
    const displayName = user.displayName || 'User';
    const email = user.email || '';
    const firstName = displayName.split(' ')[0];

    document.getElementById('user-name').textContent = displayName;
    document.getElementById('user-email').textContent = email;
    document.getElementById('welcome-name').textContent = firstName;

    // Set avatar with initials
    const avatar = document.getElementById('user-avatar');
    if (user.photoURL) {
        avatar.innerHTML = `<img src="${user.photoURL}" alt="Avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    } else {
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        avatar.textContent = initials;
        avatar.style.display = 'flex';
        avatar.style.alignItems = 'center';
        avatar.style.justifyContent = 'center';
        avatar.style.fontSize = '0.85rem';
        avatar.style.fontWeight = '600';
    }

    // Show dashboard
    dashboardLoading.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    setTimeout(() => dashboardContainer.classList.add('fade-in'), 10);
}

// ==========================================
// SIGN OUT
// ==========================================

document.getElementById('signout-btn').addEventListener('click', async () => {
    const btn = document.getElementById('signout-btn');
    btn.disabled = true;

    try {
        await auth.signOut();
        window.location.href = 'portal.html';
    } catch (error) {
        console.error('Sign out error:', error);
        btn.disabled = false;
    }
});

// ==========================================
// PARTICLES BACKGROUND
// ==========================================

const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = Math.random() > 0.5 ? '255, 107, 157' : '192, 132, 252';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

animateParticles();
