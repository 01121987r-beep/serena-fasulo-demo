(() => {
  const title = document.querySelector('#story-title').textContent.trim();
  const article = new URL(window.location.href);
  article.hash = '';
  article.search = '';
  const isWebPage = ['http:', 'https:'].includes(article.protocol);
  const destinations = [
    ['Facebook', 'facebook', 'https://www.facebook.com/sharer/sharer.php', { u: article.href }],
    ['X', 'twitter-x', 'https://twitter.com/intent/tweet', { text: title, url: article.href }],
    ['WhatsApp', 'whatsapp', 'https://wa.me/', { text: title + '\n' + article.href }]
  ];

  function addControl(group, element, label, icon) {
    element.className = 'share-control';
    element.setAttribute('aria-label', label);
    element.title = label;
    const image = document.createElement('img');
    image.src = '../assets/' + icon + '.svg';
    image.alt = '';
    image.width = image.height = 19;
    element.append(image);
    group.append(element);
  }

  for (const group of document.querySelectorAll('.story-share')) {
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Condividi questo articolo');
    const feedback = document.createElement('span');
    feedback.className = 'share-feedback';
    feedback.setAttribute('role', 'status');

    for (const [name, icon, endpoint, params] of destinations) {
      const link = document.createElement(isWebPage ? 'a' : 'button');
      if (isWebPage) {
        const url = new URL(endpoint);
        url.search = new URLSearchParams(params).toString();
        link.href = url.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.type = 'button';
        link.addEventListener('click', () => {
          feedback.textContent = 'Per condividere sui social, apri la pagina dal sito web.';
        });
      }
      addControl(group, link, 'Condividi su ' + name, icon);
    }

    const copy = document.createElement('button');
    copy.type = 'button';
    addControl(group, copy, 'Copia link', 'link-45deg');
    group.append(feedback);
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(article.href);
        feedback.textContent = 'Link copiato';
      } catch {
        feedback.textContent = 'Seleziona e copia il link';
        const field = document.createElement('input');
        field.readOnly = true;
        field.value = article.href;
        field.setAttribute('aria-label', 'Link dell’articolo');
        feedback.append(field);
        field.focus();
        field.select();
      }
    });
    group.hidden = false;
  }
})();
