#!/bin/bash

API="http://192.168.56.110:8000/api/assets"

HOSTNAME=$(hostname)
IP=$(hostname -I | awk '{print $2}')
OS=$(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)

curl -X POST $API \
  -H "Content-Type: application/json" \
  -d "{
    \"hostname\": \"$HOSTNAME\",
    \"ip_address\": \"$IP\",
    \"os\": $OS,
    \"type\": \"server\",
    \"source\": \"agent-linux\"
  }"

