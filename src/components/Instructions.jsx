const steps = [
  ['Escolha sua moeda', 'Selecione a criptomoeda e veja os valores em reais ou dólares.'],
  ['Informe a quantidade', 'Simule uma unidade ou uma fração. A conversão acompanha o que você digita.'],
  ['Leve o resultado', 'Copie a estimativa com a fonte e o horário para consultar depois.'],
];
export default function Instructions() {
  return <>
    <section className="instructions" id="como-funciona" aria-labelledby="instructions-title"><p className="eyebrow">SEM COMPLICAÇÃO</p><h2 id="instructions-title">Da dúvida ao valor em três passos.</h2><ol className="steps">{steps.map(([title, text]) => <li key={title}><h3>{title}</h3><p>{text}</p></li>)}</ol></section>
    <section className="notes" aria-labelledby="notes-title"><h2 id="notes-title">O que este valor significa?</h2><p>A cotação é uma referência de mercado, não uma oferta de compra ou venda. O preço pode mudar, e corretoras podem cobrar taxas. Confira o horário informado antes de usar o resultado.</p><p>As consultas dependem da disponibilidade da API. Não é necessário conectar carteira ou informar dados pessoais.</p><p>Somente a escolha de moeda e unidade fica salva no seu navegador. A quantidade digitada não é armazenada nem enviada à API. Para remover as preferências, limpe os dados deste site no navegador.</p></section>
  </>;
}
