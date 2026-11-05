(() => {
  const WA = '5492964541181'; // +54 2964 541181: prefijo 9 para WhatsApp móvil argentino
  const encode = (text) => encodeURIComponent(text);
  window.cowboyWhatsApp = (message) => `https://wa.me/${WA}?text=${encode(message)}`;

  // Botones de consulta por ficha: el nombre y código van en el mensaje.
  document.querySelectorAll('[data-wa-horse]').forEach(link => {
    const name = link.getAttribute('data-wa-horse');
    const code = link.getAttribute('data-wa-code') || '';
    const message = `¡Hola! Vi a ${name} (${code}) en el catálogo de COWBOY Polo Horses y quisiera recibir más información, disponibilidad y condiciones. Gracias.`;
    link.href = window.cowboyWhatsApp(message);
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  });
  document.querySelectorAll('[data-wa-general]').forEach(link => {
    link.href = window.cowboyWhatsApp('¡Hola! Vi el catálogo de COWBOY Polo Horses y quisiera consultar por los caballos disponibles.');
    link.target = '_blank'; link.rel = 'noopener noreferrer';
  });

  const nav = document.querySelector('.site-nav');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  menuToggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('nav-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {nav?.classList.remove('nav-open'); menuToggle?.setAttribute('aria-expanded', 'false');}));

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible'); obs.unobserve(entry.target);}});}, {threshold:.08, rootMargin:'0px 0px 45px 0px'});
    revealEls.forEach(el=>obs.observe(el));
  } else revealEls.forEach(el => el.classList.add('visible'));

  // Galería modal accesible.
  const modal = document.querySelector('#image-modal');
  const modalImage = document.querySelector('#modal-image');
  const modalCaption = document.querySelector('#modal-caption');
  let focusedBeforeModal;
  document.querySelectorAll('[data-lightbox]').forEach(btn => btn.addEventListener('click', () => {
    if (!modal) return;
    const img = btn.querySelector('img'); if (!img) return;
    focusedBeforeModal = document.activeElement;
    modalImage.src = img.src; modalImage.alt = img.alt;
    modalCaption.textContent = img.alt;
    modal.hidden = false; document.body.classList.add('modal-open');
    modal.querySelector('[data-close-modal]')?.focus();
  }));
  function closeModal(){if (!modal) return; modal.hidden=true;document.body.classList.remove('modal-open'); focusedBeforeModal?.focus();}
  modal?.querySelector('[data-close-modal]')?.addEventListener('click',closeModal);
  modal?.addEventListener('click', e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal?.hidden)closeModal();});

  // Si la imagen remota falla, mostrar una portada SVG local (web usable sin fotos).
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    img.addEventListener('error', () => {
      if (!img.dataset.fallbackUsed){img.dataset.fallbackUsed='1';img.src=img.dataset.fallback;}
    });
  });

  const inquiry = document.querySelector('#inquiry-form');
  inquiry?.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(inquiry);
    const horse = String(data.get('horse')||'Sin preferencia');
    const level = String(data.get('level')||'A conversar');
    const note = String(data.get('message')||'').trim();
    const message = `¡Hola! Quisiera asesoramiento para encontrar un caballo de polo.\n\nCaballo de interés: ${horse}\nNivel buscado: ${level}${note ? `\nMi consulta: ${note}` : ''}\n\nVi el catálogo de COWBOY Polo Horses.`;
    window.open(window.cowboyWhatsApp(message),'_blank','noopener,noreferrer');
  });
})();
