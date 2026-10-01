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
| `console.html` | แอดมินคอนโสล (internal; separate admin URL) |
| `ai-chart.html` | TradingView คนละชั้น |
| `docs/CONTROL_LAYER.md` | สเปกชั้นควบคุม |
| `docs/SIGNAL_LICENSE.md` | License ↔ Telegram + Subscription |

Admin credentials and bootstrap secrets live in environment / deployment config — not in this README.

## กฎิกาสาธารณะ

- เว็บ = คอนโสลคุมและโชว์การ์ด
- Client Agent / MCP = สมองอ่านชาร์ต
- Analyze only เป็นค่าเริ่ม ปุ่มเทรดล็อก
- คีย์ไม่ขึ้นรีโปนี้
- Customer UI does not link to `console.html`; admins use the separate admin deployment URL
