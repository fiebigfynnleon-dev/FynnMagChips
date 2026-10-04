# FynnMagChips — Base44 Dev Notes

## What this is
A **Discord bot** (not a web app). Uses `discord.js` for bot commands/events, `@twurple/*` for Twitch stream monitoring, and `rss-parser` for social feeds. No web frontend — a minimal HTTP status server (`src/statusServer.js`) was added on port 3000 so the bot is visible in the Base44 preview.

## Required credentials (all external — user must provide real values)
- `DISCORD_TOKEN` — Discord bot token. Without a valid token the bot cannot connect; the status page shows an error.
- `TWITCH_CLIENT_ID` — Twitch app client ID (used by `src/events/socialMonitor.js` at module load).
- `TWITCH_CLIENT_SECRET` — Twitch app client secret (same).

Generated development placeholders exist for all three — they let the process start but the Discord login will fail until a real `DISCORD_TOKEN` is supplied.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- Base image: `node:22-slim`, source bind-mounted at `/app`.
- `npm install` runs on every container start (no lockfile is committed — `package-lock.json` is gitignored).
- Status server on port 3000 at `/` (HTML) and `/health` (JSON).

## Architecture
- `src/index.js` — entry point: loads all commands and events, logs in to Discord, starts status server.
- `src/commands/` — slash commands (giveaway, roles, moderator, event, etc.).
- `src/events/` — event handlers (counting, giveaways, support, social monitoring, etc.).
- `config.json`, `counting.json`, `giveaways.json` — runtime state files (mutable).

## Verifying it works
- `curl localhost:3000/health` returns JSON with the bot's connection status.
- The preview page at `/` shows a status card that auto-refreshes every 5 seconds.
- With a valid `DISCORD_TOKEN`, the status turns green and shows the bot tag and guild count.
