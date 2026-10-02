# Customer hosts + Google login (locked 2026-10-02)

แหล่งแผน: `NexxTrade-EA-Admin-Private/ARCHITECTURE.md` § **Client hosts and pay plan (locked 2026-10-02)**  
สะท้อนในแดชบอร์ด: `PLAN_LOCKED.md`, เมนู `#siteMenu`, `config.js`

## Login

- **Primary:** Google (`GOOGLE_CLIENT_ID` ใน `config.js` หรือ localStorage `google_client_id`)
- โหนดในผังถูกสร้าง **หลัง** บิลแพ็ก **20 USDT** จับคู่เลขบิล + QR (จำนวนเต็ม) เท่านั้น
- **Web3 ไม่ใช่ทางเข้าหลัก** — ถามวอลเล็ตตอน Claim/ถอนเท่านั้น

## เมนูลูกค้า · 5 โฮสต์ (admin ไม่ขึ้นเมนู)

| Prefix | บทบาท | Repo / พื้นผิวหลัก |
|---|---|---|
| `app.` | ฮับ · ผัง · API Keys | `Web-AI-Dashboard-Nexttrade` |
| `ai.` | กราฟ + แชต + ควบคุม | `Web-AI-Dashboard-Nexttrade` (+ runtime ลูกค้า `Nexttrade-AI-Agent`) |
| `news.` | ปฏิทิน + ฟีด | `Web-AI-Dashboard-Nexttrade` (ข่าวลึกภายหลัง: `gold-trading-news-automation`) |
| `pay.` | แพ็ก / ไลเซนส์ EA / Claim | Dashboard UI + license API จาก `NexxTrade-EA-Admin-Private` |
| `go.` | ลิงก์แนะนำสาธารณะ | `Web-AI-Dashboard-Nexttrade` |
| `admin.` | อีเมล + 2FA · **คนละ origin** | `nexttrade-admin-console` / EA-Admin — **ห้ามใส่เมนูลูกค้า** |

Placeholder ใน config (อย่าเดาโดเมนจริง):

```text
https://app.nexxtrade.example
https://ai.nexxtrade.example
https://news.nexxtrade.example
https://pay.nexxtrade.example
https://go.nexxtrade.example
https://admin.nexxtrade.example   ← ไม่ขึ้นเมนูลูกค้า
```

ค่าเริ่ม `CUSTOMER_MENU_MODE=auto`:
- บน `*.vercel.app` / `github.io` / localhost → **SPA hash** (โปรเจกต์ Vercel เดียว `web-ai-dashboard-nt`)
- บนโฮสต์ที่ลงท้ายด้วย `CUSTOMER_ROOT_DOMAIN` → ลิงก์ข้ามซับโดเมนตาม `CUSTOMER_HOSTS`

## Vercel / DNS ที่ต้องทำเมื่อมีโดเมนจริง

1. ซื้อ/ชี้โดเมนจริง แล้วแทนที่ `nexxtrade.example` ใน `config.js` (`CUSTOMER_ROOT_DOMAIN` + `CUSTOMER_HOSTS` + `ADMIN_HOST_URL`)
2. ใน Vercel โปรเจกต์ลูกค้า `web-ai-dashboard-nt` (หรือแยกโปรเจกต์ต่อโฮสต์ถ้าต้องการ):
   - Add Domain: `app.`, `ai.`, `news.`, `pay.`, `go.` ของโดเมนจริง
3. DNS: CNAME แต่ละซับโดเมน → `cname.vercel-dns.com` (หรือตามที่ Vercel แสดง)
4. โปรเจกต์แอดมินคนละตัว (`nexttrade-admin-console`) ชี้เฉพาะ `admin.`
5. Google Cloud OAuth Web client — Authorized JavaScript origins ใส่ทุก origin ลูกค้า (+ Vercel ปัจจุบัน)
6. ตั้ง `CUSTOMER_MENU_MODE=hosts` (หรือปล่อย `auto` เมื่อ DNS ชี้แล้ว)

## Env / config ที่ต้องใส่ (ไม่มี secret ใน repo)

| คีย์ | ที่ใส่ | หมายเหตุ |
|---|---|---|
| `GOOGLE_CLIENT_ID` | `config.js` หรือ localStorage `google_client_id` | OAuth 2.0 Web Client ID (public) |
| `CUSTOMER_ROOT_DOMAIN` | `config.js` | ตอนนี้ `nexxtrade.example` |
| `CUSTOMER_HOSTS` | `config.js` | map app/ai/news/pay/go |
| `CUSTOMER_MENU_MODE` | `config.js` | `auto` / `spa` / `hosts` |
| `WALLETCONNECT_PROJECT_ID` | optional | เฉพาะวอลเล็ตถอน |
| `USDT_PAYMENT_VAULT` | **ว่าง** | แผนใช้เลขบิล+QR ไม่ใช่ vault รวม — ห้ามเดาที่อยู่ |

## ช่องว่างที่เหลือ

- ตรวจ `id_token` ฝั่งเซิร์ฟเวอร์ / สร้าง session จริง (ตอนนี้ GIS ฝั่งเบราว์เซอร์อย่างเดียว)
- API จับคู่บิล 20 USDT + สร้างโหนดในผัง
- DNS/โดเมนจริงยังไม่ได้ตั้ง — เมนูบน Vercel ยังเป็น SPA
