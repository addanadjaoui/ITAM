import subprocess
from .db import upsert_asset

def discover_network(subnet):
    result = subprocess.check_output(
        ["nmap", "-sn", subnet],
        text=True
    )

    assets = []
    current_ip = None

    for line in result.splitlines():
        if "Nmap scan report for" in line:
            current_ip = line.split()[-1]
        if "Host is up" in line and current_ip:
            asset = {
                "hostname": current_ip,
                "ip_address": current_ip,
                "os": "Unknown",
                "source": "NETWORK"
            }
            upsert_asset(asset)
            assets.append(asset)

    return assets

