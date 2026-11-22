// Inserire gli URL dei profili, i numeri con prefisso internazionale e la mail dello studio.
const canali = {
  facebook: '',
  instagram: '',
  whatsapp: '',
  telefono: '+39 06 0000 0000',
  email: 'serena.fasulo@example.com'
};

const nav = document.querySelector('#nav');
const menu = document.querySelector('.menu');
function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  nav.classList.toggle('open', open);
}
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', () => setMenu(false));
function closeMenuOutside(event) {
  if (nav.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) {
    setMenu(false);
  }
}
document.addEventListener('pointerdown', closeMenuOutside);
document.addEventListener('focusin', closeMenuOutside);
window.matchMedia('(max-width: 720px)').addEventListener('change', () => setMenu(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    setMenu(false);
    menu.focus();
  }
});

const sections = Array.from(document.querySelectorAll('main section[id]'));
if (sections.length) {
  const navLinks = Array.from(nav.querySelectorAll('[data-section]'));
  let scheduled = false;
  function updateLocation() {
    const marker = window.innerHeight * 0.32;
    const active = sections.filter(section => section.getBoundingClientRect().top <= marker).pop() || sections[0];
    navLinks.forEach(link => {
      if (link.dataset.section === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  function scheduleLocation() {
    if (!scheduled) requestAnimationFrame(updateLocation);
    scheduled = true;
  }
  window.addEventListener('scroll', scheduleLocation, { passive: true });
  window.addEventListener('resize', scheduleLocation);
  updateLocation();
}

const form = document.querySelector('#contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  function preview() {
    if (form.reportValidity()) status.textContent = 'La prova del modulo è completa. Nessun messaggio è stato inviato.';
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    preview();
  });
  form.querySelector('#preview').addEventListener('click', preview);
  form.addEventListener('input', () => { status.textContent = ''; });
}

const pathDialog = document.querySelector('#path-dialog');
let selectedPathCard;
if (pathDialog) {
  const title = pathDialog.querySelector('#path-title');
  const symbol = pathDialog.querySelector('.path-symbol');
  const copy = pathDialog.querySelector('.path-copy');
  for (const trigger of document.querySelectorAll('.area-trigger')) {
    trigger.addEventListener('click', () => {
      selectedPathCard = trigger;
      const card = trigger.closest('.area');
      title.textContent = trigger.textContent;
      symbol.src = card.querySelector('.area-mark').src;
      pathDialog.style.setProperty('--path-tint', getComputedStyle(card).getPropertyValue('--path-tint'));
      copy.replaceChildren(card.querySelector('template').content.cloneNode(true));
      pathDialog.showModal();
      pathDialog.scrollTop = 0;
      title.focus({ preventScroll: true });
    });
  }
  pathDialog.querySelector('.path-close').addEventListener('click', () => pathDialog.close());
  pathDialog.addEventListener('click', event => {
    if (event.target !== pathDialog) return;
    const bounds = pathDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) pathDialog.close();
  });
}

const appointment = document.querySelector('#appointment-dialog');
if (appointment) {
  const trigger = document.querySelector('#request-appointment');
  const request = appointment.querySelector('form');
  const review = appointment.querySelector('.appointment-review');
  const heading = appointment.querySelector('#appointment-title');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let entrance;
  let returnFocus;

  function openAppointment(opener, topic) {
    returnFocus = opener;
    request.elements.percorso.value = topic || 'Primo colloquio';
    request.hidden = false;
    review.hidden = true;
    appointment.showModal();
    appointment.scrollTop = 0;
    heading.focus({ preventScroll: true });
    if (window.gsap && !reduceMotion.matches) {
      entrance = gsap.timeline()
        .fromTo(appointment, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out', clearProps: 'transform,opacity' })
        .fromTo(request, { y: 7 }, { y: 0, duration: 0.24, clearProps: 'transform' }, 0.08);
    }
  }
  trigger.addEventListener('click', () => openAppointment(trigger));
  document.querySelector('#path-contact').addEventListener('click', () => {
    pathDialog.close();
    openAppointment(selectedPathCard, selectedPathCard.textContent.trim());
  });

  request.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(request);
    review.querySelectorAll('[data-value]').forEach(field => {
      field.textContent = values.get(field.dataset.value).trim() || 'Non indicato';
    });
    request.hidden = true;
    review.hidden = false;
    review.querySelector('h3').focus();
  });

  review.querySelector('[data-edit]').addEventListener('click', () => {
    review.hidden = true;
    request.hidden = false;
    request.elements.nome.focus();
  });
  review.querySelector('[data-done]').addEventListener('click', () => {
    request.reset();
    review.querySelectorAll('[data-value]').forEach(field => { field.textContent = ''; });
    appointment.close();
  });
  appointment.querySelector('.appointment-close').addEventListener('click', () => appointment.close());
  appointment.addEventListener('click', event => {
    if (event.target !== appointment) return;
    const rect = appointment.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) appointment.close();
  });
  appointment.addEventListener('close', () => {
    entrance?.progress(1).kill();
    returnFocus?.focus({ preventScroll: true });
  });
}

const filters = document.querySelectorAll('[data-filter]');
const posts = document.querySelectorAll('[data-category]');
filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let count = 0;
    posts.forEach(post => {
      post.hidden = button.dataset.filter !== 'all' && post.dataset.category !== button.dataset.filter;
      if (!post.hidden) count++;
    });
    document.querySelector('#results').textContent = count === 1 ? '1 articolo visibile' : count + ' articoli visibili';
  });
});

const dialog = document.querySelector('#channel-dialog');
const labels = { facebook: 'Facebook', instagram: 'Instagram', whatsapp: 'WhatsApp', telefono: 'Telefono', email: 'Email' };
const noteCanali = {
  telefono: 'Il numero dello studio sarà disponibile nella versione definitiva.',
  whatsapp: 'Il numero WhatsApp sarà disponibile nella versione definitiva.',
  email: 'L’indirizzo email dello studio sarà disponibile nella versione definitiva.'
};
document.querySelectorAll('[data-channel]').forEach(link => {
  const key = link.dataset.channel;
  const value = canali[key].trim();
  const phone = value.replace(/[\s()-]/g, '');
  let url = '';
  if (key === 'telefono' && /^\+?\d{7,15}$/.test(phone)) url = 'tel:' + phone;
  if (key === 'whatsapp' && /^\+?\d{7,15}$/.test(phone)) url = 'https://wa.me/' + phone.replace(/^\+/, '');
  if (key === 'email' && /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)) url = 'mailto:' + value;
  if ((key === 'facebook' || key === 'instagram') && /^https:\/\//.test(value)) url = value;
  if (url) {
    link.href = url;
    if (url.startsWith('https://')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  } else {
    link.addEventListener('click', event => {
      event.preventDefault();
      document.querySelector('#channel-title').textContent = labels[key];
      const note = noteCanali[key] || 'Il profilo professionale sarà collegato nella versione definitiva.';
      document.querySelector('#channel-note').textContent = note + ' Intanto puoi esplorare il modulo di contatto.';
      dialog.showModal();
    });
  }
});
dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.querySelector('a').addEventListener('click', () => dialog.close());

// Le etichette si muovono dentro il pulsante, così il bersaglio del clic resta fermo.
if (window.gsap) {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    const releaseHandlers = [];
    const controls = document.querySelectorAll('.button, .filters button, .intro-skip');
    controls.forEach(control => {
      const label = document.createElement('span');
      label.className = 'press-label';
      label.append(...control.childNodes);
      control.append(label);
      function press() {
        gsap.to(label, { y: 1.6, scale: 0.975, duration: 0.09, overwrite: true });
      }
      function release() {
        gsap.to(label, { y: 0, scale: 1, duration: 0.25, ease: 'power2.out', overwrite: true });
      }
      control.addEventListener('pointerdown', press);
      control.addEventListener('keydown', keyPress);
      function keyPress(event) {
        if (event.key === ' ' || event.key === 'Enter') press();
      }
      const events = ['pointerup', 'pointerleave', 'pointercancel', 'keyup', 'blur'];
      events.forEach(event => control.addEventListener(event, release));
      releaseHandlers.push(() => {
        control.removeEventListener('pointerdown', press);
        control.removeEventListener('keydown', keyPress);
        events.forEach(event => control.removeEventListener(event, release));
        gsap.killTweensOf(label);
        label.replaceWith(...label.childNodes);
      });
    });

    const book = document.querySelector('.notebook');
    let timeline;
    function openBook() {
      if (!book) return;
      timeline = gsap.timeline();
      timeline.fromTo(book, { rotation: -5, y: 22, rotationY: -18 }, {
        rotation: 7, y: 0, rotationY: 0, duration: 0.95, ease: 'power3.out', clearProps: 'transform'
      });
    }
    const curtain = document.querySelector('#paper-intro');
    if (curtain?.open) curtain.addEventListener('close', openBook, { once: true });
    else if (!location.hash || location.hash === '#home') openBook();
    return () => {
      curtain?.removeEventListener('close', openBook);
      timeline?.progress(1).kill();
      releaseHandlers.forEach(remove => remove());
    };
  });
}
