export function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
export function safeGet(obj, path) {
  if (!path) return undefined;
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}
export function flattenMessages(root) {
  if (Array.isArray(root)) return root;
  if (root?.messages) return root.messages;
  if (root?.conversations) return root.conversations.flatMap(c => c.messages || []);
  return [];
}
export function toCSV(rows, headers) {
  const esc = s => (s == null ? '' : /["\n,]/.test(s) ? '"' + String(s).replace(/"/g,'""') + '"' : s);
  return [headers.join(','), ...rows.map(r => headers.map(h => esc(r[h])).join(','))].join('\n');
}
export function downloadFile(filename, content, mime='text/plain') {
  const blob = new Blob([content], { type: mime + ';charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
