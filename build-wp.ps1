# Build WordPress Elementor paste-ready HTML
$base = "d:\LMSLandingPage"
$wpBase = "https://nesso.vn/wp-content/uploads/2026/06/"

# Read source files
$html = Get-Content "$base\index.html" -Raw -Encoding UTF8
$css = Get-Content "$base\style.css" -Raw -Encoding UTF8
$js = Get-Content "$base\script.js" -Raw -Encoding UTF8

# Replace asset paths: assets/images/X.png -> wpBase/X.png etc.
$pattern = "assets/(?:images|svg|icons)/([^\x22\x27\)\s\?]+)"

# Count matches before replace
$allBefore = $html + $css + $js
$matchesBefore = [regex]::Matches($allBefore, $pattern)
$fileList = @{}
foreach ($m in $matchesBefore) {
    $fn = $m.Groups[1].Value
    if (-not $fileList.ContainsKey($fn)) { $fileList[$fn] = 0 }
    $fileList[$fn]++
}

# Do replacements
$htmlR = [regex]::Replace($html, $pattern, { param($m) $wpBase + $m.Groups[1].Value })
$cssR = [regex]::Replace($css, $pattern, { param($m) $wpBase + $m.Groups[1].Value })
$jsR = [regex]::Replace($js, $pattern, { param($m) $wpBase + $m.Groups[1].Value })

# Extract body content from HTML (between <body> and </body>)
$bodyMatch = [regex]::Match($htmlR, '(?s)<body[^>]*>(.*?)</body>')
$bodyContent = $bodyMatch.Groups[1].Value.Trim()

# Remove <script src="script.js"></script> from body
$bodyContent = $bodyContent -replace '<script\s+src="script\.js[^"]*">\s*</script>', ''
$bodyContent = $bodyContent.Trim()

# Change animated SVG <img> to <object> for SMIL animation support
$svgAnimated = @('connector-1.svg', 'connector-2.svg', 'connector-3.svg', 'vector-139.svg', 'vector-151.svg', 'vector-152.svg')
foreach ($svg in $svgAnimated) {
    $url = $wpBase + $svg
    # Match <img src="URL" ... class="CLASSES"> and replace with <object>
    $imgPattern = '<img\s+src="' + [regex]::Escape($url) + '"\s+alt="[^"]*"\s+class="([^"]*)"(?:\s+aria-hidden="[^"]*")?>'
    $bodyContent = [regex]::Replace($bodyContent, $imgPattern, { 
        param($m) 
        $cls = $m.Groups[1].Value
        '<object data="' + $url + '" type="image/svg+xml" class="' + $cls + '" aria-hidden="true"></object>'
    })
}

# CSS Reset for WordPress
$wpReset = @"
/* Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

/* =============================================
   WordPress Elementor Canvas - Full Override
   ============================================= */
html,
body,
.elementor-page,
.page-template-elementor_canvas,
.elementor-kit,
#page,
#content,
#primary,
.site,
.site-content,
.entry-content,
.elementor,
.elementor-inner,
.elementor-section-wrap,
.elementor-top-section,
.elementor-element,
.e-con {
  margin: 0 !important;
  padding: 0 !important;
  overflow-x: hidden !important;
  background: #000 !important;
  background-color: #000 !important;
  width: 100% !important;
}

/* Hide WP header/footer/title */
.elementor-location-header,
.elementor-location-footer,
.site-header,
.site-footer,
header.site-header,
footer.site-footer,
.page-header,
.entry-header,
.entry-title,
.wp-site-blocks > header,
.wp-site-blocks > footer {
  display: none !important;
}

/* Force Elementor containers to full width, no padding */
.elementor-widget-html,
.elementor-widget-html .elementor-widget-container,
.elementor-element,
.elementor-container,
.elementor-column,
.elementor-column-wrap,
.elementor-widget-wrap,
.elementor-section,
.elementor-section .elementor-container,
.elementor-section-wrap,
.elementor-top-section,
.elementor-inner-section,
.e-con,
.e-con-inner {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  box-sizing: border-box !important;
}

/* Override Elementor boxed layout */
.elementor-section.elementor-section-boxed > .elementor-container {
  max-width: 100% !important;
}

.elementor-section.elementor-section-full_width {
  width: 100% !important;
}

/* Remove Elementor gaps */
.elementor-column-gap-default > .elementor-column > .elementor-element-populated,
.elementor-column-gap-default > .elementor-row > .elementor-column > .elementor-element-populated {
  padding: 0 !important;
}

/* Force text color - cascade */
.page {
  color: #FFFFFF !important;
  margin: 0 auto !important;
}

.page a {
  color: inherit !important;
  text-decoration: none !important;
}

.page h1, .page h2, .page h3, .page h4, .page h5, .page h6,
.page p, .page span, .page li, .page blockquote, .page em, .page strong,
.page label, .page input {
  color: inherit !important;
}

.page a:hover, .page a:visited, .page a:focus {
  color: inherit !important;
}

/* Testimonial specific */
.page .testimonials__trust-stars {
  color: #FFD700 !important;
}

.page .testimonials__overlay-author {
  color: rgba(255,255,255,0.7) !important;
}

/* Footer specific */
.page .footer__member,
.page .footer__address {
  color: rgba(255,255,255,0.6) !important;
}

.page .footer__copyright {
  color: rgba(255,255,255,0.5) !important;
}

.page .footer__contact-email {
  color: rgba(255,255,255,0.7) !important;
}

.page .footer__input {
  color: #FFFFFF !important;
  background: transparent !important;
}

.page .footer__input::placeholder {
  color: rgba(255,255,255,0.4) !important;
}

/* Object SVG styles */
.core-values__connector,
.features__vector,
.features__bottom-line {
  border: none !important;
}

"@

# Build output
$output = "<style>`n$wpReset`n$cssR`n</style>`n`n$bodyContent`n`n<script>`n$jsR`n</script>"

# Write output
[System.IO.File]::WriteAllText("$base\wordpress-elementor-paste.html", $output, [System.Text.Encoding]::UTF8)

# Report
Write-Host "=== BUILD REPORT ==="
Write-Host "Output: $base\wordpress-elementor-paste.html"
Write-Host ""
Write-Host "Total asset paths replaced: $($matchesBefore.Count)"
Write-Host "Unique files: $($fileList.Count)"
Write-Host ""
Write-Host "Asset filenames:"
foreach ($k in ($fileList.Keys | Sort-Object)) {
    Write-Host "  $k (x$($fileList[$k]))"
}

# Verify
$outputContent = Get-Content "$base\wordpress-elementor-paste.html" -Raw -Encoding UTF8
$remaining = [regex]::Matches($outputContent, 'assets/')
Write-Host ""
Write-Host "Remaining 'assets/' references: $($remaining.Count)"

$objectTags = [regex]::Matches($outputContent, '<object ')
Write-Host "SVG <object> tags: $($objectTags.Count)"

$hasDoctype = $outputContent.Contains('<!DOCTYPE')
Write-Host "Contains DOCTYPE: $hasDoctype"
