import { test, expect } from '@playwright/test';

const endpoint = '**/api.coingecko.com/**';
function fixture() {
  return Object.fromEntries(['bitcoin', 'ethereum', 'solana'].map((id, index) => [id, {
    brl: 500000 / (index + 1), usd: 100000 / (index + 1),
    brl_24h_change: 2.5, usd_24h_change: null, last_updated_at: Math.floor(Date.now() / 1000),
  }]));
}
async function mock(page, data = fixture()) {
  await page.route(endpoint, route => route.fulfill({ json: data }));
}

test('converte sem novas chamadas e mantém preferências ao recarregar', async ({ page }) => {
  let calls = 0;
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route(endpoint, route => { calls++; return route.fulfill({ json: fixture() }); });
  await page.goto('/');
  await expect(page.locator('#total')).toContainText('500.000,00');
  const initialCalls = calls;
  await page.getByLabel('Quantidade de cripto').fill('0,5');
  await expect(page.locator('#total')).toContainText('250.000,00');
  await page.getByRole('button', { name: 'Solana · SOL' }).click();
  await expect(page.getByLabel('Criptomoeda', { exact: true })).toHaveValue('solana');
  await page.getByLabel('Converter para').selectOption('usd');
  await expect(page.locator('#total')).toContainText('16.666,67');
  expect(calls).toBe(initialCalls);
  await page.reload();
  await expect(page.getByLabel('Criptomoeda', { exact: true })).toHaveValue('solana');
  await expect(page.getByLabel('Converter para')).toHaveValue('usd');
  await expect(page.getByLabel('Quantidade de cripto')).toHaveValue('1');
  expect(errors).toEqual([]);
});

test('valida entrada e oferece cópia manual quando clipboard falha', async ({ page }) => {
  await mock(page);
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('denied'); } }, configurable: true }));
  await page.goto('/');
  const copy = page.getByRole('button', { name: 'Copiar resultado' });
  await expect(copy).toBeEnabled();
  await copy.click();
  await expect(page.getByLabel('Resultado para copiar manualmente')).toBeFocused();
  await expect(page.getByLabel('Resultado para copiar manualmente')).toContainText('Fonte: CoinGecko');
  await page.getByLabel('Quantidade de cripto').fill('-1');
  await expect(page.locator('#amount-error')).toBeVisible();
  await expect(copy).toBeDisabled();
  await expect(page.getByLabel('Resultado para copiar manualmente')).toHaveCount(0);
});

test('exibe erro HTTP 429 sem inventar valores', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ status: 429, json: {} }));
  await page.goto('/');
  await expect(page.locator('#status')).toContainText('Limite de consultas');
  await expect(page.locator('#total')).toHaveText('—');
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeDisabled();
});

test('trata resposta parcial e armazenamento bloqueado', async ({ page }) => {
  const data = fixture();
  delete data.solana;
  await mock(page, data);
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new Error('blocked'); } }));
  await page.goto('/');
  await expect(page.getByText('A fonte retornou apenas parte', { exact: false })).toBeVisible();
  await expect(page.locator('#preference-status')).toContainText('não permitiu salvar');
  await page.getByLabel('Criptomoeda', { exact: true }).selectOption('solana');
  await expect(page.locator('#total')).toHaveText('—');
  await expect(page.locator('#unit-price')).toContainText('Sem cotação');
});

for (const width of [375, 768, 1200]) {
  test(`layout sem rolagem horizontal em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await mock(page);
    await page.goto('/');
    await expect(page.locator('#total')).toContainText('500.000,00');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test('respeita intervalo de consultas e preserva cotações após falha', async ({ page }) => {
  await page.clock.install();
  let calls = 0;
  await page.route(endpoint, route => {
    calls++;
    return route.fulfill(calls === 1 ? { json: fixture() } : { status: 503, json: {} });
  });
  await page.goto('/');
  await expect(page.locator('#total')).toContainText('500.000,00');
  await expect(page.getByRole('button', { name: /Nova consulta em/ })).toBeDisabled();
  await page.clock.fastForward(61000);
  await page.getByRole('button', { name: 'Consultar cotação' }).click();
  await expect(page.locator('#status')).toContainText('Mantivemos as cotações anteriores');
  await expect(page.locator('#total')).toContainText('500.000,00');
  await expect(page.locator('.result-meta')).toContainText('Cotação anterior');
  expect(calls).toBe(2);
});

test('copia e compartilha texto com fonte e horário', async ({ page }) => {
  await mock(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { window.copiedResult = text; } }, configurable: true });
    Object.defineProperty(navigator, 'share', { value: async data => { window.sharedResult = data; }, configurable: true });
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Copiar resultado' })).toBeEnabled();
  await page.getByRole('button', { name: 'Copiar resultado' }).click();
  await expect(page.locator('#action-status')).toContainText('Resultado copiado');
  await page.getByRole('button', { name: 'Compartilhar', exact: true }).click();
  await expect(page.locator('#action-status')).toContainText('Resultado compartilhado');
  const { copied, shared } = await page.evaluate(() => ({ copied: window.copiedResult, shared: window.sharedResult }));
  expect(copied).toContain('Fonte: CoinGecko');
  expect(copied).toContain('Cotação de referência:');
  expect(shared.text).toBe(copied);
});
