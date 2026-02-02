from .ad import get_ad_computers
from .db import upsert_asset

def run_discovery():
    # Simulation : on pourrait ping le réseau ou interroger AD
    return [
        {"hostname": "srv-new-01", "type": "server", "os": "Ubuntu 22.04", "status": "in_use"}
    ]


def discover_assets():
    assets = []

    # 1️⃣ Discovery AD
    ad_assets = get_ad_computers()
    assets.extend(ad_assets)

    # 2️⃣ (Futur) Discovery réseau, SNMP, agent, etc.

    return assets


def discover_from_ad():
    assets = get_ad_computers()
    for a in assets:
        upsert_asset(a)
    return assets

