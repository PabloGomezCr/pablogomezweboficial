import { detectVideoOrientation, openVideoModal } from './modal.js';

export function initCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  const cards = [...carousel.querySelectorAll('.live-card')];

  const getStep = () => {
    const first = cards[0];
    return first ? first.getBoundingClientRect().width + 24 : carousel.clientWidth * 0.8;
  };

  prev?.addEventListener('click', () => {
    carousel.scrollBy({ left: -getStep(), behavior: 'smooth' });
  });

  next?.addEventListener('click', () => {
    carousel.scrollBy({ left: getStep(), behavior: 'smooth' });
  });

  cards.forEach((card) => {
    const button = card.querySelector('.live-expand');
    const inlineVideo = card.querySelector('video');

    if (inlineVideo) detectVideoOrientation(inlineVideo);

    button?.addEventListener('click', () => {
      const currentTime = inlineVideo?.currentTime || 0;
      inlineVideo?.pause();

      openVideoModal({
        title: card.dataset.title || 'Live Performance',
        src: card.dataset.video,
        sourceElement: card,
        initialTime: currentTime
      });
    });

    inlineVideo?.addEventListener('play', () => {
      cards.forEach((otherCard) => {
        const otherVideo = otherCard.querySelector('video');
        if (otherVideo && otherVideo !== inlineVideo) otherVideo.pause();
      });
    });
  });
}
