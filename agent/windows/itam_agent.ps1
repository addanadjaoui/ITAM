$api = "http://192.168.56.110:8000/api/agent/report"
$hostname = $env:COMPUTERNAME
$os = (Get-CimInstance Win32_OperatingSystem).Caption
$cpu = (Get-CimInstance Win32_Processor).Name
$ram = [math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory /1GB,2)

$software = Get-ItemProperty HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\* |
Select DisplayName, DisplayVersion

$body = @{
  hostname=$hostname
  os=$os
  cpu=$cpu
  ram_gb=$ram
  software=$software
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri $api -Method POST -Body $body -ContentType "application/json"

