# Control layer — แยกจากชาร์ต

เว็บแดชบอร์ดชุดนี้คือคอนโสลคุม ไม่ใช่ AI Assistant ในตัว MT5
ชาร์ตอยู่คนละชั้นกับแผงควบคุม เพิ่มโมดูล ไม่รื้อหน้าเดิม

## ของเดิม vs ที่เพิ่ม

| ชั้น | มีอยู่แล้ว | เพิ่มรอบนี้ |
|---|---|---|
| เปลือก UI | `index.html` เว็บ | ใช้ต่อ |
| ชาร์ต | หน้า AI + `ai-chart.html` TradingView | ไม่ย้าย |
| คีย์ลูกค้า | หน้า Keys 4 ช่องว่าง | สถานะ `WAIT_KEY / OK / BAD_KEY` |
| SNAP | ไม่มี | ฟอร์ม 6 บรรทัฑ → การ์ด |
| โหมด | Signal Only / Auto ในสถาปัตยกรรม | สวิตช์ Analyze only เป็นค่าเริ่ม ปุ่มเทรดล็อก |
| Stress / ping / RAM | ยังไม่มี | เลื่อนรอบถัดไป อ่านอย่างเดียว |

## SNAP 6 บรรทัฑ

รับทั้งแปะอิสระและรูปแบบ `KEY: value`

```
SYMBOL: XAUUSD
TIMEFRAME: M15
SESSION: LONDON
BIAS: BULL
RISK: 0.5%
SETUP: FVG + OB sweep
```

ถ้าไม่มีป้ายกำกับ เรียงตามลำดับ 6 ช่องด้านบน

การ์ดที่โชว์: BIAS · SESSION · RISK · SNAP (รวม SYMBOL/TF/SETUP)

## Provider

4 เจ้าตั้งแต่วันแรก: OpenAI, Anthropic, Gemini, xAI
คีย์เป็นของลูกค้า ตรวจรูปทรงฝั่งเบราว์เซอร์เท่านั้น
เซิร์ฟเวอร์เก็บแค่สถานะ + hash ย่อ ไม่เก็บ plaintext ในรีโป

## Analyze / Trade

- ค่าเริ่ม: `analyzeOnly = true`
- ปุ่มเทรดล็อกจนกว่าจะปิด Analyze only และมีอย่างน้อยหนึ่งคีย์สถานะ OK
- ชั้นนี้ไม่ยิงออเดอร์เอง — ส่งคำสั่งไปสะพาน MT5 ที่มีอยู่

## ไฟล์

- `control-layer.js` — โมดูลร่วมเบราว์เซอร์/โนด
- `index.html` — แผงบนหน้า AI + Keys + หน้าควบคุม
