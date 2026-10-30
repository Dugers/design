// Keep the candle and its visitors asleep when the illustration is off screen.
const artwork = document.querySelector('.intro-art');

if (artwork) {
  const syncVisibility = () => {
    document.body.classList.toggle('night-paused', document.hidden);
  };
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      artwork.classList.toggle('art-paused', !entry.isIntersecting);
    }, { rootMargin: '80px' });
    observer.observe(artwork);
  }
}
