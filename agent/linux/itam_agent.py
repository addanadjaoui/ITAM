import platform
import psutil
import socket
import requests
import json
import subprocess

API_URL = "http://192.168.56.110:8000/api/agent/report"
API_KEY = "CHANGE_ME"

def get_software():
    pkgs = subprocess.getoutput("dpkg-query -W -f='${binary:Package} ${Version}\n'")
    return pkgs.splitlines()

data = {
    "hostname": socket.gethostname(),
    "os": f"{platform.system()} {platform.release()}",
    "cpu": platform.processor(),
    "ram_gb": round(psutil.virtual_memory().total / (1024**3), 2),
    "disk_gb": round(psutil.disk_usage('/').total / (1024**3), 2),
    "ip": socket.gethostbyname(socket.gethostname()),
    "software": get_software()
}

requests.post(
    API_URL,
    json=data,
    headers={"Authorization": f"Bearer {API_KEY}"}
)

