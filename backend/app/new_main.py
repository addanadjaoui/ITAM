from fastapi import FastAPI, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from .db import get_db
from sqlalchemy.orm import Session
from models import Asset

app = FastAPI(title="ITAM Enterprise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/assets")
def get_assets(
    search: str = "",
    page: int = 1,
    limit: int = 10,
    sort: str | None = None,
    order: str = "asc",
    db: Session = Depends(get_db),
):
    query = db.query(Asset)

    if search:
        query = query.filter(Asset.hostname.ilike(f"%{search}%"))

    total = query.count()

    if sort:
        col = getattr(Asset, sort)
        query = query.order_by(col.desc() if order == "desc" else col.asc())

    data = (
        query
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "data": data,
        "page": page,
        "total": total,
        "pages": (total + limit - 1) // limit,
    }

