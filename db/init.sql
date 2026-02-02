CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE,
  email VARCHAR,
  full_name VARCHAR,
  source VARCHAR,
  external_id VARCHAR,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  hostname VARCHAR UNIQUE,
  type VARCHAR,
  ip_address VARCHAR,
  manufacturer VARCHAR,
  model VARCHAR,
  serial_number VARCHAR,
  os VARCHAR,
  owner_id INT REFERENCES users(id),
  status VARCHAR DEFAULT 'in_use',
  source VARCHAR DEFAULT 'manual',
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE licenses (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  vendor VARCHAR,
  total_seats INT,
  expiration_date DATE,
  license_type VARCHAR
);

CREATE TABLE asset_licenses (
  asset_id INT REFERENCES assets(id),
  license_id INT REFERENCES licenses(id)
);

CREATE TABLE compliance_snapshots (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  compliant BOOLEAN,
  reason TEXT,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR,
  entity VARCHAR,
  entity_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE discovery_runs (
  id SERIAL PRIMARY KEY,
  method VARCHAR,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  assets_found INT
);

-- Sample assets
INSERT INTO assets (hostname, type, ip_address, os, source) VALUES
('srv-db-01','server','192.168.56.110','Ubuntu 22.04','manual'),
('pc-user-01','pc','10.14.14.134','Windows 10','manual'),
('srv-old-01','server','172.16.41.107','CentOS 7','manual');

