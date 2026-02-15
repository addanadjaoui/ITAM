from fastapi import APIRouter
from pydantic import BaseModel
from app.models.asset import AssetUpsert
import psycopg2
import os



router = APIRouter()
DATABASE_URL = os.getenv("http:/192.168.56.110")
conn = psycopg2.connect(os.getenv("DATABASE_URL"))

class Asset(BaseModel):
    hostname: str
    type: str
    os: str
    ip_address: str = None
    owner: str = None
    status: str = "in_use"

# GET all assets
@router.get("/assets")
def get_assets():
    cur = conn.cursor()
    cur.execute("SELECT hostname,type,os,ip_address,owner_id,status FROM assets")
    rows = cur.fetchall()
    return [{"hostname": h, "type": t, "os": o, "ip": ip, "owner": owner, "status": s} for h,t,o,ip,owner,s in rows]

#@router.get("/api/assets")
#def get_assets(
#    search: str = "",
#    sort: str = "hostname",
#    order: str = "asc",
#    page: int = 1,
#    limit: int = 10
#):
#    offset = (page - 1) * limit
#
#    query = f"""
#      SELECT * FROM assets
#      WHERE hostname ILIKE %s OR ip ILIKE %s
#      ORDER BY {sort} {order}
#      LIMIT %s OFFSET %s
#    """
#    db = conn.cursor() 
#    rows = db.execute(
#        query,
#        (f"%{search}%", f"%{search}%", limit, offset)
#    )
#
#    total = db.execute(
#        "SELECT COUNT(*) FROM assets WHERE hostname ILIKE %s OR ip ILIKE %s",
#        (f"%{search}%", f"%{search}%")
#    ).fetchone()[0]
#
#    return {
#        "data": rows,
#        "total": total
#    }

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
                    a sset.hostname,
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

