function defangUrl(url) {
  return url
    .replace(/http/gi, 'hxxp')
    .replace(/\./g, '[.]')
    .replace(/:/g, '[:]');
}

function replaceSelectionWithDefanged() {
  const active = document.activeElement;
  // Cas input ou textarea
  if (active && (active.tagName === 'TEXTAREA' || (active.tagName === 'INPUT' && /text|search|url|tel|password/.test(active.type)))) {
    const start = active.selectionStart;
    const end = active.selectionEnd;
    if (start !== end) {
      const selectedText = active.value.substring(start, end);
      const defanged = defangUrl(selectedText);
      active.setRangeText(defanged, start, end, 'end');
    }
    return;
  }
  // Cas contenteditable ou texte normal
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();
  if (!selectedText) return;
  const defanged = defangUrl(selectedText);
  // Si dans un contenteditable, remplacer proprement
  if (selection.anchorNode && selection.anchorNode.parentElement && selection.anchorNode.parentElement.isContentEditable) {
    range.deleteContents();
    range.insertNode(document.createTextNode(defanged));
    selection.removeAllRanges();
    return;
  }
  // Sinon, texte normal
  range.deleteContents();
  range.insertNode(document.createTextNode(defanged));
  selection.removeAllRanges();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "defang-selection") {
    replaceSelectionWithDefanged();
  }
}); 