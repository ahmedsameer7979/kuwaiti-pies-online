// products.js - قائمة منتجات فطاير ومعجنات الديرة الكويتية

const CATEGORIES = [
  { id: "all", name_ar: "الكل", name_en: "All", icon: "sparkles" },
  { id: "pies", name_ar: "فطاير كلاسيكية", name_en: "Classic Pies", icon: "pie" },
  { id: "manakeesh", name_ar: "مناقيش وصاج", name_en: "Manakeesh & Saj", icon: "flame" },
  { id: "mini_boxes", name_ar: "بوكسات الجمعات والميني", name_en: "Party Boxes & Mini", icon: "box" },
  { id: "pizzas", name_ar: "بيتزا ومعجنات إيطالية", name_en: "Pizzas & Calzones", icon: "pizza" },
  { id: "sweets", name_ar: "حلويات وفطائر حلوة", name_en: "Sweet Pies & Desserts", icon: "heart" },
  { id: "beverages", name_ar: "مشروبات وعصائر", name_en: "Beverages", icon: "coffee" }
];

const PRODUCTS_DATA = [
  // --- فطاير كلاسيكية ---
  {
    id: "pie-akkawi",
    category: "pies",
    name_ar: "فطيرة جبنة عكاوي بلدية",
    name_en: "Traditional Akkawi Cheese Pie",
    description_ar: "جبنة عكاوي بلدية منقوعة وموزونة النكهة ومخبوزة في فرن الحجر مع رشة حبة بركة وسمسم.",
    description_en: "Authentic desalted Akkawi cheese baked to golden perfection with nigella seeds and sesame.",
    price: 0.850,
    calories: 320,
    badge: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة حب بر (أسمر)", "عجينة مقرمشة"],
    addons: [
      { name_ar: "جبنة إضافية", name_en: "Extra Cheese", price: 0.300 },
      { name_ar: "شرائح زيتون أسود", name_en: "Black Olives", price: 0.150 },
      { name_ar: "شطة حارة خاصة", name_en: "Special Hot Sauce", price: 0.100 }
    ]
  },
  {
    id: "pie-kashkaval",
    category: "pies",
    name_ar: "فطيرة جبن قشقوان فاخر",
    name_en: "Kashkaval Cheese Pie",
    description_ar: "جبنة قشقوان بلغارية فاخرة تذوب في الفم مع ملمس غني ومقرمش من أطراف العجين.",
    description_en: "Premium melting Bulgarian Kashkaval cheese on a crispy golden stone-baked crust.",
    price: 0.950,
    calories: 340,
    badge: "مميز",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة حب بر (أسمر)"],
    addons: [
      { name_ar: "جبنة قشقوان مضاعفة", name_en: "Double Kashkaval", price: 0.350 },
      { name_ar: "سمسم وحبة البركة", name_en: "Sesame & Nigella", price: 0.100 }
    ]
  },
  {
    id: "pie-zaatar",
    category: "pies",
    name_ar: "فطيرة زعتر بلدي بالزيت البكر",
    name_en: "Wild Thyme & Olive Oil Pie (Zaatar)",
    description_ar: "خلطة زعتر بلدي فاخر مع زيت زيتون فلسطيني بكر معصور على البارد وسمسم محمص.",
    description_en: "Premium wild zaatar blend infused with cold-pressed virgin olive oil and toasted sesame.",
    price: 0.600,
    calories: 280,
    badge: "نباتي",
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة حب بر (أسمر)"],
    addons: [
      { name_ar: "إضافة جبنة عكاوي (زعتر وجبن)", name_en: "Add Akkawi Cheese", price: 0.350 },
      { name_ar: "قطع طماطم ونعناع فريش", name_en: "Fresh Tomato & Mint", price: 0.150 }
    ]
  },
  {
    id: "pie-meat",
    category: "pies",
    name_ar: "صفيحة لحم بلدي طازج",
    name_en: "Fresh Local Minced Meat Pie (Lahm Bi Ajeen)",
    description_ar: "لحم عجل وغنم بلدي طازج مفروم مع تتبيلة البصل، الطماطم، دبس الرمان، والبهارات الكويتية الخاصة.",
    description_en: "Fresh premium minced lamb & beef seasoned with tomatoes, onions, pomegranate molasses and spices.",
    price: 1.100,
    calories: 360,
    badge: "شيف الديرة",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية رقيقة", "عجينة حب بر"],
    addons: [
      { name_ar: "جبنة موزاريلا مذابة على الوجه", name_en: "Melted Mozzarella on top", price: 0.350 },
      { name_ar: "دبس رمان إضافي", name_en: "Extra Pomegranate Molasses", price: 0.150 },
      { name_ar: "ليمون وشطة", name_en: "Lemon & Chili", price: 0.100 }
    ]
  },
  {
    id: "pie-spinach",
    category: "pies",
    name_ar: "مثلثات سبانخ بلدية بالرمان",
    name_en: "Spinach Triangles with Pomegranate & Sumac",
    description_ar: "سبانخ طازجة مفرومة ومتبلة بالسماق البلدي، عصير الليمون، زيت الزيتون، وبذور الرمان المقرمشة.",
    description_en: "Fresh baby spinach seasoned with tangy sumac, fresh lemon juice, virgin olive oil, and pomegranate.",
    price: 0.750,
    calories: 240,
    badge: "صحي",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة بر كامل"],
    addons: [
      { name_ar: "دبس رمان مركز", name_en: "Pomegranate Glaze", price: 0.150 },
      { name_ar: "صنوبر محمص", name_en: "Toasted Pine Nuts", price: 0.300 }
    ]
  },
  {
    id: "pie-labneh-honey",
    category: "pies",
    name_ar: "فطيرة لبنة تركية بالزيتون والعسل",
    name_en: "Creamy Turkish Labneh with Honey & Olives",
    description_ar: "لبنة تركية كريمية حامضة مع شرائح الزيتون، رشة زعتر ولمسة عسل سدر طبيعي.",
    description_en: "Creamy Turkish labneh with sliced Kalamata olives, thyme, and a drizzle of natural Sidr honey.",
    price: 0.900,
    calories: 290,
    badge: "جديد",
    image: "https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة حب بر"],
    addons: [
      { name_ar: "عسل سدر إضافي", name_en: "Extra Sidr Honey", price: 0.250 },
      { name_ar: "قطع طماطم وخيار", name_en: "Sliced Veggies", price: 0.150 }
    ]
  },
  {
    id: "pie-falafel",
    category: "pies",
    name_ar: "فطيرة فلافل مقرمشة باللبنة والطحينة",
    name_en: "Crispy Falafel Pie with Labneh & Tahini",
    description_ar: "فلافل ذهبية مقرمشة مطحونة داخل الفطيرة مع اللبنة، المخلل، الطماطم، وصلصة الطحينة الخاصة.",
    description_en: "Golden crispy falafel layered with creamy labneh, pickled cucumbers, tomatoes, and sesame tahini sauce.",
    price: 0.850,
    calories: 350,
    badge: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة سمراء"],
    addons: [
      { name_ar: "جبنة موزاريلا", name_en: "Mozzarella Cheese", price: 0.300 },
      { name_ar: "شطة دقوس كويتية", name_en: "Kuwaiti Spicy Daqoos", price: 0.150 }
    ]
  },
  {
    id: "pie-halloumi",
    category: "pies",
    name_ar: "فطيرة حلوم مشوي مع بيستو الريحان",
    name_en: "Grilled Halloumi with Basil Pesto",
    description_ar: "جبنة حلوم قبرصية مشوية مع صوص البيستو الإيطالي، شرائح الطماطم المجففة والجرجير.",
    description_en: "Grilled Cyprus Halloumi cheese paired with rich basil pesto, sun-dried tomatoes, and fresh rocket.",
    price: 1.150,
    calories: 380,
    badge: "فاخر",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة حب بر"],
    addons: [
      { name_ar: "طماطم مجففة إضافية", name_en: "Extra Sun-dried Tomatoes", price: 0.250 },
      { name_ar: "صوص بلسمك معتق", name_en: "Aged Balsamic Glaze", price: 0.150 }
    ]
  },

  // --- مناقيش وصاج ---
  {
    id: "manousheh-muhammara",
    category: "manakeesh",
    name_ar: "منقوشة محمرة بالقشقوان والجوز",
    name_en: "Muhammara & Kashkaval with Walnuts",
    description_ar: "صلصة المحمرة الحلبية بالفليفلة الحمراء المشوية، زيت الزيتون، عين الجمل، وجبنة القشقوان الذائبة.",
    description_en: "Roasted red pepper muhammara spread with crushed walnuts and melted Kashkaval cheese on hot saj.",
    price: 1.200,
    calories: 390,
    badge: "حار ولذيذ",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة صاج رقيقة", "عجينة طابون سميكة"],
    addons: [
      { name_ar: "عين جمل محمص إضافي", name_en: "Extra Roasted Walnuts", price: 0.250 },
      { name_ar: "جبن عكاوي مخلوط", name_en: "Mixed Akkawi Cheese", price: 0.350 }
    ]
  },
  {
    id: "manousheh-kiri-honey",
    category: "manakeesh",
    name_ar: "منقوشة جبنة كيري بالعسل والسمسم",
    name_en: "Kiri Cream Cheese with Honey & Sesame",
    description_ar: "طبقة غنية من جبن كيري الفرنسي الكريمي مغطاة بعسل السدر الطبيعي وحبات السمسم المحمصة.",
    description_en: "Velvety Kiri cream cheese baked and drizzled with pure golden honey and toasted sesame.",
    price: 1.100,
    calories: 370,
    badge: "مفضل الجمعات",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة صاج رقيقة", "عجينة كلاسيكية"],
    addons: [
      { name_ar: "عسل إضافي", name_en: "Extra Honey", price: 0.200 },
      { name_ar: "حبة البركة", name_en: "Black Seeds", price: 0.100 }
    ]
  },
  {
    id: "manousheh-meat-cheese",
    category: "manakeesh",
    name_ar: "منقوشة لحم بعجين بالجبنة الموزاريلا",
    name_en: "Meat Lahmacun with Melted Mozzarella",
    description_ar: "خلطة لحم مفروم بالبندورة والبصل والبهارات مع طبقة سخية من جبن الموزاريلا والقشقوان.",
    description_en: "Spiced minced meat topped with a molten layer of premium mozzarella and kashkaval cheese.",
    price: 1.350,
    calories: 430,
    badge: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية", "عجينة صاج رقيقة"],
    addons: [
      { name_ar: "فلفل حار هلابينو", name_en: "Jalapeño Peppers", price: 0.150 },
      { name_ar: "دبس رمان", name_en: "Pomegranate Molasses", price: 0.150 }
    ]
  },

  // --- بوكسات الجمعات والديوانية والميني ---
  {
    id: "box-royal-50",
    category: "mini_boxes",
    name_ar: "بوكس الديرة الملكي (50 حبة ميني مشكل)",
    name_en: "Al-Deerah Royal Box (50 Mixed Mini Pieces)",
    description_ar: "البوكس الأنسب للديوانيات والمناسبات: 50 قطعة ميني مشكلة (جبنة، قشقوان، زعتر، لحم، سبانخ، بيتزا، فلافل، شاورما) مع 4 أنواع صوصات ومخللات فاخرة.",
    description_en: "The ultimate gathering box: 50 assorted mini pastries (cheese, zaatar, meat, spinach, pizza, falafel) with 4 signature dipping sauces.",
    price: 8.500,
    calories: 2200,
    badge: "👑 بوكس المناسبات",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=800&q=80",
    dough_options: ["تشكيلة كاملة كلاسيك", "نصف كلاسيك ونصف بر أسمر"],
    addons: [
      { name_ar: "إضافة صوص رانش وشطة إضافية", name_en: "Extra Dips Pack", price: 0.750 },
      { name_ar: "بوكس شاي كرك لتر ونصف", name_en: "1.5L Karak Tea Flask", price: 2.500 }
    ]
  },
  {
    id: "box-breakfast-24",
    category: "mini_boxes",
    name_ar: "بوكس الترويقة الصباحية (24 حبة ميني)",
    name_en: "Morning Gathering Box (24 Mini Pieces)",
    description_ar: "24 قطعة ميني طازجة ومختارة للإفطار: ميني زعتر، جبنة بيضاء بالنعناع، قشقوان، لبنة بعسل، وسبانخ ليموني.",
    description_en: "24 fresh mini pieces ideal for breakfast: mini zaatar, mint cheese, kashkaval, labneh honey, and spinach.",
    price: 4.750,
    calories: 1200,
    badge: "عرض الصباح",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة مشكلة", "عجينة حب بر صحية"],
    addons: [
      { name_ar: "عصير برتقال فريش 1 لتر", name_en: "1L Fresh Orange Juice", price: 1.500 }
    ]
  },
  {
    id: "box-mini-pizza-20",
    category: "mini_boxes",
    name_ar: "بوكس ميني بيتزا وشاورما (20 حبة)",
    name_en: "Mini Pizza & Shawarma Box (20 Pieces)",
    description_ar: "10 حبات ميني بيتزا إيطالية و10 حبات ميني ساندوتش شاورما دجاج متبلة ومخبوزة بالعجين الطري.",
    description_en: "10 pieces of stone-baked mini Italian pizza and 10 pieces of baked pastry chicken shawarma bites.",
    price: 4.950,
    calories: 1400,
    badge: "مفضل الأطفال",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة كلاسيكية"],
    addons: [
      { name_ar: "صوص ثومية وكاتشب إضافي", name_en: "Garlic Mayo & Ketchup Pack", price: 0.500 }
    ]
  },

  // --- بيتزا ومعجنات إيطالية ---
  {
    id: "pizza-margherita",
    category: "pizzas",
    name_ar: "بيتزا مارغريتا كلاسيكية وسط",
    name_en: "Classic Margherita Pizza (Medium)",
    description_ar: "صلصة طماطم إيطالية مطبوخة بالأعشاب والريحان، مع جبنة موزاريلا طبيعية بنسبة 100% وزيت زيتون.",
    description_en: "Authentic Italian tomato sauce, fragrant basil leaves, and 100% real melted mozzarella cheese.",
    price: 2.250,
    calories: 680,
    badge: "إيطالي أصيل",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة رقيقة مقرمشة (Italian Thin)", "عجينة سميكة وهشة (Pan Crust)"],
    addons: [
      { name_ar: "أطراف محشوة بالجبنة (Stuffed Crust)", name_en: "Stuffed Crust", price: 0.500 },
      { name_ar: "موزاريلا مضاعفة", name_en: "Double Mozzarella", price: 0.450 },
      { name_ar: "فطر فريش", name_en: "Fresh Mushrooms", price: 0.250 }
    ]
  },
  {
    id: "pizza-pepperoni",
    category: "pizzas",
    name_ar: "بيتزا بيبروني بقري بالجبن",
    name_en: "Beef Pepperoni Feast Pizza",
    description_ar: "شرائح بيبروني بقري بقري حلال مقرمشة مع جبنة الموزاريلا وصلصة الطماطم الغنية.",
    description_en: "Crispy premium beef pepperoni slices with melted mozzarella over our rich house-made marinara.",
    price: 2.650,
    calories: 790,
    badge: "الأكثر طلباً",
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة رقيقة", "عجينة سميكة"],
    addons: [
      { name_ar: "أطراف محشية جبن", name_en: "Stuffed Crust", price: 0.500 },
      { name_ar: "هلابينو حار", name_en: "Jalapeños", price: 0.200 }
    ]
  },
  {
    id: "pizza-chicken-ranch",
    category: "pizzas",
    name_ar: "بيتزا دجاج رانش باربيكيو",
    name_en: "Chicken BBQ Ranch Pizza",
    description_ar: "قطع صدور دجاج متبلة ومشوية مع صوص الرانش الغني وصوص الباربيكيو المدخن والمشروم الطازج.",
    description_en: "Tender grilled chicken breast tossed with creamy ranch and smoky BBQ sauce, mushrooms & cheese.",
    price: 2.850,
    calories: 820,
    badge: "توصية الشيف",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة رقيقة", "عجينة سميكة"],
    addons: [
      { name_ar: "صوص رانش إضافي", name_en: "Extra Ranch Dip", price: 0.250 },
      { name_ar: "بصل مقرمش وذرة", name_en: "Crispy Onions & Corn", price: 0.200 }
    ]
  },

  // --- حلويات وفطائر حلوة ---
  {
    id: "sweet-nutella-banana",
    category: "sweets",
    name_ar: "فطيرة نوتيلا مع شرائح الموز والمكسرات",
    name_en: "Nutella Chocolate & Fresh Banana Pie",
    description_ar: "شوكولاتة نوتيلا أصلية ساخنة داخل عجينة هشة ومقرمشة مع قطع الموز ورشة فستق حلبي وبندق.",
    description_en: "Decadent warm Nutella spread inside golden flaky crust with sliced bananas and crushed pistachios.",
    price: 1.450,
    calories: 490,
    badge: "حلى ساخن",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة حلوة كلاسيكية"],
    addons: [
      { name_ar: "فراولة فريش", name_en: "Fresh Strawberries", price: 0.300 },
      { name_ar: "آيس كريم فانيليا إضافي", name_en: "Vanilla Ice Cream Cup", price: 0.500 }
    ]
  },
  {
    id: "sweet-cream-honey",
    category: "sweets",
    name_ar: "فطيرة قشطة بلدية بالعسل والمكسرات",
    name_en: "Clotted Cream Pie with Honey & Pistachios",
    description_ar: "قشطة بلدية طازجة وكثيفة مخبوزة ومسقية بعسل السدر الكويتي الفاخر والمكسرات المحمصة.",
    description_en: "Rich Arabic clotted cream baked to perfection, sweetened with natural honey and pistachio crumbles.",
    price: 1.350,
    calories: 440,
    badge: "كلاسيك",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    dough_options: ["عجينة هشة"],
    addons: [
      { name_ar: "عسل إضافي", name_en: "Extra Honey", price: 0.200 },
      { name_ar: "فستق حلبي مجروش", name_en: "Extra Pistachio", price: 0.250 }
    ]
  },

  // --- مشروبات وعصائر ---
  {
    id: "bev-karak-flask",
    category: "beverages",
    name_ar: "ترمس شاي كرك بالهيل والزعفران (1 لتر)",
    name_en: "Karak Tea Flask with Cardamom & Saffron (1L)",
    description_ar: "شاي كرك كويتي مطبوخ على أصوله بالحليب المركز، الهيل الأخضر الفاخر وخيوط الزعفران الأصلية.",
    description_en: "Authentic Kuwaiti Karak tea slow-brewed with condensed milk, aromatic cardamom, and saffron threads.",
    price: 2.250,
    calories: 180,
    badge: "شاي ديوانية",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
    dough_options: [],
    addons: [
      { name_ar: "سكر زيادة", name_en: "Extra Sweet", price: 0.000 },
      { name_ar: "بدون سكر (سكر خارجي)", name_en: "Unsweetened (Side Sugar)", price: 0.000 }
    ]
  },
  {
    id: "bev-orange-fresh",
    category: "beverages",
    name_ar: "عصير برتقال فريش طازج (500 مل)",
    name_en: "Fresh Squeezed Orange Juice (500ml)",
    description_ar: "عصير برتقال طبيعي 100% معصور فورياً بدون ماء أو سكر مضاف.",
    description_en: "100% pure fresh squeezed orange juice, no added sugar or preservatives.",
    price: 0.950,
    calories: 110,
    badge: "طبيعي 100%",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
    dough_options: [],
    addons: []
  },
  {
    id: "bev-soft-drinks",
    category: "beverages",
    name_ar: "مشروب غازي بارد (علبة)",
    name_en: "Chilled Soft Drink (Can)",
    description_ar: "اختر مشروبك المفضل: بيبسي، بيبسي دايت، سفن آب، سفن آب دايت، ميرندا برتقال، ماونتن ديو.",
    description_en: "Choice of Pepsi, Diet Pepsi, 7Up, Diet 7Up, Mirinda, or Mountain Dew.",
    price: 0.250,
    calories: 140,
    badge: "بارد ومنعش",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    dough_options: [],
    addons: []
  },
  {
    id: "bev-water",
    category: "beverages",
    name_ar: "مياه معدنية كويتية نقية (500 مل)",
    name_en: "Kuwaiti Mineral Water (500ml)",
    description_ar: "مياه شرب نقية مبردة (الروضتين / أبراج).",
    description_en: "Chilled pure local mineral water.",
    price: 0.150,
    calories: 0,
    badge: "نقي",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80",
    dough_options: [],
    addons: []
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CATEGORIES, PRODUCTS_DATA };
}
