const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function getElements() {
  return {
    dialog: document.querySelector('#site-modal'),
    title: document.querySelector('#modal-title'),
    body: document.querySelector('#modal-body'),
    close: document.querySelector('#modal-close')
  };
}

function animateFromSource(shell, sourceElement) {
  if (!sourceElement || prefersReducedMotion.matches || !shell.animate) return;

  const source = sourceElement.getBoundingClientRect();
  const target = shell.getBoundingClientRect();

  const sourceCenterX = source.left + source.width / 2;
  const sourceCenterY = source.top + source.height / 2;
  const targetCenterX = target.left + target.width / 2;
  const targetCenterY = target.top + target.height / 2;

  const scaleX = Math.max(0.2, source.width / Math.max(target.width, 1));
  const scaleY = Math.max(0.2, source.height / Math.max(target.height, 1));

  shell.animate(
    [
      {
        opacity: 0.2,
        transform: `translate(${sourceCenterX - targetCenterX}px, ${sourceCenterY - targetCenterY}px) scale(${scaleX}, ${scaleY})`,
        clipPath: 'inset(18% 16% round 24px)'
      },
      {
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
        clipPath: 'inset(0 0 round 20px)'
      }
    ],
    {
      duration: 560,
      easing: 'cubic-bezier(.2,.85,.24,1)'
    }
  );
}

export function openModal({ title, content, sourceElement = null }) {
  const { dialog, title: titleNode, body } = getElements();
  if (!dialog || !titleNode || !body) return;

  titleNode.textContent = title;
  body.replaceChildren(content);
  document.body.classList.add('modal-open');

  if (!dialog.open) {
    dialog.showModal();
  }

  const shell = dialog.querySelector('.modal-shell');
  requestAnimationFrame(() => animateFromSource(shell, sourceElement));
}

export function closeModal() {
  const { dialog, body } = getElements();
  if (!dialog?.open) return;

  const video = body?.querySelector('video');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }

  dialog.close();
  document.body.classList.remove('modal-open');
}

export function detectVideoOrientation(video) {
  const setOrientation = () => {
    if (!video.videoWidth || !video.videoHeight) return;
    video.dataset.orientation = video.videoWidth >= video.videoHeight ? 'landscape' : 'portrait';
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    setOrientation();
  } else {
    video.addEventListener('loadedmetadata', setOrientation, { once: true });
  }
}

export function openVideoModal({ title, src, sourceElement, initialTime = 0 }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'video-modal-content';

  const video = document.createElement('video');
  video.controls = true;
  video.playsInline = true;
  video.preload = 'metadata';
  detectVideoOrientation(video);

  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';

  video.append(source);
  wrapper.append(video);

  openModal({ title, content: wrapper, sourceElement });
  if (initialTime > 0) {
    const restorePlaybackPosition = () => {
      video.currentTime = Math.min(initialTime, video.duration || initialTime);
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      restorePlaybackPosition();
    } else {
      video.addEventListener('loadedmetadata', restorePlaybackPosition, { once: true });
    }
  }
  video.focus();
}

export function openImageModal({ title, src, alt, description, photographer, location, sourceElement }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'photo-modal-content';

  const image = document.createElement('img');
  image.src = src;
  image.alt = alt;
  image.width = 720;
  image.height = 1280;

  const meta = document.createElement('div');
  meta.className = 'photo-modal-meta';

  const descriptionNode = document.createElement('p');
  descriptionNode.textContent = description;

  const photographerNode = document.createElement('p');
  photographerNode.innerHTML = '<strong>Fotógrafo:</strong> ';
  photographerNode.append(document.createTextNode(photographer));

  const locationNode = document.createElement('p');
  locationNode.innerHTML = '<strong>Lugar:</strong> ';
  locationNode.append(document.createTextNode(location));

  meta.append(descriptionNode, photographerNode, locationNode);
  wrapper.append(image, meta);

  openModal({ title, content: wrapper, sourceElement });
}

export function initModal() {
  const { dialog, close } = getElements();
  if (!dialog || !close) return;

  close.addEventListener('click', closeModal);

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeModal();
  });

  document.querySelectorAll('[data-legal]').forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.legal;
      const wrapper = document.createElement('div');
      wrapper.className = 'legal-placeholder';

      const p = document.createElement('p');
      p.textContent = type === 'policies'
        ? '[AGREGAR AQUÍ LAS POLÍTICAS DE USO DEFINITIVAS ANTES DE PRODUCCIÓN.]'
        : '[AGREGAR AQUÍ LOS TÉRMINOS Y CONDICIONES DEFINITIVOS ANTES DE PRODUCCIÓN.]';

      const note = document.createElement('p');
      note.className = 'muted';
      note.textContent = 'Este contenido es un placeholder y no constituye asesoría legal.';

      wrapper.append(p, note);

      openModal({
        title: type === 'policies' ? 'Políticas de uso' : 'Términos y condiciones',
        content: wrapper,
        sourceElement: button
      });
    });
  });
}
