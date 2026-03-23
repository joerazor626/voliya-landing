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
