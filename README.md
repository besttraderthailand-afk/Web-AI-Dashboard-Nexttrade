# NexxTrade — Web AI Dashboard (PUBLIC)

เดโมเว็บ + ชั้นควบคุมแยกจากชาร์ต + License ↔ Telegram signal

**Repo นี้ไม่ใช่ AI Agent.** สมองวิเคราะห์/คำนวณอยู่ที่เครื่องลูกค้า (ส่วน private).
แผนที่: [REPOS.md](./REPOS.md)

## URLs

| Audience | Surface | Notes |
|---|---|---|
| **Customers** | Customer Vercel project (`web-ai-dashboard-nt`) and GitHub Pages | Wallet connect only — no Admin CTA in the customer UI |
| **Admins** | Separate Vercel project (`nexttrade-admin-console`) | Serves `console.html` at `/` (project rewrite). Not linked from customer pages |

GitHub Pages (customer demo): https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/

หน้าควบคุม: https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/control.html

| ไฟล์ | หน้า |
|---|---|
| `control.html` | SNAP / Providers / Analyze-only |
| `control-layer.js` | สถานะคีย์ + parse SNAP |
| `index.html` | หน้าหลักลูกค้า (Web3 connect) |
| `wallet-connect.js` | EIP-1193 MetaMask/injected + WC scaffold |
| `wallet-ui.js` | UI เมนูเชื่อมวอลเล็ต |
| `console.html` | แอดมินคอนโสล (internal; separate admin URL) |
| `config.js` | `ADMIN_API_BASE` + `WALLETCONNECT_PROJECT_ID` / BSC / vault |
| `ai-chart.html` | TradingView คนละชั้น (เต็มจอ) |
| `chart-assets.js` | แคตตาล็อกสัญลักษณ์ + map TF → TV |
| `dashboard-widgets.js` | ฝัง TV ใน `#ai` + ปฏิทิน/ฟีดใน `#news` |
| `docs/CONTROL_LAYER.md` | สเปกชั้นควบคุม |
| `docs/SIGNAL_LICENSE.md` | License ↔ Telegram + Subscription |

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

**ยังเป็น mock / ช่องว่าง**
- AI Chat บน `#ai` ยังตอบตัวอย่างในเบราว์เซอร์ (ยังไม่ยิงคีย์ลูกค้า)
- ชำระเงิน / Cap / IB ยังจำลองจนกว่ามี vault
- Repo `gold-trading-news-automation` มีสแกนเนอร์จริง (biquote + Forex Factory JSON + RSS) แต่ **ยังไม่มี public HTTP API** ให้แดชบอร์ดดึง — เว็บจึงใช้วิดเจ็ต TradingView แทนจนกว่าจะมี backend `/news`

## Web3 เชื่อมวอลเล็ต (Phase 1)

ลูกค้าเว็บ `https://web-ai-dashboard-nt.vercel.app` ใช้ **MetaMask / injected** จริงบน **BSC mainnet (chainId 56)** — แสดงที่อยู่ย่อ, ตัดการเชื่อมต่อ, ฟัง `accountsChanged` / `chainChanged`, และขอสลับเชนถ้าไม่ใช่ BSC.

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
ปุ่มจ่าย 17 USDT ยังเป็น **จำลอง** จนกว่าจะมี `USDT_PAYMENT_VAULT` ใน config — ห้ามเดาที่อยู่ vault
