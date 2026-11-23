export default function PageLayout({ children }) {
  return <>
    <a className="skip-link" href="#cotador">Pular para o cotador</a>
    <header className="site-header container">
      <a className="brand" href="./" aria-label="CriptoCotação, início"><span className="brand-mark" aria-hidden="true">₿</span>Cripto<span>Cotação</span></a>
      <nav aria-label="Principal"><a href="#cotador">Cotador</a><a href="#como-funciona">Como funciona</a></nav>
    </header>
    <main className="container">{children}</main>
    <footer className="container site-footer"><span className="brand">CriptoCotação<span className="muted"> / projeto acadêmico · React</span></span><a href="https://davidonisarthur.github.io/site-pessoal-web1-utfpr/">Arthur Otavio Rodrigues Davidonis</a></footer>
  </>;
}
