Add-Type -Assembly 'System.IO.Compression.FileSystem'
try {
    $zip = [System.IO.Compression.ZipFile]::OpenRead('c:\Users\User\Documents\fleetforce\fleetforce.zip')
    $zip.Entries | Select-Object FullName, Length | Format-Table
    $zip.Dispose()
} catch {
    Write-Host "ZIP ERROR: $($_.Exception.Message)"
}
