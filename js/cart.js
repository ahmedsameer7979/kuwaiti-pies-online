// cart.js - نظام سلة التسوق، الخصومات وحساب الرسوم بالدينار الكويتي

const CART_STORAGE_KEY = 'kuwait_pies_cart_v1';
const COUPON_STORAGE_KEY = 'kuwait_pies_applied_coupon';

// كوبونات الخصم المعتمدة
const AVAILABLE_COUPONS = {
  'KUWAIT10': { type: 'percent', value: 10, label_ar: 'خصم 10% بمناسبة الافتتاح', label_en: '10% Launch Discount' },
  'DEERAH': { type: 'percent', value: 15, label_ar: 'خصم 15% لأهل الديرة', label_en: '15% Al-Deerah Discount' },
  'FREE': { type: 'free_delivery', value: 0, label_ar: 'توصيل مجاني لجميع مناطق الكويت', label_en: 'Free Delivery Across Kuwait' },
  'DIWANIYA': { type: 'fixed', value: 1.000, min_order: 6.000, label_ar: 'خصم 1 د.ك لطلبات الديوانية (أكثر من 6 د.ك)', label_en: '1.000 KWD Off Diwaniya Orders' }
};

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.appliedCoupon = this.loadCoupon();
    this.deliveryFee = 1.000; // الافتراضي
    this.deliveryType = 'delivery'; // 'delivery' or 'pickup'
    this.selectedArea = null;
    this.listeners = [];
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
      this.notifyListeners();
    } catch (e) {
      console.error("Cart save error:", e);
    }
  }

  loadCoupon() {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  saveCoupon() {
    try {
      if (this.appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(this.appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
      this.notifyListeners();
    } catch (e) {
      console.error("Coupon save error:", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.getSummary());
  }

  notifyListeners() {
    const summary = this.getSummary();
    this.listeners.forEach(cb => {
      try { cb(summary); } catch(err) { console.error(err); }
    });
  }

  // إضافة منتج مع التخصيصات
  addItem(product, quantity = 1, selectedDough = null, selectedAddons = [], specialNotes = '') {
    const addonsCost = selectedAddons.reduce((sum, a) => sum + (a.price || 0), 0);
    const unitPrice = (product.price || 0) + addonsCost;
    
    // إنشاء مفتاح فريد للتوليفة
    const addonKeys = selectedAddons.map(a => a.name_ar).sort().join('|');
    const itemKey = `${product.id}__${selectedDough || 'default'}__${addonKeys}__${specialNotes.trim()}`;

    const existingIndex = this.items.findIndex(item => item.cartKey === itemKey);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        cartKey: itemKey,
        productId: product.id,
        name_ar: product.name_ar,
        name_en: product.name_en,
        basePrice: product.price,
        unitPrice: unitPrice,
        image: product.image,
        quantity: quantity,
        dough: selectedDough,
        addons: selectedAddons,
        notes: specialNotes.trim()
      });
    }

    this.saveCart();
  }

  updateQuantity(cartKey, newQuantity) {
    const index = this.items.findIndex(item => item.cartKey === cartKey);
    if (index > -1) {
      if (newQuantity <= 0) {
        this.items.splice(index, 1);
      } else {
        this.items[index].quantity = newQuantity;
      }
      this.saveCart();
    }
  }

  removeItem(cartKey) {
    this.items = this.items.filter(item => item.cartKey !== cartKey);
    this.saveCart();
  }

  clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    this.saveCoupon();
    this.saveCart();
  }

  setDeliveryType(type) {
    this.deliveryType = type; // 'delivery' or 'pickup'
    this.saveCart();
  }

  setArea(areaName, fee = 1.000) {
    this.selectedArea = areaName;
    this.deliveryFee = fee;
    this.saveCart();
  }

  applyCoupon(code) {
    const cleanCode = code ? code.trim().toUpperCase() : '';
    if (!cleanCode) {
      return { success: false, message_ar: 'يرجى إدخال رمز الكوبون', message_en: 'Please enter a coupon code' };
    }

    const coupon = AVAILABLE_COUPONS[cleanCode];
    if (!coupon) {
      return { success: false, message_ar: 'كوبون الخصم غير صحيح أو منتهي الصلاحية', message_en: 'Invalid or expired coupon' };
    }

    const subtotal = this.getSubtotal();
    if (coupon.min_order && subtotal < coupon.min_order) {
      return { 
        success: false, 
        message_ar: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.min_order.toFixed(3)} د.ك`, 
        message_en: `Minimum order for this coupon is ${coupon.min_order.toFixed(3)} KWD` 
      };
    }

    this.appliedCoupon = { code: cleanCode, ...coupon };
    this.saveCoupon();
    return { 
      success: true, 
      message_ar: `تم تفعيل الكوبون: ${coupon.label_ar}`, 
      message_en: `Coupon activated: ${coupon.label_en}` 
    };
  }

  removeCoupon() {
    this.appliedCoupon = null;
    this.saveCoupon();
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  getTotalCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  getDiscount() {
    if (!this.appliedCoupon) return 0;
    const subtotal = this.getSubtotal();
    if (this.appliedCoupon.type === 'percent') {
      return subtotal * (this.appliedCoupon.value / 100);
    }
    if (this.appliedCoupon.type === 'fixed') {
      return Math.min(this.appliedCoupon.value, subtotal);
    }
    return 0;
  }

  getEffectiveDeliveryFee() {
    if (this.deliveryType === 'pickup') return 0;
    if (this.appliedCoupon && this.appliedCoupon.type === 'free_delivery') return 0;
    return this.deliveryFee;
  }

  getTotal() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const delivery = this.getEffectiveDeliveryFee();
    const total = subtotal - discount + delivery;
    return Math.max(0, total);
  }

  getSummary() {
    const subtotal = this.getSubtotal();
    const discount = this.getDiscount();
    const delivery = this.getEffectiveDeliveryFee();
    const total = this.getTotal();
    const count = this.getTotalCount();

    return {
      items: this.items,
      count: count,
      subtotal: subtotal,
      discount: discount,
      deliveryFee: delivery,
      rawDeliveryFee: this.deliveryFee,
      deliveryType: this.deliveryType,
      selectedArea: this.selectedArea,
      coupon: this.appliedCoupon,
      total: total,
      formattedSubtotal: `${subtotal.toFixed(3)} د.ك`,
      formattedDiscount: `${discount.toFixed(3)} د.ك`,
      formattedDelivery: delivery === 0 ? (this.deliveryType === 'pickup' ? 'استلام من الفرع مجاناً' : 'توصيل مجاني') : `${delivery.toFixed(3)} د.ك`,
      formattedTotal: `${total.toFixed(3)} د.ك`
    };
  }
}

// إنشاء نسخة عامة للسلة
const cart = new CartManager();
window.cart = cart;
