// AURA BITE upgrade layer: split payments, discount/tax/service, dues, richer invoice, print sizes.
// Loaded after script.js; existing data is migrated in place (old bills become fully-paid).
(() => {
  const num = v => Math.max(0, Number(v) || 0);
  const paidOf = b => b.payments.reduce((n, p) => n + p.amt, 0);
  const dueOf = b => Math.max(0, b.total - paidOf(b));
  const statusOf = b => dueOf(b) <= 0 ? "Paid" : paidOf(b) > 0 ? "Partial" : "Due";
  const label = m => m === "Online" ? "UPI" : m;
  const when = t => new Date(t).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "numeric", minute: "2-digit" });
  function norm(b) {
    if (!Array.isArray(b.payments)) b.payments = [{ amt: b.total, method: b.payment || "Cash", at: b.createdAt }];
    if (b.subtotal == null) Object.assign(b, { subtotal: b.total, discount: 0, service: 0, tax: 0 });
    return b;
  }
  const normAll = () => state.bills.forEach(norm);
  normAll(); saveState();

  // ---- Checkout form: clone to drop old submit handler, add new fields
  const old = $("paymentForm"), pf = old.cloneNode(true); old.replaceWith(pf);
  pf.querySelector(".checkout-total").insertAdjacentHTML("beforebegin", `
    <div class="form-grid">
      <label>Discount %<input id="billDiscount" type="number" min="0" max="100" value="0"></label>
      <label>Service Charge %<input id="billService" type="number" min="0" max="30" value="0"></label>
    </div>
    <div class="form-grid">
      <label>Tax (GST) %<input id="billTax" type="number" min="0" max="28" value="0"></label>
      <label>Paid Now (₹)<input id="billPaidNow" type="number" min="0" placeholder="Blank = full amount"></label>
    </div>`);
  pf.querySelector(".checkout-total").insertAdjacentHTML("afterend", `<div class="checkout-total"><span>Remaining Due</span><strong id="checkoutDue">₹0</strong></div>`);
  $("paymentMethod").innerHTML = `<option value="Cash">Cash</option><option value="Online">UPI</option><option value="Card">Card</option><option value="Due">Credit / Due (pay later)</option>`;

  function calc() {
    const sub = cart.reduce((n, x) => n + x.qty * x.price, 0);
    const disc = Math.round(sub * Math.min(100, num($("billDiscount").value)) / 100);
    const svc = Math.round((sub - disc) * num($("billService").value) / 100);
    const tax = Math.round((sub - disc + svc) * num($("billTax").value) / 100);
    return { sub, disc, svc, tax, total: sub - disc + svc + tax };
  }
  function paidNow(t) {
    if ($("paymentMethod").value === "Due") return 0;
    return $("billPaidNow").value === "" ? t.total : num($("billPaidNow").value);
  }
  function refresh() {
    const t = calc();
    $("checkoutTotal").textContent = money(t.total);
    $("checkoutDue").textContent = money(Math.max(0, t.total - paidNow(t)));
  }
  pf.addEventListener("input", refresh);
  $("checkoutBtn").addEventListener("click", refresh);

  pf.addEventListener("submit", e => {
    e.preventDefault();
    if (!cart.length) return toast("Add at least one item first.");
    const t = calc(), method = $("paymentMethod").value, paid = paidNow(t);
    const name = $("customerName").value.trim(), phone = $("customerPhone").value.trim();
    if (paid > t.total) return toast("Paid amount cannot exceed the total.");
    if (phone && !/^\d{10}$/.test(phone)) return toast("Enter a valid 10-digit mobile number.");
    if (paid < t.total && !name) return toast("Enter the customer name to record a due amount.");
    const now = Date.now();
    const bill = {
      id: String(state.nextBill++), createdAt: now, source: $("billSource").value,
      customer: name || "Walk-in Customer", phone: phone || "—", payment: method,
      items: cart.map(x => ({ ...x })), subtotal: t.sub, discount: t.disc, service: t.svc, tax: t.tax, total: t.total,
      payments: paid > 0 ? [{ amt: paid, method, at: now }] : []
    };
    state.bills.push(bill); saveState();
    cart = []; renderCart(); pf.reset(); refresh();
    $("paymentModal").classList.remove("show");
    renderDashboard(); renderBills(); openInvoice(bill.id);
    toast(`Bill #${bill.id} saved${t.total - paid > 0 ? " · due " + money(t.total - paid) : ""}`);
  });

  // ---- Add payment modal
  document.body.insertAdjacentHTML("beforeend", `
  <div class="modal-backdrop" id="addPayModal"><div class="modal modal-medium">
    <button class="modal-close" id="closeAddPay" aria-label="Close">×</button>
    <span class="eyebrow">RECEIVE PAYMENT</span><h2 id="apTitle"></h2>
    <div class="pay-sum"><div>Total<b id="apTotal"></b></div><div>Paid<b id="apPaid"></b></div><div>Due<b id="apDue"></b></div></div>
    <div class="pay-hist" id="apHist"></div>
    <form id="addPayForm"><div class="form-grid">
      <label>Amount (₹)<input id="apAmt" type="number" min="1" step="1" required></label>
      <label>Method<select id="apMethod"><option value="Cash">Cash</option><option value="Online">UPI</option><option value="Card">Card</option></select></label>
    </div><button class="primary-btn full-btn" type="submit">Record Payment ✓</button></form>
  </div></div>`);
  let payId = null;
  function fillPay(b) {
    $("apTitle").textContent = `Bill #${b.id} · ${b.customer}`;
    $("apTotal").textContent = money(b.total); $("apPaid").textContent = money(paidOf(b)); $("apDue").textContent = money(dueOf(b));
    $("apAmt").max = dueOf(b); $("apAmt").value = dueOf(b);
    $("apHist").innerHTML = b.payments.length ? b.payments.map(p => `<div><span>${when(p.at)} · ${label(p.method)}</span><b>${money(p.amt)}</b></div>`).join("") : "<small>No payments yet.</small>";
  }
  window.addPayment = id => { const b = state.bills.find(x => x.id === id); if (!b) return; payId = id; fillPay(norm(b)); $("addPayModal").classList.add("show"); };
  $("closeAddPay").addEventListener("click", () => $("addPayModal").classList.remove("show"));
  $("addPayForm").addEventListener("submit", e => {
    e.preventDefault();
    const b = state.bills.find(x => x.id === payId); if (!b) return;
    const amt = num($("apAmt").value);
    if (amt <= 0) return toast("Enter a valid amount.");
    if (amt > dueOf(b)) return toast(`Amount exceeds the due of ${money(dueOf(b))}.`);
    b.payments.push({ amt, method: $("apMethod").value, at: Date.now() }); saveState();
    renderBills(); renderDashboard();
    if (dueOf(b) <= 0) { $("addPayModal").classList.remove("show"); toast(`Bill #${b.id} fully paid 🎉`); }
    else { fillPay(b); toast(`${money(amt)} received · ${money(dueOf(b))} still due`); }
  });

  // ---- All Bills: status filter, sort, due column, add payment
  $("paymentFilter").innerHTML = `<option value="">All Payments / Status</option><option>Cash</option><option>Online</option><option>Card</option><option value="Due">Status: Due</option><option value="Partial">Status: Partial</option><option value="Paid">Status: Paid</option>`;
  $("billDateFilter").insertAdjacentHTML("afterend", `<select id="billSort"><option value="new">Newest first</option><option value="old">Oldest first</option></select>`);
  window.renderBills = function () {
    normAll();
    const q = ($("billSearch").value || "").toLowerCase(), src = $("sourceFilter").value, pay = $("paymentFilter").value, date = $("billDateFilter").value, now = new Date();
    const list = [...state.bills].sort((a, b) => $("billSort").value === "old" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt).filter(b => {
      const d = new Date(b.createdAt), st = statusOf(b);
      return (!q || `${b.id} ${b.customer} ${b.phone}`.toLowerCase().includes(q)) && (!src || b.source === src) &&
        (!pay || st === pay || b.payments.some(p => p.method === pay)) &&
        (date === "all" || (date === "today" && dateKey(d) === dateKey(now)) || (date === "month" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()));
    });
    $("allBillsBody").innerHTML = list.length ? list.map(b => `<tr>
      <td class="bill-number">#${esc(b.id)}</td><td>${esc(b.customer)}</td>
      <td><span class="source-badge ${b.source === "Online" ? "online" : "shop"}">${esc(b.source || "Shop")}</span></td>
      <td>${esc(b.phone || "—")}</td><td>${esc(billTime(b))}</td>
      <td><span class="st st-${statusOf(b)}">${statusOf(b)}</span>${dueOf(b) ? `<span class="due-note">Due ${money(dueOf(b))}</span>` : ""}</td>
      <td style="font-weight:700">${money(b.total)}</td>
      <td><div class="product-actions">
        <button onclick="openInvoice('${b.id}')">Receipt</button>
        ${dueOf(b) ? `<button onclick="addPayment('${b.id}')">+ Payment</button>` : ""}
        <button onclick="shareBill('${b.id}')">Share</button>
        <button class="mini-action danger" onclick="deleteBill('${b.id}')">Delete</button>
      </div></td></tr>`).join("") : `<tr><td colspan="8" class="empty-cell">No matching bills found.</td></tr>`;
  };
  ["billSearch", "sourceFilter", "paymentFilter", "billDateFilter", "billSort"].forEach(id => {
    $(id).addEventListener(id === "billSearch" ? "input" : "change", renderBills);
  });

  // ---- Dashboard: collected-by-method + pending dues card
  const baseDash = renderDashboard;
  $("allBills").closest(".stats-grid").insertAdjacentHTML("beforeend", `<article class="stat-card"><div class="stat-top"><span>Pending Payments</span><span class="stat-icon peach">!</span></div><strong id="pendingDue">₹0</strong><small id="pendingCount">0 unpaid bills</small></article>`);
  window.renderDashboard = function () {
    normAll(); baseDash();
    const by = m => state.bills.reduce((n, b) => n + b.payments.filter(p => p.method === m).reduce((s, p) => s + p.amt, 0), 0);
    const cash = by("Cash"), online = by("Online"), card = by("Card"), tot = cash + online + card;
    $("cashSales").textContent = money(cash); $("onlineSales").textContent = money(online); $("cardSales").textContent = money(card); $("paidTotal").textContent = money(tot);
    const c = tot ? cash / tot * 360 : 0, o = tot ? online / tot * 360 : 0;
    $("paymentDonut").style.background = `conic-gradient(#e8590c 0deg ${c}deg,#d9a83e ${c}deg ${c + o}deg,#c4dacb ${c + o}deg 360deg)`;
    const unpaid = state.bills.filter(b => dueOf(b) > 0);
    $("pendingDue").textContent = money(unpaid.reduce((n, b) => n + dueOf(b), 0));
    $("pendingCount").textContent = `${unpaid.length} unpaid bill${unpaid.length === 1 ? "" : "s"}`;
    document.querySelectorAll("#recentBillsBody .payment-badge").forEach((el, i) => {
      const b = [...state.bills].sort((a, z) => z.createdAt - a.createdAt)[i];
      if (b) { el.className = "st st-" + statusOf(b); el.textContent = statusOf(b); }
    });
  };

  // ---- Invoice
  window.invoiceMarkup = function (b) {
    norm(b);
    const row = (l, v, c = "") => v ? `<div class="${c}"><span>${l}</span><b>${v}</b></div>` : "";
    return `
    <div style="border-bottom:2px solid #e8590c;padding-bottom:12px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">
        <div><h2 style="margin:0;font-family:'Playfair Display',serif;color:#e8590c">AURA BITE ✦</h2>
        <div style="font-size:11px;font-style:italic;color:#e8590c">Good Food • Happy Mood</div>
        <p style="margin:4px 0;font-size:11px;color:#555">Baligori, Newtown, Kolkata 700160<br>Phone / WhatsApp: ${STORE_PHONE}</p></div>
        <div style="text-align:right"><b style="font-size:16px;color:#e8590c">INVOICE #${esc(b.id)}</b>
        <div style="font-size:11px;color:#666">${esc(billTime(b))}</div><span class="st st-${statusOf(b)}">${statusOf(b)}</span></div>
      </div>
      <div style="margin-top:10px;background:#fff1e6;padding:8px 10px;border-radius:6px;font-size:11px"><b>Customer:</b> ${esc(b.customer)} | <b>Phone:</b> ${esc(b.phone)} | <b>Type:</b> ${esc(b.source || "Shop")}</div>
    </div>
    <table style="width:100%;font-size:12px;margin-bottom:12px"><thead><tr style="border-bottom:1px solid #ddd;text-align:left"><th>Item</th><th>Qty</th><th>Price</th><th style="text-align:right">Total</th></tr></thead><tbody>
    ${b.items.map(x => `<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:5px 0">${esc(x.name)}</td><td>${x.qty}</td><td>${money(x.price)}</td><td style="text-align:right;font-weight:bold">${money(x.qty * x.price)}</td></tr>`).join("")}</tbody></table>
    <div class="inv-sum">
      ${row("Subtotal", money(b.subtotal))}${row("Discount", b.discount ? "−" + money(b.discount) : "")}${row("Service Charge", b.service ? money(b.service) : "")}${row("Tax", b.tax ? money(b.tax) : "")}
      ${row("Grand Total", money(b.total), "gt")}${row("Paid", money(paidOf(b)))}${row("Due", money(dueOf(b)), dueOf(b) ? "due" : "")}
    </div>
    ${b.payments.length ? `<div style="margin-top:12px;font-size:11px"><b>Payment History</b>${b.payments.map(p => `<div style="display:flex;justify-content:space-between;border-bottom:1px dashed #ddd;padding:3px 0"><span>${when(p.at)} · ${label(p.method)}</span><b>${money(p.amt)}</b></div>`).join("")}</div>` : ""}
    <div style="text-align:center;margin-top:18px;font-size:10px;color:#777;border-top:1px solid #eee;padding-top:10px">Thank you for visiting! Good Food • Happy Mood ✦ AURA BITE</div>`;
  };
  window.shareBill = function (id) {
    const b = state.bills.find(x => x.id === id); if (!b) return; norm(b);
    const t = `*AURA BITE — BILL #${b.id}*\n${billTime(b)}\nCustomer: ${b.customer}\n${b.items.map(x => `${x.name} x ${x.qty} = ${money(x.qty * x.price)}`).join("\n")}\n*Total: ${money(b.total)}*\nPaid: ${money(paidOf(b))}${dueOf(b) ? `\n*Due: ${money(dueOf(b))}*` : ""}\nThank you! Good Food • Happy Mood`;
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank");
  };

  // ---- Print: A4 or 80mm thermal
  $("printInvoice").style.display = "none";
  $("printInvoice").insertAdjacentHTML("afterend", `<button class="outline-btn" id="printThermal">Thermal 80mm 🧾</button><button class="primary-btn" id="printA4">Print A4 🖨️</button>`);
  const printAs = k => {
    let s = $("pgStyle"); if (!s) { s = document.createElement("style"); s.id = "pgStyle"; document.head.appendChild(s); }
    s.textContent = k === "thermal" ? "@page{size:80mm auto;margin:3mm}" : "@page{size:A4;margin:12mm}";
    document.body.classList.toggle("thermal", k === "thermal"); window.print();
  };
  $("printA4").addEventListener("click", () => printAs("a4"));
  $("printThermal").addEventListener("click", () => printAs("thermal"));

  // confirm toast on delete (existing confirm dialog kept)
  if ($("appShell").style.display !== "none") { renderDashboard(); renderBills(); }
})();
