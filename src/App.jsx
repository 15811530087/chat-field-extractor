import React, { useState } from 'react';
import { readFileAsync, safeGet, flattenMessages, toCSV, downloadFile } from './extractor';

function App() {
  const [file, setFile] = useState(null);
  const [fieldsText, setFieldsText] = useState('');
  const [format, setFormat] = useState('csv');
  const [preview, setPreview] = useState('');

  const handleFileChange = e => setFile(e.target.files && e.target.files[0]);

  const handlePreview = async () => {
    if (!file) return alert('请选择文件');
    const txt = await readFileAsync(file);
    let parsed;
    try { parsed = JSON.parse(txt); }
    catch { parsed = txt.trim().split(/\r?\n/).map(l => JSON.parse(l)); }
    const msgs = flattenMessages(parsed);
    const fields = fieldsText.split(',').map(s=>s.trim()).filter(Boolean);
    if (!fields.length) return alert('请输入字段');
    const rows = msgs.map(m => Object.fromEntries(fields.map(f=>[f,safeGet(m,f)])));
    setPreview(JSON.stringify(rows.slice(0,100), null, 2));
  };

  const handleExport = async () => {
    if (!file) return alert('请选择文件');
    const txt = await readFileAsync(file);
    let parsed;
    try { parsed = JSON.parse(txt); }
    catch { parsed = txt.trim().split(/\r?\n/).map(l => JSON.parse(l)); }
    const msgs = flattenMessages(parsed);
    const fields = fieldsText.split(',').map(s=>s.trim()).filter(Boolean);
    if (!fields.length) return alert('请输入字段');
    const rows = msgs.map(m => Object.fromEntries(fields.map(f=>[f,safeGet(m,f)])));
    const baseName = file.name.replace(/\.json$/i,'') || 'extracted';
    if (format === 'json')
      downloadFile(baseName + '_extracted.json', JSON.stringify(rows,null,2), 'application/json');
    else
      downloadFile(baseName + '_extracted.csv', toCSV(rows, fields), 'text/csv');
  };

  return (
    <div style={{ padding: '12px', fontFamily: 'system-ui,sans-serif' }}>
      <h2>Chat Field Extractor</h2>
      <div><label>聊天记录文件:</label><input type="file" accept=".json" onChange={handleFileChange} /></div>
      <div><label>提取字段:</label><input type="text" value={fieldsText} onChange={e=>setFieldsText(e.target.value)} placeholder="speaker,timestamp,content" /></div>
      <div><label>输出格式:</label><select value={format} onChange={e=>setFormat(e.target.value)}><option value="csv">CSV</option><option value="json">JSON</option></select></div>
      <div style={{ marginTop:'8px' }}>
        <button onClick={handlePreview}>预览</button>
        <button onClick={handleExport}>导出</button>
      </div>
      <textarea readOnly rows={10} style={{ width:'100%', marginTop:'8px' }} value={preview} />
    </div>
  );
}
export default App;
