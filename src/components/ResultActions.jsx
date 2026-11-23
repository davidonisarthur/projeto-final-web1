import { useEffect, useRef, useState } from 'react';

export default function ResultActions({ text, loading }) {
  const [feedback, setFeedback] = useState(null);
  const [pending, setPending] = useState(false);
  const textRef = useRef(null);
  const currentText = useRef(text);
  currentText.current = text;
  // Resultados assíncronos pertencem ao texto capturado no clique.
  const visible = feedback?.text === text ? feedback : null;
  useEffect(() => {
    if (visible?.manual) {
      textRef.current?.focus();
      textRef.current?.select();
    }
  }, [visible]);

  async function copy() {
    const snapshot = text;
    setPending(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard indisponível');
      await navigator.clipboard.writeText(snapshot);
      if (currentText.current === snapshot) setFeedback({ text: snapshot, message: 'Resultado copiado com a fonte e o horário da cotação.' });
    } catch {
      if (currentText.current === snapshot) setFeedback({ text: snapshot, manual: true, message: 'Não foi possível copiar automaticamente. Copie o texto selecionado abaixo.' });
    } finally { setPending(false); }
  }
  async function share() {
    const snapshot = text;
    setPending(true);
    try {
      await navigator.share({ title: 'CriptoCotação', text: snapshot });
      if (currentText.current === snapshot) setFeedback({ text: snapshot, message: 'Resultado compartilhado.' });
    } catch (error) {
      if (currentText.current === snapshot) setFeedback({ text: snapshot, message: error.name === 'AbortError' ? 'Compartilhamento cancelado.' : 'Não foi possível compartilhar. Use Copiar resultado.' });
    } finally { setPending(false); }
  }
  return <>
    <div className="actions"><button type="button" disabled={!text || loading || pending} onClick={copy}>Copiar resultado</button>{typeof navigator.share === 'function' && <button type="button" disabled={!text || loading || pending} onClick={share}>Compartilhar</button>}</div>
    <p id="action-status" role="status" className="muted">{visible?.message}</p>
    {visible?.manual && <div><label htmlFor="copy-text">Resultado para copiar manualmente</label><textarea id="copy-text" ref={textRef} rows={4} readOnly value={visible.text} /></div>}
  </>;
}
