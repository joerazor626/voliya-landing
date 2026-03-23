// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// ---- Interactive Phone ----
const dealData = {
  deal1: { discount: '20% OFF', title: '20% Off Fresh Produce', business: 'MH Supermarket — Suva', distance: '0.8 km away', time: '2d 14h' },
  deal2: { discount: 'BOGO', title: 'Buy 1 Get 1 Free', business: 'Island Wear — Nadi', distance: '3.2 km away', time: '5d' },
  deal3: { discount: 'FREE SHIP', title: 'Free Shipping Weekend', business: 'Fiji Electronics — Lautoka', distance: '12 km away', time: '1d 6h' },
  deal4: { discount: '30% OFF', title: '30% Off All Clothing', business: 'Courts — Suva', distance: '1.2 km away', time: '3d' },
  deal5: { discount: '$5 OFF', title: '$5 Off Orders Over $50', business: 'New World — Nausori', distance: '5.4 km away', time: '6d' },
};

// Phone page navigation
function showPhonePage(pageId) {
  document.querySelectorAll('.phone-page').forEach(p => {
    p.classList.remove('phone-page--active');
  });
  const page = document.getElementById(pageId);
  if (page) {
    page.classList.add('phone-page--active');
  }
  // Update nav active state
  document.querySelectorAll('.phone-nav__item').forEach(btn => {
    btn.classList.toggle('phone-nav__item--active', btn.dataset.page === pageId);
  });
}

// Bottom nav clicks
document.querySelectorAll('.phone-nav__item').forEach(btn => {
  btn.addEventListener('click', () => showPhonePage(btn.dataset.page));
});

// Tab clicks
document.querySelectorAll('.phone-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.phone-tab').forEach(t => t.classList.remove('phone-tab--active'));
    tab.classList.add('phone-tab--active');
  });
});

// Deal card click → detail page
document.querySelectorAll('.phone-card[data-deal]').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('phone-card__heart')) return;
    const deal = dealData[card.dataset.deal];
    if (!deal) return;
    document.getElementById('dealDiscount').textContent = deal.discount;
    document.getElementById('dealTitle').textContent = deal.title;
    document.getElementById('dealBusiness').textContent = deal.business;
    showPhonePage('pageDeal');
    // Hide bottom nav on detail
    document.querySelector('.phone-nav').style.display = 'none';
  });
});

// Back button from deal detail
document.getElementById('dealBack').addEventListener('click', () => {
  showPhonePage('pageHome');
  document.querySelector('.phone-nav').style.display = 'flex';
});

// Heart toggle (like/unlike)
document.querySelectorAll('.phone-card__heart').forEach(heart => {
  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    const liked = heart.dataset.liked === 'true';
    heart.dataset.liked = liked ? 'false' : 'true';
    heart.textContent = liked ? '♡' : '♥';
    heart.style.color = liked ? '' : '#ef4444';
    // Quick pop animation
    heart.style.transform = 'scale(1.4)';
    setTimeout(() => { heart.style.transform = 'scale(1)'; }, 200);
  });
});

// Redeem button interaction
const redeemBtn = document.querySelector('.phone-detail__btn');
if (redeemBtn) {
  redeemBtn.addEventListener('click', () => {
    redeemBtn.textContent = 'Redeemed!';
    redeemBtn.style.background = '#10b981';
    setTimeout(() => {
      redeemBtn.textContent = 'Redeem This Deal';
      redeemBtn.style.background = '';
    }, 2000);
  });
}

// Update status bar time
function updatePhoneTime() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const timeEl = document.querySelector('.phone-statusbar__time');
  if (timeEl) timeEl.textContent = h + ':' + m;
}
updatePhoneTime();
setInterval(updatePhoneTime, 60000);

// ---- Auto Demo Mode ----
// The phone automatically showcases itself: scrolls, switches pages, opens deals, likes, etc.
// Pauses when user interacts, resumes after idle.

let autoDemo = null;
let autoPaused = false;
let autoTimeout = null;

function pauseAutoDemo() {
  autoPaused = true;
  clearTimeout(autoTimeout);
  // Resume after 8 seconds of no interaction
  autoTimeout = setTimeout(() => { autoPaused = false; }, 8000);
}

// Pause on any user interaction with the phone
document.querySelector('.phone-frame').addEventListener('pointerdown', pauseAutoDemo);
document.querySelector('.phone-frame').addEventListener('wheel', pauseAutoDemo);

function smoothScrollTo(el, target, duration) {
  const start = el.scrollTop;
  const diff = target - start;
  let startTime = null;
  function step(time) {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const ease = progress < 0.5
      ? 2 * progress * progress
      : -1 + (4 - 2 * progress) * progress;
    el.scrollTop = start + diff * ease;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function simulateHeart(index) {
  const hearts = document.querySelectorAll('.phone-card__heart');
  if (hearts[index] && hearts[index].dataset.liked === 'false') {
    hearts[index].dataset.liked = 'true';
    hearts[index].textContent = '♥';
    hearts[index].style.color = '#ef4444';
    hearts[index].style.transform = 'scale(1.4)';
    setTimeout(() => { hearts[index].style.transform = 'scale(1)'; }, 200);
  }
}

function simulateUnheart(index) {
  const hearts = document.querySelectorAll('.phone-card__heart');
  if (hearts[index] && hearts[index].dataset.liked === 'true') {
    hearts[index].dataset.liked = 'false';
    hearts[index].textContent = '♡';
    hearts[index].style.color = '';
    hearts[index].style.transform = 'scale(1.4)';
    setTimeout(() => { hearts[index].style.transform = 'scale(1)'; }, 200);
  }
}

function openDeal(dealKey) {
  const deal = dealData[dealKey];
  if (!deal) return;
  document.getElementById('dealDiscount').textContent = deal.discount;
  document.getElementById('dealTitle').textContent = deal.title;
  document.getElementById('dealBusiness').textContent = deal.business;
  showPhonePage('pageDeal');
  document.querySelector('.phone-nav').style.display = 'none';
}

function closeDeal() {
  showPhonePage('pageHome');
  document.querySelector('.phone-nav').style.display = 'flex';
}

function simulateRedeem() {
  const btn = document.querySelector('.phone-detail__btn');
  if (btn) {
    btn.textContent = 'Redeemed!';
    btn.style.background = '#10b981';
    setTimeout(() => {
      btn.textContent = 'Redeem This Deal';
      btn.style.background = '';
    }, 1500);
  }
}

// The demo sequence — a scripted tour of the app
const demoSteps = [
  // 1. Start on Home, scroll down slowly
  () => {
    showPhonePage('pageHome');
    document.querySelector('.phone-nav').style.display = 'flex';
    const scroll = document.querySelector('#pageHome .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 80, 1200);
  },
  // 2. Like first deal
  () => { simulateHeart(0); },
  // 3. Scroll more
  () => {
    const scroll = document.querySelector('#pageHome .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 200, 1200);
  },
  // 4. Like second deal
  () => { simulateHeart(1); },
  // 5. Scroll to see more deals
  () => {
    const scroll = document.querySelector('#pageHome .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 350, 1200);
  },
  // 6. Tap on a deal to open detail
  () => { openDeal('deal1'); },
  // 7. Scroll detail page
  () => {
    const scroll = document.querySelector('#pageDeal .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 100, 1000);
  },
  // 8. Redeem the deal
  () => { simulateRedeem(); },
  // 9. Wait, then go back
  () => {},
  // 10. Go back to home
  () => { closeDeal(); },
  // 11. Scroll back to top
  () => {
    const scroll = document.querySelector('#pageHome .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 0, 800);
  },
  // 12. Switch to Flyers
  () => { showPhonePage('pageFlyers'); },
  // 13. Scroll flyers
  () => {
    const scroll = document.querySelector('#pageFlyers .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 100, 1000);
  },
  // 14. Scroll more flyers
  () => {
    const scroll = document.querySelector('#pageFlyers .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 0, 800);
  },
  // 15. Switch to Nearby
  () => { showPhonePage('pageNearby'); },
  // 16. Scroll nearby
  () => {
    const scroll = document.querySelector('#pageNearby .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 80, 1000);
  },
  // 17. Back to top
  () => {
    const scroll = document.querySelector('#pageNearby .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 0, 800);
  },
  // 18. Switch to Profile
  () => { showPhonePage('pageProfile'); },
  // 19. Scroll profile
  () => {
    const scroll = document.querySelector('#pageProfile .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 120, 1000);
  },
  // 20. Scroll back
  () => {
    const scroll = document.querySelector('#pageProfile .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 0, 800);
  },
  // 21. Unlike hearts (reset)
  () => { simulateUnheart(0); },
  () => { simulateUnheart(1); },
  // 22. Back to Home to restart loop
  () => {
    showPhonePage('pageHome');
    const scroll = document.querySelector('#pageHome .phone-scroll');
    if (scroll) smoothScrollTo(scroll, 0, 500);
  },
];

let demoIndex = 0;
function runDemoStep() {
  if (autoPaused) {
    setTimeout(runDemoStep, 500);
    return;
  }
  demoSteps[demoIndex]();
  demoIndex = (demoIndex + 1) % demoSteps.length;
  setTimeout(runDemoStep, 2000);
}

// Start auto demo after a short delay
setTimeout(runDemoStep, 2500);

// Scroll-based nav shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    nav.style.boxShadow = '0 1px 12px rgba(0,0,0,0.08)';
  } else {
    nav.style.boxShadow = 'none';
  }
});

// Fade-in on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.feature-card, .step, .price-card, .consumer-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
