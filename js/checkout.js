// checkout.js - إتمام الطلب، بوابات الدفع (KNET / كاش / بطاقة) وتجهيز رسائل الواتساب

const ORDERS_STORAGE_KEY = 'kuwait_pies_orders_v1';
const RESTAURANT_WHATSAPP = '96599887766'; // رقم واتساب المطعم في الكويت

// البنوك الكويتية المدعومة في بوابة KNET
const KUWAIT_BANKS = [
  { id: 'nbk', name_ar: 'بنك الكويت الوطني (NBK)', name_en: 'National Bank of Kuwait', prefix: '5196' },
  { id: 'kfh', name_ar: 'بيت التمويل الكويتي (بيتك - KFH)', name_en: 'Kuwait Finance House', prefix: '5370' },
  { id: 'boubyan', name_ar: 'بنك بوبيان (Boubyan Bank)', name_en: 'Boubyan Bank', prefix: '5247' },
  { id: 'gulf', name_ar: 'بنك الخليج (Gulf Bank)', name_en: 'Gulf Bank', prefix: '5211' },
  { id: 'burgan', name_ar: 'بنك برقان (Burgan Bank)', name_en: 'Burgan Bank', prefix: '5285' },
  { id: 'cbk', name_ar: 'البنك التجاري الكويتي (Al-Tijari)', name_en: 'Commercial Bank of Kuwait', prefix: '5314' },
  { id: 'warba', name_ar: 'بنك وربة (Warba Bank)', name_en: 'Warba Bank', prefix: '5208' },
  { id: 'abk', name_ar: 'البنك الأهلي الكويتي (ABK)', name_en: 'Ahli Bank of Kuwait', prefix: '5120' }
];

class CheckoutManager {
  constructor() {
    this.currentOrder = null;
  }

  // توليد رقم طلب كويتي فريد
  generateOrderId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'KWT-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // حفظ الطلب في الذاكرة المحلية
  saveOrder(order) {
    try {
      const orders = this.getAllOrders();
      orders.unshift(order);
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to save order:", e);
    }
  }

  getAllOrders() {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  getOrderById(id) {
    const orders = this.getAllOrders();
    return orders.find(o => o.id === id) || null;
  }

  updateOrderStatus(orderId, newStatus) {
    const orders = this.getAllOrders();
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index].status = newStatus;
      orders[index].timeline.push({
        status: newStatus,
        time: new Date().toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toISOString()
      });
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      return orders[index];
    }
    return null;
  }

  // إنشاء وتنسيق رسالة الواتساب الكويتية الفاخرة
  generateWhatsAppMessage(order) {
    const itemsList = order.items.map((item, idx) => {
      let itemStr = `${idx + 1}. *${item.name_ar}* × ${item.quantity}`;
      if (item.dough) itemStr += `\n   🍞 العجينة: ${item.dough}`;
      if (item.addons && item.addons.length > 0) {
        itemStr += `\n   ➕ الإضافات: ${item.addons.map(a => a.name_ar).join('، ')}`;
      }
      if (item.notes) itemStr += `\n   📝 ملاحظات: ${item.notes}`;
      itemStr += `\n   💰 السعر: ${(item.unitPrice * item.quantity).toFixed(3)} د.ك`;
      return itemStr;
    }).join('\n\n');

    let addressStr = '';
    if (order.deliveryType === 'delivery') {
      addressStr = `📍 *عنوان التوصيل (الكويت):*
• المحافظة: ${order.customer.governorate}
• المنطقة: ${order.customer.area}
• القطعة: ${order.customer.block || '-'}
• الشارع: ${order.customer.street || '-'}
• الجادة: ${order.customer.avenue || '-'}
• المنزل/المبنى: ${order.customer.house || '-'}
• الدور / الشقة: ${order.customer.apartment || '-'}
• ملاحظات العنوان: ${order.customer.addressNotes || 'لا توجد'}`;
    } else {
      addressStr = `🏪 *نوع الطلب:* استلام من فرع الديرة (السالمية / الشارع الرئيسي)`;
    }

    const message = `✨ *طلب جديد من متجر فطاير ومعجنات الديرة* 🇰🇼
----------------------------------------
🔢 *رقم الطلب:* #${order.id}
📅 *التاريخ:* ${new Date(order.createdAt).toLocaleString('ar-KW')}
👤 *اسم العميل:* ${order.customer.fullName}
📱 *رقم الهاتف:* +965 ${order.customer.phone}

🛒 *تفاصيل الطلبات:*
${itemsList}

----------------------------------------
💵 *الملخص المالي:*
• المجموع الفرعي: ${order.financials.subtotal.toFixed(3)} د.ك
${order.financials.discount > 0 ? `• الخصم (${order.financials.couponCode || 'كوبون'}): -${order.financials.discount.toFixed(3)} د.ك\n` : ''}• رسوم التوصيل: ${order.financials.deliveryFee.toFixed(3)} د.ك
⭐ *الإجمالي النهائي: ${order.financials.total.toFixed(3)} د.ك*
💳 *طريقة الدفع:* ${order.paymentMethodName}
----------------------------------------
🔗 *رابط تتبع الطلب المباشر:*
${window.location.origin}${window.location.pathname.replace('index.html', '')}track.html?orderId=${order.id}

شكراً لاختياركم فطاير الديرة! ❤️🇰🇼`;

    return encodeURIComponent(message);
  }

  // إنشاء كائن الطلب من السلة ومدخلات النموذج
  createOrderObject(customerData, paymentMethod, paymentDetails = {}) {
    const summary = cart.getSummary();
    const orderId = this.generateOrderId();

    const paymentNames = {
      'knet': 'دفع إلكتروني (كي نت KNET)',
      'card': 'بطاقة بنكية (فيزا / ماستركارد)',
      'cash': 'دفع نقدي عند الاستلام (Cash on Delivery)',
      'whatsapp': 'طلب مباشر وتأكيد عبر الواتساب'
    };

    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: 'received', // received, baking, on_the_way, delivered, cancelled
      deliveryType: cart.deliveryType,
      customer: {
        fullName: customerData.fullName,
        phone: customerData.phone,
        governorate: customerData.governorate || 'العاصمة',
        area: customerData.area || cart.selectedArea || 'مدينة الكويت',
        block: customerData.block || '',
        street: customerData.street || '',
        avenue: customerData.avenue || '',
        house: customerData.house || '',
        apartment: customerData.apartment || '',
        addressNotes: customerData.notes || '',
        branch: customerData.branch || 'فرع السالمية'
      },
      payment: {
        method: paymentMethod,
        name: paymentNames[paymentMethod] || paymentMethod,
        status: paymentMethod === 'cash' || paymentMethod === 'whatsapp' ? 'pending' : 'paid',
        details: paymentDetails,
        transactionId: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
        paidAt: (paymentMethod === 'knet' || paymentMethod === 'card') ? new Date().toISOString() : null
      },
      paymentMethodName: paymentNames[paymentMethod] || paymentMethod,
      financials: {
        subtotal: summary.subtotal,
        discount: summary.discount,
        couponCode: summary.coupon ? summary.coupon.code : null,
        deliveryFee: summary.deliveryFee,
        total: summary.total
      },
      items: [...cart.items],
      timeline: [
        {
          status: 'received',
          label_ar: 'تم استلام الطلب وتأكيده بنجاح',
          time: new Date().toLocaleTimeString('ar-KW', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toISOString()
        }
      ]
    };

    this.saveOrder(order);
    this.currentOrder = order;
    return order;
  }
}

const checkout = new CheckoutManager();
window.checkout = checkout;
