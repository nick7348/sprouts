/* ========== SPROUTS PRESCHOOL — script.js ========== */

// ── Navbar scroll effect ────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Hamburger toggle ───────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── Active nav link on scroll ──────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
const observerOptions = { rootMargin: '-40% 0px -40% 0px', threshold: 0 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, observerOptions);
sections.forEach(sec => sectionObserver.observe(sec));

// ── Reveal on scroll ─────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Enrollment form submission ─────────────────────────────────────────────
const enrollForm = document.getElementById('enrollForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (enrollForm) {
  enrollForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const data = {
      parent_name: document.getElementById('parentName').value,
      child_name: document.getElementById('childName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      child_age: document.getElementById('childAge').value,
      program: document.getElementById('program').value
    };

    const response = await fetch(enrollForm.action, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      enrollForm.style.display = 'none';
      formSuccess.style.display = 'block';
    } else {
      submitBtn.textContent = 'Schedule a Free Tour 🌟';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again.');
    }
  });
}

// ── Smooth counter animation ───────────────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const update = (time) => {
    const elapsed = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (elapsed < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    const targets = [500, 15, 98];
    const suffixes = ['+', '+', '%'];
    statNums.forEach((el, i) => animateCounter(el, targets[i], suffixes[i]));
  }
}, { threshold: 0.5 });
if (statNums.length > 0) {
  heroObserver.observe(document.querySelector('.hero-stats'));
}

// ── Gallery items: subtle tilt on hover ───────────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `scale(1.03) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ── Ripple effect on primary buttons ──────────────────────────────────────
document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;
    const rect = this.getBoundingClientRect();
    circle.style.cssText = `
      width: ${diameter}px; height: ${diameter}px;
      left: ${e.clientX - rect.left - radius}px;
      top: ${e.clientY - rect.top - radius}px;
      position: absolute; border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transform: scale(0); animation: ripple 0.55s ease-out;
      pointer-events: none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  });
});

// Add ripple keyframe dynamically
const style = document.createElement('style');
style.textContent = '@keyframes ripple { to { transform: scale(4); opacity: 0; } }';
document.head.appendChild(style);

// ── Hamburger active styles ────────────────────────────────────────────────
const hamburgerStyle = document.createElement('style');
hamburgerStyle.textContent = `
  .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
  .hamburger.active span:nth-child(2) { opacity: 0; }
  .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
`;
document.head.appendChild(hamburgerStyle);

// ── Auto-pause videos when scrolled out of view ────────────────────────────
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (!entry.isIntersecting) {
      if (!video.paused) {
        video.pause();
      }
    }
  });
}, { threshold: 0.1 }); // Pause when mostly out of viewport

document.querySelectorAll('video').forEach(video => {
  videoObserver.observe(video);
});
