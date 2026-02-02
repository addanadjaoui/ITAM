from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import psycopg2
import os

router = APIRouter()
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

# POST add asset
@router.post("/assets")
def add_asset(asset: Asset):
    cur = conn.cursor()
    cur.execute("INSERT INTO assets(hostname,ip_address,type,os,status) VALUES (%s,%s,%s,%s,%s) RETURNING id",
                (asset.hostname, asset.ip_address, asset.type, asset.os, asset.status))
    conn.commit()
    return {"message": "Asset added", "hostname": asset.hostname, "IP": asset.ip_address}

