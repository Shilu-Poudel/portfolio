// ==========================================
// SILU POUDEL - PORTFOLIO MAIN JAVASCRIPT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1500);
    });

    // Fallback - hide preloader after 3 seconds max
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 3000);

    // ========== INITIALIZE AOS ==========
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
    });

    // ========== CUSTOM CURSOR ==========
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursorDot.style.left = cursorX + 'px';
            cursorDot.style.top = cursorY + 'px';
        });

        // Smooth cursor outline follow
        function animateCursor() {
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Cursor hover effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-category, .project-card-new, .timeline-content, .skill-tag');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('active');
                cursorOutline.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('active');
                cursorOutline.classList.remove('active');
            });
        });
    }

    // ========== COLORFUL MOUSE TRAIL ==========
    const trailColors = [
        '#ff6b9d', '#ff8fb8', '#c084fc', '#818cf8',
        '#f472b6', '#e879f9', '#a78bfa', '#fb7185',
        '#f9a8d4', '#d946ef', '#8b5cf6', '#fda4af',
        '#f0abfc', '#c4b5fd', '#ff63c3', '#a855f7'
    ];
    const sparkleEmojis = ['✨', '💖', '⭐', '💫', '🌸', '💜', '🩷', '🦋'];
    let trailCounter = 0;
    let lastTrailTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime < 30) return; // throttle
        lastTrailTime = now;
        trailCounter++;

        // Create colored dot trail
        const dot = document.createElement('div');
        dot.classList.add('trail-particle');
        const color = trailColors[trailCounter % trailColors.length];
        const size = Math.random() * 10 + 5;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.background = color;
        dot.style.boxShadow = `0 0 ${size}px ${color}`;
        dot.style.left = e.clientX + (Math.random() - 0.5) * 10 + 'px';
        dot.style.top = e.clientY + (Math.random() - 0.5) * 10 + 'px';
        document.body.appendChild(dot);

        // Every 5th move, also add a sparkle emoji
        if (trailCounter % 5 === 0) {
            const star = document.createElement('div');
            star.classList.add('trail-star');
            star.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
            star.style.left = e.clientX + (Math.random() - 0.5) * 20 + 'px';
            star.style.top = e.clientY + (Math.random() - 0.5) * 20 + 'px';
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 1000);
        }

        // Remove dot after animation
        setTimeout(() => dot.remove(), 800);
    });

    // ========== NAVBAR ==========
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNav() {
        const scrollY = window.scrollY;
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveNav);

    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // ========== TYPEWRITER EFFECT ==========
    const typewriterElement = document.getElementById('typewriter');
    const words = ['AI Engineer', 'ML Developer', 'Computer Vision Enthusiast', 'NLP Practitioner', 'Problem Solver'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function typeWriter() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 300; // Pause before next word
        }

        setTimeout(typeWriter, typeSpeed);
    }
    typeWriter();

    // ========== PARTICLES CANVAS ==========
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                const colors = [
                    `rgba(255, 107, 157, ${this.opacity})`,
                    `rgba(192, 132, 252, ${this.opacity})`,
                    `rgba(129, 140, 248, ${this.opacity})`,
                    `rgba(244, 114, 182, ${this.opacity})`
                ];
                ctx.fillStyle = colors[Math.floor(this.x + this.y) % colors.length];
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.strokeStyle = `rgba(255, 107, 157, ${0.1 * (1 - distance / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            animationId = requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ========== SKILL BAR ANIMATION ==========
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillProgressBars.forEach(bar => skillObserver.observe(bar));

    // ========== COUNTER ANIMATION ==========
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                let count = 0;
                const speed = Math.max(1, Math.floor(2000 / target));

                const updateCount = () => {
                    if (count < target) {
                        count++;
                        entry.target.textContent = count;
                        setTimeout(updateCount, speed);
                    } else {
                        entry.target.textContent = target;
                    }
                };
                updateCount();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    // ========== PROJECT FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ========== CONTACT FORM - FIREBASE ==========
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                read: false
            };

            try {
                await db.collection('contact-messages').add(formData);

                formStatus.className = 'form-status success';
                formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                contactForm.reset();

                // Log analytics event
                analytics.logEvent('contact_form_submitted', {
                    name: formData.name,
                    email: formData.email
                });

                setTimeout(() => {
                    formStatus.className = 'form-status';
                }, 5000);
            } catch (error) {
                console.error('Error sending message:', error);
                formStatus.className = 'form-status error';
                formStatus.textContent = '❌ Oops! Something went wrong. Please try again.';

                setTimeout(() => {
                    formStatus.className = 'form-status';
                }, 5000);
            }

            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        });
    }

    // ========== BACK TO TOP ==========
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // ========== FOOTER YEAR ==========
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ========== SMOOTH REVEAL ON SCROLL ==========
    // Adding a fade-in animation for elements
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // ========== PAGE VIEW ANALYTICS ==========
    if (typeof analytics !== 'undefined') {
        analytics.logEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
    }

    console.log('%c💖 Silu Poudel Portfolio', 'font-size: 20px; font-weight: bold; color: #ff6b9d;');
    console.log('%cBuilt with 💜 in Nepal', 'font-size: 14px; color: #c084fc;');
});
