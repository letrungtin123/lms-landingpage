param(
  [string]$SourceDir = (Join-Path $PSScriptRoot 'Landingpage-Photo-Retouch'),
  [string]$OutputPath = (Join-Path $PSScriptRoot 'nesso-photo-retouch-standalone.html'),
  [string]$AssetBaseUrl = 'https://nesso.vn/wp-content/uploads/2026/10/'
)

$ErrorActionPreference = 'Stop'

function Read-Utf8File {
  param([string]$Path)

  if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
    throw "Required source file is missing: $Path"
  }

  return [System.IO.File]::ReadAllText($Path, [System.Text.UTF8Encoding]::new($false))
}

function Escape-InlineScript {
  param([string]$Content)

  return $Content -replace '(?i)</script', '<\/script'
}

function Replace-ScriptTag {
  param(
    [string]$Document,
    [string]$Source,
    [string]$Content
  )

  $escapedSource = [regex]::Escape($Source)
  $pattern = '(?is)<script\s+[^>]*\bsrc\s*=\s*["'']{0}(?:\?[^"''>]*)?["''][^>]*>\s*</script>' -f $escapedSource
  $replacement = "<script data-standalone-source=`"$Source`">`n$(Escape-InlineScript $Content)`n</script>"
  $updated = [regex]::Replace($Document, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $replacement })

  if ($updated -eq $Document) {
    throw "Could not inline script tag: $Source"
  }

  return $updated
}

function Replace-StylesheetTag {
  param(
    [string]$Document,
    [string]$Source,
    [string]$Content
  )

  $escapedSource = [regex]::Escape($Source)
  $pattern = '(?is)<link\s+[^>]*\bhref\s*=\s*["'']{0}(?:\?[^"''>]*)?["''][^>]*>' -f $escapedSource
  $replacement = "<style data-standalone-source=`"$Source`">`n$Content`n</style>"
  $updated = [regex]::Replace($Document, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $replacement })

  if ($updated -eq $Document) {
    throw "Could not inline stylesheet tag: $Source"
  }

  return $updated
}

function Get-CachedVendorScript {
  param(
    [string]$Name,
    [string]$Url
  )

  $cacheDirectory = Join-Path $env:LOCALAPPDATA 'NessoPhotoRetouchBuild'
  $cachePath = Join-Path $cacheDirectory $Name

  if (Test-Path -LiteralPath $cachePath -PathType Leaf) {
    return Read-Utf8File $cachePath
  }

  New-Item -ItemType Directory -Path $cacheDirectory -Force | Out-Null
  $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
  if ([string]::IsNullOrWhiteSpace($response.Content)) {
    throw "Downloaded vendor script is empty: $Url"
  }

  [System.IO.File]::WriteAllText($cachePath, $response.Content, [System.Text.UTF8Encoding]::new($false))
  return $response.Content
}

function Get-GitRevision {
  param([string]$Directory)

  try {
    $revision = (& git -C $Directory rev-parse --short HEAD 2>$null).Trim()
    if ($revision) { return $revision }
  } catch {}

  return 'local'
}

function Get-ShortContentHash {
  param([string]$Content)

  $hasher = [System.Security.Cryptography.SHA256]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Content)
    $hash = -join ($hasher.ComputeHash($bytes) | ForEach-Object { $_.ToString('x2') })
    return $hash.Substring(0, 12)
  } finally {
    $hasher.Dispose()
  }
}

$SourceDir = (Resolve-Path -LiteralPath $SourceDir).Path
$OutputPath = [System.IO.Path]::GetFullPath($OutputPath)
$AssetBaseUrl = $AssetBaseUrl.TrimEnd('/') + '/'

$html = Read-Utf8File (Join-Path $SourceDir 'index.html')
$revision = Get-GitRevision $SourceDir

$stylesheets = @(
  'cosmos-hero.css',
  'style.css',
  'approach-video.css',
  'workflow-pricing.css',
  'trial-modal.css',
  'footer-cta-faq.css'
)

foreach ($stylesheet in $stylesheets) {
  $html = Replace-StylesheetTag $html $stylesheet (Read-Utf8File (Join-Path $SourceDir $stylesheet))
}

$vendorScripts = @(
  @{ Source = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js'; Cache = 'gsap-3.12.5.min.js' },
  @{ Source = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js'; Cache = 'ScrollTrigger-3.12.5.min.js' }
)

foreach ($vendor in $vendorScripts) {
  $html = Replace-ScriptTag $html $vendor.Source (Get-CachedVendorScript $vendor.Cache $vendor.Source)
}

$scripts = @(
  'assets/js/animations.js',
  'cosmos-hero.js',
  'workflow-pricing.js',
  'script.js',
  'approach-video.js',
  'trial-modal.js',
  'footer-cta-faq.js'
)

foreach ($script in $scripts) {
  $html = Replace-ScriptTag $html $script (Read-Utf8File (Join-Path $SourceDir $script))
}

$assetUrls = [ordered]@{
  '1.Ecom.png' = '1.Ecom_.png'
  '2.fashion.png' = '2.fashion.png'
  '3.photograph.png' = '3.photograph.png'
  '4.creative.png' = '4.creative.png'
  '5.retail.png' = '5.retail.png'
  'approach-video-thumb.jpg' = 'approach-video-thumb.jpg'
  'audience-sneakers.png' = 'audience-sneakers.png'
  'client-alice-olivia.png' = 'client-alice-olivia.png'
  'client-borg.png' = 'client-borg.png'
  'client-david-watt.png' = 'client-david-watt.png'
  'client-mercury.png' = 'client-mercury.png'
  'client-peter-millar.png' = 'client-peter-millar.png'
  'hero-portrait.png' = 'hero-portrait.png'
  'logo.png' = 'logo.png'
  'Necklace_after.jpg' = 'Necklace_after.jpg-scaled.jpg'
  'Necklace_after.jpg.jpg' = 'Necklace_after.jpg-scaled.jpg'
  'Necklace_before.jpg' = 'Necklace_before-scaled.jpg'
  'service-jewelry-before.png' = 'service-jewelry-before.png'
  'service-jewelry.png' = 'service-jewelry.png'
  'service-mannequin-before.png' = 'service-mannequin-before.png'
  'service-mannequin.png' = 'service-mannequin.png'
  'service-model-after.png' = 'service-model-after-scaled.jpg'
  'service-model-before.png' = 'service-model-before-scaled.jpg'
  'service-slider-handle.png' = 'service-slider-handle.png'
  'service-zoom-cheek.png' = 'service-zoom-cheek.png'
  'service-zoom-jewelry.png' = 'service-zoom-jewelry.png'
  'service-zoom-mannequin.png' = 'service-zoom-mannequin.png'
  'video-thumb.png' = 'video-thumb.jpg'
}

# Replace longer names first so one asset name cannot partially rewrite another.
foreach ($asset in ($assetUrls.GetEnumerator() | Sort-Object { $_.Key.Length } -Descending)) {
  $html = $html.Replace("assets/images/$($asset.Key)", "$AssetBaseUrl$($asset.Value)")
}

# Cache-bust the poster when its WordPress media file is replaced.
$videoPosterUrl = "$AssetBaseUrl" + 'approach-video-thumb.jpg?v=lastframe'
$posterReferenceCount = ([regex]::Matches($html, [regex]::Escape($videoPosterUrl))).Count
if ($posterReferenceCount -ne 2) {
  throw "Expected two video poster references, found $posterReferenceCount"
}
$html = $html.Replace($videoPosterUrl, "$AssetBaseUrl" + "approach-video-thumb.jpg?v=$revision")

$videoUrls = [ordered]@{
  '[Nesso] Photo Retouch Sevice Introducing_Final.mp4' = 'Nesso-Photo-Retouch-Sevice-Introducing_Final.mp4'
}

foreach ($video in $videoUrls.GetEnumerator()) {
  $html = $html.Replace("assets/video/$($video.Key)", "$AssetBaseUrl$($video.Value)")
}

$buildVersion = "$revision-$(Get-ShortContentHash $html)"
$meta = "<meta name=`"nesso-photo-retouch-build`" content=`"$buildVersion`">"
$html = $html -replace '(?i)(<meta\s+charset=[^>]+>)', "`$1`n  $meta"

$remainingLocalAssets = ([regex]::Matches($html, '(?is)(?:src|href|poster)\s*=\s*["'']assets/(?:images|video)/|url\(\s*["'']?assets/(?:images|video)/')).Count
$remainingStylesheets = ([regex]::Matches($html, '(?is)<link\s+[^>]*href\s*=\s*["''](?:cosmos-hero|style|approach-video|workflow-pricing|trial-modal|footer-cta-faq)\.css')).Count
$remainingScripts = ([regex]::Matches($html, '(?is)<script\s+[^>]*src\s*=\s*["''](?:assets/js/animations|cosmos-hero|workflow-pricing|script|approach-video|trial-modal|footer-cta-faq)\.js')).Count
$unsplashReferences = ([regex]::Matches($html, 'https://images\.unsplash\.com/')).Count

if ($remainingLocalAssets -gt 0 -or $remainingStylesheets -gt 0 -or $remainingScripts -gt 0) {
  throw "Standalone build validation failed: local asset refs=$remainingLocalAssets, stylesheet refs=$remainingStylesheets, script refs=$remainingScripts"
}

$outputDirectory = Split-Path -Parent $OutputPath
New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
[System.IO.File]::WriteAllText($OutputPath, $html, [System.Text.UTF8Encoding]::new($false))

$embedPath = Join-Path $PSScriptRoot 'block-html-photo-retouch-wp.html'
if (Test-Path -LiteralPath $embedPath -PathType Leaf) {
  $embed = Read-Utf8File $embedPath
  $standaloneUrl = "$AssetBaseUrl" + "nesso-photo-retouch-standalone.html"
  $embedPattern = 'src="' + [regex]::Escape($standaloneUrl) + '\?v=[^"]+"'
  $embedReplacement = 'src="' + $standaloneUrl + '?v=' + $buildVersion + '"'
  $updatedEmbed = [regex]::Replace($embed, $embedPattern, $embedReplacement, 1)

  if ($updatedEmbed -eq $embed) {
    throw "Could not update the standalone cache version in: $embedPath"
  }

  [System.IO.File]::WriteAllText($embedPath, $updatedEmbed, [System.Text.UTF8Encoding]::new($false))
}

Write-Host '=== PHOTO RETOUCH STANDALONE BUILD ==='
Write-Host "Source: $SourceDir"
Write-Host "Version: $buildVersion"
Write-Host "Output: $OutputPath"
Write-Host "Mapped WordPress assets: $($assetUrls.Count + $videoUrls.Count)"
Write-Host "External Unsplash references retained: $unsplashReferences"
Write-Host "Output size: $([math]::Round((Get-Item -LiteralPath $OutputPath).Length / 1MB, 2)) MB"
