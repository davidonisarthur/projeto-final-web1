# Projeto Final Web 1 — ReactJS

Evolução do [serviço original em JavaScript puro](https://github.com/davidonisarthur/web1-cripto-currency-utfpr), conforme os incrementos da disciplina.

## Estado atual

Estrutura inicial com React, ReactDOM e Vite. A migração das funcionalidades está pendente de acesso ao código original. A tela atual é apenas a base de desenvolvimento; não representa a aplicação migrada. As APIs e os recursos do navegador ainda não foram identificados.

## Execução

Requisito: Node.js 22.12 ou superior.

```sh
npm install
npm run dev
```

Para gerar e conferir a versão de produção:

```sh
npm run build
npm run preview
```

## Organização

- `src/main.jsx`: inicialização React. O acesso ao elemento raiz é a única manipulação direta do DOM prevista.
- `src/App.jsx`: componente principal.
- `src/components/PageLayout.jsx`: estrutura reutilizável que recebe conteúdo por `children`.
- `src/styles.css`: estilos globais responsivos.

## Incrementos planejados

Cada feature deverá ter pelo menos um commit separado, com branch própria quando conveniente.

1. `chore: inicia estrutura React com Vite` — base inicial presente neste diretório.
2. `feat: migra interface e funcionalidades originais para React` — após inspeção da versão anterior.
3. `refactor: extrai componentes reutilizaveis e propriedades`.
4. `feat: gerencia interacoes com estado React`.
5. `feat: controla carregamentos e limpeza de efeitos`.
6. `refactor: organiza APIs em servicos assincronos` — com carregamento, erro e cancelamento quando aplicável.
7. `feat: adiciona navegacao entre paginas` — se o fluxo original exigir rotas.
8. `docs: compara implementacoes e configura publicacao` — incluindo build e validação da versão publicada.

## Limitações desta preparação

O ambiente de execução não conseguiu resolver `github.com`, e a consulta alternativa também não retornou o código original. A criação de `.git` foi recusada pelo sistema de arquivos. Portanto, nenhum commit, push ou deploy foi realizado. A instalação e o build precisam ser validados em ambiente com acesso às dependências.

Repositório de destino: https://github.com/davidonisarthur/projeto-final-web1.git
