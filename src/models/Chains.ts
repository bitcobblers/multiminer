export type Chain = {
  name: string;
  description: string;
  token_format: string;
  memo_format?: string;
};

export const AllChains: Chain[] = [
  { name: 'BSC', description: 'Binance Smart Chain', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'BSCV2', description: 'Binance Smart Chain - SFM V2 Migration', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'ETH', description: 'Ethereum', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'ETC', description: 'Ethereum Classic', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'MATIC', description: 'Polygon', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'KCC', description: 'Kucoin Community Chain', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'SOL', description: 'Solana', token_format: '^{0-9a-zA-Z}{32,44}$' },
  { name: 'ADA', description: 'Cardano', token_format: '^(({0-9A-Za-z}{57,59})|({0-9A-Za-z}{100,104}))$' },
  { name: 'ALGO', description: 'Algorand', token_format: '^{A-Z0-9}{58,58}$' },
  { name: 'ATOM', description: 'Cosmos', token_format: '^(cosmos1){0-9a-z}{38}$', memo_format: '^{0-9A-Za-z\\-_}{1,120}$' },
  { name: 'BAND', description: 'Band Protocol', token_format: '^(band1){0-9a-z}{38}$', memo_format: '^{0-9A-Za-z\\-_}{1,120}$' },
  { name: 'BCH', description: 'Bitcoin Cash', token_format: '^{13}{a-km-zA-HJ-NP-Z1-9}{25,34}$|^{0-9A-Za-z}{42,42}$' },
  { name: 'BNB', description: 'Binance Coin', token_format: '^(bnb1){0-9a-z}{38}$', memo_format: '^{0-9A-Za-z\\-_}{1,120}$' },
  { name: 'BTC', description: 'Bitcoin', token_format: '^{13}{a-km-zA-HJ-NP-Z1-9}{25,34}$|^(bc1){0-9A-Za-z}{39,59}$' },
  { name: 'BTG', description: 'Bitcoin Gold', token_format: '^{AG}{a-km-zA-HJ-NP-Z1-9}{25,34}$' },
  { name: 'TRX', description: 'Tron', token_format: '^T{1-9A-HJ-NP-Za-km-z}{33}$' },
  { name: 'DASH', description: 'Dash', token_format: '^{X|7}{0-9A-Za-z}{33}$' },
  { name: 'DGB', description: 'DigiByte', token_format: '^{DS}{a-km-zA-HJ-NP-Z1-9}{25,34}$|^(dgb1){0-9A-Za-z}{39,59}$' },
  { name: 'DOGE', description: 'Dogecoin', token_format: '^(D|A|9){a-km-zA-HJ-NP-Z1-9}{33,34}$' },
  { name: 'EOS', description: 'EOS', token_format: '^{1-5a-z\\.}{1,12}$', memo_format: '^{0-9A-Za-z\\-_,}{1,120}$' },
  { name: 'NEO', description: 'NEO', token_format: '^(A){A-Za-z0-9}{33}$' },
  { name: 'ICX', description: 'ICON', token_format: '^(hx){A-Za-z0-9}{40}$' },
  { name: 'LSK', description: 'Lisk', token_format: '^{0-9}{12,22}{L}$' },
  { name: 'LTC', description: 'Litecoin', token_format: '^(L|M|3){A-Za-z0-9}{33}$|^(ltc1){0-9A-Za-z}{39}$' },
  { name: 'NANO', description: 'Nano', token_format: '^(xrb_|nano_){13456789abcdefghijkmnopqrstuwxyz}{60}' },
  { name: 'QTUM', description: 'Qtum', token_format: '^{Q|M}{A-Za-z0-9}{33}$' },
  { name: 'RVN', description: 'Ravencoin', token_format: '^{Rr}{1}{A-Za-z0-9}{33,34}$' },
  { name: 'SC', description: 'Siacoin', token_format: '^{A-Za-z0-9}{76}$' },
  { name: 'VET', description: 'VeChain', token_format: '^(0x){0-9A-Fa-f}{40}$' },
  { name: 'WAVES', description: 'Waves', token_format: '^(3P){0-9A-Za-z}{33}$' },
  { name: 'XLM', description: 'Stellar Lumens', token_format: '^G{A-D}{1}{A-Z2-7}{54}$', memo_format: '^{0-9A-Za-z}{1,28}$' },
  { name: 'XMR', description: 'Monero', token_format: '^{48}{a-zA-Z|\\d}{94}({a-zA-Z|\\d}{11})?$' },
  { name: 'XRP', description: 'Ripple', token_format: '^r{1-9A-HJ-NP-Za-km-z}{25,34}$', memo_format: '^((?!0){0-9}{1,19})$' },
  { name: 'XTZ', description: 'Tezos', token_format: '^(tz{1,2,3}|KT1){a-zA-Z0-9}{33}$' },
  { name: 'XVG', description: 'Verge', token_format: '^(D){A-Za-z0-9}{33}$' },
  { name: 'ZEC', description: 'Zcash', token_format: '^(t){A-Za-z0-9}{34}$' },
  { name: 'ZIL', description: 'Zilliqa', token_format: 'zil1{qpzry9x8gf2tvdw0s3jn54khce6mua7l}{38}' },
];
