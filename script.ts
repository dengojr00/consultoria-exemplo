// script.ts — compile: npx tsc script.ts --target es2020 --lib dom,es2020
const $ = <T extends HTMLElement>(s: string): T | null => document.querySelector<T>(s);
document.documentElement.classList.add('js');

// Mobile menu
const nav = $<HTMLElement>('#nav');
const burger = $<HTMLButtonElement>('.burger');
burger?.addEventListener('click', () => {
  const open = nav!.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

// Header shadow on scroll
const head = $<HTMLElement>('.head');
addEventListener('scroll', () => head?.classList.toggle('stuck', scrollY > 40), { passive: true });

// Reveal on scroll
const io = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Animated counters
function count(el: HTMLElement): void {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = (t: number): void => {
    const p = Math.min((t - start) / 1400, 1);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const co = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { count(e.target as HTMLElement); co.unobserve(e.target); } });
}, { threshold: 0.6 });
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => co.observe(el));

// Active link on scroll
const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav a'));
const so = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('active', a.hash === '#' + (e.target as HTMLElement).id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
['top', 'about', 'stats', 'industries', 'team', 'callback'].forEach((id) => { const s = document.getElementById(id); if (s) so.observe(s); });

// Call-back form validation
interface CallForm { topic: string; name: string; phone: string; }
const form = $<HTMLFormElement>('#callForm');
const msg = $<HTMLElement>('#formMsg');
form?.addEventListener('submit', (ev: Event) => {
  ev.preventDefault();
  const fields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]'));
  let ok = true;
  fields.forEach((f) => {
    const bad = !f.value.trim() || (f.name === 'phone' && !/^[+\d][\d\s-]{6,}$/.test(f.value));
    f.classList.toggle('err', bad);
    if (bad) ok = false;
  });
  if (!ok) { msg!.textContent = 'Please fill in all fields correctly.'; return; }
  const data = Object.fromEntries(new FormData(form)) as unknown as CallForm;
  msg!.textContent = `Thank you, ${data.name}! We’ll call you back shortly.`;
  form.reset();
});

// Newsletter + year
$<HTMLFormElement>('#newsForm')?.addEventListener('submit', (ev: Event) => {
  ev.preventDefault();
  (ev.target as HTMLFormElement).reset();
  alert('Subscribed!');
});
$('#year')!.textContent = String(new Date().getFullYear());