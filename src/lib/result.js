import { money } from './core.js';

export function resultText({ amount, coin, currency, quote, stale }) {
  if (!quote || amount === null) return '';
  const time = new Date(quote.last_updated_at * 1000).toLocaleString('pt-BR');
  return `${amount.toLocaleString('pt-BR', { maximumFractionDigits: 8 })} ${coin.symbol} ≈ ${money(amount * quote[currency], currency)}. Cotação de referência: ${time}${stale ? ' (cotação anterior)' : ''}. Fonte: CoinGecko. Sem taxas de negociação.`;
}
