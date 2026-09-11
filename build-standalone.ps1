# Build Standalone HTML for iframe embedding
$base = "d:\LMSLandingPage"
$wpBase = "https://nesso.vn/wp-content/uploads/2026/06/"
$proposalWpBase = "https://nesso.vn/wp-content/uploads/2026/07/"

# Read source files
$html = Get-Content "$base\index.html" -Raw -Encoding UTF8
$css = Get-Content "$base\style.css" -Raw -Encoding UTF8
$js = Get-Content "$base\script.js" -Raw -Encoding UTF8

# Read animated SVG files for inlining
$svgFiles = @{
    'connector-1' = Get-Content "$base\assets\svg\connector-1.svg" -Raw -Encoding UTF8
    'connector-2' = Get-Content "$base\assets\svg\connector-2.svg" -Raw -Encoding UTF8
    'connector-3' = Get-Content "$base\assets\svg\connector-3.svg" -Raw -Encoding UTF8
    'vector-139'  = Get-Content "$base\assets\svg\vector-139.svg" -Raw -Encoding UTF8
    'vector-151'  = Get-Content "$base\assets\svg\vector-151.svg" -Raw -Encoding UTF8
    'vector-152'  = Get-Content "$base\assets\svg\vector-152.svg" -Raw -Encoding UTF8
}

# Replace asset paths
$pattern = "assets/(images|svg|icons|proposal)/([^\x22\x27\)\?]+)"

function Get-WpAssetUrl {
    param(
        [string]$folder,
        [string]$fileName
    )

    if ($folder -eq "proposal") {
        $slideMatch = [regex]::Match($fileName, '^Slide\s+(\d+)_([A-Z]{2})\.png$')
        if ($slideMatch.Success) {
            $slideNumber = $slideMatch.Groups[1].Value
            $locale = $slideMatch.Groups[2].Value
            return $proposalWpBase + "Slide-${slideNumber}_${locale}-scaled.png"
        }

        $proposalFileName = ($fileName -replace ' ', '-')
        $proposalFileName = $proposalFileName -replace '\.png$', '-scaled.png'
        return $proposalWpBase + $proposalFileName
    }

    return $wpBase + ($fileName -replace ' ', '%20')
}

$allBefore = $html + $css + $js
$matchesBefore = [regex]::Matches($allBefore, $pattern)
$fileList = @{}
foreach ($m in $matchesBefore) {
    $fn = $m.Groups[2].Value
    if (-not $fileList.ContainsKey($fn)) { $fileList[$fn] = 0 }
    $fileList[$fn]++
}

$htmlR = [regex]::Replace($html, $pattern, { param($m) Get-WpAssetUrl $m.Groups[1].Value $m.Groups[2].Value })
$cssR = [regex]::Replace($css, $pattern, { param($m) Get-WpAssetUrl $m.Groups[1].Value $m.Groups[2].Value })
$jsR = [regex]::Replace($js, $pattern, { param($m) Get-WpAssetUrl $m.Groups[1].Value $m.Groups[2].Value })

# Extract body content
$bodyMatch = [regex]::Match($htmlR, '(?s)<body[^>]*>(.*?)</body>')
$bodyContent = $bodyMatch.Groups[1].Value.Trim()
$bodyContent = $bodyContent -replace '<script\s+src="script\.js[^"]*">\s*</script>', ''
$bodyContent = $bodyContent.Trim()

# Inline animated SVGs - replace <img> with inline SVG content
# connector-1
$bodyContent = [regex]::Replace($bodyContent, 
    '<img\s+src="[^"]*connector-1\.svg"\s+alt="[^"]*"\s+class="([^"]*)"[^>]*>',
    { param($m) '<div class="' + $m.Groups[1].Value + '">' + $svgFiles['connector-1'].Trim() + '</div>' })

# connector-2
$bodyContent = [regex]::Replace($bodyContent, 
    '<img\s+src="[^"]*connector-2\.svg"\s+alt="[^"]*"\s+class="([^"]*)"[^>]*>',
    { param($m) '<div class="' + $m.Groups[1].Value + '">' + $svgFiles['connector-2'].Trim() + '</div>' })

# connector-3
$bodyContent = [regex]::Replace($bodyContent, 
    '<img\s+src="[^"]*connector-3\.svg"\s+alt="[^"]*"\s+class="([^"]*)"[^>]*>',
    { param($m) '<div class="' + $m.Groups[1].Value + '">' + $svgFiles['connector-3'].Trim() + '</div>' })

# vector-139
$bodyContent = [regex]::Replace($bodyContent, 
    '<img\s+src="[^"]*vector-139\.svg"\s+alt="[^"]*"\s+class="([^"]*)"[^>]*>',
    { param($m) '<div class="' + $m.Groups[1].Value + '">' + $svgFiles['vector-139'].Trim() + '</div>' })

# vector-152
$bodyContent = [regex]::Replace($bodyContent, 
    '<img\s+src="[^"]*vector-152\.svg"\s+alt="[^"]*"\s+class="([^"]*)"[^>]*>',
    { param($m) '<div class="' + $m.Groups[1].Value + '">' + $svgFiles['vector-152'].Trim() + '</div>' })

# vector-151
$bodyContent = [regex]::Replace($bodyContent, 
    '<img\s+src="[^"]*vector-151\.svg"\s+alt="[^"]*"\s+class="([^"]*)"[^>]*>',
    { param($m) '<div class="' + $m.Groups[1].Value + '">' + $svgFiles['vector-151'].Trim() + '</div>' })

# Build standalone HTML
$output = @"
<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NESSO - Giai phap Cong nghe chuyen doi hoc tap</title>
  <meta name="description" content="Chung toi truc quan hoa he thong dao tao cho doanh nghiep.">
  <script>
    try {
      if (window.self !== window.top && new URLSearchParams(window.location.search).get('parentHeader') === '1') {
        document.documentElement.classList.add('nesso-lms-parent-header-context');
      }
      if (window.location.hash === '#proposal-view') {
        document.documentElement.classList.add('proposal-boot');
      } else if (/^#blog(?:\/|$)/.test(window.location.hash || '')) {
        document.documentElement.classList.add('blog-boot');
        if (/^#blog\/[^/?#]+/.test(window.location.hash || '')) {
          document.documentElement.classList.add('blog-article-boot');
        }
      } else if (window.location.hash === '#lms-features') {
        document.documentElement.classList.add('lms-features-boot');
      } else if (/^#\/?(9184726503918274|6402819573064918)\/?$/.test(window.location.hash || '')) {
        document.documentElement.classList.add('image-route-boot');
      } else if (window.location.hash === '#lucky-wheel') {
        document.documentElement.classList.add('lucky-boot');
      } else if (window.location.hash === '#contact') {
        document.documentElement.classList.add('contact-boot');
      }
    } catch (e) {}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
  <style>
$cssR
  </style>
</head>

<body>
$bodyContent

  <script>
$jsR
  </script>
</body>

</html>
"@

# Write output
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText("$base\nesso-lms-landing-standalone.html", $output, $utf8NoBom)

# === REPORT ===
Write-Host "=== BUILD REPORT ==="
Write-Host "Output: $base\nesso-lms-landing-standalone.html"
Write-Host ""
Write-Host "Total asset paths replaced: $($matchesBefore.Count)"
Write-Host "Unique files: $($fileList.Count)"
Write-Host ""

# Check inline SVGs
$outputContent = Get-Content "$base\nesso-lms-landing-standalone.html" -Raw -Encoding UTF8
$inlineSvgCount = ([regex]::Matches($outputContent, '<svg ')).Count
Write-Host "Inline SVG elements: $inlineSvgCount"

# Check no remaining local paths
$remainingAssets = ([regex]::Matches($outputContent, '"assets/')).Count
Write-Host "Remaining 'assets/' references: $remainingAssets"

# Check no Elementor references
$elementorRefs = ([regex]::Matches($outputContent, '\.elementor')).Count
Write-Host "Elementor references: $elementorRefs"

$econRefs = ([regex]::Matches($outputContent, '\.e-con')).Count
Write-Host ".e-con references: $econRefs"

$siteHeaderRefs = ([regex]::Matches($outputContent, '\.site-header')).Count
Write-Host ".site-header references: $siteHeaderRefs"

$siteFooterRefs = ([regex]::Matches($outputContent, '\.site-footer')).Count
Write-Host ".site-footer references: $siteFooterRefs"

# Check has DOCTYPE
$hasDoctype = $outputContent.Contains('<!DOCTYPE html>')
Write-Host "Has DOCTYPE: $hasDoctype"

Write-Host ""
Write-Host "Asset filenames:"
foreach ($k in ($fileList.Keys | Sort-Object)) {
    Write-Host "  $k (x$($fileList[$k]))"
}

# Check for animate elements
$animateCount = ([regex]::Matches($outputContent, '<animate ')).Count
Write-Host ""
Write-Host "SVG <animate> elements (inline): $animateCount"
