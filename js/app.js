// Wait for DOM to load
document.addEventListener("DOMContentLoaded", (event) => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // 1. Navbar Glassmorphism on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-sm');
        } else {
            navbar.classList.remove('shadow-sm');
        }
    });

    // Mobile Menu Toggle (Basic implementation)
    const mobileBtn = document.getElementById('mobile-menu-btn');
    mobileBtn.addEventListener('click', () => {
        // Expand mobile menu logic here (keeping it simple for now)
        alert('Mobile menu toggle');
    });

    // 2. Global Fade Up Animation for Elements
    const fadeUpElements = document.querySelectorAll('.gsap-fade-up');
    fadeUpElements.forEach((el) => {
        gsap.fromTo(el, 
            { 
                y: 30, 
                opacity: 0 
            },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 3. Staggered Service Cards
    const serviceCards = document.querySelectorAll('.gsap-stagger-card');
    if (serviceCards.length > 0) {
        gsap.fromTo(serviceCards,
            {
                y: 40,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#services",
                    start: "top 70%",
                }
            }
        );
    }

    // 4. Staggered Product Cards
    const productCards = document.querySelectorAll('.gsap-product');
    if (productCards.length > 0) {
        gsap.fromTo(productCards,
            {
                y: 40,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: "#products",
                    start: "top 70%",
                }
            }
        );
    }
    
    // 5. Auto-resize Textarea
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});
