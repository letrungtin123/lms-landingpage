# Photo Retouch Landing Page: Build and WordPress Release

## Purpose

`Landingpage-Photo-Retouch` is the source repository for the Photo Retouch landing page. It is maintained independently, so its files must not be changed merely to prepare a WordPress release.

The release artifact is generated outside that repository:

```text
D:\LMSLandingPage\Landingpage-Photo-Retouch\        Source clone
D:\LMSLandingPage\build-photo-retouch-standalone.ps1 Builder
D:\LMSLandingPage\nesso-photo-retouch-standalone.html WordPress artifact
```

The standalone artifact is the only HTML file that needs to be uploaded for a release. It contains all local CSS, local JavaScript, GSAP, and ScrollTrigger inline. Images resolve from the WordPress Media Library URLs.

## Local Preview

Do not use a file manager preview as the release check. Run the source through its static server:

```powershell
cd D:\LMSLandingPage\Landingpage-Photo-Retouch
node server.js
```

Open `http://localhost:3000`.

The source repo also exposes this through npm:

```powershell
npm run dev
```

Stop the server with `Ctrl+C` when finished.

## Build Command

After pulling source changes, generate a new artifact from the workspace root:

```powershell
cd D:\LMSLandingPage
powershell -ExecutionPolicy Bypass -File .\build-photo-retouch-standalone.ps1
```

The builder uses the source repository's current Git revision and reports:

- Source revision used for the artifact.
- Output file location.
- Number of WordPress assets mapped.
- Number of external Unsplash images retained.
- Final standalone file size.

To build from a different source checkout or write to a different destination:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-photo-retouch-standalone.ps1 `
  -SourceDir D:\Somewhere\Landingpage-Photo-Retouch `
  -OutputPath D:\Releases\nesso-photo-retouch-standalone.html
```

## What the Builder Does

The builder reads the current `index.html` and then:

1. Inlines `cosmos-hero.css`, `style.css`, `approach-video.css`, `workflow-pricing.css`, `trial-modal.css`, and `footer-cta-faq.css`.
2. Inlines `assets/js/animations.js`, `cosmos-hero.js`, `workflow-pricing.js`, `script.js`, `approach-video.js`, `trial-modal.js`, and `footer-cta-faq.js` in their original execution order.
3. Downloads and caches GSAP 3.12.5 plus ScrollTrigger once under `%LOCALAPPDATA%\NessoPhotoRetouchBuild`, then inlines them in the final HTML.
4. Inlines the WordPress release layer `WP/photo-retouch-thank-you.js` (the `#thank-you` view) before `</body>`. It lives outside the source repository.
5. Replaces every known local image URL with its WordPress Media Library URL.
6. Adds the source Git short SHA as build metadata.
7. Fails the build if a local CSS, JavaScript, or image dependency remains in the output.

This means a later `git pull` only requires running the build command again. The output is generated separately and does not create a merge conflict in `Landingpage-Photo-Retouch`.

## WordPress Asset Mapping

All local image references resolve under:

```text
https://nesso.vn/wp-content/uploads/2026/10/
```

Most source filenames remain unchanged. WordPress generated two alternate filenames during upload, and the builder deliberately maps them as follows:

| Source reference | WordPress filename |
| --- | --- |
| `service-model-after.png` | `service-model-after-scaled.jpg` |
| `service-model-before.png` | `service-model-before-scaled.jpg` |
| `video-thumb.png` | `video-thumb.jpg` |

The remaining mapped assets use the same filename in source and WordPress, including the logo, client logos, product images, slider handle, and zoom images.

When new local images are added to the source project:

1. Upload the asset to WordPress while keeping its filename whenever possible.
2. Add its source-to-WordPress mapping to `build-photo-retouch-standalone.ps1`.
3. Rebuild. The validation must report no local asset references.

## WordPress Release Process

1. Pull the latest source code in `Landingpage-Photo-Retouch`.
2. Run `node server.js` and visually verify the page at `http://localhost:3000`.
3. Run `build-photo-retouch-standalone.ps1` from `D:\LMSLandingPage`.
4. Open `nesso-photo-retouch-standalone.html` in a browser for a final smoke test.
5. Upload the generated HTML file to its WordPress-hosted location.
6. Embed that URL through an iframe in the WordPress page/block, rather than pasting the HTML and scripts directly into the editor.
7. Add or update the iframe cache version when replacing the hosted file.

Use the complete `block-html-photo-retouch-wp.html` in the Elementor HTML widget, not a bare iframe. Its parent listener forwards analytics and handles the Thank You navigation and route. The builder updates its cache version. The child document owns scrolling in a viewport-height iframe.

## Thank You Route for Google Ads (2026-10-13)

The conversion URL is `https://nesso.vn/nesso-retouch-thank-you/`.
Like the LMS routes, it is a rewrite route in `WP/function-wp.php`, not a separate
WordPress page: WordPress renders the `/nesso-retouch/` page there, so the site's
Google tag loads through its normal hooks. The wrapper sees the path and loads the
iframe with `#thank-you`, which shows the success modal over the landing page.
Closing that modal returns the address bar to `/nesso-retouch/` without a reload.

### Deploy in this order

1. Back up the active child-theme `functions.php`. Apply the updated contents of
   `WP/function-wp.php` to the same theme location used for the existing trial
   endpoint. Do not add a second copy in WPCode or Code Snippets. The route
   flushes rewrite rules whenever its rule is missing; no WordPress page is needed.
   If **Appearance > Theme File Editor** shows "An error occurred while saving
   your changes", reload the editor once (an expired nonce causes this) and retry.
   If it persists, the save request is blocked or timing out on the host: copy
   the old file to a backup, then paste the new contents with cPanel
   **File Manager > Edit**, and load the site immediately to confirm it works.
2. Upload the rebuilt `nesso-photo-retouch-standalone.html` to its existing Media
   Library location. Replace the HTML widget on `/nesso-retouch/` with the complete
   rebuilt `block-html-photo-retouch-wp.html`. Update the page.
3. Exclude `/nesso-retouch-thank-you/` from every active full-page cache, including
   SiteGround/Speed Optimizer, LiteSpeed, and any Cloudflare Cache Everything rule.
   Never cache POST requests to `/wp-json/nesso-lms/v1/photo-retouch-trial`.
   For Cloudflare, bypass cache when **URI Path equals
   `/nesso-retouch-thank-you/`**; do not turn off caching for the whole site.
   PHP sends `no-store`, `X-LiteSpeed-Cache-Control: no-cache` and sets
   `DONOTCACHEPAGE`, but a cache that responds before PHP runs must be excluded
   separately.
4. Purge the cache for `/nesso-retouch/` and `/nesso-retouch-thank-you/`. The old
   404 of the thank-you URL may still be cached.
5. If the thank-you URL still returns 404, open **Settings > Permalinks** and click
   **Save Changes** once to rebuild rewrite rules.

### Behavior and safety

- A successful request retains the current upload storage, submission log, email
  template, recipient (`contact@nesso.vn`), and public download links.
- Only after `wp_mail()` returns true does the API issue a random, HttpOnly,
  same-site receipt cookie with a ten-minute lifetime. No personal data is placed
  in the cookie or conversion URL. This means the mail transport accepted the
  message; it does not prove final inbox delivery.
- The iframe tells the parent page to navigate only after a successful response.
  The parent validates the sending frame, origin, and exact destination. It waits
  500 ms for the existing GA4 success event; Google tags are not required for the
  navigation itself.
- The Thank You request consumes the receipt before page output. A direct visit,
  an expired receipt, or a reload redirects to the landing before tracking tags
  load. Back-forward cache restores also return to the landing.
- If the `/nesso-retouch/` page is not published, the rewrite rule is missing,
  the backend is old, or the wrapper is old, the existing success modal remains
  available. Those fallback successes do not generate a Thank You URL conversion.
- Pending/completed duplicate form submits are blocked in the UI. This is not
  server-side deduplication of independently retried HTTP requests.
- Previewing the protected URL directly redirects intentionally. To check the
  view's appearance, open the standalone HTML with `#thank-you` appended, or
  submit the form. Do not remove the receipt guard for an Ads URL scan.

### Hand off to marketing

Create a website conversion in Google Ads for **Submit lead form**, using a page
load rule **URL is** `https://nesso.vn/nesso-retouch-thank-you/`.
Use **Primary** for bidding and **Count: One** for lead counting. One means one
conversion per ad interaction, not one for every separate form sent by that same
visitor. Keep only one primary conversion action for this submission: do not
also import the same GA4 submit-success event as another primary conversion.

The Google tag must be connected to the correct Google Ads destination and run
on both the landing parent and Thank You page. The existing GA4 Measurement ID
alone does not establish that Ads is configured. Check the existing tag before
installing another one. No Ads account ID or conversion label was supplied for
this release, so Ads-side configuration is still a marketing/admin step.

References: [Google Ads URL conversions](https://support.google.com/google-ads/answer/16560108?hl=en-GB),
[Google tag setup](https://support.google.com/google-ads/answer/7548399?hl=en),
[Elementor Canvas](https://elementor.com/help/using-elementors-canvas-page-template/).

### Live acceptance test

1. Use a logged-out/incognito browser with analytics consent granted where
   applicable. Site Kit currently excludes logged-in visitors.
2. Submit a clearly marked test request with a small image. Confirm the request
   appears in **Retouch trials**, the team receives the email and its link opens.
3. Confirm the browser's TOP address bar changes to the Thank You URL (not just
   the iframe), and the success modal with Back to homepage appears over the
   landing. Clicking Back to homepage returns the address bar to `/nesso-retouch/`.
4. Refresh: it must return to `/nesso-retouch/`. Opening the Thank You URL in a
   fresh browser session must also return to the landing.
5. Use Google Tag Assistant to verify the selected Ads conversion fires once on
   a valid successful submission and does not fire on invalid fields, mail errors,
   direct visits, or reloads. Respect consent and ad-blocking settings; recording
   is not guaranteed for every visitor. Do not click your own live ad to test.

Local regression checks mock WordPress/SMTP/network and do not send real emails:

```powershell
node --test tests/photo-retouch-analytics.test.cjs
php tests/photo-retouch-thank-you.test.php
node tests/photo-retouch-form-smoke.cjs --standalone --motion
node tests/photo-retouch-thank-you-browser.cjs --standalone
```

Browser tests require Playwright plus installed Chrome. The Thank You browser
test saves screenshots under `%LOCALAPPDATA%\NessoPhotoRetouchBuild\qa`. The PHP
test requires a local PHP CLI.

## Mail Recovery Patch (2026-10-12)

Only `WP/function-wp.php` needs updating for this patch. The standalone HTML and
iframe wrapper are unchanged. The Photo Retouch frontend repository does not
contain the WordPress mail backend.

- Native PHP `Error`/`TypeError` and plugin exceptions during email preparation or
  sending are caught, logged, and returned as a structured API error. No false
  success or conversion is generated. Memory exhaustion/process termination is
  not guaranteed to be catchable and can still require hosting logs.
- Open **Retouch trials > the saved request** to see **Mail stage**, **Mail error**,
  **Last mail attempt**, and **Thank You error**. Error details remain in the private
  admin record, not the public REST response.
- Check the recipient inbox before retrying. A transport may accept an email
  before an unrelated plugin throws; `error` does not prove non-delivery.
- For a pending/failed/error request, **Retry email from saved request** reuses the
  existing customer details, plan, and public file links. No file reupload is
  needed, no new lead is created, and no Ads receipt is issued. Retry requires
  edit permission and a nonce; concurrent retries are locked and already-sent
  records are not resent. An interrupted retry lock expires after ten minutes.
- A thrown Thank You receipt error after a successful email now falls back to the
  existing success modal without reporting the whole submission as failed.
- This patch makes mail failures diagnosable/retryable in WP Admin. It does not
  supply SMTP credentials, enable a disabled PHP mail transport, or certify that
  the live hosting mail configuration is correct.

## External Dependencies

The final HTML intentionally retains these network resources:

- Google Fonts.
- 27 Unsplash image URLs used by the animated hero.

All source assets from `assets/images` are served from WordPress. If the hero must have no third-party image dependency, download approved replacements for the Unsplash images, upload them to WordPress, and add their mappings to the builder.

## Release Checks

Before publishing, confirm all of the following:

- The generated file opens without the source repository present.
- Hero creates 100 animated cards.
- Before/after sliders initialize and drag correctly.
- Pricing, trial modal, FAQ, and CTA interactions work.
- Browser console has no errors.
- Every mapped `nesso.vn/wp-content/uploads/2026/10/` image responds with HTTP `200`.
- The output contains no local `assets/images/...` URLs or local JavaScript/CSS file dependencies.
