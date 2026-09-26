# NexxTrade — Web AI Dashboard

เดโมเว็บทั้งระบบ + ชั้นควบคุมแยกจากชาร์ต + License ↔ Telegram signal

## เปิดบน GitHub Pages

https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/

หน้าควบคุม (แยกจากชาร์ต):
https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/control.html

| ไฟล์ | หน้า |
|---|---|
| `control.html` | ชั้นควบคุม: SNAP / Providers / Analyze-only |
| `control-layer.js` | โมดูลสถานะคีย์ + parse SNAP 6 บรรทัฑ |
| `index.html` | หน้าหลักลูกค้า |
| `console.html` | แอดมินคอนโสล |
| `ai-chart.html` | TradingView คนละชั้น |
| `docs/CONTROL_LAYER.md` | สเปกชั้นควบคุม |

## ชั้นควบคุม (26 ก.ย. 2026)

เว็บ = คอนโสลคุมและโชว์การ์ด
MT5 Assistant / MCP = สมองอ่านชาร์ต
สองชั้นทำงานคู่กัน ไม่ย้ายไปแอปวินโดว์

- 4 ช่องคีย์ OpenAI / Anthropic / Gemini / xAI สถานะ `WAIT_KEY / OK / BAD_KEY`
- SNAP 6 บรรทัฑ → การ์ด BIAS SESSION RISK SETUP
- Analyze only เป็นค่าเริ่ม ปุ่มเทรดล็อก
- คีย์ไม่ขึ้นรีโปนี้

## Repo นี้เป็นสาธารณะ

อย่า commit ซอร์ส EA, กุญแจ, `.env`, หรือ Admin API ที่มีรหัสบูตสแตรป
