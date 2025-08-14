// Countdown Timer (days:hours:minutes:seconds)
(function initCountdown() {
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minsEl = document.getElementById('timer-mins');
  const secsEl = document.getElementById('timer-secs');
  if (!daysEl || !hoursEl || !minsEl) return;

  // Set a deadline 4 days from now
  const deadline = Date.now() + 4 * 24 * 60 * 60 * 1000;

  function update() {
    const now = Date.now();
    let diff = Math.max(0, deadline - now);

    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    diff -= days * 24 * 60 * 60 * 1000;
    const hours = Math.floor(diff / (60 * 60 * 1000));
    diff -= hours * 60 * 60 * 1000;
    const mins = Math.floor(diff / (60 * 1000));
    diff -= mins * 60 * 1000;
    const secs = Math.floor(diff / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(mins).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

// Horizontal product slider
(function initProductSlider() {
  const container = document.getElementById('productsContainer');
  const row = document.getElementById('productsRow');
  if (!container || !row) return;

  function getStep() {
    // Width of one card including gutter
    const firstCol = row.querySelector('.col-lg-3, .col-md-6, .col-sm-12');
    if (!firstCol) return container.clientWidth * 0.8;
    const style = window.getComputedStyle(firstCol);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    return firstCol.getBoundingClientRect().width + marginLeft + marginRight;
  }

  window.slideProducts = function(direction) {
    const step = getStep();
    const target = direction === 'next' ? container.scrollLeft + step : container.scrollLeft - step;
    container.scrollTo({ left: target, behavior: 'smooth' });
  };
})();

// Header search submit (non-functional demo handler)
(function headerSearch() {
  const form = document.getElementById('headerSearchForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const q = (document.getElementById('headerSearchInput')?.value || '').trim();
    const cat = (document.getElementById('headerSearchCategory')?.value || '').trim();
    if (!q) {
      showToast && showToast('Please enter a search term');
      return;
    }
    const msg = cat ? `Searching "${q}" in ${cat}` : `Searching "${q}"`;
    showToast ? showToast(msg) : alert(msg);
  });
})();

// Horizontal product slider (duplicate block under New Arrivals)
(function initProductSlider2() {
  const container = document.getElementById('productsContainer2');
  const row = document.getElementById('productsRow2');
  if (!container || !row) return;

  function getStep() {
    const firstCol = row.querySelector('.col-lg-3, .col-md-6, .col-sm-12');
    if (!firstCol) return container.clientWidth * 0.8;
    const style = window.getComputedStyle(firstCol);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    return firstCol.getBoundingClientRect().width + marginLeft + marginRight;
  }

  window.slideProducts2 = function(direction) {
    const step = getStep();
    const target = direction === 'next' ? container.scrollLeft + step : container.scrollLeft - step;
    container.scrollTo({ left: target, behavior: 'smooth' });
  };
})();

// Removed secondary countdown (per request)

// Back to Top button
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  function smoothScrollToTop(duration = 550) {
    const start = window.scrollY || document.documentElement.scrollTop || 0;
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);
      const current = Math.round(start * (1 - eased));
      window.scrollTo(0, current);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    smoothScrollToTop(600); // fast smooth scroll
  });
})();

// Footer year
(function setYear() {
  const y = document.getElementById('yearNow');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Store and render recently viewed
(function recentlyViewed() {
  const menu = document.getElementById('recentlyViewedMenu');
  if (!menu) return;

  const KEY = 'recently_viewed_items_v1';

  function getItems() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  function setItems(items) {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 8)));
  }

  function render() {
    const items = getItems();
    menu.innerHTML = '';
    if (!items.length) {
      menu.innerHTML = '<li class="px-3 py-2 text-muted">No items yet</li>';
      return;
    }
    items.forEach((it) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="#" class="dropdown-item d-flex align-items-center gap-2">
          <img src="${it.image}" alt="${it.title}" style="width:40px;height:40px;object-fit:cover;border-radius:6px;"/>
          <div class="flex-grow-1">
            <div class="text-truncate" style="max-width:200px">${it.title}</div>
            <small class="text-muted">${it.price}</small>
          </div>
        </a>`;
      menu.appendChild(li);
    });
  }

  window.addEventListener('storage', render);
  render();

  // expose API to add item
  window.__addRecentlyViewed = function (item) {
    const items = getItems();
    const filtered = items.filter((i) => i.title !== item.title);
    filtered.unshift(item);
    setItems(filtered);
    render();
  };
})();

// Toast helper
function showToast(message) {
  const toastEl = document.getElementById('liveToast');
  const body = document.getElementById('toastBody');
  if (!toastEl || !body) return;
  body.textContent = message;
  const t = new bootstrap.Toast(toastEl);
  t.show();
}

// Wishlist / Cart counters
(function counters() {
  const wishBadge = document.getElementById('wishlistCountBadge');
  const cartBadge = document.getElementById('cartCountBadge');
  let wishCount = 0;
  let cartCount = 0;

  function update() {
    if (wishBadge) wishBadge.textContent = String(wishCount);
    if (cartBadge) cartBadge.textContent = String(cartCount);
  }

  // hook action buttons
  document.addEventListener('click', function (e) {
    const target = e.target.closest('button');
    if (!target) return;

    if (target.classList.contains('wishlist-btn') || target.id === 'quickViewAddWish') {
      wishCount += 1;
      update();
      showToast('Added to wishlist');
    }
    if (target.classList.contains('cart-btn') || target.id === 'quickViewAddCart') {
      cartCount += 1;
      update();
      showToast('Added to cart');
    }
  });

  update();
})();

// Quick View modal
(function quickView() {
  const modalEl = document.getElementById('quickViewModal');
  if (!modalEl) return;
  const modal = new bootstrap.Modal(modalEl);

  const titleEl = document.getElementById('quickViewTitle');
  const imgEl = document.getElementById('quickViewImage');
  const priceEl = document.getElementById('quickViewPrice');
  const originalEl = document.getElementById('quickViewOriginal');
  const descEl = document.getElementById('quickViewDesc');

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.view-btn');
    if (!btn) return;

    const card = btn.closest('.product-card');
    if (!card) return;

    const img = card.querySelector('.product-image');
    const title = card.querySelector('.product-title');
    const current = card.querySelector('.current-price');
    const original = card.querySelector('.original-price');

    if (title) titleEl.textContent = title.textContent.trim();
    if (img && imgEl) imgEl.src = img.src;
    if (priceEl && current) priceEl.textContent = current.textContent.trim();
    if (originalEl) originalEl.textContent = original ? original.textContent.trim() : '';
    if (descEl) descEl.textContent = 'A premium product with excellent build quality and value.';

    window.__addRecentlyViewed({
      title: title ? title.textContent.trim() : 'Product',
      image: img ? img.src : 'Img/599194134.jpg',
      price: current ? current.textContent.trim() : '$0'
    });

    modal.show();
  });
})();

// Newsletter form toast
(function newsletter() {
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    if (form.closest('.newsletter-band')) {
      e.preventDefault();
      showToast('Subscribed successfully!');
      form.reset();
    }
  });
})();

// Coupon copy functionality
window.copyCoupon = function() {
  navigator.clipboard.writeText('COUPON25').then(function() {
    showToast('Coupon code copied to clipboard!');
  }).catch(function() {
    showToast('Failed to copy coupon code');
  });
};

// Enhanced mega-menu hover effects
(function bootstrapHoverDropdowns(){
  const container = document.getElementById('secondaryNavContent') || document;
  const items = container.querySelectorAll('.nav-item.dropdown');
  if (!items.length || !window.bootstrap) return;

  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  let openInstance = null;

  items.forEach(item => {
    const toggle = item.querySelector('.dropdown-toggle');
    const menu = item.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    toggle.setAttribute('data-bs-auto-close', 'outside');
    const dd = bootstrap.Dropdown.getOrCreateInstance(toggle, {
      autoClose: false,
      popperConfig: { strategy: 'fixed' }
    });

    let hideTimer = null;
    const HIDE_DELAY = 280;

    function show(){
      clearTimeout(hideTimer);
      if (openInstance && openInstance !== dd) openInstance.hide();
      dd.show();
      overlay.classList.add('show');
      openInstance = dd;
    }
    function scheduleHide(){
      clearTimeout(hideTimer);
      hideTimer = setTimeout(()=>{
        dd.hide();
        if (!document.querySelector('.dropdown-menu.show')){
          overlay.classList.remove('show');
          openInstance = null;
        }
      }, HIDE_DELAY);
    }

    item.addEventListener('mouseenter', show);
    item.addEventListener('mouseleave', scheduleHide);
    menu.addEventListener('mouseenter', ()=> clearTimeout(hideTimer));
    menu.addEventListener('mouseleave', scheduleHide);
    toggle.addEventListener('click', (e)=>{ e.preventDefault(); show(); });
  });

  overlay.addEventListener('click', ()=>{
    if (openInstance) openInstance.hide();
    overlay.classList.remove('show');
    openInstance = null;
  });
})();

// Product image lazy loading
(function lazyLoading() {
  const images = document.querySelectorAll('img[src*="Img/"]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
})();

// Smooth scroll for anchor links
(function smoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// Product Details: build related products strip (Flash Deals style)
(function productDetailsRelatedStrip() {
  if (!window.location.pathname.includes('ProductDetails.html')) return;
  const container = document.getElementById('productsContainerPD');
  const row = document.getElementById('productsRowPD');
  if (!container || !row) return;

  function buildCard(p) {
    return `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <a href="ProductDetails.html?id=${p.id}" class="card-link">
          <div class="card h-100 shop-card">
            <div class="shop-image-container">
              <img src="Img/fashion-1.jpg" class="shop-image" alt="${p.title}">
              <div class="side-icons">
                <button class="side-icon wishlist-btn" title="Wishlist"><i class="far fa-heart"></i></button>
                <button class="side-icon compare-btn" title="Compare"><i class="fas fa-random"></i></button>
                <button class="side-icon view-btn" title="Quick View"><i class="fas fa-search"></i></button>
                <button class="side-icon cart-btn" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
              </div>
            </div>
            <div class="card-body">
              <div class="small text-muted">${p.brand} • ${p.color} • ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
              <h6 class="card-title mt-1 mb-2">${p.title}</h6>
              <div class="fw-bold">$${p.price}</div>
            </div>
          </div>
        </a>
      </div>`;
  }

  const items = Array.from({length: 8}, (_,i)=>({
    id: i+1,
    title: `Related Product ${i+1}`,
    brand: ['Nike','Apple','Sony','Canon','Adidas','Zara'][i%6],
    color: ['Black','Blue','Gray','Green'][i%4],
    rating: 3 + (i % 3),
    price: 49 + (i*17 % 600)
  }));
  row.innerHTML = items.map(buildCard).join('');

  function getStep() {
    const firstCol = row.querySelector('.col-lg-3, .col-md-6, .col-sm-12');
    if (!firstCol) return container.clientWidth * 0.8;
    const style = window.getComputedStyle(firstCol);
    const marginLeft = parseFloat(style.marginLeft) || 0;
    const marginRight = parseFloat(style.marginRight) || 0;
    return firstCol.getBoundingClientRect().width + marginLeft + marginRight;
  }

  window.slideProductsPD = function(direction) {
    const step = getStep();
    const target = direction === 'next' ? container.scrollLeft + step : container.scrollLeft - step;
    container.scrollTo({ left: target, behavior: 'smooth' });
  };
})();

// ---------------------------
// Shop page logic (filters + grid + pagination)
(function shopPage() {
  const app = document.getElementById('shopApp');
  if (!app) return; // Only run on Shop.html

  // Config
  const PRODUCTS_TOTAL = 100;
  const ALL_COLORS = ['Black','Blue','Brown','Burgundy','Cool Pink','Deep Purple','Gray','Green','Light Brown','Navy','Orange','Pink','Purple','Red'];
  const ALL_BRANDS = ['Nike','Apple','Sony','Samsung','Adidas','Gucci','Zara','Canon'];
  const ALL_SIZES = ['XS','S','M','L','XL'];
  const ALL_STORAGE = ['32GB','64GB','128GB','256GB','512GB','1TB'];

  const state = {
    page: 1,
    perPage: 28,
    sort: 'latest',
    filters: {
      colors: new Set(),
      brands: new Set(),
      min: '',
      max: '',
      sizes: new Set(),
      storage: new Set(),
      rating: new Set(),
    }
  };

  // Helpers
  function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function rand(seed){ return Math.abs(Math.sin(seed))*1000; }
  function makeProduct(i){
    // Dummy product data
    return {
      id: i + 1,
      title: `Product ${i+1} Name`,
      brand: ALL_BRANDS[i % ALL_BRANDS.length],
      color: ALL_COLORS[i % ALL_COLORS.length],
      rating: 3 + (i % 3),
      price: 49 + (i * 11 % 900),
      image: `Img/fashion-${(i%4)+1}.jpg`
    };
  }

  function buildCard(p) {
    return `<div class="col-lg-3 col-md-4 col-sm-6 mb-4">
              <a href="ProductDetails.html?id=${p.id}" class="card-link">
                <div class="card h-100 shop-card">
                  <div class="shop-image-container">
                    <img src="${p.image}" class="shop-image" alt="${p.title}">
                    <div class="side-icons">
                      <button class="side-icon wishlist-btn" title="Wishlist"><i class="far fa-heart"></i></button>
                      <button class="side-icon compare-btn" title="Compare"><i class="fas fa-random"></i></button>
                      <button class="side-icon view-btn" title="Quick View"><i class="fas fa-search"></i></button>
                      <button class="side-icon cart-btn" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
                    </div>
                  </div>
                  <div class="card-body">
                    <div class="small text-muted">${p.brand} • ${p.color} • ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
                    <h6 class="card-title mt-1 mb-2">${p.title}</h6>
                    <div class="fw-bold">$${p.price}</div>
                  </div>
                </div>
              </a>
            </div>`;
  }

  // Build filters
  const colorsWrap = document.getElementById('filterColors');
  const brandsWrap = document.getElementById('filterBrands');
  const sizesWrap = document.getElementById('filterSizes');
  const storageWrap = document.getElementById('filterStorage');
  const ratingsWrap = document.getElementById('filterRatings');

  if (colorsWrap) {
    const COLOR_SWATCH = {
      Black:'#111', Blue:'#2563eb', Brown:'#8b5e34', Burgundy:'#7b1120', 'Cool Pink':'#f8b4d9', 'Deep Purple':'#6b21a8', Gray:'#9ca3af', Green:'#10b981', 'Light Brown':'#c89f7a', Navy:'#0f172a', Orange:'#f59e0b', Pink:'#f472b6', Purple:'#9333ea', Red:'#ef4444', Rosewood:'#65000b', 'True Cotal':'#e07a5f', White:'#ffffff', Yellow:'#fbbf24'
    };
    ALL_COLORS.forEach((c,idx)=>{
      const count = 3 + (idx*7)%96; // mock counts
      colorsWrap.appendChild(el(`<li>
        <div class="left">
          <input class="form-check-input" type="checkbox" value="${c}" id="c${idx}">
          <span class="swatch" style="background:${COLOR_SWATCH[c]||'#ddd'}"></span>
          <label class="form-check-label" for="c${idx}">${c}</label>
        </div>
        <span class="count">${count}</span>
      </li>`));
    })
  }
  if (brandsWrap) {
    ALL_BRANDS.forEach((b,idx)=>{
      brandsWrap.appendChild(el(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${b}" id="b${idx}"><label class="form-check-label" for="b${idx}">${b}</label></div>`));
    })
  }
  if (sizesWrap) {
    ALL_SIZES.forEach((s,idx)=>{
      sizesWrap.appendChild(el(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${s}" id="s${idx}"><label class="form-check-label" for="s${idx}">${s}</label></div>`));
    })
  }
  if (storageWrap) {
    ALL_STORAGE.forEach((s,idx)=>{
      storageWrap.appendChild(el(`<div class="form-check"><input class="form-check-input" type="checkbox" value="${s}" id="st${idx}"><label class="form-check-label" for="st${idx}">${s}</label></div>`));
    })
  }
  if (ratingsWrap) {
    [5,4,3].forEach((r)=>{
      ratingsWrap.appendChild(el(`<label class="form-check small"><input class="form-check-input me-1" type="checkbox" value="${r}"> ${'★'.repeat(r)}${'☆'.repeat(5-r)} & Up</label>`));
    })
  }

  // Grid render (4 columns x 7 rows = 28 per page)
  const grid = document.getElementById('shopGrid');
  const isStaticGrid = grid && grid.getAttribute('data-static') === 'true';
  const summary = document.getElementById('shopSummary');
  const pag = document.getElementById('shopPagination');
  const perSelect = document.getElementById('perPageSelect');
  const sortSelect = document.getElementById('sortSelect');

  function getProducts() {
    // generate deterministic array of PRODUCTS_TOTAL
    return Array.from({length: PRODUCTS_TOTAL}, (_,i)=>makeProduct(i+1));
  }

  function applyFilters(items) {
    const f = state.filters;
    return items.filter(p => {
      if (f.colors.size && !f.colors.has(p.color)) return false;
      if (f.brands.size && !f.brands.has(p.brand)) return false;
      if (f.min && p.price < Number(f.min)) return false;
      if (f.max && p.price > Number(f.max)) return false;
      if (f.rating.size) {
        const minRating = Math.max(...Array.from(f.rating).map(Number));
        if (p.rating < minRating) return false;
      }
      return true;
    });
  }

  function sortItems(items, sortBy) {
    switch(sortBy) {
      case 'price_asc': return items.sort((a,b) => a.price - b.price);
      case 'price_desc': return items.sort((a,b) => b.price - a.price);
      case 'rating_desc': return items.sort((a,b) => b.rating - a.rating);
      default: return items; // latest simulated
    }
  }

  function render() {
    if (isStaticGrid) {
      // If grid is static, just update summary counts based on static items
      const staticCards = grid ? grid.querySelectorAll('.shop-card') : [];
      const total = staticCards.length;
      summary && (summary.textContent = `Showing 1-${total} of ${total} results`);
      pag && (pag.innerHTML = '');
      return;
    }
    const filtered = applyFilters(getProducts());
    const sorted = sortItems(filtered, state.sort);
    state.totalItems = sorted.length;
    const start = (state.page - 1) * state.perPage;
    const end = start + state.perPage;
    const slice = sorted.slice(start, end);
    grid.innerHTML = '';
    slice.forEach(p => {
      grid.appendChild(el(buildCard(p))); // Use buildCard here
    });
    summary.textContent = `Showing ${start+1}-${Math.min(start+state.perPage,state.totalItems)} of ${state.totalItems} results`;
    pag.innerHTML = '';
    const makePage = (n, active=false)=> el(`<li class="page-item ${active?'active':''}"><a class="page-link" href="#">${n}</a></li>`);
    for (let i=1;i<=Math.ceil(state.totalItems / state.perPage);i++) {
      const li = makePage(i, i===state.page);
      li.addEventListener('click', (e)=>{ e.preventDefault(); state.page=i; render(); window.scrollTo({top:0,behavior:'smooth'}); });
      pag.appendChild(li);
    }
  }

  // Events
  perSelect && perSelect.addEventListener('change', ()=>{ state.perPage = Number(perSelect.value)||28; state.page=1; render(); });
  sortSelect && sortSelect.addEventListener('change', ()=>{ state.sort = sortSelect.value; state.page=1; render(); });

  document.getElementById('applyFiltersBtn')?.addEventListener('click', ()=>{
    state.filters.colors = new Set(Array.from(document.querySelectorAll('#filterColors input:checked')).map(i=>i.value));
    state.filters.brands = new Set(Array.from(document.querySelectorAll('#filterBrands input:checked')).map(i=>i.value));
    state.filters.min = document.getElementById('priceMin').value;
    state.filters.max = document.getElementById('priceMax').value;
    state.filters.sizes = new Set(Array.from(document.querySelectorAll('#filterSizes input:checked')).map(i=>i.value));
    state.filters.storage = new Set(Array.from(document.querySelectorAll('#filterStorage input:checked')).map(i=>i.value));
    state.filters.rating = new Set(Array.from(document.querySelectorAll('#filterRatings input:checked')).map(i=>i.value));
    state.page = 1; render();
  });

  document.getElementById('clearFiltersBtn')?.addEventListener('click', ()=>{
    document.querySelectorAll('#shopApp input[type="checkbox"]').forEach(i=>i.checked=false);
    document.getElementById('priceMin').value='';
    document.getElementById('priceMax').value='';
    state.filters = { colors:new Set(),brands:new Set(),min:'',max:'',sizes:new Set(),storage:new Set(),rating:new Set() };
    state.page=1; render();
  });

  const catBar = document.getElementById('shopCatBar');
  if (catBar) {
    catBar.addEventListener('click', (e)=>{
      const btn = e.target.closest('.shop-cat-pill');
      if (!btn) return;
      // Active UI
      catBar.querySelectorAll('.shop-cat-pill').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      // Map demo categories to filters (brand/category approximation)
      const key = btn.dataset.cat;
      // For demo: filter by brand or color group loosely
      switch(key){
        case 'beauty':
          state.filters.brands = new Set(['Zara']); break;
        case 'electronic':
          state.filters.brands = new Set(['Apple','Sony','Canon','Samsung']); break;
        case 'fashion':
          state.filters.brands = new Set(['Nike','Adidas','Zara']); break;
        case 'games':
          state.filters.brands = new Set(['Sony']); break;
        case 'home':
          state.filters.brands = new Set(['Zara']); break;
        case 'laptop':
          state.filters.brands = new Set(['Apple','Samsung']); break;
        case 'phone':
          state.filters.brands = new Set(['Apple','Samsung']); break;
        case 'tv':
          state.filters.brands = new Set(['Sony','Samsung']); break;
        default:
          state.filters.brands = new Set();
      }
      state.page = 1;
      render();
    });
  }

  // Initialize
  render();
})();

// ---------------------------
// Home page: replace Flash Deals cards with shop-style cards
(function homeFlashDeals() {
  // This buildCard is similar to the one in shopApp, but repeated for modularity
  // and to ensure correct image paths (picsum vs local assets).
  function buildCard(p) {
    return `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <a href="ProductDetails.html?id=${p.id}" class="card-link">
          <div class="card h-100 shop-card">
            <div class="shop-image-container">
              <img src="Img/fashion-${(p.id%4)+1}.jpg" class="shop-image" alt="${p.title}">
              <div class="side-icons">
                <button class="side-icon wishlist-btn" title="Wishlist"><i class="far fa-heart"></i></button>
                <button class="side-icon compare-btn" title="Compare"><i class="fas fa-random"></i></button>
                <button class="side-icon view-btn" title="Quick View"><i class="fas fa-search"></i></button>
                <button class="side-icon cart-btn" title="Add to Cart"><i class="fas fa-shopping-cart"></i></button>
              </div>
            </div>
            <div class="card-body">
              <div class="small text-muted">${p.brand} • ${p.color} • ${'★'.repeat(p.rating)}${'☆'.repeat(5-p.rating)}</div>
              <h6 class="card-title mt-1 mb-2">${p.title}</h6>
              <div class="fw-bold">$${p.price}</div>
            </div>
          </div>
        </a>
      </div>`;
  }

  function fillRow(rowId, count=8) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const items = Array.from({length: count}, (_,i)=>({
      id: i+1,
      title: `Deal Product ${i+1}`,
      brand: ['Nike','Apple','Sony','Canon','Adidas','Zara'][i%6],
      color: ['Black','Blue','Gray','Green'][i%4],
      rating: 3 + (i % 3),
      price: 49 + (i*11 % 900)
    }));
    row.innerHTML = items.map(buildCard).join('');
  }

  fillRow('productsRow', 8);
  fillRow('productsRow2', 4);
})();
// New Arrivals highlight variants swapper
(function naHighlightVariants() {
  const main = document.getElementById('naMainImage');
  const list = document.getElementById('naVariants');
  if (!main || !list) return;

  list.addEventListener('click', function (e) {
    const btn = e.target.closest('.na-variant');
    if (!btn) return;
    const url = btn.getAttribute('data-img');
    if (!url) return;
    main.src = url;
    this.querySelectorAll('.na-variant.active').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
  });
})();

// ---------------------------
// Product Details Page Logic
(function productDetailsApp() {
  // Only run if on ProductDetails.html
  if (window.location.pathname.includes('ProductDetails.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Helper function to create HTML elements
    const el = (html) => {
      const div = document.createElement('div');
      div.innerHTML = html.trim();
      return div.firstChild;
    };

    // Dummy data for product details (you would fetch this from an API normally)
    function getProductById(id) {
      // For demonstration, use a subset of the data or generate a dummy product
      // In a real app, you would have a more robust product data source
      const allProducts = Array.from({length: 100}, (_, i) => ({
        id: i + 1,
        title: `Detailed Product ${i+1}`,
        brand: ['Nike','Apple','Sony','Canon','Adidas','Zara'][i%6],
        color: ['Black','Blue','Gray','Green'][i%4],
        rating: 3 + (i % 3),
        price: 99 + (i*15 % 1000),
        image: `Img/fashion-${(i%4)+1}.jpg`,
        smallImages: [
          `Img/fashion-1.jpg`,
          `Img/fashion-2.jpg`,
          `Img/fashion-3.jpg`,
          `Img/fashion-4.jpg`
        ],
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
        features: [
          "Machine Wash",
          "Lace-Up",
          "14.11 Ounces"
        ],
        sku: `SKU${Math.floor(Math.random() * 100000)}`,
        categories: "Accessories, Shoes"
      }));
      return allProducts.find(p => p.id === parseInt(id));
    }

    const product = getProductById(productId);
    const mainContent = document.querySelector('main.container');

    if (product && mainContent) {
      mainContent.innerHTML = `
        <nav aria-label="breadcrumb" class="mb-4">
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="Index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="Shop.html">Shop</a></li>
            <li class="breadcrumb-item active" aria-current="page">${product.title}</li>
          </ol>
        </nav>
        <div class="row">
          <!-- Product Images -->
          <div class="col-lg-6">
            <div class="mb-4">
              <img id="mainProductImage" src="${product.image}" class="img-fluid rounded" alt="${product.title}">
            </div>
            <div class="d-flex gap-2 mb-4">
              ${product.smallImages.map((img, idx) => `
                <img src="${img}" class="img-thumbnail product-thumbnail ${idx === 0 ? 'active' : ''}" alt="Thumbnail ${idx + 1}" data-main-image="${img}">
              `).join('')}
            </div>
          </div>

          <!-- Product Details -->
          <div class="col-lg-6">
            <h6 class="text-muted">${product.brand}</h6>
            <h1 class="mb-3">${product.title}</h1>
            <div class="d-flex align-items-center mb-3">
              <div class="text-warning fs-5 me-2">${'★'.repeat(product.rating)}${'☆'.repeat(5-product.rating)}</div>
              <span class="text-muted">(${product.rating} Reviews)</span>
            </div>
            <div class="fs-3 fw-bold mb-3">$${product.price}</div>
            <ul class="list-unstyled mb-4">
              ${product.features.map(feature => `<li><i class="fas fa-check-circle text-success me-2"></i>${feature}</li>`).join('')}
            </ul>
            <p class="text-muted mb-4">${product.description}</p>
            <div class="d-flex align-items-center mb-4">
              <div class="input-group" style="width: 150px;">
                <button class="btn btn-outline-secondary" type="button" id="minusBtn">-</button>
                <input type="text" class="form-control text-center" value="1" id="quantityInput">
                <button class="btn btn-outline-secondary" type="button" id="plusBtn">+</button>
              </div>
              <button class="btn btn-dark ms-3"><i class="fas fa-shopping-cart me-2"></i>Add to Cart</button>
            </div>
            <div class="d-flex gap-3 small text-muted">
              <span>SKU: ${product.sku}</span>
              <span>Categories: ${product.categories}</span>
            </div>
            <div class="mt-4">
              <a href="#" class="me-3 text-muted"><i class="far fa-heart me-1"></i>Add to Wishlist</a>
              <a href="#" class="text-muted"><i class="fas fa-random me-1"></i>Add to Compare</a>
            </div>
          </div>
        </div>
      `;

      // Add event listeners for quantity buttons
      const quantityInput = document.getElementById('quantityInput');
      const minusBtn = document.getElementById('minusBtn');
      const plusBtn = document.getElementById('plusBtn');

      if (quantityInput && minusBtn && plusBtn) {
        minusBtn.addEventListener('click', () => {
          let val = parseInt(quantityInput.value);
          if (val > 1) quantityInput.value = val - 1;
        });

        plusBtn.addEventListener('click', () => {
          let val = parseInt(quantityInput.value);
          quantityInput.value = val + 1;
        });
      }
      
      // Thumbnail click functionality
      document.querySelectorAll('.product-thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
          document.querySelectorAll('.product-thumbnail').forEach(img => img.classList.remove('active'));
          this.classList.add('active');
          document.getElementById('mainProductImage').src = this.dataset.mainImage;
        });
      });


    } else if (mainContent) {
      mainContent.innerHTML = '<p class="text-center">Product not found.</p>';
    }
  }
})();

// ==============================
// Product Details Interactions
// ==============================
(function productDetailsInteractions(){
  const mainImg = document.getElementById('mainProductImage');
  const thumbs = document.querySelectorAll('.thumbnail-image');
  if (mainImg && thumbs.length) {
    thumbs.forEach((img) => {
      // lazy loading for remote images
      if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
      img.addEventListener('click', function(){
        thumbs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        const src = this.getAttribute('data-main') || this.src;
        mainImg.src = src;
        const wrap = mainImg.closest('.main-image-container');
        if (wrap) {
          // Force background update with absolute URL to prevent caching issues
          const a = document.createElement('a'); a.href = src; wrap.style.backgroundImage = `url('${a.href}')`;
        }
      });
    });
    // set first as active if none
    if (!document.querySelector('.thumbnail-image.active')) {
      thumbs[0].classList.add('active');
    }
  }

  // Image zoom like Merto: magnify inside frame following cursor
  (function productZoom(){
    const img = document.getElementById('mainProductImage');
    if (!img) return;
    const wrap = img.closest('.main-image-container');
    if (!wrap) return;

    const ZOOM_SCALE = 2.2; // magnification

    function setBackground(src){
      const a = document.createElement('a'); a.href = src; // absolute URL
      wrap.style.backgroundImage = `url('${a.href}')`;
      wrap.style.backgroundSize = `${ZOOM_SCALE*100}% auto`;
    }
    setBackground(img.src);

    // Update background on src change
    const obs = new MutationObserver(()=> setBackground(img.src));
    obs.observe(img, { attributes: true, attributeFilter: ['src'] });

    function onMove(e){
      const rect = wrap.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      wrap.style.backgroundPosition = `${x}% ${y}%`;
    }
    function activate(){ wrap.classList.add('zoom-active'); wrap.style.cursor = 'zoom-out'; }
    function deactivate(){ wrap.classList.remove('zoom-active'); wrap.style.cursor = 'zoom-in'; wrap.style.backgroundPosition = 'center'; }

    wrap.addEventListener('mouseenter', activate);
    wrap.addEventListener('mouseleave', deactivate);
    wrap.addEventListener('mousemove', function(e){ if (wrap.classList.contains('zoom-active')) onMove(e); });
    // Also support touch
    wrap.addEventListener('touchstart', (e)=>{ activate(); if (e.touches[0]) onMove(e.touches[0]); }, { passive:true });
    wrap.addEventListener('touchmove', (e)=>{ if (wrap.classList.contains('zoom-active') && e.touches[0]) onMove(e.touches[0]); }, { passive:true });
    wrap.addEventListener('touchend', deactivate);
  })();

  // Quantity controls
  document.addEventListener('click', function(e){
    const btn = e.target.closest('.quantity-btn');
    if (!btn) return;
    const input = btn.parentElement.querySelector('.quantity-input');
    if (!input) return;
    let val = parseInt(input.value || '1', 10);
    if (btn.dataset.action === 'increase') val += 1;
    if (btn.dataset.action === 'decrease') val = Math.max(1, val - 1);
    input.value = String(val);
  });

  // Add to cart / wishlist hooks reuse global handlers
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function(){
      const qty = parseInt(document.querySelector('.quantity-input')?.value || '1', 10);
      for (let i = 0; i < qty; i++) {
        const evt = new Event('click', { bubbles: true });
        const fake = document.createElement('button');
        fake.className = 'cart-btn';
        fake.style.display = 'none';
        document.body.appendChild(fake);
        fake.dispatchEvent(evt);
        document.body.removeChild(fake);
      }
    });
  }

  const wishBtn = document.querySelector('.add-to-wishlist');
  if (wishBtn) {
    wishBtn.addEventListener('click', function(){
      const evt = new Event('click', { bubbles: true });
      const fake = document.createElement('button');
      fake.className = 'wishlist-btn';
      fake.style.display = 'none';
      document.body.appendChild(fake);
      fake.dispatchEvent(evt);
      document.body.removeChild(fake);
    });
  }
})();

// Prevent card-link navigation when clicking action icons and toggle active state
(function preventIconNavigationAndToggle() {
  document.addEventListener('click', function (e) {
    const iconBtn = e.target.closest('.side-icon');
    if (!iconBtn) return;
    // prevent any parent anchor navigation
    e.preventDefault();
    e.stopPropagation();
    // toggle active state
    iconBtn.classList.toggle('active');
  });
})();
