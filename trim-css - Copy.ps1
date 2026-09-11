$content = Get-Content 'd:\LMSLandingPage\style.css' -Encoding UTF8
$trimmed = $content[0..2780]
$trimmed | Set-Content 'd:\LMSLandingPage\style.css' -Encoding UTF8
Write-Host "Lines: $($trimmed.Count)"
