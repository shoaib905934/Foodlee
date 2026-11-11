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
Until a signing key is added, GitHub signs each build with a temporary test key. Those builds install fine,
but a newer build cannot update an older one: the phone must uninstall the old app first.

To fix that (and before publishing on Google Play), create one private signing key and add it to
GitHub → Settings → Secrets and variables → Actions as:
`ANDROID_KEYSTORE_B64` (the keystore file, base64-encoded), `ANDROID_KEYSTORE_PASSWORD`,
`ANDROID_KEY_ALIAS` and `ANDROID_KEY_PASSWORD`. Never commit the key or its passwords to this repository.
