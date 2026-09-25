# NexxTrade — Web AI Dashboard

เดโมเว็บทั้งระบบ + แอดมินคอนโซล + License ↔ Telegram signal (25 ก.ย. 2026)

## เปิดบน GitHub Pages

https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/

| ไฟล์ | หน้า |
|---|---|
| `index.html` | หน้าหลัก ลูกค้า: AI+ชาร์ต, ข่าว, จ่ายเงิน, Affiliate/IB, ต้นไม้, API keys |
| `console.html` | แอดมินคอนโซล (เดโม UI) |
| `docs/SIGNAL_LICENSE.md` | สเปก License API + ผูก `telegram_chat_id` |
| `signal-api/signal-entitlement.js` | โมดูลสิทธิ์รับสัญญาณ ผูกกับบอท |

## License ↔ Telegram signal

ก่อนซิงค์ได้ บอทต้อง `POST /signal/telegram/start` ด้วย `X-Bot-Token` แล้วดึง `GET /signal/recipients` ก่อนยิงสัญญาณ

รายละเอียดอยู่ใน `docs/SIGNAL_LICENSE.md`

## ขึ้นโดเมนจริง

อัป `index.html` + `console.html` ไปที่ document root ของโดเมน

- หน้าแรก → `/` หรือ `/index.html`
- คอนโซล → `/console.html`

API จริง (login / license / recipients) รันแยกบน VPS — รีโปนีไม่มีรหัสบูต / `.env`

## Repo นี้เป็นสาธารณะ

อย่า่ commit ซอร์ส EA, กุญแจ, `.env`, หรือ Admin API ที่มีรหัสบูตสแตรป
