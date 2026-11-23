import { useState } from 'react';
import PageLayout from './components/PageLayout.jsx';
import QuoteForm from './components/QuoteForm.jsx';
import QuoteResult from './components/QuoteResult.jsx';
import MarketSummary from './components/MarketSummary.jsx';
import Instructions from './components/Instructions.jsx';
import { useQuotes } from './hooks/useQuotes.js';
import { COINS, parseAmount } from './lib/core.js';

export default function App() {
  const [coinId, setCoinId] = useState('bitcoin');
  const [currency, setCurrency] = useState('brl');
  const [amountText, setAmountText] = useState('1');
  const { quotes, loading, error, refresh, now, remaining } = useQuotes();
  const coin = COINS.find(item => item.id === coinId);
  const amount = parseAmount(amountText);
  const quote = quotes[coinId];
  const stale = Boolean(quote && (now / 1000 - quote.last_updated_at > 300 || error));
  const partial = Object.keys(quotes).length > 0 && Object.keys(quotes).length < COINS.length;

  return <PageLayout>
    <section className="intro" aria-labelledby="titulo"><p className="eyebrow">MENOS ABAS. MAIS CLAREZA.</p><h1 id="titulo">Quanto vale sua<br />cripto <em>agora?</em></h1><p>Consulte a cotação e transforme Bitcoin, Ethereum ou Solana em reais e dólares. Simples assim.</p></section>
    <div className="workspace">
      <section className="panel tool" id="cotador" aria-labelledby="cotador-titulo">
        <div className="section-heading"><div><p className="eyebrow">COTADOR</p><h2 id="cotador-titulo">Do cripto para o seu dia a dia.</h2></div><span className="tag">BRL · USD</span></div>
        <QuoteForm coin={coinId} currency={currency} amount={amountText} valid={amount !== null} onCoin={setCoinId} onCurrency={setCurrency} onAmount={setAmountText} onRefresh={refresh} loading={loading} remaining={remaining} />
        <p id="status" role="status">{loading ? 'Consultando cotações na CoinGecko…' : error ? `${error}${Object.keys(quotes).length ? ' Mantivemos as cotações anteriores; confira o horário da fonte.' : ''}` : 'Consulta concluída. Troque a moeda ou a quantidade para converter sem uma nova consulta.'}</p>
        {partial && <p className="error">A fonte retornou apenas parte das moedas. Valores ausentes estão indicados como indisponíveis.</p>}
        <QuoteResult coin={coin} currency={currency} amount={amount} quote={quote} loading={loading} stale={stale} />
        <p className="source">Dados fornecidos por <a href="https://www.coingecko.com/">CoinGecko</a>. Valores indicativos, sem taxas de negociação.</p>
      </section>
      <MarketSummary quotes={quotes} currency={currency} selectedCoin={coinId} onSelect={setCoinId} />
    </div>
    <Instructions />
  </PageLayout>;
}
