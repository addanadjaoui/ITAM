import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://itam:itam@postgres:5432/itam"
)

ALLOWED_SORT_FIELDS = [
    "id",
    "hostname",
    "ip_address",
    "os",
    "asset_type",
    "status",
    "source"
]

conn = psycopg2.connect(DATABASE_URL)
conn.autocommit = True

# ======================================================
# Initialisation DB
# ======================================================
def init_db():
    with conn.cursor() as cur:
        cur.execute("""
        CREATE TABLE IF NOT EXISTS assets (
            id SERIAL PRIMARY KEY,
            hostname TEXT UNIQUE,
            ip_address TEXT UNIQUE,
            os TEXT,
            asset_type TEXT,
            status TEXT DEFAULT 'in_use',
            source TEXT DEFAULT 'manual',
            last_seen TIMESTAMP,
            created_at TIMESTAMP DEFAULT now()
        );
        """)

# ======================================================
# Build Order by list
# ======================================================
def build_order_by(sort: str):
    """
    Transforme: 'hostname,-status,ip_address'
    en: 'hostname ASC, status DESC, ip_address ASC'
    """
    clauses = []

    for field in sort.split(","):
        field = field.strip()
        if not field:
            continue

        direction = "ASC"
        name = field

        if field.startswith("-"):
            name = field[1:]
            direction = "DESC"

        if name in ALLOWED_SORT_FIELDS:
            clauses.append(f"{name} {direction}")

    return ", ".join(clauses) if clauses else "hostname ASC"

# ======================================================
# Parse Sort Function
# ======================================================
def parse_sort(sort: str):
    allowed_fields = {
        "id": "id",
        "hostname": "hostname",
        "ip_address": "ip_address",
        "os": "os",
        "asset_type": "asset_type",
        "status": "status",
        "source": "source",
    }

    clauses = []

    for part in sort.split(","):
        if ":" not in part:
            continue

        field, order = part.split(":", 1)
        field = field.strip()
        order = order.lower().strip()

        if field not in allowed_fields:
            continue
        if order not in ("asc", "desc"):
            order = "asc"

        clauses.append(f"{allowed_fields[field]} {order.upper()}")

    return ", ".join(clauses) or "hostname ASC"


# ======================================================
# UPSERT : ajout + modification
# ======================================================
def upsert_asset(asset: dict):
    with conn.cursor()  as cur:
        if "id" in asset and asset["id"]:
            # Update par ID
            cur.execute( """
                UPDATE as sets
                SET hostname=%s,
                    ip_add ress=%s,
                    os=%s,
                    asset_type=%s,
                    status=%s,
                    source=%s,
                     last_seen=now()
                 WHERE id=%s
            """, (
                asset.get("hostname"),
                asset.get("ip_address"),
                asset.get("os"),
                asset.get("asset_type"),
                asset.get("status", "in_use"),
                asset.get("source", "manual"),
                asset["id"]
            ) )
        else:
            # Insert
            cur.execute("""
                INSERT INTO  assets (hostname, ip_address, os, asset_type, status, source, last_seen)
                VALUES (%s, %s, %s, %s, %s, %s, now())
                ON CONFLICT (hostname)
                DO UPDATE SET
                    ip_address = EXCLUDED.ip_address, 
                    os = EXCLUDED.os,
                    asset_type = EXCLUDED.type,
                    status = EXCLUDED.status,
                    source = EXCLUDED.source,
                    last_seen = now();
            """, (
                asset.get("hostname" ),
                asset.get("ip_address"),
                asset.get("os"),
                asset.get("asset_type"),
                asset.get("status", "in_use"),
                asset.get("source", "manual"),
             ))

# ======================================================
# GET assets (pagination + search + sort)
# ======================================================
def get_assets(search="", page=1, limit=20, sort="hostname:asc"):
    offset = (page - 1) * limit
    #order_by = parse_sort(sort)
    order_by = build_order_by(sort)

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute(
            f"""
            SELECT
                id, 
                hostname,
                ip_address,
                os,
                asset_type,
                status,
                source
            FROM assets
            WHERE
                hostname ILIKE %s
                OR ip_address ILIKE %s
                OR os ILIKE %s
            ORDER BY {order_by}
            LIMIT %s OFFSET %s
            """,
            (
                f"%{search}%",
                f"%{search}%",
                f"%{search}%",
                limit,
                offset
            )
        )
        return cur.fetchall()

# ======================================================
# Total pour pagination
# ======================================================
def get_total_assets(search=""):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT COUNT(*) FROM assets
            WHERE hostname ILIKE %s OR ip_address::text ILIKE %s OR os ILIKE %s
        """, (f"%{search}%", f"%{search}%", f"%{search}%"))
        return cur.fetchone()[0]

