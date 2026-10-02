# NEXTTRADE — แผนโฮสต์ลูกค้าและการเข้าใช้งาน

**สถานะ:** Locked · 2 ตุลาคม 2026  
**แหล่งอ้างอิง:** `Web-AI-Dashboard-Nexttrade/docs/CUSTOMER_HOSTS.md`, `PLAN_LOCKED.md` และ `ARCHITECTURE.md`

> เอกสารนี้เป็นแผนผังสำหรับทีมและการเตรียม deploy ลูกค้า โดเมนในตัวอย่างเป็น placeholder ยังไม่ใช่โดเมนจริง

## สรุปสั้น (EN)

Customer entry is **Google login first**. A customer node is created only after an integer **20 USDT package** is matched by bill number and QR payment. Web3 is used only when claiming/withdrawing. Until real DNS is ready, all customer surfaces stay in one SPA/hash deployment.

## 1) การเข้าใช้งานลูกค้า

- **ทางเข้าหลัก:** Google OAuth Web Client (`GOOGLE_CLIENT_ID`)
- **การสร้างโหนดในผัง:** หลังตรวจแพ็กเกจ **20 USDT** แบบจำนวนเต็ม โดยจับคู่เลขบิลกับ QR แล้วเท่านั้น
- **Web3:** ไม่ใช่ทางเข้าหลัก ใช้เฉพาะตอน Claim/ถอน
- **โหมดเริ่มต้นของระบบ:** ลูกค้าเห็น dashboard และการควบคุมตามสิทธิ์ที่ได้รับ; การเทรดเริ่มในโหมดปลอดภัย `advise` / `analyze_only=true` / `auto_trade=false`

## 2) โฮสต์ลูกค้า 5 จุด

| Prefix | หน้าที่ | พื้นผิว/แหล่งระบบ |
|---|---|---|
| `app.` | ฮับลูกค้า, ผัง, API Keys | `Web-AI-Dashboard-Nexttrade` |
| `ai.` | กราฟ, แชต, การควบคุม | Dashboard + runtime ลูกค้า `Nexttrade-AI-Agent` |
| `news.` | ปฏิทินและฟีดข่าว | Dashboard (ข่าวเชิงลึกต่อยอดจาก `gold-trading-news-automation`) |
| `pay.` | แพ็กเกจ, ใบอนุญาต EA, Claim | Dashboard UI + license API จาก `NexxTrade-EA-Admin-Private` |
| `go.` | ลิงก์แนะนำสาธารณะ | `Web-AI-Dashboard-Nexttrade` |

`admin.` เป็นระบบแอดมินคนละ origin ใช้สำหรับอีเมลและ 2FA และ **ห้ามแสดงในเมนูลูกค้า**

## 3) Placeholder URL (ห้ามเดาโดเมนจริง)

```text
https://app.nexxtrade.example
https://ai.nexxtrade.example
https://news.nexxtrade.example
https://pay.nexxtrade.example
https://go.nexxtrade.example
https://admin.nexxtrade.example   # แอดมิน ไม่ใช่เมนูลูกค้า
```

ในป้ายเมนูไม่ต้องแสดง prefix `app.` / `ai.` ฯลฯ ให้ใช้ชื่อฟังก์ชันที่ลูกค้าเข้าใจง่าย เช่น **Dashboard, AI, News, Pay, Invite**

## 4) พฤติกรรมเมนูระหว่างยังไม่มี DNS

ค่าเริ่มต้น `CUSTOMER_MENU_MODE=auto`

- บน `*.vercel.app`, `github.io` หรือ `localhost`: ใช้ **SPA hash** ในโปรเจกต์ Vercel เดียว `web-ai-dashboard-nt`
- เมื่อเปิดบนโฮสต์ที่ลงท้ายด้วย `CUSTOMER_ROOT_DOMAIN`: เปลี่ยนเป็นลิงก์ข้ามซับโดเมนตาม `CUSTOMER_HOSTS`
- ระหว่าง DNS ยังไม่พร้อม เมนูลูกค้ายังต้องทำงานใน SPA เดียว ไม่ควรสร้างลิงก์ไปโดเมนสมมติ

## 5) ค่า config / environment ที่เกี่ยวข้อง

| คีย์ | หน้าที่ | สถานะ/ข้อควรระวัง |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Google OAuth Web Client ID | เป็น public client ID; ใส่ใน `config.js` หรือ localStorage `google_client_id` |
| `CUSTOMER_ROOT_DOMAIN` | root domain ของลูกค้า | ตอนนี้ใช้ `nexxtrade.example` เป็น placeholder |
| `CUSTOMER_HOSTS` | map ของ `app/ai/news/pay/go` | เปลี่ยนเมื่อมีโดเมนจริง |
| `CUSTOMER_MENU_MODE` | `auto` / `spa` / `hosts` | ใช้ `auto` จน DNS พร้อม |
| `WALLETCONNECT_PROJECT_ID` | วอลเล็ตตอน Claim/ถอน | optional |
| `USDT_PAYMENT_VAULT` | vault รวม | ต้องว่าง; ห้ามเดาหรือใส่ address เพราะแผนใช้เลขบิล + QR |

ห้ามใส่ secret, private key, token หรือ wallet address จริงใน public repo

## 6) Checklist เมื่อมีโดเมนจริง

1. ซื้อ/ชี้ root domain จริง แล้วแทนที่ placeholder ใน `config.js` (`CUSTOMER_ROOT_DOMAIN`, `CUSTOMER_HOSTS`, `ADMIN_HOST_URL`)
2. ใน Vercel โปรเจกต์ลูกค้า `web-ai-dashboard-nt` เพิ่ม domain: `app.`, `ai.`, `news.`, `pay.`, `go.`
3. ตั้ง DNS CNAME ของแต่ละ subdomain ไปยัง `cname.vercel-dns.com` หรือตามค่าที่ Vercel แสดง
4. ให้โปรเจกต์แอดมิน `nexttrade-admin-console` ชี้เฉพาะ `admin.`
5. ใน Google Cloud OAuth Web client เพิ่ม Authorized JavaScript origins ของทุก customer origin และ Vercel URL ที่ยังใช้งาน
6. เปลี่ยน `CUSTOMER_MENU_MODE=hosts` หรือคง `auto` ให้ระบบเลือกตาม host

## 7) งานที่ยังไม่ถือว่าเสร็จ

- ตรวจ `id_token` ฝั่งเซิร์ฟเวอร์และสร้าง session จริง (ปัจจุบันเป็น GIS ฝั่งเบราว์เซอร์)
- ทำ API จับคู่บิล 20 USDT และสร้างโหนดในผัง
- ตั้ง DNS/โดเมนจริง; ก่อนหน้านั้นเมนูบน Vercel ต้องอยู่ใน SPA mode

## 8) ขอบเขตความปลอดภัยของระบบ

Dashboard เป็นชั้นควบคุมและแสดงผล ไม่ใช่สมองเทรด; EA เป็นผู้ execute จริง ส่วน client agent วิเคราะห์และทำ guardrails บนเครื่องลูกค้า ห้ามใส่ source EA, secret หรือคีย์ LLM ลงใน dashboard public repo
