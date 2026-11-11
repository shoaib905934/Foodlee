package in.foodlee.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Foodlee app: shows www.foodlee.in full screen and hands UPI, WhatsApp, phone and email links to the right apps. */
public class MainActivity extends Activity {
    private static final String HOME = "https://www.foodlee.in/?source=android";
    private static final int LOCATION_REQUEST = 7;
    private WebView web;
    private String geoOrigin;
    private GeolocationPermissions.Callback geoCallback;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#FBF5EA"));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUserAgentString(s.getUserAgentString() + " FoodleeApp/" + BuildConfigVersion());

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return route(request.getUrl());
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    view.loadDataWithBaseURL(null,
                        "<html><body style='margin:0;font-family:sans-serif;background:#DA582F;color:#FDF3DF;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;text-align:center;padding:24px'>"
                        + "<h2 style='margin:0 0 8px'>You’re offline</h2><p style='margin:0 0 20px'>Check your internet connection and try again.</p>"
                        + "<a href='" + HOME + "' style='background:#FDF3DF;color:#DA582F;padding:12px 22px;border-radius:99px;font-weight:bold;text-decoration:none'>Try again</a></body></html>",
                        "text/html", "utf-8", null);
                }
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                if (Build.VERSION.SDK_INT < 23 || checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false);
                } else {
                    geoOrigin = origin;
                    geoCallback = callback;
                    requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION_REQUEST);
                }
            }
        });

        Uri link = getIntent() != null ? getIntent().getData() : null;
        if (state != null) web.restoreState(state);
        else web.loadUrl(link != null && isFoodlee(link) ? link.toString() : HOME);
    }

    private String BuildConfigVersion() {
        try { return getPackageManager().getPackageInfo(getPackageName(), 0).versionName; } catch (Exception e) { return "1"; }
    }

    private static boolean isFoodlee(Uri u) {
        String h = u.getHost();
        return ("https".equals(u.getScheme()) || "http".equals(u.getScheme())) && h != null && (h.equals("foodlee.in") || h.endsWith(".foodlee.in"));
    }

    /** Foodlee pages stay in the app; UPI, WhatsApp, phone, email and other sites open in their own apps. */
    private boolean route(Uri u) {
        if (isFoodlee(u) && !u.getPath().endsWith(".apk")) return false;
        try {
            Intent i = "intent".equals(u.getScheme()) ? Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME) : new Intent(Intent.ACTION_VIEW, u);
            if ("upi".equals(u.getScheme())) i = Intent.createChooser(i, "Pay with");
            startActivity(i);
        } catch (ActivityNotFoundException e) {
            if ("upi".equals(u.getScheme())) web.evaluateJavascript("typeof toast==='function'&&toast('No UPI app found. Scan the QR code from another phone, or choose cash on delivery.')", null);
        } catch (Exception ignored) { }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] permissions, int[] results) {
        if (code == LOCATION_REQUEST && geoCallback != null) {
            boolean ok = results.length > 0 && results[0] == PackageManager.PERMISSION_GRANTED;
            geoCallback.invoke(geoOrigin, ok, false);
            geoCallback = null;
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        Uri link = intent.getData();
        if (link != null && isFoodlee(link)) web.loadUrl(link.toString());
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }
}
