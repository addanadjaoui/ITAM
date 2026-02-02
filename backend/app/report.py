from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from datetime import datetime
import psycopg2
import os

conn = psycopg2.connect(os.getenv("DATABASE_URL"))

def generate_pdf_report(file_path="ITAM_Report.pdf"):
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM assets")
    total = cur.fetchone()[0]
    cur.execute("SELECT COUNT(*) FROM assets WHERE status='non_compliant'")
    non_compliant = cur.fetchone()[0]
    cur.execute("SELECT hostname, os, status FROM assets")
    assets = [{"hostname": h, "os": o, "status": s} for h,o,s in cur.fetchall()]

    env = Environment(loader=FileSystemLoader('templates'))
    template = env.get_template('report.html')
    html_out = template.render(date=datetime.now().strftime("%Y-%m-%d"),
                               kpi={"total_assets": total,"non_compliant": non_compliant,"licenses_expired":0},
                               assets=assets)
    HTML(string=html_out).write_pdf(file_path)

