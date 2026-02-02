# import psycopg2
# import os

# conn = psycopg2.connect(os.getenv("DATABASE_URL"))

# def upsert_asset(asset):
    # cur = conn.cursor()
    # cur.execute("""
        # INSERT INTO assets (hostname, os, ip_address, source, last_seen)
        # VALUES (%s, %s, %s, %s, now())
        # ON CONFLICT (hostname, ip_address)
        # DO UPDATE SET
            # os = EXCLUDED.os,
            # source = EXCLUDED.source,
            # last_seen = now();
    # """, (
        # asset["hostname"],
        # asset.get("os"),
        # asset.get("ip_address")
        # asset.get("source")
    # ))
    # conn.commit()

import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL")

def upsert_asset(asset):
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO assets (
                        hostname,
                        os,
                        ip_address,
                        source,
                        last_seen
                    )
                    VALUES (%s, %s, %s, %s, now())
                    ON CONFLICT (hostname, ip_address)
                    DO UPDATE SET
                        os = EXCLUDED.os,
                        source = EXCLUDED.source,
                        last_seen = now();
                """, (
                    asset["hostname"],
                    asset.get("ip_address"),
                    asset.get("os"),
                    asset.get("source")
                ))
    finally:
        conn.close()

