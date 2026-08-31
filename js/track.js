// track.js - نظام التتبع المباشر للطلبات

const STATUS_CONFIG = {
  'received': {
    step: 1,
    title_ar: 'تم استلام الطلب وتأكيده',
    desc_ar: 'طلبك وصل لمطبخ فطاير الديرة وجارٍ تجهيز المكونات الطازجة.',
    badge_class: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: 'check-circle'
  },
  'baking': {
    step: 2,
    title_ar: 'في الفرن والتحضير الساخن 🔥',
    desc_ar: 'يتم الآن فرد العجين وخبز الفطاير في فرن الحجر التقليدي.',
    badge_class: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    icon: 'flame'
  },
  'on_the_way': {
    step: 3,
    title_ar: 'مع المندوب في الطريق إليك 🛵',
    desc_ar: 'المندوب استلم البوكسات الساخنة وهو في طريقه لعنوانك في الكويت.',
    badge_class: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: 'truck'
  },
  'delivered': {
    step: 4,
    title_ar: 'تم التوصيل بنجاح! بالعافية ❤️',
    desc_ar: 'تم تسليم الطلب. نتمنى لك وجبة شهية ونسعد برأيك وتقييمك.',
    badge_class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    icon: 'check-check'
  },
  'cancelled': {
    step: 0,
    title_ar: 'تم إلغاء الطلب',
    desc_ar: 'تم إلغاء هذا الطلب. يرجى التواصل مع خدمة العملاء.',
    badge_class: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    icon: 'alert-circle'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  if (orderId) {
    loadOrder(orderId);
  } else {
    // عرض أحدث طلب إذا وجد
    const all = checkout.getAllOrders();
    if (all.length > 0) {
      loadOrder(all[0].id);
    } else {
      showNoOrderState();
    }
  }
});

function searchOrder() {
  const input = document.getElementById('track-search-input');
  if (!input) return;
  const val = input.value.trim().toUpperCase();
  if (!val) return;
  loadOrder(val);
}

function loadOrder(orderId) {
  const order = checkout.getOrderById(orderId);
  const container = document.getElementById('order-track-container');
  const emptyState = document.getElementById('order-not-found');

  if (!order) {
    if (container) container.classList.add('hidden');
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (container) container.classList.remove('hidden');

  renderOrderDetails(order);
}

function renderOrderDetails(order) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG['received'];

  // تحديث النصوص العلوية
  const idEl = document.getElementById('order-id-display');
  const dateEl = document.getElementById('order-date-display');
  const statusBadge = document.getElementById('order-status-badge');
  const statusDesc = document.getElementById('order-status-desc');

  if (idEl) idEl.textContent = `#${order.id}`;
  if (dateEl) dateEl.textContent = new Date(order.createdAt).toLocaleString('ar-KW');
  if (statusBadge) {
    statusBadge.className = `px-3.5 py-1.5 rounded-full text-xs font-black border flex items-center gap-1.5 ${cfg.badge_class}`;
    statusBadge.innerHTML = `<i data-lucide="${cfg.icon}" class="w-4 h-4"></i> ${cfg.title_ar}`;
  }
  if (statusDesc) statusDesc.textContent = cfg.desc_ar;

  // تحديث شريط التقدم (Timeline Steps)
  const currentStep = cfg.step;
  const progressPercent = currentStep === 1 ? 15 : currentStep === 2 ? 45 : currentStep === 3 ? 75 : 100;
  const progressBar = document.getElementById('order-progress-bar');
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  [1, 2, 3, 4].forEach(stepNum => {
    const stepCircle = document.getElementById(`step-circle-${stepNum}`);
    const stepLabel = document.getElementById(`step-label-${stepNum}`);

    if (stepCircle && stepLabel) {
      if (stepNum <= currentStep) {
        stepCircle.className = 'w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30 transition';
        stepLabel.className = 'text-xs font-bold text-amber-400 mt-2 text-center';
      } else {
        stepCircle.className = 'w-10 h-10 rounded-2xl bg-stone-800 text-stone-500 font-bold flex items-center justify-center border border-stone-700 transition';
        stepLabel.className = 'text-xs font-medium text-stone-500 mt-2 text-center';
      }
    }
  });

  // تفاصيل العميل والعنوان
  const customerInfo = document.getElementById('order-customer-info');
  if (customerInfo) {
    customerInfo.innerHTML = `
      <div class="space-y-2 text-sm text-stone-300">
        <div class="flex items-center gap-2"><i data-lucide="user" class="w-4 h-4 text-amber-400"></i> <strong class="text-white">${order.customer.fullName}</strong></div>
        <div class="flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4 text-amber-400"></i> <span>+965 ${order.customer.phone}</span></div>
        <div class="flex items-start gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-amber-400 mt-1"></i> 
          <span>${order.deliveryType === 'delivery' ? `${order.customer.governorate} - ${order.customer.area}، ق ${order.customer.block || '-'}، ش ${order.customer.street || '-'}، م ${order.customer.house || '-'}` : order.customer.branch}</span>
        </div>
        <div class="flex items-center gap-2"><i data-lucide="credit-card" class="w-4 h-4 text-amber-400"></i> <span>طريقة الدفع: <strong class="text-amber-400">${order.paymentMethodName}</strong></span></div>
      </div>
    `;
  }

  // عناصر الطلب
  const itemsContainer = document.getElementById('order-items-summary');
  if (itemsContainer) {
    itemsContainer.innerHTML = order.items.map(item => `
      <div class="flex items-center justify-between py-2 border-b border-stone-800/60 last:border-none">
        <div class="flex items-center gap-3">
          <img src="${item.image}" alt="${item.name_ar}" class="w-12 h-12 rounded-xl object-cover border border-stone-700">
          <div>
            <h5 class="text-sm font-bold text-white">${item.name_ar} <span class="text-xs text-amber-400">×${item.quantity}</span></h5>
            ${item.dough ? `<span class="text-[11px] text-stone-400 block">🍞 ${item.dough}</span>` : ''}
            ${item.addons && item.addons.length > 0 ? `<span class="text-[11px] text-stone-400 block">➕ ${item.addons.map(a=>a.name_ar).join('، ')}</span>` : ''}
          </div>
        </div>
        <div class="text-sm font-black text-amber-400">
          ${(item.unitPrice * item.quantity).toFixed(3)} د.ك
        </div>
      </div>
    `).join('');
  }

  // الحساب المالي
  const subtotalEl = document.getElementById('summary-subtotal');
  const discountRow = document.getElementById('summary-discount-row');
  const discountEl = document.getElementById('summary-discount');
  const deliveryEl = document.getElementById('summary-delivery');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `${order.financials.subtotal.toFixed(3)} د.ك`;
  if (deliveryEl) deliveryEl.textContent = `${order.financials.deliveryFee.toFixed(3)} د.ك`;
  if (totalEl) totalEl.textContent = `${order.financials.total.toFixed(3)} د.ك`;

  if (discountRow && discountEl) {
    if (order.financials.discount > 0) {
      discountRow.classList.remove('hidden');
      discountEl.textContent = `-${order.financials.discount.toFixed(3)} د.ك`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  // رابط الدعم عبر الواتساب
  const supportBtn = document.getElementById('whatsapp-support-btn');
  if (supportBtn) {
    const waText = encodeURIComponent(`مرحباً خدمة عملاء فطاير الديرة، أستفسر بخصوص طلبي رقم #${order.id}`);
    supportBtn.href = `https://wa.me/96599887766?text=${waText}`;
  }

  // زر محاكاة تقدم الحالة (Demo Simulation)
  const advanceBtn = document.getElementById('advance-order-btn');
  if (advanceBtn) {
    advanceBtn.onclick = () => advanceOrderStatus(order.id);
  }

  if (window.lucide) window.lucide.createIcons();
}

function advanceOrderStatus(orderId) {
  const order = checkout.getOrderById(orderId);
  if (!order) return;

  const nextStatusMap = {
    'received': 'baking',
    'baking': 'on_the_way',
    'on_the_way': 'delivered',
    'delivered': 'received'
  };

  const next = nextStatusMap[order.status] || 'received';
  checkout.updateOrderStatus(orderId, next);
  loadOrder(orderId);
}

function showNoOrderState() {
  const container = document.getElementById('order-track-container');
  const emptyState = document.getElementById('order-not-found');
  if (container) container.classList.add('hidden');
  if (emptyState) emptyState.classList.remove('hidden');
}
