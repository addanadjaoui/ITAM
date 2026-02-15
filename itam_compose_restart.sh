#!/usr/bin/env bash

set -e  # stop en cas d‚Äôerreur

SERVICE="$1"

echo "Ì†ΩÌªë Stopping containers..."
docker compose down

echo "Ì†ΩÌ∫Ä Building & starting containers..."

case "$SERVICE" in
  backend)
    docker compose up -d --build backend
    ;;
  frontend)
    docker compose up -d --build frontend
    ;;
  "" | all)
    docker compose up -d --build
    ;;
  *)
    echo "‚ùå Usage:"
    echo "  $0              # build & run ALL services"
    echo "  $0 all          # same as above"
    echo "  $0 backend      # build & run backend only"
    echo "  $0 frontend     # build & run frontend only"
    exit 1
    ;;
esac

echo "Ì†ΩÌ≥¶ Current containers status:"
docker compose ps

