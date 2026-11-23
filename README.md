# CriptoCotação — ReactJS

**Autor:** Arthur Otavio Rodrigues Davidonis · UTFPR · Projeto Final de Desenvolvimento Web 1.

Migração e melhoria do [CriptoCotação em JavaScript puro](https://github.com/davidonisarthur/web1-cripto-currency-utfpr), usando React 19 e Vite. Mantém o serviço anterior, suas moedas, integração CoinGecko, identidade visual e recursos do navegador. Não requer carteira, cadastro, backend ou chave de API.

## Executar

Requisito: Node.js 22.12 ou superior.

```sh
npm ci
npm run dev
```

Abra o endereço exibido pelo Vite. Para conferir o resultado de produção:

```sh
npm run build
npm run preview
```

## Funcionalidades preservadas e melhorias

- Bitcoin, Ethereum e Solana em reais e dólares, com variação de 24 horas e horário da fonte.
- Conversão instantânea com vírgula ou ponto, até oito casas decimais e quantidade de até 1 bilhão.
- Consulta inicial e atualização manual, com intervalo mínimo de 60 segundos. Alterar a quantidade ou a seleção não consulta a API novamente.
- Tratamento de rede, HTTP 429, timeout de 12 segundos e resposta parcial, sem preços fictícios. Uma falha na atualização preserva as cotações anteriores e identifica seu estado.
- Preferências de moeda e unidade no `localStorage`, usando a mesma chave do original (`criptocotacao:preferences:v1`), com tolerância a armazenamento bloqueado ou corrompido. A quantidade não é persistida nem enviada à API.
- Clipboard com alternativa manual selecionada por foco e Web Share quando disponível. Esses recursos dependem das permissões e do suporte do navegador.
- Layout responsivo, rótulos, link para pular ao cotador e mensagens de status acessíveis.
- Melhorias: seleção da moeda pelo resumo de mercado, indicação explícita de resposta parcial, contagem regressiva para atualização e cancelamento da chamada ao desmontar o componente.
- Espaço publicitário demonstrativo, sem anúncios ativos ou rastreadores, e link ao site pessoal do autor.

## Arquitetura e incrementos

| Incremento | Implementação |
| --- | --- |
| Migração | `src/main.jsx` inicializa React; `App.jsx` compõe a aplicação. |
| Componentização | `PageLayout`, `QuoteForm`, `QuoteResult`, `MarketSummary`, `ResultActions` e `Instructions`, com comunicação por props e callbacks. |
| Estado | `useState` controla seleção, quantidade, cotações, carregamento e feedback. Valores convertidos são derivados do estado. |
| Efeitos e ciclo de vida | `useQuotes` consulta na montagem, cancela requisições e limpa o relógio na desmontagem. `usePreferences` sincroniza as preferências. `ResultActions` usa ref para foco e seleção. |
| Serviços e APIs | `src/services/api.js` contém `fetch`, `async/await`, timeout, cancelamento e tratamento HTTP. `src/lib` reúne validação, formatação, persistência e texto do resultado. |
| Navegação | Uma página, como no original, com âncoras para cotador e instruções. Não há fluxos separados que justifiquem adicionar um roteador. |
| Qualidade e publicação | Testes das regras e fluxos no navegador, build Vite e workflow GitHub Pages. |

A única busca de elemento no DOM está na inicialização da raiz React. Listas, mensagens, atributos e campos são renderizados declarativamente. As refs são usadas apenas para foco/seleção e controle de requisições.

## Comparação com JavaScript puro

| Antes | Agora |
| --- | --- |
| `getElementById`, `textContent`, `replaceChildren`, `createElement` | JSX, componentes e renderização a partir do estado. |
| `addEventListener` em campos e botões | Eventos React e campos controlados por props. |
| Variáveis globais mutáveis de consulta | Hook `useQuotes`, com estado e refs limitados ao ciclo da aplicação. |
| `setInterval` sem desmontagem | Efeito com limpeza do temporizador e cancelamento do fetch. |
| `app.js` concentra renderização, eventos e integrações | Componentes, hooks, regras e serviços separados. |
| Servidor simples entrega os arquivos originais | Vite entrega desenvolvimento local e gera `dist/` otimizado. |

A separação adiciona uma etapa de build, mas permite compartilhar o mesmo estado entre formulário, resultado e resumo sem atualizar esses elementos manualmente.

## API e privacidade

A consulta pública `https://api.coingecko.com/api/v3/simple/price` agrupa as três moedas e ambas as unidades em uma requisição. Documentação: [CoinGecko Simple Price](https://docs.coingecko.com/reference/simple-price). A API pode limitar chamadas por IP ou ficar indisponível; isso aparece na interface. Valores de referência não incluem taxas. Nunca coloque segredos no frontend.

## Verificação

```sh
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Os testes Node verificam quantidades, normalização, falhas HTTP/rede, cancelamento e armazenamento. O Playwright gera o build, inicia o servidor de preview e verifica conversão sem novas consultas, persistência, quantidade não persistida, alternativa manual de cópia, HTTP 429, resposta parcial, armazenamento bloqueado, intervalo mínimo, preservação das cotações após falha e ausência de rolagem horizontal em 375, 768 e 1200 px. As respostas de mercado dos testes são simuladas e não são usadas na aplicação. O diálogo nativo de compartilhamento depende do dispositivo e requer verificação manual.

## Histórico e publicação

Cada feature é registrada em um commit local separado. Nenhum push é necessário durante o desenvolvimento. Depois de revisar:

```sh
git push -u origin main
```

No GitHub, abra **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**. O workflow `.github/workflows/deploy.yml` instala dependências, executa testes, gera o build e publica `dist/` quando a branch `main` é enviada. Se necessário, execute-o em **Actions → Validar e publicar no GitHub Pages → Run workflow** após habilitar Pages.

Endereço esperado após uma publicação bem-sucedida: https://davidonisarthur.github.io/projeto-final-web1/

O `base: './'` do Vite permite servir os arquivos no subdiretório do repositório. A publicação ainda depende do seu push e da execução bem-sucedida do workflow; o endereço acima não é confirmação de deploy realizado.
