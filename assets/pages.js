/* Fills business details from config.js into the information pages, and sends the contact form */
(function () {
  var C = window.FOODLEE || {};
  var digits = function (s) { return String(s || "").replace(/\D/g, ""); };
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var v = C[el.getAttribute("data-cfg")] || "";
    if (el.hasAttribute("data-link")) {
      var kind = el.getAttribute("data-link");
      if (!v) { el.textContent = ""; return; }
      el.textContent = v;
      el.href = kind === "mail" ? "mailto:" + v : kind === "tel" ? "tel:+" + digits(v).replace(/^(?!91)/, "91") : kind === "wa" ? "https://wa.me/" + digits(v) : v;
      if (kind === "wa") el.textContent = "+" + digits(v);
    } else el.textContent = v;
  });
  document.querySelectorAll("[data-need]").forEach(function (el) {
    var keys = el.getAttribute("data-need").split(" ");
    if (!keys.some(function (k) { return C[k]; })) el.hidden = true;
  });
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById("contact-form");
  if (!form) return;
  var msg = document.getElementById("contact-msg");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var d = Object.fromEntries(new FormData(form));
    if (!d.name.trim() || !d.reach.trim() || d.message.trim().length < 5) { msg.className = "err"; msg.textContent = "Add your name, a phone number or email, and your message."; return; }
    if (!C.sheetUrl) { msg.className = "note"; msg.innerHTML = "Please email us at <a href=\"mailto:" + C.supportEmail + "\">" + C.supportEmail + "</a> for now."; return; }
    var btn = form.querySelector("button"); btn.disabled = true; msg.className = "note"; msg.textContent = "Sending…";
    fetch(C.sheetUrl, { method: "POST", body: JSON.stringify({ action: "contact", name: d.name, reach: d.reach, message: d.message }) })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j.ok) throw 0; form.reset(); msg.className = "ok"; msg.textContent = "Thanks! We’ve got your message and will reply within one working day."; })
      .catch(function () { msg.className = "err"; msg.innerHTML = "That didn’t send. Please email <a href=\"mailto:" + C.supportEmail + "\">" + C.supportEmail + "</a>."; })
      .finally(function () { btn.disabled = false; });
  });
})();
