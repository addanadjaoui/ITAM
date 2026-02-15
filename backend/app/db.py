import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://itam:itam@postgres:5432/itam"
)

# Connexion globale (simple et efficace pour Docker)
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
            source TEXT,          -- manual | agent | ad
            last_seen TIMESTAMP,
            created_at TIMESTAMP DEFAULT now()
        );
        """)


# ======================================================
# UPSERT : ajout + modification
# ======================================================
def upsert_asset(asset: dict):
    """
    asset = {
        hostname,
        ip_address,
        os,
        asset_type,
        source
    }
    """
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO assets (hostname, ip_address, os, asset_type, source, last_seen)
            VALUES (%s, %s, %s, %s, %s, now())
            ON CONFLICT (hostname)
            DO UPDATE SET
                ip_address = EXCLUDED.ip_address,
                os = EXCLUDED.os,
                asset_type = EXCLUDED.asset_type,
                source = EXCLUDED.source,
                last_seen = now();
        """, (
            asset.get("hostname"),
            asset.get("ip_address"),
            asset.get("os"),
            asset.get("asset_type"),
            asset.get("source", "manual"),
        ))


# ======================================================
# GET assets (pagination + search)
# ======================================================
def get_assets(search="", page=1, limit=20, sort="id"):
    offset = (page - 1) * limit

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT
                id,
                hostname,
                ip_address::text AS ip_address,
                os,
                type,
                status,
                source,
                last_seen
            FROM assets
            WHERE
                hostname ILIKE %s
                OR ip_address::text ILIKE %s
                OR os ILIKE %s
            ORDER BY last_seen DESC
            LIMIT %s OFFSET %s
        """, (
            f"%{search}%",
            f"%{search}%",
            f"%{search}%",
            limit,
            offset
        ))

        return cur.fetchall()


# ======================================================
# Stats Dashboard
# ======================================================
def get_stats():
    with conn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM assets")
        total_assets = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM assets
            WHERE last_seen > now() - interval '7 days'
        """)
        active_assets = cur.fetchone()[0]

        return {
            "total_assets": total_assets,
            "active_assets": active_assets
        }


# ======================================================
# Delete asset (optionnel)
# ======================================================
def delete_asset(asset_id: int):
    with conn.cursor() as cur:
        cur.execute(
            "DELETE FROM assets WHERE id = %s",
            (asset_id,)
        )

