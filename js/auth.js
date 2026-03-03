// ==========================================
// Auth.js - Firebase Authentication Logic
// ==========================================

const auth = firebase.auth();

// DOM Elements - Login
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const forgotCard = document.getElementById('forgot-card');
const verifyCard = document.getElementById('verify-card');

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotForm = document.getElementById('forgot-form');

const loginStatus = document.getElementById('login-status');
const registerStatus = document.getElementById('register-status');
const forgotStatus = document.getElementById('forgot-status');
const verifyStatus = document.getElementById('verify-status');

// Store user for resend verification
let pendingUser = null;

// ==========================================
// Switch Between Forms
// ==========================================

document.getElementById('show-register').addEventListener('click', (e) => {
    e.preventDefault();
    switchCard(registerCard);
});

document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    switchCard(loginCard);
});

document.getElementById('forgot-password-link').addEventListener('click', (e) => {
    e.preventDefault();
    switchCard(forgotCard);
});

document.getElementById('show-login-from-forgot').addEventListener('click', (e) => {
    e.preventDefault();
    switchCard(loginCard);
});

document.getElementById('show-login-from-verify').addEventListener('click', (e) => {
    e.preventDefault();
    switchCard(loginCard);
});

function switchCard(showCard) {
    [loginCard, registerCard, forgotCard, verifyCard].forEach(card => {
        card.classList.add('hidden');
        card.classList.remove('card-enter');
    });
    showCard.classList.remove('hidden');
    setTimeout(() => showCard.classList.add('card-enter'), 10);
    clearStatuses();
}

function clearStatuses() {
    [loginStatus, registerStatus, forgotStatus, verifyStatus].forEach(s => {
        s.textContent = '';
        s.className = 'auth-status';
    });
}

// ==========================================
// Show Status Messages
// ==========================================

function showStatus(element, message, type) {
    element.textContent = message;
    element.className = `auth-status status-${type}`;
}

// ==========================================
// Toggle Password Visibility
// ==========================================

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = loginForm.querySelector('.btn-auth');

    btn.classList.add('loading');
    btn.disabled = true;
    clearStatuses();

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
            pendingUser = user;
            showStatus(loginStatus, 'Please verify your email before signing in.', 'error');
            btn.classList.remove('loading');
            btn.disabled = false;

            // Offer to resend
            setTimeout(() => {
                switchCard(verifyCard);
            }, 1500);
            return;
        }

        showStatus(loginStatus, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        let message = 'An error occurred. Please try again.';
        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email.';
                break;
            case 'auth/wrong-password':
                message = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address.';
                break;
            case 'auth/too-many-requests':
                message = 'Too many attempts. Please try again later.';
                break;
            case 'auth/invalid-credential':
                message = 'Invalid email or password.';
                break;
        }
        showStatus(loginStatus, message, 'error');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const btn = registerForm.querySelector('.btn-auth');

    clearStatuses();

    // Validate passwords match
    if (password !== confirmPassword) {
        showStatus(registerStatus, 'Passwords do not match.', 'error');
        return;
    }

    if (password.length < 6) {
        showStatus(registerStatus, 'Password must be at least 6 characters.', 'error');
        return;
    }

    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Update display name
        await user.updateProfile({ displayName: name });

        // Store user info in Firestore
        await db.collection('users').doc(user.uid).set({
            fullName: name,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: false
        });

        // Send email verification
        await user.sendEmailVerification();

        pendingUser = user;

        showStatus(registerStatus, 'Account created! Check your email for verification.', 'success');

        setTimeout(() => {
            switchCard(verifyCard);
        }, 2000);

    } catch (error) {
        let message = 'An error occurred. Please try again.';
        switch (error.code) {
            case 'auth/email-already-in-use':
                message = 'An account with this email already exists.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address.';
                break;
            case 'auth/weak-password':
                message = 'Password is too weak. Use at least 6 characters.';
                break;
        }
        showStatus(registerStatus, message, 'error');
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

// ==========================================
// RESEND VERIFICATION EMAIL
// ==========================================

document.getElementById('resend-verification').addEventListener('click', async () => {
    const btn = document.getElementById('resend-verification');
    btn.classList.add('loading');
    btn.disabled = true;

    try {
        if (pendingUser) {
            await pendingUser.sendEmailVerification();
            showStatus(verifyStatus, 'Verification email resent! Check your inbox.', 'success');
        } else {
            showStatus(verifyStatus, 'Please try logging in again.', 'error');
        }
    } catch (error) {
        if (error.code === 'auth/too-many-requests') {
            showStatus(verifyStatus, 'Too many requests. Please wait a few minutes.', 'error');
        } else {
            showStatus(verifyStatus, 'Failed to resend. Please try again.', 'error');
        }
    }

    btn.classList.remove('loading');
    btn.disabled = false;
});

// ==========================================
// FORGOT PASSWORD
// ==========================================

forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgot-email').value.trim();
    const btn = forgotForm.querySelector('.btn-auth');

    btn.classList.add('loading');
    btn.disabled = true;
    clearStatuses();

    try {
        await auth.sendPasswordResetEmail(email);
        showStatus(forgotStatus, 'Password reset link sent! Check your email.', 'success');
    } catch (error) {
        let message = 'An error occurred.';
        switch (error.code) {
            case 'auth/user-not-found':
                message = 'No account found with this email.';
                break;
            case 'auth/invalid-email':
                message = 'Invalid email address.';
                break;
        }
        showStatus(forgotStatus, message, 'error');
    }

    btn.classList.remove('loading');
    btn.disabled = false;
});

// ==========================================
// GOOGLE SIGN IN
// ==========================================

document.getElementById('google-signin').addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const btn = document.getElementById('google-signin');

    btn.classList.add('loading');
    btn.disabled = true;

    try {
        const result = await auth.signInWithPopup(provider);
        const user = result.user;

        // Store/update user in Firestore
        await db.collection('users').doc(user.uid).set({
            fullName: user.displayName || 'Google User',
            email: user.email,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            emailVerified: true
        }, { merge: true });

        showStatus(loginStatus, 'Login successful! Redirecting...', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        if (error.code !== 'auth/popup-closed-by-user') {
            showStatus(loginStatus, 'Google sign-in failed. Please try again.', 'error');
        }
        btn.classList.remove('loading');
        btn.disabled = false;
    }
});

// ==========================================
// CHECK AUTH STATE (redirect if already logged in)
// ==========================================

auth.onAuthStateChanged((user) => {
    if (user && user.emailVerified) {
        window.location.href = 'dashboard.html';
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
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
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

for (let i = 0; i < 60; i++) {
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
