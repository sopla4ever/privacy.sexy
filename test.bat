@echo off

:: Add
PowerShell -Command "$domain='localhost'; $file=\"$env:windir\System32\drivers\etc\hosts\"; @(\"0.0.0.0`t$domain\",\"::`t$domain\") | ForEach { If (!(Select-String -Path $file -pattern $_)){$_ | Out-File $file -Append -Encoding UTF8}}"

:: Revert
PowerShell -Command "$domain='localhost'; $file=\"$env:windir\System32\drivers\etc\hosts\"; @(\"0.0.0.0`t$domain\",\"::`t$domain\") | ForEach { (Get-Content $file) -NotMatch $_ | Set-Content $file }"

pause