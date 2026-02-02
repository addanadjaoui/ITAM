from ldap3 import Server, Connection, ALL

AD_SERVER = "ldap://ad.domain.local"
AD_USER = "DOMAIN\\itam_service"
AD_PASSWORD = "StrongPassword"
BASE_DN = "DC=domain,DC=local"

def get_ad_computers():
    server = Server(AD_SERVER, get_info=ALL)
    conn = Connection(
        server,
        user=AD_USER,
        password=AD_PASSWORD,
        auto_bind=True
    )

    conn.search(
        search_base=BASE_DN,
        search_filter="(objectClass=computer)",
        attributes=["name", "operatingSystem"]
    )

    computers = []
    for entry in conn.entries:
        computers.append({
            "hostname": str(entry.name),
            "os": str(entry.operatingSystem or "Unknown"),
            "source": "AD"
        })

    conn.unbind()
    return computers

