# NexxTrade — Web AI Dashboard

เดโมเว็บทั้งระบบ + ชั้นควบคุมแยกจากชาร์ต + License ↔ Telegram signal

## เปิดบน GitHub Pages

https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/

| ไฟล์ | หน้า |
|---|---|
| `index.html` | หน้าหลักลูกค้า + แผงควบคุม / SNAP / Analyze-only |
| `control-layer.js` | โมดูลสถานะคีย์ + parse SNAP 6 บรรทัฑ |
| `console.html` | แอดมินคอนโสล (เดโม UI) |
| `ai-chart.html` | TradingView คนละชั้นกับแผงคุม |
| `docs/CONTROL_LAYER.md` | สเปกชั้นควบคุม |
| `docs/SIGNAL_LICENSE.md` | สเปก License API + ผูก telegram_chat_id |
| `signal-api/signal-entitlement.js` | โมดูลสิทธิ์รับสัญญาณ |

ทางลัด: [ควบคุม](https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/#control) · [AI + กราฟ](https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/#ai) · [API Keys](https://besttraderthailand-afk.github.io/Web-AI-Dashboard-Nexttrade/#keys)

## ชั้นควบคุม (26 ก.ย. 2026)

เว็บ = คอนโสลคุมและโชว์การ์ด  
MT5 Assistant / MCP = สมองอ่านชาร์ตในเทอร์มินัล  
สองชั้นทำงานคู่กัน ไม่ย้ายไปแอปวินโดว์

- 4 ช่องคีย์ OpenAI / Anthropic / Gemini / xAI สถานะ `WAIT_KEY / OK / BAD_KEY`
- SNAP 6 บรรทัฑ → การ์ด BIAS SESSION RISK SETUP
- Analyze only เป็นค่าเริ่ม ปุ่มเทรดล็อกจนกว่าจะมีคีย์ OK และปลดล็อกเอง
- คีย์ไม่ขึ้นรีโปนี้

## Repo นี้เป็นสาธารณะ

อย่า commit ซอร์ส EA, กุญแจ, `.env`, หรือ Admin API ที่มีรหัสบูตสแตรป
