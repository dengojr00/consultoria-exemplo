// script.js — plain JavaScript version (same logic as script.ts)
const $ = (s) => document.querySelector(s);
document.documentElement.classList.add('js');

const nav = $('#nav'), burger = $('.burger');
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

const head = $('.head');
addEventListener('scroll', () => head?.classList.toggle('stuck', scrollY > 40), { passive: true });

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

function count(el) {
  const target = Number(el.dataset.count), start = performance.now();
  const step = (t) => {
    const p = Math.min((t - start) / 1400, 1);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const co = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { count(e.target); co.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => co.observe(el));

const links = [...document.querySelectorAll('.nav a')];
const so = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.hash === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['top', 'about', 'stats', 'industries', 'team', 'callback'].forEach((id) => { const s = document.getElementById(id); if (s) so.observe(s); });

const form = $('#callForm'), msg = $('#formMsg');
form?.addEventListener('submit', (ev) => {
  ev.preventDefault();
  let ok = true;
  form.querySelectorAll('[required]').forEach((f) => {
    const bad = !f.value.trim() || (f.name === 'phone' && !/^[+\d][\d\s-]{6,}$/.test(f.value));
    f.classList.toggle('err', bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = 'Please fill in all fields correctly.'; return; }
  const data = Object.fromEntries(new FormData(form));
  msg.textContent = `Thank you, ${data.name}! We’ll call you back shortly.`;
  form.reset();
});

$('#newsForm')?.addEventListener('submit', (ev) => {
  ev.preventDefault();
  ev.target.reset();
  alert('Subscribed!');
});
$('#year').textContent = String(new Date().getFullYear());