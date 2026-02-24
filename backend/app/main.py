from fastapi import FastAPI, Query, Body, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from app.db import get_assets, upsert_asset, init_db, get_total_assets
import os
from app.db import get_assets, get_total_assets, init_db

app = FastAPI(title="ITAM Enterprise API")

# CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Initialisation de la DB si nécessaire
init_db()

# Base Model
class Asset(BaseModel):
    hostname: str
    asset_type: Optional[str] = None
    os: Optional[str] = None
    ip_address: Optional[str] = None
    source: Optional[str] = "manual"
    status: Optional[str] = "in_use"


# Health check
@app.get("/api/health")
def health():
    return {"status": "ok"}

# Get : KPI
@app.get("/api/kpi")
def get_kpi():
    assets = get_assets(
        search="",
        page=1,
        limit=100000,
        sort="id"
    )

    # ✅ assets est déjà une LISTE
    total = len(assets)

    non_compliant = sum(
        1 for a in assets if a.get("status") != "in_use"
    )

    conformity = round(
        ((total - non_compliant) / total) * 100,
        2
    ) if total else 0

    return {
        "total": total,
        "non_compliant": non_compliant,
        "conformity": conformity
    }

# ✅ GET : assets avec pagination, tri et recherche
@app.get("/api/assets")
def list_assets(
    search: str = "",
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1),
    sort: Optional[str] = Query(
        "hostname:asc",
        description="Tri multi-colonnes ex: hostname:asc,ip_address:desc"
    ),
):
    assets = get_assets(
        search=search,
        page=page,
        limit=limit,
        sort=sort
    )
    total = get_total_assets(search)

    return {
        "data": assets,
        "total": total
    }

# ✅ POST : ajout d’un nouvel asset
@app.post("/api/assets")
def add_asset(asset: Asset):
    try: 
        upsert_asset(asset.dict())
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'ajout: {str(e)}")


# ✅ PATCH : modification d’un asset existant par ID
@app.patch("/api/assets/{asset_id}")
def update_asset(asset_id: int = Path(..., description="ID de l'asset à modifier"), asset: Asset = Body(...)):
    try: 
        data = asset.dict()
        data["id"] = asset_id
        upsert_asset(data)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour: {str(e)}")

