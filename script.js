const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-section, .reveal-card, .project, .card, .linkbox, .terminal-aside, .hero-copy');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

revealEls.forEach((el, i) => {
  el.style.transitionDelay = `${Math.min(i * 20, 260)}ms`;
  observer.observe(el);
});

document.querySelectorAll('.room-item').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-16px) translateY(6px)';
  item.style.transition = 'opacity .55s ease, transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .3s ease, background .3s ease';
  item.style.transitionDelay = `${Math.min(i * 55, 480)}ms`;
  requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'translateX(0) translateY(0)'; });
});

window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  nav.style.background = window.scrollY > 40 ? 'rgba(10,10,26,.95)' : 'rgba(10,10,26,.82)';
  nav.style.boxShadow = window.scrollY > 40 ? '0 20px 60px rgba(0,255,136,.18)' : '0 8px 32px rgba(0,255,136,.08)';
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 220) current = sec.id; });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});