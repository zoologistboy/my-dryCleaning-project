// utils/triggerConfetti.js
import confetti from 'canvas-confetti';

export default function triggerConfetti(type = 'default') {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;

  const baseOptions = {
    origin: { y: 0.7 },
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffcc00', '#ff00ff'],
    shapes: ['circle', 'square'],
    scalar: 1.1,
    gravity: 0.9,
    ticks: 200,
  };

  // Standard burst from both sides
  const defaultConfetti = () => {
    const interval = setInterval(() => {
      if (Date.now() > animationEnd) return clearInterval(interval);

      confetti({ ...baseOptions, particleCount: 40, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ ...baseOptions, particleCount: 40, angle: 120, spread: 55, origin: { x: 1 } });
    }, 250);
  };

  // Emoji-based particles
  const emojiConfetti = () => {
    const interval = setInterval(() => {
      if (Date.now() > animationEnd) return clearInterval(interval);

      confetti({
        ...baseOptions,
        particleCount: 25,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        emojis: ['🎉', '🎈', '✨', '🥳'],
      });
    }, 400);
  };

  // Firework-like effect
  const fireworkConfetti = () => {
    const interval = setInterval(() => {
      if (Date.now() > animationEnd) return clearInterval(interval);

      confetti({
        ...baseOptions,
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.4,
        },
      });
    }, 300);
  };

  // Trigger the selected type
  switch (type) {
    case 'emoji':
      emojiConfetti();
      break;
    case 'firework':
      fireworkConfetti();
      break;
    case 'default':
    default:
      defaultConfetti();
      break;
  }
}
