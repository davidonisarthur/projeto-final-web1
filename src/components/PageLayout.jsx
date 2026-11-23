export default function PageLayout({ children }) {
  return (
    <div className="layout">
      <header>
        <a className="brand" href="./">Criptomoedas <span>Web 1</span></a>
      </header>
      <main id="conteudo">{children}</main>
      <footer>Projeto Final · Desenvolvimento Web · UTFPR</footer>
    </div>
  );
}
