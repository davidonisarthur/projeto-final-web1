import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchQuotes } from '../src/services/api.js';

test('propaga cancelamento do componente para a chamada HTTP', async () => {
  const controller = new AbortController();
  let requestSignal;
  const pending = fetchQuotes(async (_url, { signal }) => {
    requestSignal = signal;
    return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError'))));
  }, { signal: controller.signal });
  controller.abort();
  await assert.rejects(pending, { name: 'AbortError' });
  assert.equal(requestSignal.aborted, true);
});

test('distingue resposta inválida e falha HTTP', async () => {
  await assert.rejects(fetchQuotes(async () => ({ ok: true, json: async () => { throw new SyntaxError(); } })), /resposta inválida/);
  await assert.rejects(fetchQuotes(async () => ({ ok: false, status: 503 })), /indisponível/);
});
