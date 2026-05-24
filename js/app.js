/* ==========================================================================
   FRAMEX - E-commerce State & Interaction Engine
   ========================================================================== */

// E-commerce Cart State
let cart = [];

// DOMContentLoaded Entry Point
document.addEventListener('DOMContentLoaded', () => {
  initCartEngine();
  initSearchModal();
  initCustomizerModal();
  initAIChatbot();
});



/**
 * 2. E-commerce Cart Drawer Controller
 */
function initCartEngine() {
  const cartToggle = document.getElementById('cart-toggle-btn');
  const closeCart = document.getElementById('close-cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  
  if (!cartToggle || !cartDrawer) return;

  // Toggle Cart functions
  const openDrawer = () => {
    cartDrawer.classList.remove('translate-x-full');
    cartOverlay.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  };

  const closeDrawer = () => {
    cartDrawer.classList.add('translate-x-full');
    cartOverlay.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  };

  cartToggle.addEventListener('click', openDrawer);
  if (closeCart) closeCart.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);

  // Bind all standard product "Add to Cart" triggers
  const addButtons = document.querySelectorAll('.add-to-cart-trigger');
  addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.productId;
      const name = btn.dataset.productName;
      const price = parseFloat(btn.dataset.productPrice);
      const img = btn.dataset.productImage;

      addToCart({ id, name, price, img });
      openDrawer();
    });
  });
}

function addToCart(item) {
  // Check if item already exists
  const existing = cart.find(i => i.id === item.id && i.size === item.size && i.material === item.material);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: item.id || 'custom-' + Date.now(),
      name: item.name,
      price: item.price,
      img: item.img || 'assets/collection_wedding.png',
      size: item.size || '16" x 24"',
      material: item.material || 'Bespoke Gold',
      quantity: 1
    });
  }

  updateCartUI();
  animateCartBadge();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cart-items-list');
  const cartCountBadges = document.querySelectorAll('.cart-count-badge');
  const cartSubtotalEl = document.getElementById('cart-subtotal-amount');
  const emptyCartState = document.getElementById('empty-cart-state');
  const cartContentArea = document.getElementById('cart-content-area');

  if (!cartItemsContainer) return;

  // Clear container
  cartItemsContainer.innerHTML = '';

  const totalItems = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  // Update counts
  cartCountBadges.forEach(badge => {
    badge.textContent = totalItems;
    if (totalItems > 0) {
      badge.classList.remove('opacity-0');
    } else {
      badge.classList.add('opacity-0');
    }
  });

  if (totalItems === 0) {
    emptyCartState.classList.remove('hidden');
    cartContentArea.classList.add('hidden');
  } else {
    emptyCartState.classList.add('hidden');
    cartContentArea.classList.remove('hidden');

    // Populate items
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'flex items-center gap-4 py-4 border-b border-neutral-800/60 dark:border-neutral-800/60 border-neutral-200/80';
      itemEl.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="w-16 h-20 object-cover border border-neutral-800/30 rounded">
        <div class="flex-1">
          <h4 class="font-serif-luxury text-base text-neutral-100 dark:text-neutral-100 text-neutral-900 font-medium">${item.name}</h4>
          <p class="text-xs text-neutral-400 mt-0.5">${item.size} • ${item.material}</p>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-neutral-400">Qty: ${item.quantity}</span>
            <span class="text-sm font-semibold text-neutral-900">INR ${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button onclick="removeFromCart(${index})" class="text-neutral-500 hover:text-red-500 transition-colors p-1" title="Remove">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartSubtotalEl.textContent = `INR ${subtotal.toFixed(2)}`;
  }
}

function animateCartBadge() {
  const cartToggle = document.getElementById('cart-toggle-btn');
  if (!cartToggle) return;

  // Visual pop feedback on addition
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(cartToggle, 
      { scale: 1 }, 
      { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' }
    );
  }
}

// Global hook for removal button
window.removeFromCart = (index) => {
  removeFromCart(index);
};

/**
 * 3. Editorial Search Overlay System
 */
function initSearchModal() {
  const searchToggle = document.getElementById('search-toggle-btn');
  const closeSearch = document.getElementById('close-search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  
  if (!searchToggle || !searchOverlay) return;

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.remove('hidden');
    searchOverlay.classList.add('flex');
    const input = searchOverlay.querySelector('input');
    if (input) setTimeout(() => input.focus(), 100);
    document.body.classList.add('overflow-hidden');
  });

  const hideSearch = () => {
    searchOverlay.classList.add('hidden');
    searchOverlay.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  };

  if (closeSearch) closeSearch.addEventListener('click', hideSearch);
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) hideSearch();
  });
}

/**
 * 4. Interactive "Design Your Memory" Customizer Modal
 */
function initCustomizerModal() {
  const openCustomizers = document.querySelectorAll('.open-customizer-trigger');
  const closeCustomizer = document.getElementById('close-customizer-btn');
  const customizerModal = document.getElementById('customizer-modal');
  const uploadInput = document.getElementById('cust-upload');
  const uploadPreview = document.getElementById('customizer-image-preview');
  const sizeSelects = document.querySelectorAll('.size-option');
  const materialSelects = document.querySelectorAll('.material-option');
  const priceDisplay = document.getElementById('customizer-total-price');
  const addCustomToCartBtn = document.getElementById('add-custom-to-cart-btn');

  if (!customizerModal) return;

  // Customizer active parameters
  let activeSize = '16" x 24"';
  let activeMaterial = 'Bespoke Gold';
  let basePrice = 24000;
  let materialSurcharge = 0;
  let uploadedImgUrl = null;

  // Open / Close functions
  openCustomizers.forEach(btn => {
    btn.addEventListener('click', () => {
      customizerModal.classList.remove('hidden');
      customizerModal.classList.add('flex');
      document.body.classList.add('overflow-hidden');
    });
  });

  const hideCustomizer = () => {
    customizerModal.classList.add('hidden');
    customizerModal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  };

  if (closeCustomizer) closeCustomizer.addEventListener('click', hideCustomizer);

  // File Upload Preview
  if (uploadInput && uploadPreview) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          uploadedImgUrl = event.target.result;
          uploadPreview.style.backgroundImage = `url('${uploadedImgUrl}')`;
          uploadPreview.style.backgroundSize = 'cover';
          uploadPreview.style.backgroundPosition = 'center';
          uploadPreview.innerHTML = ''; // Clear help texts
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Size selections
  sizeSelects.forEach(opt => {
    opt.addEventListener('click', () => {
      sizeSelects.forEach(s => s.classList.remove('border-neutral-950', 'text-neutral-950'));
      opt.classList.add('border-neutral-950', 'text-neutral-950');
      
      activeSize = opt.dataset.size;
      basePrice = parseFloat(opt.dataset.price);
      recalculateCustomPrice();
    });
  });

  // Material selections
  materialSelects.forEach(opt => {
    opt.addEventListener('click', () => {
      materialSelects.forEach(m => m.classList.remove('border-neutral-950', 'text-neutral-950'));
      opt.classList.add('border-neutral-950', 'text-neutral-950');

      activeMaterial = opt.dataset.material;
      materialSurcharge = parseFloat(opt.dataset.surcharge);
      recalculateCustomPrice();
    });
  });

  function recalculateCustomPrice() {
    const total = basePrice + materialSurcharge;
    priceDisplay.textContent = `INR ${total.toFixed(2)}`;
  }

  // Add custom framed memory to cart
  if (addCustomToCartBtn) {
    addCustomToCartBtn.addEventListener('click', () => {
      // Add custom frame to cart
      const finalPrice = basePrice + materialSurcharge;
      
      addToCart({
        id: 'bespoke-' + Date.now(),
        name: 'Bespoke Digital Memory',
        price: finalPrice,
        img: uploadedImgUrl || 'assets/hero_portrait.png',
        size: activeSize,
        material: activeMaterial
      });

      // Close and open cart drawer
      hideCustomizer();
      setTimeout(() => {
        const cartDrawer = document.getElementById('cart-drawer');
        const cartOverlay = document.getElementById('cart-overlay');
        cartDrawer.classList.remove('translate-x-full');
        cartOverlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
      }, 300);
    });
  }
}

/**
 * 5. Glassmorphic AI Chatbot Concierge
 */
function initAIChatbot() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotContainer = document.getElementById('chatbot-container');
  const closeChatbot = document.getElementById('close-chatbot-btn');
  const chatMessagesList = document.getElementById('chat-messages-list');
  const chatSuggestedQuestions = document.querySelectorAll('.chat-suggested-q');

  if (!chatbotToggle || !chatbotContainer) return;

  chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.toggle('hidden');
    chatbotContainer.classList.toggle('flex');
    
    // Bounce chat icon
    if (typeof gsap !== 'undefined') {
      gsap.from(chatbotContainer, { opacity: 0, y: 30, duration: 0.4, ease: 'back.out(1.7)' });
    }
  });

  if (closeChatbot) {
    closeChatbot.addEventListener('click', () => {
      chatbotContainer.classList.add('hidden');
      chatbotContainer.classList.remove('flex');
    });
  }

  // Handle Suggested questions
  chatSuggestedQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const questionText = btn.textContent.trim();
      addUserMessage(questionText);
      
      // Clear suggested
      btn.parentElement.classList.add('opacity-40', 'pointer-events-none');

      // AI Response with typing effect
      showTypingIndicator();
      setTimeout(() => {
        const answer = getAIResponse(questionText);
        removeTypingIndicator();
        addAIMessage(answer);
      }, 1500);
    });
  });

  function addUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'self-end bg-neutral-800 border border-neutral-700/50 rounded-xl px-4 py-2.5 max-w-[85%] text-xs font-light text-neutral-100';
    msg.textContent = text;
    chatMessagesList.appendChild(msg);
    scrollChatToBottom();
  }

  function addAIMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'self-start bg-neutral-50/90 border border-neutral-200 rounded-xl px-4 py-2.5 max-w-[85%] text-xs font-light text-neutral-800 relative';
    
    msg.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.02)';
    
    msg.innerHTML = `
      <div class="flex items-center gap-1.5 mb-1 text-[10px] text-neutral-900 font-sans-luxury tracking-wider font-semibold uppercase">
        <span class="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-pulse"></span>
        FRAMEX Concierge
      </div>
      <p class="leading-relaxed leading-5">${text}</p>
    `;
    chatMessagesList.appendChild(msg);
    scrollChatToBottom();
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'chat-typing-indicator';
    indicator.className = 'self-start bg-neutral-900/60 border border-neutral-800/40 rounded-xl px-4 py-3 text-xs text-neutral-400 flex items-center gap-1';
    indicator.innerHTML = `
      <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style="animation-delay: 0s"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style="animation-delay: 0.15s"></span>
      <span class="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style="animation-delay: 0.3s"></span>
    `;
    chatMessagesList.appendChild(indicator);
    scrollChatToBottom();
  }

  function removeTypingIndicator() {
    const ind = document.getElementById('chat-typing-indicator');
    if (ind) ind.remove();
  }

  function scrollChatToBottom() {
    chatMessagesList.scrollTop = chatMessagesList.scrollHeight;
  }

  function getAIResponse(question) {
    const q = question.toLowerCase();
    
    if (q.includes('size') || q.includes('custom')) {
      return "Absolutely. At FRAMEX, we offer bespoke framing services tailored to your exact photographic dimensions. Our standards span 12x18\" to 24x36\", but our artisanal workshops craft frames up to 60x80\". Click 'Design Your Memory' above to begin configuring your bespoke custom size.";
    }
    
    if (q.includes('shipping') || q.includes('packaging') || q.includes('deliver')) {
      return "To safeguard your precious frames, every creation is cushioned inside an impact-resistant, matte-black gift box detailed with gold foil embossing. We ship internationally using fully insured premium couriers, guaranteeing safe door-to-door arrival.";
    }
    
    if (q.includes('print') || q.includes('paper') || q.includes('gicl')) {
      return "We execute museum-grade giclÃ©e prints utilizing pigment archival inks on premium heavy 310gsm cotton-rag fine art paper. This achieves rich depth, deep contrast shadows, and a lifetime color permanence exceeding 100 years.";
    }

    if (q.includes('craft') || q.includes('workshop') || q.includes('material')) {
      return "All our frames are crafted manually by our master framing artisans. We use sustainably harvested Italian solid walnut wood, double-bevel gold leaves, and ultra-clear anti-reflective acrylic glass to deliver a peerless gallery showcase.";
    }

    return "Thank you for reaching out to FRAMEX. Our digital concierge is delighted to assist. How may we elevate your family legacy today?";
  }
}

