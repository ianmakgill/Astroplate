export function initFeatureScrollAnimations() {
  const featureSections = document.querySelectorAll('.feature-scroll-section');

  if (featureSections.length === 0) {
    return;
  }

  featureSections.forEach((section) => {
    const image = section.querySelector('.feature-image') as HTMLElement;
    const textWrapper = section.querySelector('.feature-text-wrapper') as HTMLElement;

    if (!image || !textWrapper) {
      return;
    }

    // Set initial states
    image.style.opacity = '0';
    textWrapper.style.opacity = '0';
  });

  function updateAnimations() {
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    featureSections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      const sectionHeight = rect.height;
      const image = section.querySelector('.feature-image') as HTMLElement;
      const textWrapper = section.querySelector('.feature-text-wrapper') as HTMLElement;

      if (!image || !textWrapper) return;

      // Calculate scroll progress through the section
      // 0 = section bottom at bottom of viewport
      // 1 = section top at top of viewport
      const scrollProgress = (scrollY + windowHeight - sectionTop) / (sectionHeight + windowHeight);

      // Clamp between 0 and 1
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));

      // Phase 1: Image fades in (0 to 0.3 of scroll progress)
      let imageOpacity = 0;
      if (clampedProgress < 0.3) {
        imageOpacity = clampedProgress / 0.3;
      } else if (clampedProgress >= 0.3 && clampedProgress < 0.8) {
        // Phase 2: Image fully visible (0.3 to 0.8)
        imageOpacity = 1;
      } else {
        // Phase 3: Image fades out (0.8 to 1.0)
        imageOpacity = 1 - ((clampedProgress - 0.8) / 0.2);
      }

      // Text fades in (0.35 to 0.42)
      // Text stays visible (0.42 to 0.48)
      // Text fades out (0.48 to 0.55) - must be invisible before sticky runs out of space
      let textOpacity = 0;
      if (clampedProgress < 0.35) {
        textOpacity = 0;
      } else if (clampedProgress >= 0.35 && clampedProgress < 0.42) {
        // Fade in - starts later to avoid overlap with previous section
        textOpacity = (clampedProgress - 0.35) / 0.07;
      } else if (clampedProgress >= 0.42 && clampedProgress < 0.48) {
        // Fully visible
        textOpacity = 1;
      } else if (clampedProgress >= 0.48 && clampedProgress < 0.55) {
        // Fade out - invisible before container forces upward movement
        textOpacity = 1 - ((clampedProgress - 0.48) / 0.07);
      } else {
        textOpacity = 0;
      }

      image.style.opacity = imageOpacity.toString();
      textWrapper.style.opacity = textOpacity.toString();
    });
  }

  // Use scroll event for smooth updates
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateAnimations();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial update
  updateAnimations();
}
