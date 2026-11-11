# Foodlee Android app

A small Android app that opens www.foodlee.in full screen, keeps customers signed in to their cart and orders,
and hands UPI, WhatsApp, phone and email links to the right apps on the phone.

## How it gets built
Every change pushed to the `android/` folder makes GitHub build a new APK automatically
(see `.github/workflows/android.yml`). The newest build is always at:

https://github.com/shoaib905934/Foodlee/releases/latest/download/foodlee.apk

The website footer links to it as "Get the Android app". Website changes do not need a new APK:
the app always shows the live site.

## Installing it on a phone
Open the link above on an Android phone, download `foodlee.apk`, open it and allow "Install unknown apps"
for your browser when asked.

## Signing key
The app is signed with a private Foodlee key stored only as the GitHub secret `ANDROID_SIGNING`
(Settings → Secrets and variables → Actions). It is never stored in this repository.
Until that secret exists, GitHub signs builds with a temporary test key, and a newer build cannot update an older one.
Keep your backup copy of the key safe: the same key is needed for every future update and for the Google Play Store.
