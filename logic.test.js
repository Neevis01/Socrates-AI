const { isCrisisMessage, applyPanicFlag, getErrorResponse } = require('./logic');

describe('Krisenschutz-Filter', () => {
  it('erkennt eindeutige Krisen-Phrasen', () => {
    expect(isCrisisMessage('Ich will nicht mehr leben')).toBe(true);
    expect(isCrisisMessage('Ich habe Suizidgedanken')).toBe(true);
  });

  it('löst NICHT bei harmlosen philosophischen Aussagen aus', () => {
    expect(isCrisisMessage('Ist das Leben nicht eigentlich sinnlos?')).toBe(false);
    expect(isCrisisMessage('Manchmal fühle ich mich lebensmüde vom Alltag')).toBe(false);
  });

  it('ist case-insensitive', () => {
    expect(isCrisisMessage('ICH WILL STERBEN')).toBe(true);
  });
});

describe('Panic-Button-Flag', () => {
  it('injiziert das Kontroll-Tag wenn isPanic true ist', () => {
    expect(applyPanicFlag('❓', true)).toBe('[PANIC_BUTTON_TRIGGERED] ❓');
  });

  it('lässt den Text unverändert wenn isPanic false ist', () => {
    expect(applyPanicFlag('Normale Frage', false)).toBe('Normale Frage');
  });
});

describe('Error-Handling', () => {
  it('erkennt 503-Overload korrekt', () => {
    const result = getErrorResponse({ status: 503 });
    expect(result.reply).toContain('bestürmt');
    expect(result.isError).toBe(true);
  });

  it('erkennt 429-Rate-Limit korrekt', () => {
    const result = getErrorResponse({ status: 429 });
    expect(result.reply).toContain('bestürmt');
  });

  it('fällt bei unbekannten Fehlern auf generischen Text zurück', () => {
    const result = getErrorResponse({ message: 'Netzwerkfehler' });
    expect(result.reply).toContain('konnte nicht fortgesetzt werden');
  });
});