import { COINS, money } from '../lib/core.js';

export default function MarketSummary({ quotes, currency, selectedCoin, onSelect }) {
  return <aside className="sidebar" aria-label="Resumo e publicidade">
    <section className="panel market" aria-labelledby="market-title"><p className="eyebrow">DE OLHO NO MERCADO</p><h2 id="market-title">Três moedas. Um lugar.</h2><p className="muted">Selecione uma moeda para converter. Preço de uma unidade.</p><ul>{COINS.map(coin => <li key={coin.id}><button type="button" aria-pressed={selectedCoin === coin.id} onClick={() => onSelect(coin.id)}>{coin.name} · {coin.symbol}</button><span>{quotes[coin.id] ? money(quotes[coin.id][currency], currency) : 'Indisponível'}</span></li>)}</ul></section>
    <div className="ad" aria-label="Espaço publicitário demonstrativo"><span>PUBLICIDADE</span><p>Seu próximo projeto<br />pode estar aqui.</p><small>Espaço reservado · sem anúncios ativos</small></div>
  </aside>;
}
