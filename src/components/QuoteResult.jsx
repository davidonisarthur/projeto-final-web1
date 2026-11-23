import { money } from '../lib/core.js';

export default function QuoteResult({ coin, currency, amount, quote, loading, stale }) {
  const change = quote?.[`${currency}_24h_change`];
  return <div id="result" className="result" aria-busy={loading}>
    <p className="eyebrow">VALOR ESTIMADO</p>
    <output id="total" htmlFor="amount coin currency" aria-live="polite">{quote && amount !== null ? money(amount * quote[currency], currency) : '—'}</output>
    <p id="unit-price">{quote ? `1 ${coin.symbol} = ${money(quote[currency], currency)}` : 'Sem cotação disponível para esta moeda.'}</p>
    <div className="result-meta"><span className={Number.isFinite(change) ? change >= 0 ? 'positive' : 'negative' : ''}>{Number.isFinite(change) ? `${change >= 0 ? '+' : ''}${change.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}% em 24h` : 'Variação em 24h indisponível'}</span><span>{quote ? `Fonte: ${new Date(quote.last_updated_at * 1000).toLocaleString('pt-BR')}${stale ? ' · Cotação anterior' : ''}` : 'Aguardando consulta'}</span></div>
  </div>;
}
