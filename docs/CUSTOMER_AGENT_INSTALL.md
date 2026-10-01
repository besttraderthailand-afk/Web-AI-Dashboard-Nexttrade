# ติดตั้ง Local Agent ให้แชต `#ai` ทำงาน / Install Local Agent for dashboard chat

อัปเดต: 2026-10-01

แดชบอร์ดนี้ **ไม่มีสมอง LLM ในตัว** — แท็บ AI จะเรียก Agent บนเครื่องคุณที่  
`http://127.0.0.1:8787` (ค่าเริ่มใน `config.js` → `LOCAL_AGENT_URL`)

คีย์ของคุณอยู่บนเครื่องคุณเท่านั้น บริษัทไม่ใส่คีย์ใน repo นี้

## ขั้นตอนสั้น (ไทย)

1. ได้ชุด **Nexttrade-AI-Agent** (ZIP จาก Release หรือโฟลเดอร์จากทีม)
2. ติดตั้ง **Python 3.10+** แล้วสร้าง venv:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate          # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. คัดลอก env แล้วใส่คีย์ของคุณ (อย่างน้อย 1 ตัว):
   ```bash
   cp config/example.env .env
   # แก้ .env — OPENAI_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY / XAI_API_KEY
   ```
4. รัน:
   ```bash
   python -m agent.server
   ```
5. ตรวจ:
   ```bash
   curl -s http://127.0.0.1:8787/health
   ```
6. เปิดแดชบอร์ดนี้ → แท็บ **AI** — สถานะควรขึ้น **Local Agent พร้อม**  
   แล้วลองพิมพ์ในช่องแชต (คำตอบมี prefix `[Local Agent]`)

รายละเอียดเต็ม (แก้ปัญหา / MT5 / ZIP): อยู่ในชุด Agent ที่ไฟล์  
`docs/CUSTOMER_INSTALL.md`

## English (short)

1. Unpack **Nexttrade-AI-Agent** (customer ZIP).  
2. Python **3.10+** → venv → `pip install -r requirements.txt`.  
3. `cp config/example.env .env` and fill **your** provider key(s).  
4. `python -m agent.server` → `http://127.0.0.1:8787`.  
5. `GET /health` then open this site’s **#ai** tab — status should show Local Agent ready.  
6. Do **not** invent or commit API keys.

## ทางเลือก / Fallback

| สถานะ | ผล |
|---|---|
| Local Agent รันอยู่ | แชตผ่าน `POST /chat` |
| Agent ปิด แต่มีคีย์ในแท็บ API Keys | ลอง BYOK `POST /api/chat` |
| ไม่มีทั้งสอง | ข้อความรอต่อสาย — **ไม่ตอบตัวอย่างปลอม** |

**ชุดหลัก** = Nexttrade-AI-Agent (linear).  
`Nexttrade-AI-Agent-langgraph` เป็นทางเลือกขั้นสูง ไม่จำเป็นสำหรับแชตนี้

## ลิงก์ในแดชบอร์ด

- แท็บ [AI](../index.html#ai) · แท็บ [API Keys](../index.html#keys)
- โค้ด probe: `ai-chat.js` · สเปก: [AI_CHAT.md](./AI_CHAT.md)
