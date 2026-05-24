/* ==========================================================================
   FRAMEX - Cinematic GSAP Animation Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Register ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }


  initMagneticButtons();
  initEntranceAnimations();
  initFloatingElements();
});



/**
 * 2. Elegant Magnetic Button Physics
 */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-btn');

  magneticBtns.forEach(btn => {
    const text = btn.querySelector('.magnetic-text') || btn;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic physical "pull" of the button boundary
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Internal text pulls slightly less to create 3D visual depth
      if (text !== btn) {
        gsap.to(text, {
          x: x * 0.15,
          y: y * 0.15,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    btn.addEventListener('mouseleave', () => {
      // Spring bounce back to original position
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)'
      });

      if (text !== btn) {
        gsap.to(text, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    });
  });
}

/**
 * 3. Staggered Scroll-Triggered Entrance Reveals
 */
function initEntranceAnimations() {
  if (typeof gsap === 'undefined') return;

  // Stagger reveal hero headings
  gsap.from('.hero-reveal', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power4.out',
    delay: 0.2
  });

  // Hero Image scale up
  gsap.from('.hero-image-scale', {
    scale: 1.1,
    opacity: 0,
    duration: 1.6,
    ease: 'power3.out',
    delay: 0.4
  });

  // Stagger feature highlight bar
  gsap.from('.feature-bar-item', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#feature-bar',
      start: 'top 85%'
    }
  });

  // Stagger collection grid reveal
  gsap.from('.collection-card', {
    opacity: 0,
    y: 50,
    duration: 1.0,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#collections-grid',
      start: 'top 80%'
    }
  });

  // Parallax background items
  const parallaxItems = document.querySelectorAll('.parallax-img');
  parallaxItems.forEach(item => {
    gsap.fromTo(item, 
      { y: -30 },
      {
        y: 30,
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });

  // Stagger services cards reveal
  gsap.from('.service-card', {
    opacity: 0,
    y: 40,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#services-grid',
      start: 'top 80%'
    }
  });

  // Stagger ecommerce product cards reveal
  gsap.from('.product-card', {
    opacity: 0,
    y: 45,
    duration: 1.0,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#products-showcase',
      start: 'top 80%'
    }
  });

  // Cinematic Spotlights Tracking Cursor inside Showcase
  const showcaseContainer = document.getElementById('three-showcase-section');
  if (showcaseContainer) {
    const spotlight = showcaseContainer.querySelector('.gold-spotlight');
    showcaseContainer.addEventListener('mousemove', (e) => {
      const rect = showcaseContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(spotlight, {
        background: `radial-gradient(circle 500px at ${x}px ${y}px, rgba(255, 255, 255, 0.5) 0%, rgba(248, 245, 239, 0) 80%)`,
        duration: 0.3
      });
    });
  }
}

/**
 * 4. Infinite Floating Physics (Antigravity Floating Effect)
 */
function initFloatingElements() {
  if (typeof gsap === 'undefined') return;

  // Slowly float the Hero 3D Frame mockup container
  gsap.to('.float-element-hero', {
    y: -15,
    rotation: 1.5,
    duration: 4.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  // Floating decorative gold accent lights in hero background
  gsap.to('.float-light-1', {
    x: 20,
    y: -30,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  gsap.to('.float-light-2', {
    x: -30,
    y: 20,
    duration: 9,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
}
