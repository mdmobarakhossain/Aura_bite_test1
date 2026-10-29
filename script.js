// AURA BITE - CONFIG & CREDENTIALS
const ADMIN_USER = "mobarako6";
const ADMIN_PASS = "Mobarak@1";
const STORE_PHONE = "8509549177";
const WHATSAPP_NUM = "918509549177";
const STORE_KEY = "auraBiteDatabaseV2";
const AUTH_KEY = "auraBiteLoggedInAdmin";

// REAL-LIFE FOOD IMAGES (High-quality photos)
const defaultProducts = [
  // Bread & Toast
  ["Butter Toast", "Bread & Toast", 15, "2 slices", "🍞", "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?auto=format&fit=crop&w=400&q=80"],
  ["Jam Bread", "Bread & Toast", 15, "2 slices", "🍞", "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"],
  ["Cheese Toast", "Bread & Toast", 25, "2 slices", "🧀", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80"],
  ["Bread Omelette", "Bread & Toast", 30, "2 slices + 1 egg", "🍳", "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80"],
  
  // Eggs & Omelettes
  ["Boiled Egg", "Eggs & Omelettes", 12, "1 pc", "🥚", "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80"],
  ["Double Egg Omelette", "Eggs & Omelettes", 30, "2 eggs", "🍳", "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=400&q=80"],
  ["Egg Bhurji", "Eggs & Omelettes", 35, "2 eggs", "🍳", "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=400&q=80"],

  // Puri & Kachori
  ["Puri-Sabzi", "Puri & Kachori", 28, "4 pcs + sabzi", "🫓", "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80"],
  ["Kachori-Aloo Sabzi", "Puri & Kachori", 30, "2 pcs", "🫓", "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80"],

  // Veg Sandwiches
  ["Veg Masala Sandwich", "Veg Sandwiches", 30, "1 sandwich", "🥪", "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80"],
  ["Cheese Corn Sandwich", "Veg Sandwiches", 40, "1 sandwich", "🥪", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80"],
  ["Paneer Masala Sandwich", "Veg Sandwiches", 45, "1 sandwich", "🥪", "https://images.unsplash.com/photo-1628191010210-a59de33e5941?auto=format&fit=crop&w=400&q=80"],

  // Non-Veg Sandwiches
  ["Masala Egg Sandwich", "Non-Veg Sandwiches", 35, "1 sandwich", "🥪", "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&w=400&q=80"],
  ["Chicken Sandwich", "Non-Veg Sandwiches", 55, "1 sandwich", "🥪", "https://images.unsplash.com/photo-1603064752734-4c48eff53d05?auto=format&fit=crop&w=400&q=80"],

  // Maggi & More
  ["Classic Masala Maggi", "Maggi & More", 30, "1 bowl", "🍜", "https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=400&q=80"],
  ["Egg Maggi", "Maggi & More", 40, "1 bowl", "🍜", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80"],
  ["Chicken Maggi", "Maggi & More", 55, "1 bowl", "🍜", "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=400&q=80"],

  // Beverages
  ["Milk Tea", "Beverages", 12, "1 cup", "☕", "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80"],
  ["Hot Coffee", "Beverages", 20, "1 cup", "☕", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80"],
  ["Cold Coffee", "Beverages", 35, "1 glass", "🥤", "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80"],

  // Shakes
  ["Chocolate Milkshake", "Shakes", 50, "1 glass", "🥤", "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80"],
  ["Banana Shake", "Shakes", 40, "1 glass", "🍌", "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80"]
];

const categories = [
  ["Bread & Toast", "🍞"],
  ["Eggs & Omelettes", "🍳"],
  ["Puri & Kachori", "🫓"],
  ["Veg Sandwiches", "🥪"],
  ["Non-Veg Sandwiches", "🥪"],
  ["Maggi & More", "🍜"],
  ["Beverages", "☕"],
  ["Shakes", "🥤"]
];

// STATE MANAGEMENT
let state = loadState();
let cart = [];
let customerCart = [];
let lastInvoiceId = null;

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STORE_KEY));
    if (s && Array.isArray(s.products) && Array.isArray(s.bills)) return s;
  } catch (e) {}
  return {
    products: defaultProducts.map((p, i) => ({
      id: "p" + (i + 1),
      name: p[0],
      category: p[1],
      price: p[2],
      unit: p[3],
      emoji: p[4],
      image: p[5] || ""
    })),
    bills: [],
    nextBill: 101
  };
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

// UTILITIES
const $ = id => document.getElementById(id);
const money = n => "₹" + Number(n || 0).toLocaleString("en-IN");
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg) {
  const t = $("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2500);
}

function billTime(b) {
  return new Date(b.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// AUTH & ROLE CONTROLLER
function checkAdminSession() {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

$("btnChooseCustomer").addEventListener("click", () => {
  openCustomer();
});

$("btnChooseAdmin").addEventListener("click", () => {
  if (checkAdminSession()) {
    openAdminShell();
  } else {
    $("adminLoginModal").classList.add("show");
  }
});

$("closeAdminLogin").addEventListener("click", () => {
  $("adminLoginModal").classList.remove("show");
});

$("adminLoginForm").addEventListener("submit", e => {
  e.preventDefault();
  const u = $("adminUser").value.trim();
  const p = $("adminPass").value.trim();

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, "true");
    $("adminLoginModal").classList.remove("show");
    $("adminLoginForm").reset();
    toast("Login successful!");
    openAdminShell();
  } else {
    alert("Invalid User ID or Password!");
  }
});

$("adminLogout").addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_KEY);
  $("appShell").style.display = "none";
  $("portalGateway").style.display = "flex";
  toast("Signed out successfully.");
});

function openAdminShell() {
  $("portalGateway").style.display = "none";
  $("appShell").style.display = "block";
  renderDashboard();
  renderAccordion();
  renderProducts();
  renderBills();
}

// CUSTOMER PAGE CONTROLS
function openCustomer() {
  customerCart = [];
  renderCustomerCart();
  renderCustomerMenu();
  $("portalGateway").style.display = "none";
  $("customerPage").classList.add("show");
  window.scrollTo(0, 0);
}

function closeCustomer() {
  $("customerPage").classList.remove("show");
  if (checkAdminSession()) {
    $("appShell").style.display = "block";
  } else {
    $("portalGateway").style.display = "flex";
  }
}

$("closeCustomerPage").addEventListener("click", closeCustomer);
$("btnPreviewCustomerPage").addEventListener("click", openCustomer);
$("btnLaunchCustomer").addEventListener("click", openCustomer);

// NAVIGATION
function navigate(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  $(view + "View").classList.add("active");
  document.querySelectorAll(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.view === view));

  const labels = {
    dashboard: ["YOUR CAFÉ AT A GLANCE", "Good afternoon, AURA BITE"],
    billing: ["COUNTER POS BILLING", "Create a new bill"],
    bills: ["INVOICE ARCHIVE", "Saved bills history"],
    products: ["CAFÉ MENU CONTROL", "Menu & Products"],
    orders: ["ONLINE ORDER LINK", "Customer Order Page"]
  };
  $("pageEyebrow").textContent = labels[view][0];
  $("pageTitle").innerHTML = labels[view][1] + " <span>✦</span>";
  $("sidebar").classList.remove("open");

  if (view === "dashboard") renderDashboard();
  if (view === "billing") renderAccordion();
  if (view === "bills") renderBills();
  if (view === "products") renderProducts();
}

document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.view)));
document.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => navigate(b.dataset.goto)));
$("mobileMenu").addEventListener("click", () => $("sidebar").classList.toggle("open"));
$("topNewBill").addEventListener("click", () => {
  cart = [];
  renderCart();
  navigate("billing");
});

// CLOCK
function updateClock() {
  const d = new Date();
  $("currentTime").textContent = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  $("currentDate").textContent = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  $("todayChip").textContent = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  $("billDateChip").textContent = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// DASHBOARD
function renderDashboard() {
  const d = new Date(), today = dateKey(d), month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const bills = state.bills;
  const todayBills = bills.filter(b => dateKey(new Date(b.createdAt)) === today);
  const monthBills = bills.filter(b => dateKey(new Date(b.createdAt)).startsWith(month));

  const sum = a => a.reduce((n, b) => n + b.total, 0);
  const total = sum(bills);
  const cash = sum(bills.filter(b => b.payment === "Cash"));
  const online = sum(bills.filter(b => b.payment === "Online"));
  const card = sum(bills.filter(b => b.payment === "Card"));

  $("todaySales").textContent = money(sum(todayBills));
  $("monthSales").textContent = money(sum(monthBills));
  $("allBills").textContent = bills.length;
  $("averageBill").textContent = money(bills.length ? total / bills.length : 0);

  $("paidTotal").textContent = money(total);
  $("cashSales").textContent = money(cash);
  $("onlineSales").textContent = money(online);
  $("cardSales").textContent = money(card);

  const cashDeg = total ? (cash / total) * 360 : 0;
  const onlineDeg = total ? (online / total) * 360 : 0;
  $("paymentDonut").style.background = `conic-gradient(#e8590c 0deg ${cashDeg}deg, #d9a83e ${cashDeg}deg ${cashDeg + onlineDeg}deg, #c4dacb ${cashDeg + onlineDeg}deg 360deg)`;

  const rows = [...bills].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  $("recentBillsBody").innerHTML = rows.length ? rows.map(b => `
    <tr>
      <td class="bill-number">#${esc(b.id)}</td>
      <td>${esc(b.customer || "Walk-in Customer")}</td>
      <td><span class="source-badge ${b.source === 'Online' ? 'online' : 'shop'}">${b.source || 'Shop'}</span></td>
      <td>${esc(billTime(b))}</td>
      <td><span class="payment-badge ${b.payment.toLowerCase()}">${esc(b.payment)}</span></td>
      <td style="font-weight:700">${money(b.total)}</td>
      <td><button class="mini-action" onclick="openInvoice('${b.id}')">Receipt ↗</button></td>
    </tr>
  `).join("") : `<tr><td colspan="7" class="empty-cell">No bills saved yet.</td></tr>`;
}

// BILLING ACCORDION
function renderAccordion() {
  const query = ($("menuSearch").value || "").toLowerCase();
  let html = "";
  const groups = [...categories, ...[...new Set(state.products.map(p => p.category).filter(c => !categories.some(x => x[0] === c)))].map(c => [c, "🍽️"])];

  groups.forEach(([cat, emoji], i) => {
    const products = state.products.filter(p => (p.category || "Other") === cat && (`${p.name} ${p.unit} ${p.category}`).toLowerCase().includes(query));
    if (!products.length) return;

    html += `
      <article class="category-block ${query || i === 0 ? "open" : ""}">
        <button class="category-toggle" data-cat="${esc(cat)}">
          <span class="category-emoji">${emoji}</span>
          <span>
            <strong>${esc(cat)}</strong>
            <small>${products.length} items</small>
          </span>
          <span class="chevron">⌄</span>
        </button>
        <div class="category-items">
          ${products.map(p => `
            <div class="food-item">
              <div class="food-thumb">
                ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" />` : esc(p.emoji || "🍽️")}
              </div>
              <div class="food-info">
                <b>${esc(p.name)}</b>
                <small>${esc(p.unit || "1 portion")}</small>
                <div class="food-price">${money(p.price)}</div>
              </div>
              <button class="add-item" onclick="addToCart('${p.id}')">+</button>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  });

  $("categoryAccordion").innerHTML = html || `<div class="empty-cell">No food items found.</div>`;
  document.querySelectorAll(".category-toggle").forEach(b => {
    b.addEventListener("click", () => b.closest(".category-block").classList.toggle("open"));
  });
}
$("menuSearch").addEventListener("input", renderAccordion);

// CART OPERATIONS (COUNTER)
function addToCart(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  const line = cart.find(x => x.productId === id);
  if (line) line.qty++;
  else cart.push({ productId: id, name: p.name, price: Number(p.price), unit: p.unit, qty: 1 });
  renderCart();
}

function changeQty(id, delta, isCustomer = false) {
  const target = isCustomer ? customerCart : cart;
  const item = target.find(x => x.productId === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) target.splice(target.indexOf(item), 1);
  isCustomer ? renderCustomerCart() : renderCart();
}

function removeCart(id, isCustomer = false) {
  const target = isCustomer ? customerCart : cart;
  const i = target.findIndex(x => x.productId === id);
  if (i >= 0) target.splice(i, 1);
  isCustomer ? renderCustomerCart() : renderCart();
}

function renderCart() {
  const count = cart.reduce((n, x) => n + x.qty, 0);
  const total = cart.reduce((n, x) => n + x.qty * x.price, 0);

  $("cartCount").textContent = count;
  $("cartSubtotal").textContent = money(total);
  $("cartTotal").textContent = money(total);
  $("checkoutTotal").textContent = money(total);

  $("cartItems").innerHTML = cart.length ? cart.map(x => `
    <div class="cart-line">
      <div>
        <div class="cart-line-name">${esc(x.name)}</div>
        <div class="cart-line-bottom">
          <div class="qty-control">
            <button onclick="changeQty('${x.productId}', -1)">−</button>
            <b>${x.qty}</b>
            <button onclick="changeQty('${x.productId}', 1)">+</button>
          </div>
          <button class="remove-line" onclick="removeCart('${x.productId}')">Remove</button>
        </div>
      </div>
      <div style="font-weight:700">${money(x.qty * x.price)}</div>
    </div>
  `).join("") : `<div class="cart-empty"><span>🧾</span><b>Your bill is empty</b><small>Select food items from the menu</small></div>`;
}

$("clearCart").addEventListener("click", () => {
  cart = [];
  renderCart();
  toast("Order reset.");
});

$("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return toast("Please select at least one item first.");
  $("paymentModal").classList.add("show");
});

document.querySelectorAll("[data-close]").forEach(b => {
  b.addEventListener("click", () => $(b.dataset.close).classList.remove("show"));
});

// PAYMENT & BILL GENERATION
$("paymentForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!cart.length) return;

  const bill = {
    id: String(state.nextBill++),
    createdAt: Date.now(),
    source: $("billSource").value,
    customer: $("customerName").value.trim() || "Walk-in Customer",
    phone: $("customerPhone").value.trim() || "—",
    payment: $("paymentMethod").value,
    items: cart.map(x => ({ ...x })),
    total: cart.reduce((n, x) => n + x.qty * x.price, 0)
  };

  state.bills.push(bill);
  saveState();

  cart = [];
  renderCart();
  $("paymentForm").reset();
  $("paymentModal").classList.remove("show");

  renderDashboard();
  renderBills();
  lastInvoiceId = bill.id;
  openInvoice(bill.id);
  toast(`Bill #${bill.id} saved successfully!`);
});

// SAVED BILLS
function renderBills() {
  const q = ($("billSearch").value || "").toLowerCase();
  const source = $("sourceFilter").value;
  const pay = $("paymentFilter").value;
  const date = $("billDateFilter").value;
  const now = new Date();

  const list = [...state.bills].sort((a, b) => b.createdAt - a.createdAt).filter(b => {
    const d = new Date(b.createdAt);
    return (!q || `${b.id} ${b.customer} ${b.phone}`.toLowerCase().includes(q)) &&
      (!source || b.source === source) &&
      (!pay || b.payment === pay) &&
      (date === "all" || (date === "today" && dateKey(d) === dateKey(now)) || (date === "month" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()));
  });

  $("allBillsBody").innerHTML = list.length ? list.map(b => `
    <tr>
      <td class="bill-number">#${esc(b.id)}</td>
      <td>${esc(b.customer || "Walk-in")}</td>
      <td><span class="source-badge ${b.source === 'Online' ? 'online' : 'shop'}">${b.source || 'Shop'}</span></td>
      <td>${esc(b.phone || "—")}</td>
      <td>${esc(billTime(b))}</td>
      <td><span class="payment-badge ${b.payment.toLowerCase()}">${esc(b.payment)}</span></td>
      <td style="font-weight:700">${money(b.total)}</td>
      <td>
        <div class="product-actions">
          <button onclick="openInvoice('${b.id}')">Receipt</button>
          <button onclick="shareBill('${b.id}')">Share</button>
          <button class="mini-action danger" onclick="deleteBill('${b.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join("") : `<tr><td colspan="8" class="empty-cell">No saved bills found.</td></tr>`;
}

$("billSearch").addEventListener("input", renderBills);
$("sourceFilter").addEventListener("change", renderBills);
$("paymentFilter").addEventListener("change", renderBills);
$("billDateFilter").addEventListener("change", renderBills);

// INVOICE & PRINT
function invoiceMarkup(b) {
  return `
    <div style="border-bottom: 2px solid #e8590c; padding-bottom: 12px; margin-bottom: 12px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h2 style="margin:0; font-family:'Playfair Display', serif; color:#e8590c;">AURA BITE ✦</h2>
          <p style="margin:4px 0; font-size:11px; color:#555;">Baligori, Newtown, Kolkata 700160<br>Near UEM & St. Xavier’s University<br>Mob: ${STORE_PHONE}</p>
        </div>
        <div style="text-align:right;">
          <b style="font-size:16px; color:#e8590c;">INVOICE #${esc(b.id)}</b>
          <div style="font-size:11px; color:#666;">${esc(billTime(b))}</div>
          <span class="payment-badge ${b.payment.toLowerCase()}">${esc(b.payment)}</span>
        </div>
      </div>
      <div style="margin-top:10px; background:#f4f7f2; padding:8px 10px; border-radius:6px; font-size:11px;">
        <b>Customer:</b> ${esc(b.customer)} | <b>Phone:</b> ${esc(b.phone)} | <b>Type:</b> ${b.source || 'Shop'}
      </div>
    </div>

    <table style="width:100%; font-size:12px; margin-bottom:14px;">
      <thead>
        <tr style="border-bottom:1px solid #ddd; text-align:left;">
          <th style="padding:6px 0;">Item</th>
          <th style="padding:6px 0;">Qty</th>
          <th style="padding:6px 0;">Price</th>
          <th style="text-align:right; padding:6px 0;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${b.items.map(x => `
          <tr style="border-bottom:1px solid #f0f0f0;">
            <td style="padding:6px 0;">${esc(x.name)}</td>
            <td style="padding:6px 0;">${x.qty}</td>
            <td style="padding:6px 0;">${money(x.price)}</td>
            <td style="text-align:right; padding:6px 0; font-weight:bold;">${money(x.qty * x.price)}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div style="text-align:right; border-top:1px dashed #ccc; padding-top:8px;">
      <div style="font-size:16px; font-weight:bold; color:#e8590c;">Grand Total: ${money(b.total)}</div>
    </div>
    <div style="text-align:center; margin-top:20px; font-size:10px; color:#777; border-top:1px solid #eee; padding-top:10px;">
      Thank you for visiting! Fresh ingredients · Hygienic preparation ✦ AURA BITE
    </div>
  `;
}

function openInvoice(id) {
  const b = state.bills.find(x => x.id === id);
  if (!b) return;
  lastInvoiceId = id;
  $("invoiceContent").innerHTML = invoiceMarkup(b);
  $("invoiceModal").classList.add("show");
}

$("printInvoice").addEventListener("click", () => window.print());

function shareBill(id) {
  const b = state.bills.find(x => x.id === id);
  if (!b) return;
  const text = `*AURA BITE — BILL #${b.id}*\nDate: ${billTime(b)}\nCustomer: ${b.customer}\n${b.items.map(x => `${x.name} x ${x.qty} =${money(x.qty * x.price)}`).join("\n")}\n*Grand Total: ${money(b.total)}*\nPayment: ${b.payment}\nBaligori, Newtown · Call: ${STORE_PHONE}\nThank you!`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
}

$("invoiceWhatsApp").addEventListener("click", () => {
  if (lastInvoiceId) shareBill(lastInvoiceId);
});

function deleteBill(id) {
  if (!confirm(`Are you sure you want to delete bill #${id}?`)) return;
  state.bills = state.bills.filter(b => b.id !== id);
  saveState();
  renderBills();
  renderDashboard();
  toast("Bill deleted.");
}

// PRODUCT CATALOG MANAGEMENT
function renderProducts() {
  const q = ($("productSearch").value || "").toLowerCase();
  const cat = $("productCategoryFilter").value;
  const cats = [...new Set([...categories.map(x => x[0]), ...state.products.map(p => p.category)])];

  $("productCategoryFilter").innerHTML = '<option value="">All Categories</option>' + cats.map(c => `<option ${cat === c ? "selected" : ""}>${esc(c)}</option>`).join("");
  $("productCategory").innerHTML = cats.map(c => `<option>${esc(c)}</option>`).join("");

  const list = state.products.filter(p => (!q || `${p.name} ${p.category} ${p.unit}`.toLowerCase().includes(q)) && (!cat || p.category === cat));
  $("productCount").textContent = `${list.length} items`;

  $("productGrid").innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" />` : esc(p.emoji || "🍽️")}
        <span class="product-cat">${esc(p.category)}</span>
      </div>
      <div class="product-card-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.unit || "1 portion")}</p>
        <div class="product-card-bottom">
          <strong>${money(p.price)}</strong>
          <div class="product-actions">
            <button onclick="editProduct('${p.id}')">Edit</button>
            <button class="mini-action danger" onclick="deleteProduct('${p.id}')">Delete</button>
          </div>
        </div>
      </div>
    </article>
  `).join("") || `<div class="empty-cell">No products found.</div>`;
}

$("productSearch").addEventListener("input", renderProducts);
$("productCategoryFilter").addEventListener("change", renderProducts);

$("addProductBtn").addEventListener("click", () => {
  $("productForm").reset();
  $("editProductId").value = "";
  $("productModalTitle").textContent = "Add Food Item";
  $("productModal").classList.add("show");
});

function editProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  $("productForm").reset();
  $("editProductId").value = p.id;
  $("productModalTitle").textContent = "Edit Food Item";
  $("productName").value = p.name;
  $("productCategory").value = p.category;
  $("productPrice").value = p.price;
  $("productUnit").value = p.unit || "";
  $("productImage").value = p.image || "";
  $("productModal").classList.add("show");
}

function deleteProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Remove "${p.name}" from the menu?`)) return;
  state.products = state.products.filter(x => x.id !== id);
  saveState();
  renderProducts();
  renderAccordion();
  renderCustomerMenu();
  toast("Food item removed.");
}

$("productForm").addEventListener("submit", e => {
  e.preventDefault();
  const id = $("editProductId").value;
  const name = $("productName").value.trim();
  const category = $("productCategory").value;
  const price = Number($("productPrice").value);
  const unit = $("productUnit").value.trim();
  const url = $("productImage").value.trim();
  const file = $("productImageFile").files[0];

  const saveProductData = img => {
    const existing = state.products.find(p => p.id === id);
    const item = {
      id: id || "p" + Date.now(),
      name,
      category,
      price,
      unit,
      emoji: existing?.emoji || "🍽️",
      image: img || ""
    };
    if (existing) Object.assign(existing, item);
    else state.products.push(item);

    saveState();
    $("productModal").classList.remove("show");
    renderProducts();
    renderAccordion();
    renderCustomerMenu();
    toast(existing ? "Product updated!" : "New product added!");
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = () => saveProductData(reader.result);
    reader.readAsDataURL(file);
  } else {
    saveProductData(url || state.products.find(p => p.id === id)?.image || "");
  }
});

// CUSTOMER MENU & ORDERING
function renderCustomerMenu() {
  const q = ($("customerSearch").value || "").toLowerCase();
  const list = state.products.filter(p => `${p.name} ${p.category} ${p.unit}`.toLowerCase().includes(q));

  $("customerMenu").innerHTML = list.length ? list.map(p => `
    <article class="customer-product">
      <div class="customer-product-img">
        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.name)}" />` : esc(p.emoji || "🍽️")}
      </div>
      <div class="customer-product-body">
        <span class="eyebrow">${esc(p.category)}</span>
        <h3 style="margin: 4px 0;">${esc(p.name)}</h3>
        <p style="font-size:10px; color:#777; margin:0 0 6px;">${esc(p.unit || "1 portion")}</p>
        <div class="customer-product-foot">
          <b>${money(p.price)}</b>
          <button onclick="addCustomerItem('${p.id}')">+</button>
        </div>
      </div>
    </article>
  `).join("") : `<div class="empty-cell" style="grid-column:1/-1;">No food items found.</div>`;
}

$("customerSearch").addEventListener("input", renderCustomerMenu);

function addCustomerItem(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  const item = customerCart.find(x => x.productId === id);
  if (item) item.qty++;
  else customerCart.push({ productId: id, name: p.name, price: Number(p.price), unit: p.unit, qty: 1 });
  renderCustomerCart();
  toast(`${p.name} added to tray`);
}

function renderCustomerCart() {
  const count = customerCart.reduce((n, x) => n + x.qty, 0);
  const total = customerCart.reduce((n, x) => n + x.qty * x.price, 0);

  $("customerCartCount").textContent = count;
  $("customerCartTotal").textContent = money(total);
  $("customerCheckoutTotal").textContent = money(total);

  $("customerCartItems").innerHTML = customerCart.length ? customerCart.map(x => `
    <div class="cart-line">
      <div>
        <div class="cart-line-name">${esc(x.name)}</div>
        <div class="cart-line-bottom">
          <div class="qty-control">
            <button onclick="changeQty('${x.productId}', -1, true)">−</button>
            <b>${x.qty}</b>
            <button onclick="changeQty('${x.productId}', 1, true)">+</button>
          </div>
          <button class="remove-line" onclick="removeCart('${x.productId}', true)">Remove</button>
        </div>
      </div>
      <div style="font-weight:700">${money(x.qty * x.price)}</div>
    </div>
  `).join("") : `<div class="cart-empty"><span>🛍️</span><b>Your tray is empty</b><small>Select food items from the menu</small></div>`;
}

$("customerCheckout").addEventListener("click", () => {
  if (!customerCart.length) return toast("Please add items to your cart first.");
  $("customerDetailsModal").classList.add("show");
});

$("orderType").addEventListener("change", () => {
  const isDelivery = $("orderType").value === "Home delivery";
  $("addressOptional").textContent = isDelivery ? "(Required)" : "(Not needed for pickup)";
  $("orderAddress").required = isDelivery;
});

// WHATSAPP ORDER SUBMISSION
$("customerDetailsForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!customerCart.length) return;

  const name = $("orderCustomerName").value.trim();
  const phone = $("orderCustomerPhone").value.trim();
  const type = $("orderType").value;
  const address = $("orderAddress").value.trim();
  const payment = $("orderPayment").value;
  const notes = $("orderNotes").value.trim();
  const total = customerCart.reduce((n, x) => n + x.qty * x.price, 0);

  if (type === "Home delivery" && !address) {
    return alert("Please enter your delivery address!");
  }

  // Record this as an online order bill in local database
  const autoBill = {
    id: String(state.nextBill++),
    createdAt: Date.now(),
    source: "Online",
    customer: name,
    phone: phone,
    payment: payment.includes("Cash") ? "Cash" : "Online",
    items: customerCart.map(x => ({ ...x })),
    total: total
  };
  state.bills.push(autoBill);
  saveState();

  const lines = customerCart.map(x => `• ${x.name} x ${x.qty} = ${money(x.qty * x.price)}`).join("\n");
  const msg = `*AURA BITE — NEW ORDER REQUEST* 🥪\n\n*Customer:* ${name}\n*Mobile:* ${phone}\n*Order Type:* ${type}\n${address ? `*Address:* ${address}\n` : ""}*Payment Preference:* ${payment}\n\n*Ordered Items:*\n${lines}\n\n*Total Bill:* ${money(total)}\n${notes ? `*Instructions:* ${notes}\n` : ""}\nPlease confirm availability and estimated preparation time.`;

  $("customerDetailsModal").classList.remove("show");
  customerCart = [];
  renderCustomerCart();

  window.open(`https://wa.me/${WHATSAPP_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
  toast("WhatsApp opened with your order summary!");
});

// INITIALIZATION
function init() {
  updateClock();
  setInterval(updateClock, 10000);
}
init();