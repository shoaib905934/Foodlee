/**
 * FOODLEE ORDER DESK — runs inside your Google Sheet (Extensions ▸ Apps Script).
 *
 *  Products tab : change a price or untick Available; the website follows.
 *  Orders tab   : every order lands here; you get an email (and optional Telegram alert).
 *  Messages tab : contact-form messages from the website.
 *  Order desk   : www.foodlee.in/admin.html — sign in with your admin key to manage orders.
 *
 * First time: choose "setup" in the function menu and press Run. Your admin key is emailed to you.
 */
const STATUSES = ["New", "Confirmed", "Packed", "Out for delivery", "Delivered", "Cancelled"];
const PAYMENTS = ["Awaiting UPI payment", "Payment sent, being verified", "Paid", "Cash on delivery", "Pay on delivery", "Refunded"];
const ORDER_HEAD = ["Time", "Order ID", "Status", "Payment", "Pay with", "UPI ref", "Name", "Phone", "Items", "Total (₹)",
  "Area", "Address", "Landmark", "Pincode", "Map link", "Delivery slot", "Repeat monthly"];
const COL = {}; ORDER_HEAD.forEach(function (h, i) { COL[h] = i + 1; });
// Sheet to use. Leave "" when this script is opened from the sheet (Extensions ▸ Apps Script);
// set it to the sheet's ID (the long code in its web address) when the script is a standalone project.
const SHEET_ID = "";
function book_() { return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet(); }
const SEED = [["h0", "Honey shots", "Honey Garlic", "1 shot", 30, true], ["h1", "Honey shots", "Honey Ginger", "1 shot", 30, true], ["h2", "Honey shots", "Honey Anjeer", "1 shot", 35, true], ["h3", "Honey shots", "Honey Dates", "1 shot", 30, true], ["h4", "Honey shots", "Honey Almond", "1 shot", 35, true], ["h5", "Honey shots", "Honey Ashwagandha", "1 shot", 35, true], ["h6", "Honey shots", "Glow", "1 shot", 35, true], ["h7", "Honey shots", "Gut", "1 shot", 35, true], ["h8", "Honey shots", "Sleep", "1 shot", 35, true], ["h9", "Honey shots", "Hydrate", "1 shot", 30, true], ["h10", "Honey shots", "Focus", "1 shot", 35, true], ["h11", "Honey shots", "Immune", "1 shot", 30, true], ["h12", "Honey shots", "Recover", "1 shot", 30, true], ["hstam", "Honey shots", "Stamina", "1 shot", 35, true], ["h14", "Honey shots", "Salted Caramel", "1 shot", 35, true], ["h15", "Honey shots", "Kesar Pista Kulfi", "1 shot", 45, true], ["h16", "Honey shots", "Choco Hazelnut", "1 shot", 45, true], ["h17", "Honey shots", "Masala Chai", "1 shot", 30, true], ["h18", "Honey shots", "Thandai", "1 shot", 40, true], ["h19", "Honey shots", "Paan Mukhwas", "1 shot", 35, true], ["h20", "Honey shots", "Peanut Chikki", "1 shot", 30, true], ["h21", "Honey shots", "Chatpata Mango", "1 shot", 35, true], ["h22", "Honey shots", "Cinnamon Roll", "1 shot", 30, true], ["h23", "Honey shots", "Coconut Ladoo", "1 shot", 35, true], ["h24", "Honey shots", "Spiced Cookie", "1 shot", 30, true], ["sx26", "Snacks", "Peri Peri Makhana", "60 g", 99, true], ["sx26", "Snacks", "Peri Peri Makhana", "150 g", 229, true], ["sx27", "Snacks", "Jowar Millet Puffs", "50 g", 60, true], ["sx27", "Snacks", "Jowar Millet Puffs", "5 pack", 279, true], ["sx28", "Snacks", "Date and Nut Bites", "6 pieces", 149, true], ["sx28", "Snacks", "Date and Nut Bites", "12 pieces", 279, true], ["sx29", "Snacks", "Ragi Chips", "75 g", 70, true], ["sx29", "Snacks", "Ragi Chips", "4 pack", 259, true], ["sx30", "Snacks", "Honey Trail Mix", "100 g", 179, true], ["sx30", "Snacks", "Honey Trail Mix", "250 g", 419, true], ["sx31", "Atta and dals", "Fresh Chakki Atta", "1 kg", 65, true], ["sx31", "Atta and dals", "Fresh Chakki Atta", "5 kg", 310, true], ["sx31", "Atta and dals", "Fresh Chakki Atta", "10 kg", 599, true], ["sx32", "Atta and dals", "Jowar Atta", "1 kg", 85, true], ["sx32", "Atta and dals", "Jowar Atta", "5 kg", 399, true], ["sx33", "Atta and dals", "Ragi Atta", "1 kg", 90, true], ["sx33", "Atta and dals", "Ragi Atta", "5 kg", 425, true], ["sx34", "Atta and dals", "Multigrain Atta", "1 kg", 95, true], ["sx34", "Atta and dals", "Multigrain Atta", "5 kg", 449, true], ["sx35", "Atta and dals", "Unpolished Toor Dal", "500 g", 99, true], ["sx35", "Atta and dals", "Unpolished Toor Dal", "1 kg", 189, true], ["sx36", "Atta and dals", "Unpolished Moong Dal", "500 g", 89, true], ["sx36", "Atta and dals", "Unpolished Moong Dal", "1 kg", 169, true], ["sx37", "Spices and paste", "Guntur Mirchi Powder", "200 g", 95, true], ["sx37", "Spices and paste", "Guntur Mirchi Powder", "500 g", 219, true], ["sx38", "Spices and paste", "Haldi Powder", "200 g", 75, true], ["sx38", "Spices and paste", "Haldi Powder", "500 g", 175, true], ["sx39", "Spices and paste", "Dhaniya Powder", "200 g", 60, true], ["sx39", "Spices and paste", "Dhaniya Powder", "500 g", 139, true], ["sx40", "Spices and paste", "Ginger Garlic Paste", "200 g", 55, true], ["sx40", "Spices and paste", "Ginger Garlic Paste", "500 g", 125, true], ["ox41", "Pressed oils", "Groundnut Oil", "500 ml", 180, true], ["ox41", "Pressed oils", "Groundnut Oil", "1 L", 340, true], ["ox41", "Pressed oils", "Groundnut Oil", "5 L", 1599, true], ["ox42", "Pressed oils", "Sesame Oil", "500 ml", 250, true], ["ox42", "Pressed oils", "Sesame Oil", "1 L", 480, true], ["ox43", "Pressed oils", "Coconut Oil", "500 ml", 260, true], ["ox43", "Pressed oils", "Coconut Oil", "1 L", 499, true], ["ox44", "Pressed oils", "Safflower Oil", "1 L", 360, true], ["ox44", "Pressed oils", "Safflower Oil", "5 L", 1699, true], ["ox45", "Pressed oils", "Mustard Oil", "1 L", 320, true]];

function props_() { return PropertiesService.getScriptProperties(); }
function ownerEmail_() { return props_().getProperty("NOTIFY_EMAIL") || Session.getEffectiveUser().getEmail(); }
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(v) { v = String(v == null ? "" : v).slice(0, 600); return /^[=+\-@]/.test(v) ? "'" + v : v; }
function isAdmin_(key) { var k = props_().getProperty("ADMIN_KEY"); return !!k && String(key || "") === k; }
function cache_() { return CacheService.getScriptCache(); }
/** Allows at most `max` hits per `secs` for this name; returns false once the limit is reached. */
function rate_(name, max, secs) { var c = cache_(), k = "r_" + Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, name)), n = Number(c.get(k) || 0);
  if (n >= max) return false; c.put(k, String(n + 1), secs); return true; }
/** Locks the order desk for 15 minutes after 10 wrong keys in a row, so the key can't be guessed. */
function adminOk_(key) { var c = cache_(), bad = Number(c.get("adminBad") || 0); if (bad >= 10) return false;
  if (isAdmin_(key)) return true; c.put("adminBad", String(bad + 1), 900); return false; }
function newKey_() { return Utilities.getUuid().replace(/-/g, "") .slice(0, 24); }
/** Run this if your admin key may have leaked: makes a new key, emails it to you, and the old one stops working. */
function newAdminKey() { props_().setProperty("ADMIN_KEY", newKey_());
  MailApp.sendEmail(ownerEmail_(), "Your new Foodlee order desk key", "Your order desk key was changed.\n\nNew admin key: " + props_().getProperty("ADMIN_KEY") +
    "\n\nSign in again at https://www.foodlee.in/admin.html. The old key no longer works."); Logger.log("New admin key emailed to " + ownerEmail_()); }
/** Cheapest honest total for the items we can price from the Products tab (used to catch tampered totals). */
function minTotal_(items, sub) { var p = book_().getSheetByName("Products"), price = {}, sum = 0;
  if (!p || p.getLastRow() < 2) return 0;
  p.getRange(2, 1, p.getLastRow() - 1, 5).getValues().forEach(function (r) { price[String(r[0]) + "|" + String(r[3])] = Number(r[4]) || 0; });
  (items || []).forEach(function (i) { if (i && i.pid) sum += (price[String(i.pid) + "|" + String(i.label)] || 0) * Math.max(0, Number(i.n) || 0); });
  return Math.floor(sum * (sub ? 0.9 : 1)); }

/** Run once. Creates the tabs, fills product prices and emails you the admin key. */
function setup() {
  var ss = book_();
  var p = ss.getSheetByName("Products") || ss.insertSheet("Products");
  if (p.getLastRow() === 0) {
    p.getRange(1, 1, 1, 6).setValues([["ID (do not change)", "Shelf", "Product", "Size", "Price (₹)", "Available"]]).setFontWeight("bold");
    p.getRange(2, 1, SEED.length, 6).setValues(SEED);
    p.getRange(2, 6, SEED.length, 1).insertCheckboxes();
    p.setFrozenRows(1); p.autoResizeColumns(1, 6);
  }
  var o = ss.getSheetByName("Orders") || ss.insertSheet("Orders", 0);
  if (o.getLastRow() === 0) {
    o.getRange(1, 1, 1, ORDER_HEAD.length).setValues([ORDER_HEAD]).setFontWeight("bold").setBackground("#FBEBDD");
    o.setFrozenRows(1);
    o.getRange(2, COL["Status"], 3000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(STATUSES, true).build());
    o.getRange(2, COL["Payment"], 3000, 1).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(PAYMENTS, true).build());
  }
  var m = ss.getSheetByName("Messages") || ss.insertSheet("Messages");
  if (m.getLastRow() === 0) { m.getRange(1, 1, 1, 5).setValues([["Time", "Name", "Phone or email", "Message", "Replied?"]]).setFontWeight("bold"); m.setFrozenRows(1); }
  var sh1 = ss.getSheetByName("Sheet1"); if (sh1 && sh1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(sh1);
  Logger.log("Order sheet: " + ss.getUrl());

  if (!props_().getProperty("ADMIN_KEY")) props_().setProperty("ADMIN_KEY", newKey_());
  MailApp.sendEmail(ownerEmail_(), "Your Foodlee order desk key",
    "Your Foodlee order desk is ready.\n\nAdmin key: " + props_().getProperty("ADMIN_KEY") +
    "\n\nOpen https://www.foodlee.in/admin.html and sign in with this key to see and manage orders.\nKeep it private: anyone with the key can see customer orders.");
  Logger.log("Setup done. Admin key sent to " + ownerEmail_());
}

/** Optional: instant phone alerts through Telegram. Fill in the two values, then Run once. */
function setTelegram() {
  props_().setProperty("TELEGRAM_TOKEN", "PASTE_BOT_TOKEN_HERE");
  props_().setProperty("TELEGRAM_CHAT", "PASTE_CHAT_ID_HERE");
  notify_("Test", "Foodlee alerts are on. You will get a message here for every new order.");
}

function notify_(subject, body) {
  try { MailApp.sendEmail(ownerEmail_(), subject, body); } catch (e) {}
  var t = props_().getProperty("TELEGRAM_TOKEN"), c = props_().getProperty("TELEGRAM_CHAT");
  if (t && c && t.indexOf("PASTE") < 0) {
    try { UrlFetchApp.fetch("https://api.telegram.org/bot" + t + "/sendMessage", { method: "post", payload: { chat_id: c, text: subject + "\n\n" + body }, muteHttpExceptions: true }); } catch (e) {}
  }
}

function orders_() { return book_().getSheetByName("Orders"); }
function findRow_(sh, id) {
  if (sh.getLastRow() < 2) return 0;
  var ids = sh.getRange(2, COL["Order ID"], sh.getLastRow() - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

function doGet(e) {
  var a = e.parameter.action || "products", ss = book_();
  if (a === "status") {
    var want = String(e.parameter.ids || "").split(",").filter(String), out = {}, sh = orders_();
    if (sh && sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, ORDER_HEAD.length).getValues().forEach(function (r) {
      var id = String(r[COL["Order ID"] - 1]); if (want.indexOf(id) > -1) out[id] = { status: r[COL["Status"] - 1], payment: r[COL["Payment"] - 1] };
    });
    return json_({ status: out });
  }
  if (a === "orders") return json_({ ok: false, error: "Use the order desk to sign in." });
  var p = ss.getSheetByName("Products"); if (!p || p.getLastRow() < 2) return json_({ products: [] });
  var prods = p.getRange(2, 1, p.getLastRow() - 1, 6).getValues().filter(function (r) { return r[0]; })
    .map(function (r) { return { id: String(r[0]), size: String(r[3]), price: Number(r[4]), available: r[5] !== false && String(r[5]).toLowerCase() !== "false" }; });
  return json_({ products: prods });
}

function deskData_(ss) {
    var sh2 = orders_(), rows = [];
    if (sh2 && sh2.getLastRow() > 1) {
      var n = Math.min(300, sh2.getLastRow() - 1), start = sh2.getLastRow() - n + 1;
      sh2.getRange(start, 1, n, ORDER_HEAD.length).getValues().forEach(function (r) {
        var o = {}; ORDER_HEAD.forEach(function (h, i) { o[h] = r[i] instanceof Date ? r[i].toISOString() : r[i]; }); rows.push(o);
      });
    }
    var ms = ss.getSheetByName("Messages"), msgs = [];
    if (ms && ms.getLastRow() > 1) ms.getRange(Math.max(2, ms.getLastRow() - 49), 1, Math.min(50, ms.getLastRow() - 1), 5).getValues()
      .forEach(function (r) { msgs.push({ time: r[0] instanceof Date ? r[0].toISOString() : r[0], name: r[1], reach: r[2], message: r[3], replied: r[4] }); });
    return { ok: true, orders: rows.reverse(), messages: msgs.reverse() };
}

function phoneOf_(v) { return String(v || "").replace(/\D/g, "").slice(-10); }
function doPost(e) {
  var o; try { o = JSON.parse(e.postData.contents); } catch (x) { return json_({ ok: false, error: "bad request" }); }
  if (!o || typeof o !== "object" || String(e.postData.contents).length > 20000) return json_({ ok: false, error: "bad request" });
  var a = o.action || "order";
  /* order desk: key travels only inside the request body */
  if (a === "orders") { if (!adminOk_(o.key)) return json_({ ok: false, error: "key" }); return json_(deskData_(book_())); }
  if (a === "set" && !adminOk_(o.key)) return json_({ ok: false, error: "key" });
  /* spam and flood limits */
  if (a === "order") {
    var ph = phoneOf_(o.phone);
    if (!/^\d{10}$/.test(ph) || !String(o.name || "").trim() || String(o.name).length > 80 || !/^\d{6}$/.test(String(o.pin || "").trim()) ||
        String(o.addr || "").trim().length < 5 || !/^FL-\d{6}$/.test(String(o.id || "")) || !(Number(o.total) > 0 && Number(o.total) < 100000) ||
        !Array.isArray(o.items) || !o.items.length || o.items.length > 60) return json_({ ok: false, error: "Please check your order details." });
    if (!rate_("order:" + ph, 5, 600) || !rate_("orders:all", 80, 600)) return json_({ ok: false, error: "Too many orders right now. Please wait a few minutes or contact us." });
  }
  if (a === "contact") {
    if (!String(o.message || "").trim() || String(o.message).length > 3000) return json_({ ok: false, error: "Please write a message." });
    if (!rate_("contact:" + String(o.reach || "").toLowerCase(), 3, 3600) || !rate_("contact:all", 40, 3600)) return json_({ ok: false, error: "Too many messages. Please try again later." });
  }
  if ((a === "paid" || a === "paymode") && !rate_("upd:" + String(o.id), 6, 3600)) return json_({ ok: false, error: "Too many tries." });
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var ss = book_(), sh = orders_();
    if (a === "order") {
      if (findRow_(sh, o.id)) return json_({ ok: true, duplicate: true });
      if (!/^https:\/\/maps\.google\.com\/\?q=-?[\d.]+,-?[\d.]+$/.test(String(o.map || ""))) o.map = "";
      var low = minTotal_(o.items, o.sub), flag = Number(o.total) < low - 1 ? "⚠ CHECK PRICE: total ₹" + o.total + " is below the shop price ₹" + low + ". " : "";
      if (flag) o.itemsText = flag + o.itemsText;
      sh.appendRow([new Date(), clean_(o.id), "New", clean_(o.payStatus || ""), clean_(o.pay), "", clean_(o.name), clean_(o.phone), clean_(o.itemsText),
        Number(o.total) || 0, clean_(o.area), clean_(o.addr), clean_(o.land), clean_(o.pin), clean_(o.map), clean_(o.slot), o.sub ? "Yes" : "No"]);
      notify_((flag ? "⚠ " : "") + "🛒 New order " + o.id + " · ₹" + o.total + " · " + (o.pay || ""),
        String(o.itemsText).split("; ").join("\n") + "\n\nTotal: ₹" + o.total + " (" + o.pay + ")\nPayment: " + (o.payStatus || "") +
        "\n\n" + o.name + " · " + o.phone + "\n" + o.addr + ", " + o.area + (o.land ? "\nLandmark: " + o.land : "") + "\nPincode: " + o.pin +
        (o.map ? "\nMap: " + o.map : "") + "\nDelivery: " + o.slot + (o.sub ? "\nRepeat monthly: yes" : "") + "\n\nManage: https://www.foodlee.in/admin.html");
      return json_({ ok: true });
    }
    if (a === "paid" || a === "paymode") {
      var row = findRow_(sh, o.id); if (!row) return json_({ ok: false, error: "not found" });
      if (phoneOf_(sh.getRange(row, COL["Phone"]).getValue()) !== phoneOf_(o.phone)) return json_({ ok: false, error: "not found" });
      if (a === "paid") {
        sh.getRange(row, COL["Payment"]).setValue("Payment sent, being verified");
        sh.getRange(row, COL["UPI ref"]).setValue(clean_(o.utr || ""));
        notify_("💰 Payment claimed for " + o.id, "The customer says they paid by UPI." + (o.utr ? "\nUPI ref: " + o.utr : "") + "\nCheck your UPI app, then mark it Paid in the order desk.");
      } else {
        sh.getRange(row, COL["Pay with"]).setValue(clean_(o.pay)); sh.getRange(row, COL["Payment"]).setValue("Cash on delivery");
        notify_("Order " + o.id + " switched to cash on delivery", "Collect cash on delivery.");
      }
      return json_({ ok: true });
    }
    if (a === "contact") {
      (ss.getSheetByName("Messages") || ss.insertSheet("Messages")).appendRow([new Date(), clean_(o.name), clean_(o.reach), clean_(o.message), ""]);
      notify_("✉️ New message from " + o.name, o.message + "\n\nReply to: " + o.reach);
      return json_({ ok: true });
    }
    if (a === "set") {
      var r2 = findRow_(sh, o.id); if (!r2) return json_({ ok: false, error: "not found" });
      if (o.status && STATUSES.indexOf(o.status) > -1) sh.getRange(r2, COL["Status"]).setValue(o.status);
      if (o.payment && PAYMENTS.indexOf(o.payment) > -1) sh.getRange(r2, COL["Payment"]).setValue(o.payment);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: "unknown action" });
  } catch (err) {
    return json_({ ok: false, error: "Something went wrong. Please try again." });
  } finally { lock.releaseLock(); }
}
