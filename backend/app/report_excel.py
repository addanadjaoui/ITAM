import pandas as pd
import psycopg2
import os

conn = psycopg2.connect(os.getenv("DATABASE_URL"))

def generate_excel_report(file_path="ITAM_Report.xlsx"):
    cur = conn.cursor()
    cur.execute("SELECT hostname, os, status FROM assets")
    data = cur.fetchall()
    df = pd.DataFrame(data, columns=["Hostname","OS","Status"])
    df.to_excel(file_path, index=False)

