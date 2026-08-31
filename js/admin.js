// admin.js - لوحة تحكم إدارة الطلبات والمطبخ وقائمة الطعام

let adminFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  
  // إذا لم تكن هناك أي طلبات، ننشئ عينات طلبات افتراضية لأهل الكويت
  seedSampleOrdersIfEmpty();

  renderAdminStats();
  renderAdminOrders();
  renderAdminProducts();
});

function seedSampleOrdersIfEmpty() {
  const orders = checkout.getAllOrders();
  if (orders.length === 0) {
    const sample1 = {
      id: 'KWT-882A1',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'baking',
      deliveryType: 'delivery',
      customer: {
        fullName: 'عبد الله العتيبي',
        phone: '99112233',
        governorate: 'محافظة حولي',
        area: 'السالمية',
        block: '4',
        street: 'شارع سالم المبارك',
        avenue: '3',
        house: '12',
        apartment: 'شقة 4B',
        addressNotes: 'مقابل مجمع الفنار'
      },
      payment: { method: 'knet', name: 'كي نت KNET', status: 'paid' },
      paymentMethodName: 'دفع إلكتروني (كي نت KNET)',
      financials: {
        subtotal: 10.450,
        discount: 1.045,
        couponCode: 'KUWAIT10',
        deliveryFee: 1.000,
        total: 10.405
      },
      items: [
        { name_ar: 'بوكس الديرة الملكي (50 حبة ميني مشكل)', unitPrice: 8.500, quantity: 1, dough: 'تشكيلة كاملة كلاسيك', image: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80' },
        { name_ar: 'فطيرة جبنة عكاوي بلدية', unitPrice: 0.950, quantity: 2, dough: 'عجينة كلاسيكية', image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80' }
      ],
      timeline: []
    };

    const sample2 = {
      id: 'KWT-349C9',
      createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      status: 'on_the_way',
      deliveryType: 'delivery',
      customer: {
        fullName: 'فاطمة الكندري',
        phone: '66554433',
        governorate: 'محافظة العاصمة',
        area: 'ضاحية عبد الله السالم',
        block: '2',
        street: 'شارع نصف اليوسف',
        avenue: '',
        house: '18',
        apartment: '',
        addressNotes: 'بجانب الجمعية الرئيسية'
      },
      payment: { method: 'whatsapp', name: 'طلب واتساب', status: 'pending' },
      paymentMethodName: 'طلب مباشر وتأكيد عبر الواتساب',
      financials: {
        subtotal: 5.650,
        discount: 0,
        deliveryFee: 1.000,
        total: 6.650
      },
      items: [
        { name_ar: 'بيتزا دجاج رانش باربيكيو', unitPrice: 2.850, quantity: 1, dough: 'عجينة رقيقة', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80' },
        { name_ar: 'منقوشة محمرة بالقشقوان والجوز', unitPrice: 1.200, quantity: 2, dough: 'عجينة صاج رقيقة', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80' },
        { name_ar: 'عصير برتقال فريش طازج (500 مل)', unitPrice: 0.950, quantity: 1, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80' }
      ],
      timeline: []
    };

    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([sample1, sample2]));
  }
}

function renderAdminStats() {
  const orders = checkout.getAllOrders();
  const totalSales = orders.reduce((sum, o) => sum + (o.financials.total || 0), 0);
  const activeOrders = orders.filter(o => o.status === 'received' || o.status === 'baking' || o.status === 'on_the_way');
  const deliveredOrders = orders.filter(o => o.status === 'delivered');

  const salesEl = document.getElementById('stat-total-sales');
  const totalOrdersEl = document.getElementById('stat-total-orders');
  const activeOrdersEl = document.getElementById('stat-active-orders');
  const deliveredOrdersEl = document.getElementById('stat-delivered-orders');

  if (salesEl) salesEl.textContent = `${totalSales.toFixed(3)} د.ك`;
  if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
  if (activeOrdersEl) activeOrdersEl.textContent = activeOrders.length;
  if (deliveredOrdersEl) deliveredOrdersEl.textContent = deliveredOrders.length;
}

function setAdminFilter(filter) {
  adminFilter = filter;
  document.querySelectorAll('.admin-filter-btn').forEach(btn => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('bg-amber-500', 'text-stone-950');
      btn.classList.remove('bg-stone-800', 'text-stone-400');
    } else {
      btn.classList.remove('bg-amber-500', 'text-stone-950');
      btn.classList.add('bg-stone-800', 'text-stone-400');
    }
  });
  renderAdminOrders();
}

function renderAdminOrders() {
  const container = document.getElementById('admin-orders-list');
  if (!container) return;

  let orders = checkout.getAllOrders();

  if (adminFilter !== 'all') {
    orders = orders.filter(o => o.status === adminFilter);
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="p-12 text-center text-stone-500">
        <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-2 text-stone-600"></i>
        <p>لا توجد طلبات في هذا القسم حالياً</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const statusBadges = {
    'received': '<span class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold">جديد (تم الاستلام)</span>',
    'baking': '<span class="px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold animate-pulse">🔥 في الفرن والتحضير</span>',
    'on_the_way': '<span class="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold">🛵 خرج للتوصيل</span>',
    'delivered': '<span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold">✓ تم التسليم</span>',
    'cancelled': '<span class="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold">ملغي</span>'
  };

  container.innerHTML = orders.map(order => `
    <div class="bg-stone-900 border border-stone-800 rounded-3xl p-6 hover:border-stone-700 transition">
      <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <div class="flex items-center gap-3">
            <span class="text-xl font-black text-amber-400">#${order.id}</span>
            ${statusBadges[order.status] || ''}
            <span class="text-xs text-stone-500">${new Date(order.createdAt).toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p class="text-sm font-bold text-white mt-1">👤 ${order.customer.fullName} - 📱 +965 ${order.customer.phone}</p>
          <p class="text-xs text-stone-400">📍 ${order.deliveryType === 'delivery' ? `${order.customer.governorate}، ${order.customer.area} (ق ${order.customer.block || '-'} ش ${order.customer.street || '-'})` : 'استلام من الفرع'}</p>
        </div>

        <div class="text-left">
          <div class="text-xl font-black text-white">${order.financials.total.toFixed(3)} <span class="text-xs text-amber-400">د.ك</span></div>
          <span class="text-xs text-stone-400 block">${order.paymentMethodName}</span>
        </div>
      </div>

      <!-- عناصر الطلب -->
      <div class="py-4 space-y-2">
        ${order.items.map(item => `
          <div class="flex items-center justify-between text-sm">
            <span class="text-stone-300">
              <strong class="text-amber-400">${item.quantity}×</strong> ${item.name_ar}
              ${item.dough ? `<span class="text-xs text-stone-500">(${item.dough})</span>` : ''}
            </span>
            <span class="text-xs text-stone-400">${(item.unitPrice * item.quantity).toFixed(3)} د.ك</span>
          </div>
        `).join('')}
      </div>

      <!-- أزرار تحديث الحالة للفرن والمطبخ -->
      <div class="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <button onclick="updateStatus('${order.id}', 'baking')" class="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/40 transition">
            🔥 تحضير بالفرن
          </button>
          <button onclick="updateStatus('${order.id}', 'on_the_way')" class="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500 hover:text-white text-purple-400 text-xs font-bold rounded-xl border border-purple-500/40 transition">
            🛵 تسليم للمندوب
          </button>
          <button onclick="updateStatus('${order.id}', 'delivered')" class="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/40 transition">
            ✓ تم التسليم
          </button>
        </div>

        <div class="flex items-center gap-2">
          <a href="track.html?orderId=${order.id}" target="_blank" class="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold rounded-xl transition flex items-center gap-1">
            <i data-lucide="external-link" class="w-3.5 h-3.5"></i> تتبع
          </a>
          <a href="https://wa.me/965${order.customer.phone}?text=${encodeURIComponent(`مرحباً أستاذ ${order.customer.fullName}، بخصوص طلبك من فطاير الديرة رقم #${order.id}`)}" target="_blank" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i> واتساب العميل
          </a>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function updateStatus(orderId, newStatus) {
  checkout.updateOrderStatus(orderId, newStatus);
  renderAdminStats();
  renderAdminOrders();
}

function renderAdminProducts() {
  const container = document.getElementById('admin-products-table');
  if (!container) return;

  container.innerHTML = PRODUCTS_DATA.map(p => `
    <tr class="border-b border-stone-800/80 hover:bg-stone-800/40 transition">
      <td class="p-4 flex items-center gap-3">
        <img src="${p.image}" class="w-10 h-10 rounded-xl object-cover">
        <div>
          <div class="font-bold text-white text-sm">${p.name_ar}</div>
          <div class="text-xs text-stone-400">${p.category}</div>
        </div>
      </td>
      <td class="p-4 font-black text-amber-400">${p.price.toFixed(3)} د.ك</td>
      <td class="p-4">
        <span class="px-2.5 py-1 rounded-full text-xs font-bold ${p.badge ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-stone-500'}">
          ${p.badge || 'عادي'}
        </span>
      </td>
      <td class="p-4">
        <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          متوفر وجاهز للخبز
        </span>
      </td>
    </tr>
  `).join('');
}
