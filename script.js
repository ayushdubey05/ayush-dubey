// Entrance Curtain animation
const loadPct = document.getElementById('loadPct');
let pct = 0;
const pctTimer = setInterval(() => {
  pct = Math.min(99, pct + Math.round(Math.random() * 12) + 3);
  if(loadPct) loadPct.textContent = String(pct).padStart(2,'0') + '%';
}, 110);

window.addEventListener('load', () => {
  clearInterval(pctTimer);
  if(loadPct) loadPct.textContent = '100%';
  setTimeout(() => { document.body.classList.add('loaded'); }, 450);
});

// Sticky Header Effect
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  if(header) header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// Mobile Menu Toggle
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if(menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal Animations
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Dynamic Background Shift on Scroll
const bgStops = [
  { y: 0,    color: '#F6F1E6' },
  { y: 0.25, color: '#F1E9D8' },
  { y: 0.5,  color: '#EFE7D8' },
  { y: 0.72, color: '#F3ECDD' },
  { y: 1.0,  color: '#F6F1E6' }
];
function hexToRgb(hex){
  const v = hex.replace('#','');
  return [parseInt(v.substring(0,2),16), parseInt(v.substring(2,4),16), parseInt(v.substring(4,6),16)];
}
function mix(c1, c2, t){ return [0,1,2].map(i => Math.round(c1[i] + (c2[i]-c1[i]) * t)); }
function updateBackground(){
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  let i = 0;
  while (i < bgStops.length - 2 && progress > bgStops[i+1].y) i++;
  const a = bgStops[i], b = bgStops[i+1];
  const span = b.y - a.y || 1;
  const t = Math.min(1, Math.max(0, (progress - a.y) / span));
  const rgb = mix(hexToRgb(a.color), hexToRgb(b.color), t);
  document.body.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
window.addEventListener('scroll', updateBackground, { passive: true });

// Scroll Progress Bar
const progressBar = document.getElementById('progress');
function updateProgress(){
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const pctProgress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  if(progressBar) progressBar.style.width = pctProgress + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// Scroll To Top Button
const toTop = document.getElementById('toTop');
if(toTop) {
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Active Navigation Highlighting
const sectionIds = ['work-story','work','connect'];
const spySections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      spyLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });
spySections.forEach(s => spyObserver.observe(s));

// Marquee Duplication for Continuous Loop
const track = document.getElementById('marqueeTrack');
if (track) track.innerHTML += track.innerHTML;

// Contact Form Submission Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = "Sent — I'll reply soon!";
    btn.style.background = "#A9502B";
    btn.style.color = "#F6F1E6";
    contactForm.reset();
  });
}

// Project Modal Logic
const projects = {
  kesar:    { title: 'Kesar & Co. — live preview' },
  rangoli:  { title: 'Rangoli Interiors — live preview' },
  aperture: { title: 'Aperture by Devraj — live preview' }
};
const modal = document.getElementById('projectModal');
const modalTitle = document.getElementById('projModalTitle');
const modalFrame = document.getElementById('projFrame');
const modalClose = document.getElementById('projClose');

function openProject(key){
  const p = projects[key];
  const tpl = document.getElementById('tpl-' + key);
  if (!p || !tpl) return;
  if(modalTitle) modalTitle.textContent = p.title;
  if(modalFrame) modalFrame.srcdoc = tpl.textContent;
  if(modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProject(){
  if(modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { if(modalFrame) modalFrame.srcdoc = ''; }, 400);
}

document.querySelectorAll('.case[data-project]').forEach(card => {
  card.addEventListener('click', () => openProject(card.getAttribute('data-project')));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openProject(card.getAttribute('data-project')); }
  });
});

if(modalClose) modalClose.addEventListener('click', closeProject);
if(modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeProject(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.classList.contains('open')) closeProject(); });

// Custom Smooth Ring Cursor (Desktop only)
if (window.matchMedia('(pointer: fine)').matches){
  document.body.classList.add('has-cursor');
  const ring = document.getElementById('cursorRing');
  let rx = 0, ry = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
  function loop(){
    rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
    if(ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a, button, .case, .stage-row').forEach(el => {
    el.addEventListener('mouseenter', () => { if(ring) ring.classList.add('big'); });
    el.addEventListener('mouseleave', () => { if(ring) ring.classList.remove('big'); });
  });
}

// Fine-pointer-only motion polish: magnetic buttons, card tilt, hero parallax
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (hasFinePointer && !prefersReducedMotion){

  // Magnetic pull — buttons drift gently toward the cursor, spring back on leave
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${relX * 0.28}px, ${relY * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  // Subtle 3D tilt on project cards, following the pointer
  document.querySelectorAll('.case').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

if (prefersReducedMotion){
  document.querySelectorAll('.mask-lines .line > span').forEach(el => { el.style.transitionDuration = '.001ms'; });
}