// Due coppie di letture si alternano accanto all’articolo principale.
const rail = document.querySelector('.side-stories');
const pairs = [...rail.querySelectorAll('.reading-pair')];
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let current = 0;
let inView = false;
let timer;
let hovering = false;

function scheduleRotation() {
  clearTimeout(timer);
  const reading = hovering || rail.contains(document.activeElement);
  if (inView && !motionPreference.matches && !reading && !document.hidden) timer = setTimeout(changePair, 6500);
}

function changePair() {
  pairs[current].inert = true;
  current = (current + 1) % pairs.length;
  pairs[current].inert = false;
  scheduleRotation();
}

pairs.forEach((pair, index) => {
  pair.inert = index !== 0;
  pair.hidden = false;
});
rail.addEventListener('pointerenter', event => { hovering = event.pointerType === 'mouse'; scheduleRotation(); });
rail.addEventListener('pointerleave', () => { hovering = false; scheduleRotation(); });
rail.addEventListener('focusin', scheduleRotation);
rail.addEventListener('focusout', () => requestAnimationFrame(scheduleRotation));
document.addEventListener('visibilitychange', scheduleRotation);
motionPreference.addEventListener('change', scheduleRotation);
new IntersectionObserver(([entry]) => {
  inView = entry.isIntersecting;
  scheduleRotation();
}).observe(rail);
