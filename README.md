<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run the QR generator locally or in a container behind Traefik. No external AI API key is required; welcome messages are generated client-side.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Docker / Traefik

See `DEPLOY.md` for container build/run instructions with Traefik labels. Compose defaults to port 3000 mapping to container port 80.
