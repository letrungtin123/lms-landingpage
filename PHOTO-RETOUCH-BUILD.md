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

1. Inlines `cosmos-hero.css`, `style.css`, `workflow-pricing.css`, `trial-modal.css`, and `footer-cta-faq.css`.
2. Inlines `assets/js/animations.js`, `cosmos-hero.js`, `workflow-pricing.js`, `script.js`, `trial-modal.js`, and `footer-cta-faq.js` in their original execution order.
3. Downloads and caches GSAP 3.12.5 plus ScrollTrigger once under `%LOCALAPPDATA%\NessoPhotoRetouchBuild`, then inlines them in the final HTML.
4. Replaces every known local image URL with its WordPress Media Library URL.
5. Adds the source Git short SHA as build metadata.
6. Fails the build if a local CSS, JavaScript, or image dependency remains in the output.

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

Example iframe structure:

```html
<iframe
  src="https://nesso.vn/wp-content/uploads/2026/10/nesso-photo-retouch-standalone.html?v=BUILD_REVISION"
  title="Nesso Photo Retouching"
  loading="lazy"
  style="display:block;width:100%;min-height:100vh;border:0;"
></iframe>
```

The exact iframe height and parent-to-iframe resize behavior should be set in the WordPress block wrapper when the final upload URL is available.

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

