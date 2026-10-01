# Marketing compensation rules (INTERNAL — locked 2026-10-01)

> **Audience:** ops / admin only. Do **not** surface these tables or calculators on customer-facing pages.
> Customer UI shows **package price 20 USDT only**. Marketing plan stays hidden (see PR #6).

## Summary

| Item | Rule |
|------|------|
| Package price | **20 USDT** |
| Referral Tier 1–3 | Fixed **15% / 10% / 5%** = **30%**, pay **immediately** |
| Tier scope | **Package purchases only** (incl. package repurchase). **NOT** on Cap, EA/AI rental, or other paid services |
| Unilevel | **10 levels × 3%** = **21%** (package only) |
| Leadership | **8%** one-time unlock from cumulative **PACKAGE** volume under 10 downline levels |
| Leadership thresholds | Start **200 USDT**, then double each step: 200 → 400 → 800 → 1600 → … |
| Pool | **12%** of package; rank weights below |
| Company remainder | After full marketing payout ≈ **~29%** of package when all legs pay → **admin reports only** |
| Customer UI | No marketing / referral plan tables, no split calculators |

## Referral Tier (package-only)

- Tier 1: **15%**
- Tier 2: **10%**
- Tier 3: **5%**
- Total: **30%**
- Paid **immediately** on each package purchase / repurchase
- **No** hold-until-N-people rule
- Does **not** apply to Cap top-ups, EA/AI rental licenses, or other non-package paid services

## Unilevel (package-only)

- **10 levels × 3%** = **21%**
- Same package-only scope as Tier

## Leadership (one-time unlock)

- **8%** of the unlock basis, paid once when a threshold is crossed
- Based on **cumulative PACKAGE volume** under **10 downline levels** (not Cap / EA / other)
- Thresholds (USDT): **200**, then **double** each step → 400, 800, 1600, 3200, …

## Pool (12%) + ranks

Pool share of package: **12%**.

| Rank | Weight | Team volume gate (USDT) |
|------|--------|-------------------------|
| Bronze | 10% | 200 |
| Silver | 15% | 1,000 |
| Gold | 20% | 5,000 |
| Diamond | 25% | 20,000 |
| Legend | 30% | 80,000 |

**Volume for rank + Pool KPI** = **ALL paid spend** (packages + Cap + EA/AI + other paid services), tracked as **monthly cumulative KPI**.

- If the next month does **not** meet the rank KPI → **no Pool** that month for that member.

## Company remainder

When Tier + Unilevel + Leadership + Pool are fully allocated on a package, company keeps roughly **~29%**. That figure is for **admin / finance reports only** — never render marketing split tables on the customer site.

## Implementation notes

| Surface | Expectation |
|---------|-------------|
| `index.html` (customer) | Show **20 USDT**; no Tier/Unilevel/Pool/Leadership UI |
| `console.html` (admin) | Internal “Marketing plan” tab with these locked rules |
| Admin API / ledger | Compensation math & company remainder reports live in backend when implemented |
| This file | Source of truth for ops copy; update date when rules change |

**Locked date:** 2026-10-01 · Besttrade Thailand / NEXTTRADE
