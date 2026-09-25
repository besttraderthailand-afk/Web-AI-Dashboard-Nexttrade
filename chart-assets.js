/* Shared catalog. venue v1 = membership, v2 = extra pack */
window.NEXX_ASSETS = [
  { id: "XAUUSD", group: "metal", label: "ทอง", venue: "v1", tv: "OANDA:XAUUSD" },
  { id: "XAGUSD", group: "metal", label: "เงิน", venue: "v1", tv: "OANDA:XAGUSD" },
  { id: "EURUSD", group: "fx", label: "ยูโร", venue: "v1", tv: "OANDA:EURUSD" },
  { id: "GBPUSD", group: "fx", label: "ปอนด์", venue: "v1", tv: "OANDA:GBPUSD" },
  { id: "USDJPY", group: "fx", label: "เยน", venue: "v1", tv: "OANDA:USDJPY" },
  { id: "AUDUSD", group: "fx", label: "ออสซี่", venue: "v1", tv: "OANDA:AUDUSD" },
  { id: "US30", group: "index", label: "ดาวโจนส์", venue: "v1", tv: "FOREXCOM:US30" },
  { id: "NAS100", group: "index", label: "แนสแด็ก", venue: "v1", tv: "FOREXCOM:NAS100" },
  { id: "GER40", group: "index", label: "DAX", venue: "v1", tv: "XETR:DAX" },
  { id: "USOIL", group: "energy", label: "น้ำมัน", venue: "v1", tv: "TVC:USOIL" },
  { id: "ETHUSDT", group: "crypto", label: "ETH", venue: "v2", tv: "BINANCE:ETHUSDT" },
  { id: "BTCUSDT", group: "crypto", label: "BTC", venue: "v2", tv: "BINANCE:BTCUSDT" }
];
window.NEXX_TF_TO_TV = { M1: "1", M5: "5", M15: "15", H1: "60" };
