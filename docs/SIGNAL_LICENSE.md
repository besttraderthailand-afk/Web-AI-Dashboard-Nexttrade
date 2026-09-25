# License ↔ Telegram Signal Entitlement

Dashboard สามารถผูกสัญญาณกับ License ได้เมื่อครบ 4 ชิ้นนี้

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

บอทดึงรายชื่อ `chat_id` ที่ผูกแล้วและยังมีสิทธิ์ หรือฟัง webhook `signal.enabled` / `signal.disabled` / `telegram.bound` / `telegram.unbound`

`X-Bot-Token` = env `SIGNAL_BOT_TOKEN`

## 3. ผูก `telegram_chat_id` กับ `client_id`

1. เรียก `POST /signal/start-link` body `{ "userId", "ea" }` ได้ deep link `อายุ 15 นาที`
2. User เปิด `/start TOKEN` บน Telegram
3. บอท `POST /signal/telegram/start` `{ start_token, chat_id }` + `X-Bot-Token`
4. API เขียน `telegramChatId` ลง license ของ `client_id`

ถอดผูก: `POST /signal/telegram/unbind`

## 4. Auth + URL Dashboard

| ค่า | Env |
|---|---|
| Dashboard URL | `DASHBOARD_URL` |
| Admin bind | `ADMIN_BIND` / `ADMIN_PORT` |
| Admin hosts | `ADMIN_HOSTS` |
| Bot username | `TELEGRAM_BOT_USERNAME` |
| Bot service token | `SIGNAL_BOT_TOKEN` |

Admin session: `POST /auth/login` แล้ว `Authorization: Bearer`
