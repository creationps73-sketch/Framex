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
            const priceEl = card.querySelector('span');
            const price = priceEl ? priceEl.innerText : '';
            const descEl = card.querySelector('p');
            const desc = descEl ? descEl.innerText : '';

            modalImg.src = img;
            modalTitle.innerText = title;
            modalPrice.innerText = price;
            
            // Hide price element in modal if there is no price
            if (!price) {
                modalPrice.style.display = 'none';
            } else {
                modalPrice.style.display = 'block';
            }

            const modalDesc = document.getElementById('modal-desc');
            if (modalDesc) {
                modalDesc.innerText = desc || 'Premium handcrafted frame featuring meticulous attention to detail and high-quality materials. Designed to elegantly showcase your most cherished memories.';
            }

            const waBtn = document.getElementById('modal-whatsapp-btn');
            if (waBtn) {
                const waNumbers = ['919037946820', '918921841432'];
                const randomWa = waNumbers[Math.floor(Math.random() * waNumbers.length)];
                const msg = encodeURIComponent(`Hi, I would like to get an enquiry about the ${title}.`);
                waBtn.href = `https://wa.me/${randomWa}?text=${msg}`;
            }

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

    // 7. Form Submission Logic
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;
    const submitLoader = document.getElementById('submit-loader');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // UI Loading state
            if(submitBtn) submitBtn.disabled = true;
            if(submitBtnText) submitBtnText.innerText = 'Sending...';
            if(submitLoader) submitLoader.classList.remove('hidden');

            const formData = new FormData(contactForm);

            fetch('https://formsubmit.co/ajax/creationps73@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Success
                contactForm.reset();
                showToast();
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Something went wrong. Please try again.");
            })
            .finally(() => {
                // Reset UI
                if(submitBtn) submitBtn.disabled = false;
                if(submitBtnText) submitBtnText.innerText = 'Submit';
                if(submitLoader) submitLoader.classList.add('hidden');
            });
        });
    }

    function showToast() {
        if (!toast) return;
        toast.classList.remove('translate-y-[150%]', 'opacity-0');
        // Need to recreate icons for dynamically shown element just in case
        setTimeout(() => {
            toast.classList.add('translate-y-[150%]', 'opacity-0');
        }, 4000);
    }
});
