# NEXTTRADE — กติกา Marketing (Internal)

**สถานะ:** Locked · 1 ตุลาคม 2026  
**ผู้ใช้เอกสาร:** ทีม Operations / Admin / Finance เท่านั้น

> **ห้ามแสดงต่อลูกค้า** — หน้า customer แสดงราคาแพ็กเกจ **20 USDT** เท่านั้น ห้ามแสดงตาราง marketing, referral, pool หรือเครื่องคำนวณการแบ่งผลตอบแทนบน customer UI

## สรุปสั้น (EN)

The locked package is **20 USDT**. Tier is **15% / 10% / 5%**, unilevel is **21%**, leadership is **8%** when the 10-level package volume crosses **200 USDT and each doubled threshold**, and the pool reserve is **12%** with a monthly all-paid-spend KPI. These rules are internal only.

## 1) ขอบเขตแพ็กเกจ

- แพ็กเกจราคา **20 USDT** และรับเป็นจำนวนเต็ม โดยจับคู่กับเลขบิล
- กติกา Tier, Unilevel และ Leadership ในเอกสารนี้ใช้กับ **package purchase / repurchase เท่านั้น**
- ไม่ใช้กับ Cap, ค่าเช่า EA/AI หรือบริการชำระเงินประเภทอื่น เว้นแต่มีเอกสารล็อกใหม่ระบุชัดเจน

## 2) Referral Tier — จ่ายทันที

| ระดับ | อัตรา |
|---|---:|
| Tier 1 | 15% |
| Tier 2 | 10% |
| Tier 3 | 5% |
| **รวม** | **30%** |

จ่ายทันทีเมื่อมีการซื้อหรือ repurchase แพ็กเกจ ไม่มีเงื่อนไข hold รอจำนวนคน และไม่ย้ายโหนดเพื่อให้เกิดสิทธิ์

## 3) Unilevel — 21%

- รวม **21%** ของบิลแพ็กเกจ แบ่งเป็น 10 pay slots ตามสาย sponsor
- สำหรับบิล 20 USDT: **10 ระดับ × 0.42 USDT = 4.20 USDT** (เทียบเท่า 21%)
- เดินตามสาย sponsor และ **ข้าม node ที่ inactive เฉพาะบิลนั้น** โดยไม่ย้าย node
- ถ้าสาย active สั้นกว่า 10 ระดับ ช่องที่เหลือเป็นส่วนของบริษัท

## 4) Leadership — 8% จาก threshold แบบคูณสอง

- จ่าย **8% ของบิลแพ็กเกจ** เฉพาะเมื่อ cumulative **package volume ใต้ 10 ระดับ** ข้าม threshold
- Threshold เริ่มที่ **200 USDT** และเพิ่มเป็นสองเท่า: `200 → 400 → 800 → 1,600 → 3,200 → …`
- เป็นการ unlock ตามรอบ/threshold ที่กำหนด ไม่ใช่สิทธิ์จาก Cap หรือค่าเช่า EA/AI
- บิลอื่นที่ไม่เข้าเงื่อนไข unlock ให้ 8% คงอยู่ใน company share

## 5) Pool — สำรอง 12% และ KPI รายเดือน

- กัน **12% ของแพ็กเกจ/บริการ** เป็น Pool reserve ตามบัญชีบริษัท
- Rank และ KPI คำนวณใหม่จาก **ยอด paid spend สะสมของเดือนนั้น** รวม package, Cap, EA/AI และ paid services อื่น
- จ่ายให้สมาชิกเฉพาะ **rank bucket สูงสุดของตนเอง** ในเดือนนั้น ไม่รับ Bronze + Silver + Gold ซ้อนกัน
- Pool ของ bucket เดียวกันหารด้วยจำนวนสมาชิกที่ผ่าน rank เดียวกัน
- ถ้าเดือนนั้นยอดไม่ถึง 200 USDT จะไม่ได้ Pool ในรอบนั้น
- หากเดือนถัดไปไม่ถึง KPI ของ rank เดิม ให้จ่ายตาม rank ที่ทำได้ในเดือนนั้น หรือไม่จ่ายหากต่ำกว่า Bronze

### Rank และเกณฑ์ volume รายเดือน

| Rank | น้ำหนัก bucket | เกณฑ์ team volume |
|---|---:|---:|
| Bronze | 10% | 200 USDT |
| Silver | 15% | 1,000 USDT |
| Gold | 20% | 5,000 USDT |
| Diamond | 25% | 20,000 USDT |
| Legend | 30% | 80,000 USDT |

ตัวอย่าง: ผู้ที่อยู่ Diamond ได้เฉพาะ Diamond bucket; หากลดจาก Diamond เป็น Gold ให้รับเฉพาะ Gold bucket ในรอบนั้น

## 6) ส่วนที่บริษัทคงเหลือ (สำหรับรายงานภายใน)

- บิลแพ็กเกจ 20 USDT: บริษัทคงเหลือ **5.80 USDT** หากบิลนั้น unlock Leadership และ **7.40 USDT** หากไม่ unlock
- Cap และค่าเช่า EA/AI ใช้ Unilevel 21%, Pool 12% และ Leadership 8% เฉพาะบิลที่ unlock; ไม่มี Tier
- ตัวเลขนี้ใช้สำหรับ admin / finance ledger เท่านั้น ห้ามนำไปทำเป็นข้อความโฆษณาหรือแสดงหน้า customer

## 7) กติกาการแสดงผลและ implementation

- `index.html` / customer UI: แสดงเพียงราคาแพ็กเกจ **20 USDT** และข้อมูลผลิตภัณฑ์ที่อนุมัติ; **ไม่แสดง** Tier / Unilevel / Pool / Leadership / split calculator
- `console.html` / admin: ใช้ดูแผนภายในได้เมื่อมีสิทธิ์แอดมิน
- Admin API / ledger: เป็นที่คำนวณ compensation และ company remainder เมื่อ backend พร้อม
- เอกสารนี้เป็น source of truth ของ ops copy; หากกติกาเปลี่ยนต้องแก้ locked date และเอกสารที่เกี่ยวข้องพร้อมกัน

**Locked date:** 2026-10-01 · Besttrade Thailand / NEXTTRADE
