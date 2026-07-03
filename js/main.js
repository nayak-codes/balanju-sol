/* ==============================================
   BALANJU MAIN JS
   Animations, Navigation, Interactions
   ============================================== */

// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Hamburger / Mobile Nav ──
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ── Active Nav Link ──
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── Scroll Reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Animated Counters ──
function animateCounter(el, target, suffix = '') {
  const duration = 2000;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-count]').forEach(el => statsObserver.observe(el));

// ── Product Filter ──
const filterPills = document.querySelectorAll('.filter-pill');
const productCards = document.querySelectorAll('.product-card[data-category]');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    productCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (show) {
        card.style.opacity = '1';
        card.style.transform = '';
        card.style.display = '';
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
          if (filter !== 'all' && card.dataset.category !== filter) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

// ── Contact Form ──
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      showToast('✅ Message sent! We\'ll get back to you soon.');
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// ── Toast Notification ──
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-icon">🎉</span> ${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ── Smooth page-transition links ──
document.querySelectorAll('a[href$=".html"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http')) {
      // same-origin navigation — let it proceed naturally (instant is fine)
    }
  });
});

// ── Duplicate strip icons for seamless loop ──
const stripInner = document.querySelector('.icon-strip-inner');
if (stripInner) {
  const clone = stripInner.cloneNode(true);
  stripInner.parentElement.appendChild(clone);
}
