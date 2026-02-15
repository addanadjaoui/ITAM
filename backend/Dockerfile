FROM python:3.11-slim

# Installer les dépendances nécessaires pour WeasyPrint / PDF generation
RUN apt-get update && apt-get install -y \
    build-essential \
    libffi-dev \
    libgobject-2.0-0 \
    libgirepository1.0-dev \
    libcairo2 \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libjpeg-dev \
    libpng-dev \
    libssl-dev \
    python3-dev \
    nmap \
    vim \
    procps \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app/ ./app/
COPY templates/ ./templates/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

