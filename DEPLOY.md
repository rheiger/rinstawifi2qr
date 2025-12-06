# Deployment Guide

This app is a static Vite build served by Nginx and fronted by Traefik. No external API keys are required; welcome messages are generated locally in the browser.

## Prerequisites

- Docker and Docker Compose installed on the target host.
- Traefik already running and exposing an external network (named `traefik_public` in this example).
- A DNS entry that points `EXTERNAL_HOST` to your Traefik instance.

## Configuration

Environment examples are in `env.prod.example` and `env.test.example`. Copy and adjust one of them, setting at least:

```
COMPOSE_PROJECT_NAME=rinstawifi2qr
IMAGE_NAME=rinstawifi2qr
IMAGE_TAG=latest
EXTERNAL_HOST=wifi.example.com
HOST_PORT=3000
LOG_LEVEL=INFO
TEST_INSTANCE=false
```

Create the Traefik network if it does not exist:

```bash
docker network create traefik_public || true
```

## Build and run

From the project root:

```bash
# Build and start with your chosen env file
docker-compose --env-file env.prod.example up -d --build
```

Traefik labels are included in `docker-compose.yml` to route traffic:

- `Host(\`$EXTERNAL_HOST\`)` on entrypoint `websecure`
- TLS enabled with resolver `myresolver`
- Service forwards to container port 80

## Health and maintenance

- Health check: `curl http://localhost:3000/health` (or via Traefik host) returns `ok`.
- Stop/remove: `docker-compose down`
- Rebuild after code changes: `docker-compose --env-file env.prod.example up -d --build`

## Optional: local dev

```bash
npm install
npm run dev
```
