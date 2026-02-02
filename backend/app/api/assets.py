from fastapi import APIRouter
from app.models.asset import AssetUpsert
import psycopg2
import os

router = APIRouter()
DATABASE_URL = os.getenv("DATABASE_URL")

@router.post("/assets")
def upsert_asset(asset: AssetUpsert):
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO assets (
                        hostname,
                        ip_address,
                        os,
                        status,
                        owner,
                        source,
                        last_seen
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, now())
                    ON CONFLICT (hostname, ip_address)
                    DO UPDATE SET
                        os        = EXCLUDED.os,
                        status    = EXCLUDED.status,
                        owner     = EXCLUDED.owner,
                        source    = EXCLUDED.source,
                        last_seen = now()
                    RETURNING id, hostname, ip_address, status, source;
                """, (
                    asset.hostname,
                    asset.ip_address,
                    asset.os,
                    asset.status,
                    asset.owner,
                    asset.source
                ))

                row = cur.fetchone()
                return {
                    "id": row[0],
                    "hostname": row[1],
                    "ip_address": row[2],
                    "status": row[3],
                    "source": row[4],
                    "action": "upsert"
                }
    finally:
        conn.close()
