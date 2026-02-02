from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .assets_api import router as assets_router
from .report import generate_pdf_report
from .report_excel import generate_excel_report
from .discovery import discover_assets

app = FastAPI(title="ITAM Enterprise API")

# CORS pour frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# API assets
app.include_router(assets_router)

# Rapports
@app.get("/reports/pdf")
def pdf_report():
    generate_pdf_report("/tmp/ITAM_Report.pdf")
    return {"message": "PDF generated"}

@app.get("/reports/excel")
def excel_report():
    generate_excel_report("/tmp/ITAM_Report.xlsx")
    return {"message": "Excel generated"}

    assets = discover_assets()
    return {
        "discovered": len(assets),
        "assets": assets
    }

@app.post("/discover")
def discover(mode: str = "ad", subnet: str = None):
    if mode == "ad":
        assets = discover_from_ad()
    elif mode == "network" and subnet:
        assets = discover_network(subnet)
    else:
        return {"error": "Invalid discovery mode"}

    return {
        "mode": mode,
        "discovered": len(assets),
        "assets": assets
    }
