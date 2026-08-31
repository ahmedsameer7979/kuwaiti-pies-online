// app.js - المحرك الرئيسي لمتجر فطاير ومعجنات الديرة الكويتية

let currentCategory = 'all';
let searchQuery = '';
let selectedTag = 'all';
let currentLanguage = 'ar';
let selectedProductForModal = null;

// التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  initLucide();
  renderCategories();
  renderProducts();
  setupEventListeners();
  setupKuwaitGovernorates();
  setupKnetBanks();
  cart.subscribe(updateCartUI);
});

// تهيئة الأيقونات
function initLucide() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// عرض تصنيفات القائمة
function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => `
    <button 
      class="category-btn px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${cat.id === currentCategory ? 'bg-amber-500 text-stone-900 shadow-md shadow-amber-500/20 scale-105' : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'}"
      onclick="setCategory('${cat.id}')"
      data-category="${cat.id}">
      <span>${currentLanguage === 'ar' ? cat.name_ar : cat.name_en}</span>
    </button>
  `).join('');
}

function setCategory(catId) {
  currentCategory = catId;
  renderCategories();
  renderProducts();
}

function filterByTag(tag) {
  selectedTag = tag;
  document.querySelectorAll('.tag-filter-btn').forEach(btn => {
    if (btn.dataset.tag === tag) {
      btn.classList.add('bg-amber-500', 'text-stone-900');
      btn.classList.remove('bg-stone-800', 'text-stone-300');
    } else {
      btn.classList.remove('bg-amber-500', 'text-stone-900');
      btn.classList.add('bg-stone-800', 'text-stone-300');
    }
  });
  renderProducts();
}

// عرض المنتجات
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let filtered = PRODUCTS_DATA;

  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name_ar.toLowerCase().includes(query) || 
      p.name_en.toLowerCase().includes(query) ||
      p.description_ar.toLowerCase().includes(query)
    );
  }

  if (selectedTag !== 'all') {
    filtered = filtered.filter(p => p.badge && p.badge.includes(selectedTag));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full py-16 text-center text-stone-400">
        <i data-lucide="cookie" class="w-16 h-16 mx-auto mb-4 text-stone-600"></i>
        <h3 class="text-xl font-bold text-stone-200">لم يتم العثور على أطباق مطابقة</h3>
        <p class="text-sm mt-2">جرّب البحث باسم آخر أو استعراض كل الفئات</p>
        <button onclick="resetFilters()" class="mt-4 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-stone-900 font-bold rounded-xl transition">
          عرض كل الفطاير
        </button>
      </div>
    `;
    initLucide();
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="product-card bg-stone-900/90 border border-stone-800/80 rounded-3xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col group">
      <!-- الصورة والبادج -->
      <div class="relative h-52 overflow-hidden cursor-pointer" onclick="openProductModal('${product.id}')">
        <img 
          src="${product.image}" 
          alt="${product.name_ar}"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80"></div>
        ${product.badge ? `
          <span class="absolute top-3 right-3 px-3 py-1 bg-amber-500/90 backdrop-blur-md text-stone-950 text-xs font-black rounded-full shadow-lg">
            ${product.badge}
          </span>
        ` : ''}
        <span class="absolute bottom-3 left-3 px-2.5 py-1 bg-stone-900/80 backdrop-blur-md text-amber-400 text-xs font-semibold rounded-lg flex items-center gap-1 border border-stone-700">
          <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-500"></i>
          ${product.calories} سعرة
        </span>
      </div>

      <!-- محتوى البطاقة -->
      <div class="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <h3 class="font-bold text-lg text-white group-hover:text-amber-400 transition-colors cursor-pointer" onclick="openProductModal('${product.id}')">
              ${currentLanguage === 'ar' ? product.name_ar : product.name_en}
            </h3>
          </div>
          <p class="text-stone-400 text-xs line-clamp-2 leading-relaxed mb-4">
            ${currentLanguage === 'ar' ? product.description_ar : product.description_en}
          </p>
        </div>

        <!-- السعر وزر الإضافة -->
        <div class="pt-3 border-t border-stone-800/80 flex items-center justify-between">
          <div>
            <span class="text-xs text-stone-400 block">السعر</span>
            <div class="text-xl font-black text-amber-400">
              ${product.price.toFixed(3)} <span class="text-xs font-bold text-stone-300">د.ك</span>
            </div>
          </div>
          <button 
            onclick="quickAddToCart('${product.id}')"
            class="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold rounded-2xl flex items-center gap-2 transition shadow-lg shadow-amber-500/20">
            <i data-lucide="plus" class="w-4 h-4"></i>
            <span class="text-xs">إضافة للسلة</span>
          </button>
        </div>
      </div>
    </div>
  `).join('');

  initLucide();
}

function resetFilters() {
  currentCategory = 'all';
  searchQuery = '';
  selectedTag = 'all';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  renderCategories();
  renderProducts();
}

// إضافة سريعة إلى السلة
function quickAddToCart(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  // إذا كان المنتج يحتوي على خيارات عجينة أو إضافات، نفتح المودال للتخصيص
  if ((product.dough_options && product.dough_options.length > 0) || (product.addons && product.addons.length > 0)) {
    openProductModal(productId);
  } else {
    cart.addItem(product, 1);
    showToast(`تمت إضافة "${product.name_ar}" إلى سلتك!`, 'success');
  }
}

// فتح نافذة تخصيص المنتج
function openProductModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  selectedProductForModal = product;
  const modal = document.getElementById('product-modal');
  const container = document.getElementById('product-modal-content');
  if (!modal || !container) return;

  container.innerHTML = `
    <div class="relative">
      <div class="h-64 sm:h-72 w-full overflow-hidden relative">
        <img src="${product.image}" alt="${product.name_ar}" class="w-full h-full object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent"></div>
        <button onclick="closeProductModal()" class="absolute top-4 right-4 w-10 h-10 rounded-full bg-stone-900/80 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-800 transition">
          <i data-lucide="x" class="w-5 h-5"></i>
        </button>
        ${product.badge ? `
          <span class="absolute top-4 left-4 px-3 py-1 bg-amber-500 text-stone-950 text-xs font-black rounded-full">
            ${product.badge}
          </span>
        ` : ''}
      </div>

      <div class="p-6 space-y-6">
        <div>
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-2xl font-black text-white">${product.name_ar}</h2>
            <div class="text-2xl font-black text-amber-400 whitespace-nowrap">
              <span id="modal-calculated-price">${product.price.toFixed(3)}</span> <span class="text-sm font-bold text-stone-300">د.ك</span>
            </div>
          </div>
          <p class="text-stone-300 text-sm mt-2 leading-relaxed">${product.description_ar}</p>
          <div class="mt-3 flex items-center gap-3 text-xs text-stone-400">
            <span class="flex items-center gap-1 bg-stone-800 px-2.5 py-1 rounded-lg">
              <i data-lucide="flame" class="w-3.5 h-3.5 text-amber-400"></i> ${product.calories} سعرة حرارية
            </span>
            <span class="flex items-center gap-1 bg-stone-800 px-2.5 py-1 rounded-lg">
              <i data-lucide="clock" class="w-3.5 h-3.5 text-amber-400"></i> خبز طازج فوري
            </span>
          </div>
        </div>

        ${product.dough_options && product.dough_options.length > 0 ? `
          <div>
            <label class="block text-sm font-bold text-stone-200 mb-2">🍞 اختر نوع العجينة:</label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${product.dough_options.map((dough, idx) => `
                <label class="flex items-center gap-3 p-3 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 rounded-2xl cursor-pointer transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                  <input type="radio" name="modal-dough" value="${dough}" ${idx === 0 ? 'checked' : ''} class="text-amber-500 focus:ring-amber-500" onchange="updateModalPrice()">
                  <span class="text-sm text-stone-200 font-medium">${dough}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${product.addons && product.addons.length > 0 ? `
          <div>
            <label class="block text-sm font-bold text-stone-200 mb-2">➕ إضافات حسب رغبتك:</label>
            <div class="space-y-2">
              ${product.addons.map((addon, idx) => `
                <label class="flex items-center justify-between p-3 bg-stone-800/80 hover:bg-stone-800 border border-stone-700/60 rounded-2xl cursor-pointer transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-500/10">
                  <div class="flex items-center gap-3">
                    <input type="checkbox" name="modal-addon" value="${addon.name_ar}" data-price="${addon.price}" class="rounded text-amber-500 focus:ring-amber-500" onchange="updateModalPrice()">
                    <span class="text-sm text-stone-200 font-medium">${addon.name_ar}</span>
                  </div>
                  <span class="text-xs font-bold text-amber-400">+${addon.price.toFixed(3)} د.ك</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div>
          <label class="block text-sm font-bold text-stone-200 mb-2">📝 ملاحظات خاصة للفرن والمطبخ:</label>
          <input type="text" id="modal-notes" placeholder="مثال: بدون بصل، تسوية مقرمشة، تقطيع صغير..." class="w-full bg-stone-800 border border-stone-700 rounded-2xl px-4 py-3 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500">
        </div>

        <!-- الكمية وزر الإضافة -->
        <div class="pt-4 border-t border-stone-800 flex items-center justify-between gap-4">
          <div class="flex items-center bg-stone-800 rounded-2xl p-1 border border-stone-700">
            <button onclick="changeModalQty(-1)" class="w-10 h-10 rounded-xl bg-stone-700 text-white flex items-center justify-center hover:bg-stone-600 transition font-bold text-lg">-</button>
            <span id="modal-qty" class="w-12 text-center text-lg font-black text-white">1</span>
            <button onclick="changeModalQty(1)" class="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center hover:bg-amber-400 transition font-bold text-lg">+</button>
          </div>

          <button onclick="confirmAddToCart()" class="flex-1 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition">
            <i data-lucide="shopping-bag" class="w-5 h-5"></i>
            <span>إضافة إلى السلة</span>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  initLucide();
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('hidden');
  selectedProductForModal = null;
}

let modalQuantity = 1;

function changeModalQty(delta) {
  modalQuantity = Math.max(1, modalQuantity + delta);
  const qtyEl = document.getElementById('modal-qty');
  if (qtyEl) qtyEl.textContent = modalQuantity;
  updateModalPrice();
}

function updateModalPrice() {
  if (!selectedProductForModal) return;

  const basePrice = selectedProductForModal.price;
  let addonsTotal = 0;

  document.querySelectorAll('input[name="modal-addon"]:checked').forEach(cb => {
    addonsTotal += parseFloat(cb.dataset.price || 0);
  });

  const unitTotal = basePrice + addonsTotal;
  const total = unitTotal * modalQuantity;

  const priceEl = document.getElementById('modal-calculated-price');
  if (priceEl) {
    priceEl.textContent = total.toFixed(3);
  }
}

function confirmAddToCart() {
  if (!selectedProductForModal) return;

  const selectedDoughRadio = document.querySelector('input[name="modal-dough"]:checked');
  const selectedDough = selectedDoughRadio ? selectedDoughRadio.value : null;

  const selectedAddons = [];
  document.querySelectorAll('input[name="modal-addon"]:checked').forEach(cb => {
    const matched = selectedProductForModal.addons.find(a => a.name_ar === cb.value);
    if (matched) selectedAddons.push(matched);
  });

  const notes = (document.getElementById('modal-notes')?.value || '').trim();

  cart.addItem(selectedProductForModal, modalQuantity, selectedDough, selectedAddons, notes);
  showToast(`تمت إضافة ${modalQuantity} × "${selectedProductForModal.name_ar}" إلى السلة!`, 'success');
  closeProductModal();
  modalQuantity = 1;
}

// تحديث واجهة السلة
function updateCartUI(summary) {
  // تحديث عدادات السلة
  const badges = document.querySelectorAll('.cart-badge-count');
  badges.forEach(b => {
    b.textContent = summary.count;
    b.classList.toggle('hidden', summary.count === 0);
  });

  // تحديث محتوى السلة الجانبية
  const itemsContainer = document.getElementById('cart-items-list');
  const emptyState = document.getElementById('cart-empty-state');
  const footerEl = document.getElementById('cart-footer-summary');

  if (summary.count === 0) {
    if (itemsContainer) itemsContainer.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (footerEl) footerEl.classList.add('hidden');
  } else {
    if (emptyState) emptyState.classList.add('hidden');
    if (footerEl) footerEl.classList.remove('hidden');

    if (itemsContainer) {
      itemsContainer.innerHTML = summary.items.map(item => `
        <div class="flex gap-3 p-3.5 bg-stone-900/80 border border-stone-800 rounded-2xl items-center justify-between">
          <img src="${item.image}" alt="${item.name_ar}" class="w-16 h-16 rounded-xl object-cover border border-stone-700">
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-white truncate">${item.name_ar}</h4>
            ${item.dough ? `<span class="text-[11px] text-amber-400/90 block truncate">🍞 ${item.dough}</span>` : ''}
            ${item.addons && item.addons.length > 0 ? `<span class="text-[11px] text-stone-400 block truncate">➕ ${item.addons.map(a=>a.name_ar).join('، ')}</span>` : ''}
            ${item.notes ? `<span class="text-[11px] text-stone-400 block truncate">📝 ${item.notes}</span>` : ''}
            <div class="text-xs font-black text-amber-400 mt-1">
              ${(item.unitPrice * item.quantity).toFixed(3)} د.ك
              <span class="text-[10px] text-stone-500 font-normal">(${item.unitPrice.toFixed(3)} للقطعة)</span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-2">
            <button onclick="cart.removeItem('${item.cartKey}')" class="text-stone-500 hover:text-red-400 transition p-1">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
            <div class="flex items-center bg-stone-800 rounded-lg border border-stone-700">
              <button onclick="cart.updateQuantity('${item.cartKey}', ${item.quantity - 1})" class="w-6 h-6 flex items-center justify-center text-stone-300 hover:bg-stone-700 rounded-r font-bold text-sm">-</button>
              <span class="w-6 text-center text-xs font-bold text-white">${item.quantity}</span>
              <button onclick="cart.updateQuantity('${item.cartKey}', ${item.quantity + 1})" class="w-6 h-6 flex items-center justify-center text-amber-400 hover:bg-stone-700 rounded-l font-bold text-sm">+</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // تحديث القيم الرقمية
  const subtotalEl = document.getElementById('cart-subtotal');
  const deliveryEl = document.getElementById('cart-delivery');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');

  if (subtotalEl) subtotalEl.textContent = summary.formattedSubtotal;
  if (deliveryEl) deliveryEl.textContent = summary.formattedDelivery;
  if (totalEl) totalEl.textContent = summary.formattedTotal;

  if (discountRow && discountEl) {
    if (summary.discount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `-${summary.formattedDiscount}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  initLucide();
}

// فتح وإغلاق درج السلة
function toggleCartDrawer(open) {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer || !backdrop) return;

  if (open) {
    drawer.classList.remove('translate-x-full');
    backdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.add('translate-x-full');
    backdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// تطبيق الكوبون
function applyCouponCode() {
  const input = document.getElementById('coupon-input');
  if (!input) return;

  const result = cart.applyCoupon(input.value);
  showToast(result.message_ar, result.success ? 'success' : 'error');
  if (result.success) {
    input.value = '';
  }
}

// إعداد محافظات ومناطق الكويت
function setupKuwaitGovernorates() {
  const govSelect = document.getElementById('checkout-governorate');
  const areaSelect = document.getElementById('checkout-area');
  if (!govSelect || !areaSelect) return;

  govSelect.innerHTML = `<option value="">-- اختر المحافظة --</option>` + 
    KUWAIT_GOVERNORATES.map(gov => `<option value="${gov.id}">${gov.name_ar}</option>`).join('');

  govSelect.addEventListener('change', () => {
    const selectedGovId = govSelect.value;
    const gov = KUWAIT_GOVERNORATES.find(g => g.id === selectedGovId);

    if (gov) {
      areaSelect.innerHTML = `<option value="">-- اختر المنطقة في ${gov.name_ar} --</option>` +
        gov.areas.map(area => `<option value="${area}">${area}</option>`).join('');
      areaSelect.disabled = false;
      cart.setArea(gov.areas[0], gov.delivery_fee);
      
      const feeNotice = document.getElementById('delivery-fee-notice');
      if (feeNotice) {
        feeNotice.innerHTML = `رسوم التوصيل لـ ${gov.name_ar}: <span class="text-amber-400 font-bold">${gov.delivery_fee.toFixed(3)} د.ك</span> (المدة المتوقعة: ${gov.delivery_time})`;
      }
    } else {
      areaSelect.innerHTML = `<option value="">-- اختر المحافظة أولاً --</option>`;
      areaSelect.disabled = true;
    }
  });

  areaSelect.addEventListener('change', () => {
    const gov = KUWAIT_GOVERNORATES.find(g => g.id === govSelect.value);
    if (gov && areaSelect.value) {
      cart.setArea(areaSelect.value, gov.delivery_fee);
    }
  });
}

// فتح نافذة إتمام الطلب (Checkout Modal)
function openCheckoutModal() {
  if (cart.items.length === 0) {
    showToast('سلتك فارغة! أضف بعض الفطاير اللذيذة أولاً.', 'error');
    return;
  }
  toggleCartDrawer(false);
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
}

function setDeliveryTab(type) {
  cart.setDeliveryType(type);
  const deliveryFields = document.getElementById('delivery-address-fields');
  const pickupFields = document.getElementById('pickup-branch-fields');
  const deliveryTab = document.getElementById('tab-delivery');
  const pickupTab = document.getElementById('tab-pickup');

  if (type === 'delivery') {
    deliveryFields?.classList.remove('hidden');
    pickupFields?.classList.add('hidden');
    deliveryTab?.classList.add('bg-amber-500', 'text-stone-950');
    deliveryTab?.classList.remove('bg-stone-800', 'text-stone-300');
    pickupTab?.classList.remove('bg-amber-500', 'text-stone-950');
    pickupTab?.classList.add('bg-stone-800', 'text-stone-300');
  } else {
    deliveryFields?.classList.add('hidden');
    pickupFields?.classList.remove('hidden');
    pickupTab?.classList.add('bg-amber-500', 'text-stone-950');
    pickupTab?.classList.remove('bg-stone-800', 'text-stone-300');
    deliveryTab?.classList.remove('bg-amber-500', 'text-stone-950');
    deliveryTab?.classList.add('bg-stone-800', 'text-stone-300');
  }
}

// معالجة تأكيد الطلب واختيار وسيلة الدفع
function handleOrderSubmission(event) {
  event.preventDefault();

  const fullName = document.getElementById('customer-name')?.value.trim();
  const phone = document.getElementById('customer-phone')?.value.trim();

  if (!fullName || !phone) {
    showToast('يرجى كتابة الاسم ورقم الهاتف الكويتي', 'error');
    return;
  }

  // التحقق من رقم الهاتف الكويتي (8 أرقام)
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 8) {
    showToast('يرجى إدخال رقم هاتف كويتي صحيح (8 أرقام)', 'error');
    return;
  }

  const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || 'knet';

  const customerData = {
    fullName: fullName,
    phone: phone,
    governorate: document.getElementById('checkout-governorate')?.selectedOptions[0]?.text || 'محافظة العاصمة',
    area: document.getElementById('checkout-area')?.value || 'مدينة الكويت',
    block: document.getElementById('address-block')?.value || '',
    street: document.getElementById('address-street')?.value || '',
    avenue: document.getElementById('address-avenue')?.value || '',
    house: document.getElementById('address-house')?.value || '',
    apartment: document.getElementById('address-apartment')?.value || '',
    notes: document.getElementById('address-notes')?.value || '',
    branch: document.getElementById('pickup-branch-select')?.value || 'فرع السالمية'
  };

  if (paymentMethod === 'knet') {
    // فتح بوابة KNET المحاكية
    openKnetGateway(customerData);
  } else if (paymentMethod === 'whatsapp') {
    // إرسال مباشر للواتساب وحفظ الطلب
    const order = checkout.createOrderObject(customerData, 'whatsapp');
    const waUrl = `https://wa.me/${RESTAURANT_WHATSAPP}?text=${checkout.generateWhatsAppMessage(order)}`;
    cart.clearCart();
    closeCheckoutModal();
    window.open(waUrl, '_blank');
    window.location.href = `track.html?orderId=${order.id}`;
  } else {
    // كاش أو بطاقة عند الاستلام
    const order = checkout.createOrderObject(customerData, paymentMethod);
    cart.clearCart();
    closeCheckoutModal();
    showToast('تم استلام طلبك بنجاح!', 'success');
    setTimeout(() => {
      window.location.href = `track.html?orderId=${order.id}`;
    }, 1200);
  }
}

// تهيئة بنوك KNET
function setupKnetBanks() {
  const bankSelect = document.getElementById('knet-bank-select');
  if (!bankSelect) return;

  bankSelect.innerHTML = KUWAIT_BANKS.map(bank => `
    <option value="${bank.id}" data-prefix="${bank.prefix}">${bank.name_ar}</option>
  `).join('');

  bankSelect.addEventListener('change', () => {
    const selected = KUWAIT_BANKS.find(b => b.id === bankSelect.value);
    const prefixInput = document.getElementById('knet-card-prefix');
    if (prefixInput && selected) {
      prefixInput.value = selected.prefix;
    }
  });
}

let pendingKnetCustomerData = null;

function openKnetGateway(customerData) {
  pendingKnetCustomerData = customerData;
  const knetModal = document.getElementById('knet-modal');
  const knetAmountEl = document.getElementById('knet-amount');
  const knetDateEl = document.getElementById('knet-date');

  if (knetAmountEl) knetAmountEl.textContent = `${cart.getTotal().toFixed(3)} KWD`;
  if (knetDateEl) knetDateEl.textContent = new Date().toLocaleDateString('en-GB');

  if (knetModal) knetModal.classList.remove('hidden');
}

function closeKnetGateway() {
  const knetModal = document.getElementById('knet-modal');
  if (knetModal) knetModal.classList.add('hidden');
  pendingKnetCustomerData = null;
}

function processKnetPayment() {
  const cardNum = document.getElementById('knet-card-number')?.value.trim();
  const cardPin = document.getElementById('knet-card-pin')?.value.trim();

  if (!cardNum || cardNum.length < 6) {
    alert('يرجى إدخال باقي أرقام بطاقة السحب الآلي');
    return;
  }
  if (!cardPin || cardPin.length < 4) {
    alert('يرجى إدخال الرقم السري للبطاقة (PIN)');
    return;
  }

  const payBtn = document.getElementById('knet-submit-btn');
  if (payBtn) {
    payBtn.disabled = true;
    payBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      جاري الاتصال بشبكة كي نت الآمنة...
    `;
  }

  setTimeout(() => {
    const bankSelect = document.getElementById('knet-bank-select');
    const bankName = bankSelect?.selectedOptions[0]?.text || 'KNET';

    const order = checkout.createOrderObject(pendingKnetCustomerData, 'knet', {
      bank: bankName,
      lastFour: cardNum.slice(-4),
      authCode: 'KNET' + Math.floor(100000 + Math.random() * 900000)
    });

    cart.clearCart();
    closeKnetGateway();
    closeCheckoutModal();

    showToast('تم الدفع بنجاح عبر بوابة K-NET! جارٍ تحويلك لتتبع الطلب...', 'success');
    setTimeout(() => {
      window.location.href = `track.html?orderId=${order.id}`;
    }, 1500);
  }, 1800);
}

// نظام الإشعارات المنبثقة (Toast)
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-emerald-600 border-emerald-400' : 
                  type === 'error' ? 'bg-rose-600 border-rose-400' : 'bg-stone-800 border-amber-500';

  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-bold text-sm border flex items-center gap-3 transition-all duration-300 transform translate-y-10 opacity-0 ${bgClass}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// إعداد أحداث البحث والمدخلات
function setupEventListeners() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }
}
