# SOURAJITVFX-FREELLMAPI

Responsive AI chat frontend for the upstream FreeLLMAPI gateway. Deploy the gateway on Render and this UI on Vercel.

## Architecture
- This repository is the separate chat frontend/proxy; FreeLLMAPI is the backend gateway and admin dashboard.
- Vercel serverless endpoints `/api/chat` and `/api/models` proxy OpenAI-compatible requests.
- Add provider credentials in FreeLLMAPI, then copy its unified API key. This is not an official Claude API and does not guarantee Anthropic Claude model access; available models depend on upstream providers.
- The UI stores the gateway URL and unified key in browser localStorage. Use a private device and clear site data if shared.

## Render backend
1. Deploy `ghcr.io/tashfeenahmed/freellmapi:latest` as a Render web service or use `render.yaml`.
2. Set `PORT=3001` and a stable generated `ENCRYPTION_KEY`.
3. Complete admin setup, add provider keys, and copy the unified API key.
4. **Persistence warning:** Free Render services have ephemeral filesystems and cannot attach persistent disks. FreeLLMAPI stores SQLite data and encrypted provider keys in `/app/server/data`; these can be lost on restart/spin-down/redeploy. For persistence, use a paid service with a disk mounted at `/app/server/data`. Keep `ENCRYPTION_KEY` unchanged.
5. Free Render services spin down after inactivity, so first request may be delayed.

## Vercel frontend
1. Import this repository into Vercel. Framework preset: Other; root directory `./`.
2. Deploy; no build command is needed.
3. Open the site, click the gear icon, enter your HTTPS Render URL and unified API key.
4. Test connection, select a listed model, and chat.

## Local preview
Requires Node.js 20+ and Vercel CLI: `npx vercel dev`.

## Security
- Never commit provider keys, unified keys, or real `.env` files.
- Use HTTPS gateway URLs only.
- Add authentication/rate limits before making a public multi-user service.

## Files
- `api/chat.js`: streaming OpenAI-compatible chat proxy
- `api/models.js`: model catalogue proxy
- `api/_gateway.js`: URL and bearer validation
- `render.yaml`: Render image Blueprint
- `vercel.json`: Vercel config
