# NexxTrade — Web AI Dashboard (PUBLIC)

เดโมเว็บ + ชั้นควบคุมแยกจากชาร์ต + License ↔ Telegram signal

**Repo นี้ไม่ใช่ AI Agent.** สมองวิเคราะห์/คำนวณอยู่ที่เครื่องลูกค้า (ส่วน private).
แผนที่: [REPOS.md](./REPOS.md)

## URLs

| Audience | Surface | Notes |
|---|---|---|
| **Customers** | Customer Vercel project (`web-ai-dashboard-nt`) and GitHub Pages | **Google login** primary; subdomain menu app/ai/news/pay/go; no Admin CTA |
| **Admins** | Separate Vercel project (`nexttrade-admin-console`) | Serves `console.html` at `/` (project rewrite). Not linked from customer pages |

GitHub Pages (customer demo): https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/

หน้าควบคุม: https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/control.html

| ไฟล์ | หน้า |
|---|---|
| `control.html` | SNAP / Providers / Analyze-only |
| `control-layer.js` | สถานะคีย์ + parse SNAP |
| `index.html` | หน้าหลักลูกค้า (Google login + เมนูซับโดเมน) |
| `google-auth.js` / `auth-ui.js` | Google Identity Services scaffold |
| `site-menu.js` | เมนู app/ai/news/pay/go จาก `CUSTOMER_HOSTS` |
| `wallet-connect.js` / `wallet-ui.js` | วอลเล็ตถอน (รอง — ไม่ใช่ล็อกอินหลัก) |
| `docs/CUSTOMER_HOSTS.md` | DNS / Vercel / Google Client ID |
| `console.html` | แอดมินคอนโสล (internal; separate admin URL) |
| `config.js` | `ADMIN_API_BASE` + `NEXTTRADE_BACKEND_URL` (placeholder) + WC / BSC / vault |
| `ai-chart.html` | TradingView คนละชั้น (เต็มจอ) |
| `chart-assets.js` | แคตตาล็อกสัญลักษณ์ + map TF → TV |
| `dashboard-widgets.js` | ฝัง TV ใน `#ai` + ปฏิทิน/ฟีดใน `#news` |
| `docs/CONTROL_LAYER.md` | สเปกชั้นควบคุม |
| `docs/SIGNAL_LICENSE.md` | License ↔ Telegram + Subscription |
| `docs/MARKETING.md` | Locked marketing rules (admin/ops only — not for customer UI) |
| `catalog/eas.json` | Static EA license catalog (fallback) |
| `catalog-ui.js` | Load catalog (API→static) + license/signal UI hooks |

Admin credentials and bootstrap secrets live in environment / deployment config — not in this README.

## Admin console → Admin API

หน้า `console.html` (Vercel `nexttrade-admin-console`) เรียก API ตามลำดับ:

1. `?api=https://YOUR-API.vercel.app` (บันทึกลง localStorage)
2. localStorage `admin_api_base`
3. `window.ADMIN_API_BASE` จาก `config.js` (ค่าเริ่ม: `https://nexttrade-ea-admin-api.vercel.app`)
4. relative path (เมื่อ API อยู่โดเมนเดียวกัน)

ตั้งค่าในฟอร์มล็อกอินช่อง **API base URL** ได้

อย่าใส่รหัสผ่านจริงใน README / config.js

## กฎิกาสาธารณะ

- เว็บ = คอนโสลคุมและโชว์การ์ด
- Client Agent / MCP = สมองอ่านชาร์ต
- Analyze only เป็นค่าเริ่ม ปุ่มเทรดล็อก
- คีย์ไม่ขึ้นรีโปนี้
- Customer UI does not link to `console.html`; admins use the separate admin deployment URL



## กราฟ TradingView + ข่าว (ลูกค้า)

| ส่วน | URL / แท็บ | แหล่งข้อมูล |
|---|---|---|
| กราฟสด | https://web-ai-dashboard-nt.vercel.app/#ai | TradingView Advanced Chart · ค่าเริ่ม `OANDA:XAUUSD` M15 |
| กราฟเต็มจอ | https://web-ai-dashboard-nt.vercel.app/ai-chart.html | ชุดเดียวกัน + สลับสินทรัพย์ v1 |
| ปฏิทินเศรษฐกิจ | https://web-ai-dashboard-nt.vercel.app/#news | TradingView Economic Calendar widget |
| ฟีดข่าวทอง | https://web-ai-dashboard-nt.vercel.app/#news | TradingView Timeline · symbol `OANDA:XAUUSD` |

**ต่อสายแล้ว (ลูกค้า)**
- EA license catalog: `GET {ADMIN_API_BASE}/catalog/eas` → fallback `./catalog/eas.json`
- Control AI: [`control.html`](./control.html) ลิงก์จากแถบนำทาง / หน้า AI / Keys / footer
- License↔signal UI hooks บน `#pay` (เรียก `/license/verify` เมื่อ API มี — ตอนนี้แสดงข้อความรอ backend)

**แชต AI (ต่อสายแล้ว — ไม่ตอบตัวอย่างปลอม)**
- ลำดับ: Local Agent `http://127.0.0.1:8787/chat` → BYOK `POST /api/chat` ด้วยคีย์ลูกค้าใน header
- คีย์: `.env` บนเครื่องลูกค้า (Nexttrade-AI-Agent) หรือ localStorage แท็บ API Keys (มีคำเตือน ไม่เข้ารหัส)
- คีย์บริษัท: ปิดเป็นค่าเริ่ม — เปิดได้เฉพาะเมื่อตั้ง `CHAT_ALLOW_SERVER_KEYS=1` + env บน Vercel (อย่า commit คีย์)
- ไฟล์: `ai-chat.js`, `api/chat.js`, `config.js` (`LOCAL_AGENT_URL`, `CHAT_PROXY_URL`)
- คู่มือติดตั้ง Local Agent (ลูกค้า): [`docs/CUSTOMER_AGENT_INSTALL.md`](./docs/CUSTOMER_AGENT_INSTALL.md) · ลิงก์จากแท็บ `#ai` / `#keys`

**ยังเป็น mock / ช่องว่าง**
- ชำระเงิน / Cap / IB ยังจำลองจนกว่ามี `USDT_PAYMENT_VAULT` จริง (อย่าเดาที่อยู่)
- `POST /license/verify` + Telegram bind ยังไม่มีบน Admin API ชั่วคราว — UI พร้อมแล้ว
- Repo `gold-trading-news-automation` มีสแกนเนอร์จริง แต่ **ยังไม่มี public HTTP API** และต้องมี secrets — อย่า proxy บน Vercel จนกว่าผู้ใช้ให้คีย์; เว็บใช้วิดเจ็ต TradingView
- `nexttrade-backend` (`/news/guard`, `/scan`) ยังไม่ deploy สาธารณะ — ตั้ง `NEXTTRADE_BACKEND_URL` ใน `config.js` หลังมี URL จริง (ดู `docs/DEPLOY.md` ใน repo backend)

## Google login (หลัก) + เมนูซับโดเมน

ตามแผนล็อก 2026-10-02: ลูกค้าเข้าด้วย **Google** · เมนูแยกโฮสต์ `app.` `ai.` `news.` `pay.` `go.` (admin คนละ URL)

1. ตั้ง `GOOGLE_CLIENT_ID` ใน `config.js` (OAuth Web client — public) หรือ `localStorage.google_client_id`
2. Authorized origins: `https://web-ai-dashboard-nt.vercel.app` + โดเมนลูกค้าเมื่อมี
3. ดูแมป DNS/Vercel ที่ [`docs/CUSTOMER_HOSTS.md`](./docs/CUSTOMER_HOSTS.md)

### Web3 วอลเล็ตถอน (รอง — ไม่ใช่ล็อกอิน)

บนหน้าผังหลังจ่ายแล้ว มีปุ่ม **เชื่อมวอลเล็ตถอน** (MetaMask / WC) สำหรับ Claim เท่านั้น ไม่ขึ้นเป็น CTA หลักที่เฮดเดอร์

### ทดสอบ MetaMask
1. เปิดไซต์บน Chrome/Brave ที่มี MetaMask
2. กด **เชื่อมวอลเล็ต** → **MetaMask / Injected (BSC)**
3. อนุมัติบัญชี; ถ้าไม่ได้อยู่ BSC จะมี prompt สลับ/เพิ่มเครือข่าย
4. พิลล์มุมขวาต้องแสดงที่อยู่จริง (ไม่ใช่ `0xABC…`)

### WalletConnect (scaffold — ต้องมี Project ID)
ยังไม่ได้ใส่ Project ID จริงใน repo (ตั้งเอง):
1. สร้างโปรเจกต์ที่ [Reown Cloud](https://cloud.reown.com/) (เดิม WalletConnect Cloud)
2. อนุญาต origin: `https://web-ai-dashboard-nt.vercel.app`
3. ใส่ค่าใน `config.js`:

```js
window.WALLETCONNECT_PROJECT_ID = "YOUR_REOWN_PROJECT_ID";
```

หรือใน DevTools: `localStorage.setItem("walletconnect_project_id", "YOUR_ID")` แล้วรีโหลด

คีย์ config: **`WALLETCONNECT_PROJECT_ID`** (หรือ localStorage `walletconnect_project_id`)

ถ้ายังว่าง ปุ่ม WalletConnect จะถูกปิดและมีข้อความภาษาไทยสอนวิธีตั้งค่า — **MetaMask ใช้ได้โดยไม่ต้องมี Project ID**

### SIWE
`personal_sign` เดโมในเมนูระบุชัดว่า **ไม่ใช่ SIWE session** (ยังไม่มี backend nonce)

### ชำระเงิน
จ่ายแพ็ก **20 USDT** ด้วยเลขบิล+QR (จำนวนเต็ม) ตามแผนล็อก — ปุ่มยัง**จำลอง**จนกว่า API จับบิลพร้อม · `USDT_PAYMENT_VAULT` ว่าง deliberately (ห้ามเดาที่อยู่)

## Marketing (internal)

กติกาคอมเพนเสชันล็อกไว้ที่ [`docs/MARKETING.md`](./docs/MARKETING.md) และแท็บ **Marketing (internal)** ใน `console.html`.
หน้าลูกค้าแสดงแค่ราคาแพ็ก **20 USDT** — ไม่โชว์ตาราง Tier/Unilevel/Pool/Leadership.
