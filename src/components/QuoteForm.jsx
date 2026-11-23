import { COINS } from '../lib/core.js';

export default function QuoteForm({ coin, currency, amount, valid, onCoin, onCurrency, onAmount, onRefresh, loading, remaining }) {
  return <form onSubmit={event => { event.preventDefault(); onRefresh(); }} noValidate>
    <div className="fields">
      <div><label htmlFor="coin">Criptomoeda</label><select id="coin" value={coin} onChange={event => onCoin(event.target.value)}>{COINS.map(item => <option key={item.id} value={item.id}>{item.name} · {item.symbol}</option>)}</select></div>
      <div><label htmlFor="currency">Converter para</label><select id="currency" value={currency} onChange={event => onCurrency(event.target.value)}><option value="brl">Real brasileiro · BRL</option><option value="usd">Dólar americano · USD</option></select></div>
      <div className="quantity-field"><label htmlFor="amount">Quantidade de cripto</label><input id="amount" type="text" inputMode="decimal" value={amount} onChange={event => onAmount(event.target.value)} maxLength={24} autoComplete="off" aria-invalid={!valid} aria-describedby="amount-help amount-error" /><small id="amount-help">Use vírgula ou ponto decimal, sem separador de milhar. Ex.: 0,5</small><p id="amount-error" className="error" hidden={valid}>Informe um valor maior que zero, até 1 bilhão, com no máximo 8 casas decimais.</p></div>
    </div>
    <button className="primary" type="submit" disabled={loading || remaining > 0}>{loading ? 'Consultando…' : remaining > 0 ? `Nova consulta em ${remaining}s` : 'Consultar cotação'}</button>
  </form>;
}
