/*
 * FOODLEE SETTINGS — the one place to change business details.
 * Every page of the website and the app reads from here.
 * Leave a value as "" to hide it on the site.
 */
window.FOODLEE = {
  // Orders, prices and contact messages go to your Google Sheet through this link (see backend/SETUP.md)
  sheetUrl: "",

  // WhatsApp Business number: country code + number, digits only, e.g. "919876543210"
  whatsapp: "",

  // UPI payments: your UPI ID (VPA) and the name customers see in their UPI app
  upiId: "",
  upiName: "Foodlee",

  // Support details shown in the footer, Contact page and policies
  supportEmail: "support@foodlee.in",
  supportPhone: "",          // e.g. "+91 98765 43210"
  hours: "9 am – 9 pm, every day",
  city: "Hyderabad, Telangana",
  address: "",               // full business address, shown on Contact and policy pages
  legalName: "Foodlee",      // registered business / proprietor name used in the policies
  fssai: "",                 // FSSAI licence or registration number
  gstin: "",                 // GSTIN, if registered
  founder: "",               // founder name for the About page

  // Social profiles (full links)
  instagram: "",
  facebook: "",

  // Android app download (built automatically by GitHub; see .github/workflows/android.yml)
  apkUrl: "https://github.com/shoaib905934/Foodlee/releases/latest/download/foodlee.apk"
};
