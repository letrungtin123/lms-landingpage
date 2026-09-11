$stylePath = 'd:\LMSLandingPage\style.css'
$responsivePath = 'd:\LMSLandingPage\responsive.css'

# Read style.css and keep only up to line 2317 (before old responsive)
$lines = Get-Content $stylePath -Encoding UTF8
$baseLines = $lines[0..2317]

# Read new responsive CSS
$responsiveCSS = Get-Content $responsivePath -Raw -Encoding UTF8

# Combine
$combined = ($baseLines -join "`n") + "`n`n" + $responsiveCSS

# Write
[System.IO.File]::WriteAllText($stylePath, $combined, [System.Text.Encoding]::UTF8)

$newCount = (Get-Content $stylePath -Encoding UTF8).Count
Write-Host "Style.css lines: $newCount"
