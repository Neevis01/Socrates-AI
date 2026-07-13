const CRISIS_REGEX = /\b(will mich umbringen|will nicht mehr leben|suizidgedanken|mir etwas antun|keinen ausweg mehr|will sterben)\b/i;

function isCrisisMessage(text) {
  return CRISIS_REGEX.test(text.toLowerCase());
}

function applyPanicFlag(content, isPanic) {
  return isPanic ? `[PANIC_BUTTON_TRIGGERED] ${content}` : content;
}

function getErrorResponse(err) {
  const status = err.status || (err.response && err.response.status);
  const isOverload = status === 503 || status === 429 ||
                      (err.message && err.message.toLowerCase().includes('overloaded'));
  return {
    reply: isOverload
      ? "Socrates wird gerade von zu vielen Fragen bestürmt. Gib ihm einen Moment und versuch es gleich nochmal."
      : "Die Reflexion konnte nicht fortgesetzt werden. Bitte versuche es erneut.",
    isError: true
  };
}

module.exports = { isCrisisMessage, applyPanicFlag, getErrorResponse };