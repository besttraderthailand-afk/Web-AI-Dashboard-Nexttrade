# AI Chat wiring (customer dashboard)

อัปเดต: 2026-10-01

## Approach

1. **Local Agent (preferred)** — browser probes `GET {LOCAL_AGENT_URL}/health` then `POST /chat`.
   Default `LOCAL_AGENT_URL` = `http://127.0.0.1:8787` (Nexttrade-AI-Agent).
   Keys stay in the customer `.env` on that machine. Dashboard may also pass `api_key` from localStorage if `.env` is empty.
2. **BYOK proxy** — if local agent is down, `POST /api/chat` (or `CHAT_PROXY_URL`) with header `X-Customer-Api-Key`.
   No company API keys in the repo. Server env keys are **not** used unless `CHAT_ALLOW_SERVER_KEYS=1`.
3. **Gate** — if neither path works, UI shows a Thai wait message. **No hardcoded sample smart answers.**

## How the user supplies keys

| Where | How |
|---|---|
| Client PC `.env` | Copy `Nexttrade-AI-Agent/config/example.env` → `.env`, fill one provider key, run `python -m agent.server` |
| Browser localStorage | Dashboard `#keys` → save OpenAI/Claude/Gemini/Grok (cleartext localStorage + Thai warning) |
| Company server (optional) | Vercel env + `CHAT_ALLOW_SERVER_KEYS=1` — gated, not default |

## Files

- `ai-chat.js` — UI bind + probe + send
- `api/chat.js` — Vercel serverless BYOK
- `config.js` — `LOCAL_AGENT_URL`, `CHAT_PROXY_URL`

## Out of scope

- USDT vault / marketing plan tables (still hidden on customer UI)
- Inventing API keys or committing secrets
