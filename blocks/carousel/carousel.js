function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  block.querySelectorAll('.carousel-slide').forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  block.querySelectorAll('.carousel-slide-indicator').forEach((indicator, idx) => {
    const button = indicator.querySelector('button');
    if (idx !== slideIndex) {
      button.removeAttribute('disabled');
      button.removeAttribute('aria-current');
    } else {
      button.setAttribute('disabled', true);
      button.setAttribute('aria-current', true);
    }
  });
}

function showSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-slide');
  const activeSlide = slides[Math.max(0, Math.min(slideIndex, slides.length - 1))];
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

const CELL_CLASSES = ['carousel-slide-image', 'carousel-slide-title', 'carousel-slide-description', 'carousel-slide-link'];

function createSlide(row, slideIndex) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.className = 'carousel-slide';
  [...row.children].forEach((cell, i) => {
    if (CELL_CLASSES[i]) cell.classList.add(CELL_CLASSES[i]);
    slide.append(cell);
  });
  return slide;
}

let carouselId = 0;
export default function decorate(block) {
  carouselId += 1;
  block.id = `carousel-${carouselId}`;
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.children];

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.className = 'carousel-slides';

  const indicatorsNav = document.createElement('nav');
  indicatorsNav.setAttribute('aria-label', 'Carousel Slide Controls');
  const indicators = document.createElement('ol');
  indicators.className = 'carousel-slide-indicators';
  indicatorsNav.append(indicators);

  rows.forEach((row, idx) => {
    slidesWrapper.append(createSlide(row, idx));
    row.remove();

    const indicator = document.createElement('li');
    indicator.className = 'carousel-slide-indicator';
    indicator.dataset.targetSlide = idx;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Show slide ${idx + 1} of ${rows.length}`);
    indicator.append(button);
    indicators.append(indicator);
  });

  block.append(slidesWrapper, indicatorsNav);

  indicators.addEventListener('click', (e) => {
    const indicator = e.target.closest('.carousel-slide-indicator');
    if (indicator) showSlide(block, parseInt(indicator.dataset.targetSlide, 10));
  });

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) updateActiveSlide(entry.target);
    });
  }, { root: slidesWrapper, threshold: 0.6 });
  block.querySelectorAll('.carousel-slide').forEach((slide) => slideObserver.observe(slide));
}
