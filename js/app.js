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

    // 6. Product Modal Logic
    const modal = document.getElementById('product-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalImgContainer = document.getElementById('modal-image-container');

    document.querySelectorAll('.gsap-product').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            const img = card.querySelector('.img-wrapper img').src;
            const title = card.querySelector('h4').innerText;
            const price = card.querySelector('span').innerText;

            modalImg.src = img;
            modalTitle.innerText = title;
            modalPrice.innerText = price;

            // Remove previous extra images
            const extraImgs = modalImgContainer.querySelectorAll('.extra-img');
            extraImgs.forEach(el => el.remove());

            // A3 Box Matte Frame special image logic
            if (title === "A3 Box Matte Frame") {
                const secondWrapper = document.createElement('div');
                secondWrapper.className = "aspect-[4/5] w-full bg-[#FAFAFA] relative rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-border-subtle overflow-hidden extra-img";
                
                const secondImg = document.createElement('img');
                secondImg.src = "assets/PRODUCTS/20260618_144006.jpg";
                secondImg.className = "w-full h-full object-cover";
                
                secondWrapper.appendChild(secondImg);
                modalImgContainer.appendChild(secondWrapper);
            }

            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0', 'pointer-events-none');
                document.body.style.overflow = 'hidden';
            }, 10);
        });
    });

    if(modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = '';
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 500);
        });
    }
});
