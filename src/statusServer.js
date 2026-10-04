const http = require('http');

// Shared state — updated by index.js as the bot connects
const state = {
    status: 'starting',
    botTag: null,
    uptime: null,
    guildCount: 0,
    lastError: null,
    startedAt: new Date().toISOString(),
};

function setStatus(key, value) {
    state[key] = value;
}

function renderPage() {
    const statusColor = state.status === 'online' ? '#22c55e' : state.status === 'error' ? '#ef4444' : '#f59e0b';
    const statusText = state.status === 'online' ? '🟢 Online' : state.status === 'error' ? '🔴 Error' : '🟡 Starting…';

    return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FynnMagChips — Bot Status</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f1a; color: #e0e0e8; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  .card { background: #1a1a2e; border: 1px solid #2a2a4a; border-radius: 16px; padding: 48px 40px; max-width: 480px; width: 90%; text-align: center; }
  h1 { font-size: 1.5rem; margin-bottom: 8px; color: #fff; }
  .subtitle { font-size: .85rem; color: #888; margin-bottom: 32px; }
  .status-badge { display: inline-block; font-size: 1.1rem; font-weight: 600; padding: 8px 24px; border-radius: 999px; background: ${statusColor}22; color: ${statusColor}; margin-bottom: 24px; }
  .info { text-align: left; margin-top: 16px; }
  .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #2a2a4a; font-size: .9rem; }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #888; }
  .info-value { color: #e0e0e8; font-family: monospace; }
  .footer { margin-top: 32px; font-size: .75rem; color: #555; }
  .error { background: #ef444411; border: 1px solid #ef444444; border-radius: 8px; padding: 12px; margin-top: 16px; font-size: .8rem; color: #fca5a5; text-align: left; word-break: break-word; }
</style>
</head>
<body>
<div class="card">
  <h1>🤖 FynnMagChips</h1>
  <p class="subtitle">Discord Bot Status Monitor</p>
  <div class="status-badge">${statusText}</div>
  <div class="info">
    <div class="info-row"><span class="info-label">Bot</span><span class="info-value">${state.botTag || '—'}</span></div>
    <div class="info-row"><span class="info-label">Server</span><span class="info-value">${state.guildCount}</span></div>
    <div class="info-row"><span class="info-label">Gestartet</span><span class="info-value">${state.startedAt}</span></div>
  </div>
  ${state.lastError ? `<div class="error">${state.lastError}</div>` : ''}
  <p class="footer">Auto-Refresh alle 5 Sekunden</p>
</div>
<script>setTimeout(() => location.reload(), 5000);</script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: state.status, bot: state.botTag }));
        return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderPage());
});

server.listen(3000, '0.0.0.0', () => {
    console.log('📊 Status-Server läuft auf http://0.0.0.0:3000');
});

module.exports = { setStatus };
