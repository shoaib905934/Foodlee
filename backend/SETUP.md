# Connect the Foodlee order desk (about 10 minutes, free)

Orders from www.foodlee.in and the Android app will be saved in a Google Sheet, emailed to you,
and shown on your order desk at www.foodlee.in/admin.html.

1. Go to sheets.google.com and create a blank sheet named **Foodlee Order Desk**.
2. Open **Extensions → Apps Script**. Delete what is there and paste everything from `backend/Code.gs`. Save.
3. In the function menu at the top choose **setup** and press **Run**.
   Google asks for permission: choose your account → Advanced → Go to project → **Allow**.
   You get an email titled "Your Foodlee order desk key".
4. Click **Deploy → New deployment → gear icon → Web app**.
   Execute as: **Me**. Who has access: **Anyone**. Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
5. Paste that URL into `config.js` as `sheetUrl`, and fill in `whatsapp` and `upiId`.
6. Open www.foodlee.in/admin.html on your phone and sign in with the key from the email.

## Notifications
- **Email:** every order, payment claim and contact message is emailed to you. Turn on Gmail notifications on your phone.
- **Order desk:** keep admin.html open; it checks every 20 seconds and plays a sound with a notification for new orders.
- **Telegram (optional, instant):** create a bot with @BotFather, get your chat ID, put both into the
  `setTelegram` function in Apps Script and run it once.

## Daily use
- Change a price or mark a product unavailable in the **Products** tab.
- Manage orders on the order desk: Confirm → Packed → Out for delivery → Delivered, and "Mark paid" after you see the UPI payment.
- If you edit `Code.gs` later: Deploy → Manage deployments → Edit → New version, so the same URL keeps working.
