from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from app.db import get_assets, upsert_asset
from .report import generate_pdf_report
from .report_excel import generate_excel_report
#from .assets_api import router as assets_router

app = FastAPI(title="ITAM Enterprise API")

# CORS pour frontend
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)


# Health
@app.get("/api/health")
def health():
    return {"ITAM Enterprise API, status": "ok"}



# ✅ GET : lister les assets (frontend, dashboard)
@app.get("/api/assets")
def list_assets(
    search: str = "",
    page: int = 1,
    limit: int = 10
):
    return get_assets(search, page, limit)

# PDF Report
@app.get("/reports/pdf")
def pdf_report():
    generate_pdf_report("/tmp/ITAM_Report.pdf")
    return {"message": "PDF generated"}

# Excel Report
@app.get("/reports/excel")
def excel_report():
    generate_excel_report("/tmp/ITAM_Report.xlsx")
    return {"message": "Excel generated"}

# ✅ POST : ajout / modification (manuel ou agent)
@app.post("/api/assets")
def add_or_update_asset(asset: dict):
    upsert_asset(asset)
    return {"status": "ok"}

