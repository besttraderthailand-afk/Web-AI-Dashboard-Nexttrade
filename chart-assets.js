/* Shared catalog. venue v1 = membership, v2 = extra pack.
   NEXX_SYMBOL_BOOK is the client-side search list (no API key). */
window.NEXX_ASSETS = [
  { id: "XAUUSD", group: "metal", label: "ทอง", venue: "v1", tv: "OANDA:XAUUSD" },
  { id: "XAGUSD", group: "metal", label: "เงิน", venue: "v1", tv: "OANDA:XAGUSD" },
  { id: "EURUSD", group: "fx", label: "ยูโร", venue: "v1", tv: "OANDA:EURUSD" },
  { id: "GBPUSD", group: "fx", label: "ปอนด์", venue: "v1", tv: "OANDA:GBPUSD" },
  { id: "USDJPY", group: "fx", label: "เยน", venue: "v1", tv: "OANDA:USDJPY" },
  { id: "AUDUSD", group: "fx", label: "ออสซี่", venue: "v1", tv: "OANDA:AUDUSD" },
  { id: "US30", group: "index", label: "ดาวโจนส์", venue: "v1", tv: "FOREXCOM:US30" },
  { id: "NAS100", group: "index", label: "แนสแด็ก", venue: "v1", tv: "FOREXCOM:NAS100" },
  { id: "SPX", group: "index", label: "S&P 500", venue: "v1", tv: "TVC:SPX" },
  { id: "GER40", group: "index", label: "DAX", venue: "v1", tv: "XETR:DAX" },
  { id: "USOIL", group: "energy", label: "น้ำมัน", venue: "v1", tv: "TVC:USOIL" },
  { id: "ETHUSDT", group: "crypto", label: "ETH", venue: "v2", tv: "BINANCE:ETHUSDT" },
  { id: "BTCUSDT", group: "crypto", label: "BTC", venue: "v2", tv: "BINANCE:BTCUSDT" }
];

/* Curated providers per product symbol. tv = TradingView widget symbol. */
window.NEXX_SYMBOL_BOOK = [
  {
    id: "XAUUSD", label: "ทอง", aliases: ["gold", "xau", "ทอง"],
    providers: [
      { name: "OANDA", tv: "OANDA:XAUUSD" },
      { name: "FX", tv: "FX:XAUUSD" },
      { name: "FOREXCOM", tv: "FOREXCOM:XAUUSD" },
      { name: "TVC", tv: "TVC:GOLD" }
    ]
  },
  {
    id: "XAGUSD", label: "เงิน", aliases: ["silver", "xag", "เงิน"],
    providers: [
      { name: "OANDA", tv: "OANDA:XAGUSD" },
      { name: "FX", tv: "FX:XAGUSD" },
      { name: "FOREXCOM", tv: "FOREXCOM:XAGUSD" },
      { name: "TVC", tv: "TVC:SILVER" }
    ]
  },
  {
    id: "EURUSD", label: "ยูโร", aliases: ["eur", "ยูโร"],
    providers: [
      { name: "OANDA", tv: "OANDA:EURUSD" },
      { name: "FX", tv: "FX:EURUSD" },
      { name: "FOREXCOM", tv: "FOREXCOM:EURUSD" }
    ]
  },
  {
    id: "GBPUSD", label: "ปอนด์", aliases: ["gbp", "ปอนด์"],
    providers: [
      { name: "OANDA", tv: "OANDA:GBPUSD" },
      { name: "FX", tv: "FX:GBPUSD" },
      { name: "FOREXCOM", tv: "FOREXCOM:GBPUSD" }
    ]
  },
  {
    id: "USDJPY", label: "เยน", aliases: ["jpy", "เยน"],
    providers: [
      { name: "OANDA", tv: "OANDA:USDJPY" },
      { name: "FX", tv: "FX:USDJPY" },
      { name: "FOREXCOM", tv: "FOREXCOM:USDJPY" }
    ]
  },
  {
    id: "AUDUSD", label: "ออสซี่", aliases: ["aud"],
    providers: [
      { name: "OANDA", tv: "OANDA:AUDUSD" },
      { name: "FX", tv: "FX:AUDUSD" },
      { name: "FOREXCOM", tv: "FOREXCOM:AUDUSD" }
    ]
  },
  {
    id: "BTCUSD", label: "บิตคอยน์", aliases: ["btc", "bitcoin", "btcusdt"],
    providers: [
      { name: "BINANCE", tv: "BINANCE:BTCUSDT" },
      { name: "COINBASE", tv: "COINBASE:BTCUSD" },
      { name: "BITSTAMP", tv: "BITSTAMP:BTCUSD" }
    ]
  },
  {
    id: "ETHUSD", label: "อีเธอเรียม", aliases: ["eth", "ethereum", "ethusdt"],
    providers: [
      { name: "BINANCE", tv: "BINANCE:ETHUSDT" },
      { name: "COINBASE", tv: "COINBASE:ETHUSD" }
    ]
  },
  {
    id: "US30", label: "ดาวโจนส์", aliases: ["dji", "dow", "us30"],
    providers: [
      { name: "FOREXCOM", tv: "FOREXCOM:US30" },
      { name: "TVC", tv: "TVC:DJI" },
      { name: "OANDA", tv: "OANDA:US30USD" }
    ]
  },
  {
    id: "NAS100", label: "แนสแด็ก", aliases: ["nasdaq", "nas", "ndx", "us100"],
    providers: [
      { name: "FOREXCOM", tv: "FOREXCOM:NAS100" },
      { name: "TVC", tv: "TVC:NDX" },
      { name: "OANDA", tv: "OANDA:NAS100USD" }
    ]
  },
  {
    id: "SPX", label: "S&P 500", aliases: ["sp500", "spx", "us500"],
    providers: [
      { name: "TVC", tv: "TVC:SPX" },
      { name: "SP", tv: "SP:SPX" },
      { name: "FOREXCOM", tv: "FOREXCOM:SPXUSD" }
    ]
  },
  {
    id: "GER40", label: "DAX", aliases: ["dax", "ger40"],
    providers: [
      { name: "XETR", tv: "XETR:DAX" },
      { name: "TVC", tv: "TVC:DAX" }
    ]
  },
  {
    id: "USOIL", label: "น้ำมัน", aliases: ["oil", "wti", "usoil"],
    providers: [
      { name: "TVC", tv: "TVC:USOIL" }
    ]
  }
];

window.NEXX_TF_LIST = [
  { id: "1", label: "1" },
  { id: "5", label: "5" },
  { id: "15", label: "15" },
  { id: "30", label: "30" },
  { id: "1H", label: "1H" },
  { id: "4H", label: "4H" },
  { id: "1D", label: "1D" },
  { id: "1W", label: "1W" }
];

window.NEXX_TF_TO_TV = {
  "1": "1",
  "5": "5",
  "15": "15",
  "30": "30",
  "1H": "60",
  "4H": "240",
  "1D": "D",
  "1W": "W",
  M1: "1",
  M5: "5",
  M15: "15",
  H1: "60"
};
