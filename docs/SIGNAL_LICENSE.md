# License ↔ Telegram Signal Entitlement

Dashboard เรียก **Admin API** (`ADMIN_API_BASE` ใน `config.js`) เมื่อครบชิ้นด้านล่าง  
โมดูลอ้างอิง: `signal-api/signal-entitlement.js` (orphan / mirror) · implementation จริงอยู่ที่ `NexxTrade-EA-Admin-Private`

## 1. License API

| Method | Path | Auth | ใช้ทำอะไร |
|---|---|---|---|
| POST | `/license/verify` | public | EA / client ส่ง `key` + `ea` ได้ `status` `expiry` `signal_enabled` |
| GET | `/license/status` | public query | `userId` / `ea` / `id` / `key` |
| POST | `/ea/:code/license` | admin `ea.license.issue` | ออก key (plain ครั้งเดียว) ค่าเริ่ม `signal_enabled=true` |
| POST | `/ea/:code/license/revoke` | admin | เพิกถอน → status=`revoked` ตัดสัญญาณ |
| POST | `/ea/:code/license/signal` | admin `ea.license.flag` | เปิด/ปิด `signal_enabled` โดยไม่ต้อง revoke |

สถานะ License: `active` | `expired` | `revoked` | `missing`

สิทธิ์รับสัญญาณ = `status === active` **และ** `signal_enabled === true`

## 2. รายชื่อผู้รับสัญญาณ

| Method | Path | Auth |
|---|---|---|
| GET | `/signal/recipients?ea=002` | header `X-Bot-Token` (บอท) |
| GET | `/signal/admin/recipients` | admin session |
| POST | `/signal/webhooks` | admin — ลงทะเบียน URL เมื่อเปิด/ปิดสิทธิ์ |

`X-Bot-Token` = env `SIGNAL_BOT_TOKEN` (ตั้งบน Admin API เท่านั้น — อย่าใส่ใน README)

ถ้ายังไม่ตั้ง token → API ตอบ **503** `bot_token_unset` (ไม่ใช่ 404)

## 3. ผูก `telegram_chat_id` กับ `client_id`

1. เรียก `POST /signal/start-link` body `{ "key", "ea" }` หรือ `{ "userId", "ea" }` ได้ deep link อายุ 15 นาที  
2. User เปิด `/start TOKEN` บน Telegram  
3. บอท `POST /signal/telegram/start` `{ start_token, chat_id }` + `X-Bot-Token`  
4. API เขียน `telegramChatId` ลง license  

ถอดผูก: `POST /signal/telegram/unbind`

ถ้ายังไม่ตั้ง `TELEGRAM_BOT_USERNAME` → start-link ตอบ **503** `telegram_bot_unset` — ปุ่ม UI แสดงข้อความช่วยเหลือ

## 4. Auth + URL Dashboard

| ค่า | Env / config |
|---|---|
| Dashboard URL | `DASHBOARD_URL` (Admin API) · UI: `config.js` |
| Admin API base | `window.ADMIN_API_BASE` → `https://nexttrade-ea-admin-api.vercel.app` |
| Bot username | `TELEGRAM_BOT_USERNAME` |
| Bot service token | `SIGNAL_BOT_TOKEN` |

Admin session: `POST /auth/login` แล้ว `Authorization: Bearer`

## 5. Persistence

Vercel Admin API ตอนนี้เก็บ license ในหน่วยความจำ (ephemeral) — ใช้ smoke ได้  
Production ย้ายไป VPS/DB ตาม `NexxTrade-EA-Admin-Private/docs/SIGNAL_LICENSE.md`
