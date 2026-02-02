from pydantic import BaseModel
from typing import Optional

class AssetUpsert(BaseModel):
    hostname: str
    ip_address: str
    os: Optional[str] = None
    status: str = "in_use"
    owner: Optional[str] = None
    source: str = "manual"
