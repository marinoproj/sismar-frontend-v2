const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const dist    = path.join(__dirname, '..', 'dist', 'vendas-wc', 'browser');
const outDir  = path.join(__dirname, '..', 'dist', 'vendas-wc');
const outJs   = path.join(outDir, 'sismar-vendas.js');
const outHtml = path.join(outDir, 'demo.html');

// 1. Lê arquivos do build Angular
const cssFile  = path.join(dist, 'styles.css');
const mainFile = path.join(dist, 'main.js');

let css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : '';

// Embutir apenas woff2 como base64 — reconstrói o @font-face com uma única src limpa
const woff2File = path.join(dist, 'media', 'remixicon.woff2');
if (css && fs.existsSync(woff2File)) {
  const b64 = fs.readFileSync(woff2File).toString('base64');
  const dataUrl = `url("data:font/woff2;base64,${b64}") format("woff2")`;
  // Substitui o bloco @font-face inteiro para eliminar todas as src: com URLs relativas
  css = css.replace(/@font-face\{[^}]+\}/g, (block) => {
    const family  = (block.match(/font-family:[^;]+;/) || [''])[0];
    const display = (block.match(/font-display:[^;]+;/) || [''])[0];
    return `@font-face{${family}src:${dataUrl};${display}}`;
  });
}

const cssInject = css
  ? `(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s);})();`
  : '';

// 2. Converte ESM → IIFE (bundle:false = sem resolver imports externos)
esbuild.build({
  entryPoints: [mainFile],
  bundle: false,
  format: 'iife',
  platform: 'browser',
  outfile: outJs,
  allowOverwrite: true,
  banner: { js: cssInject },
  logLevel: 'warning',
}).then(() => {
  const kb = (fs.statSync(outJs).size / 1024).toFixed(0);
  console.log(`Bundle JS: dist/vendas-wc/sismar-vendas.js (${kb} KB)`);

  // 3. Gera demo.html
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Demo — sismar-vendas</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0f172a; color: #f8fafc;
      min-height: 100vh; padding: 2rem;
    }
    header {
      max-width: 1200px; margin: 0 auto 2rem;
      display: flex; align-items: center;
      justify-content: space-between; flex-wrap: wrap; gap: 1rem;
    }
    header h1 { font-size: 1.25rem; font-weight: 600; color: #f1f5f9; }
    header p  { font-size: 0.85rem; color: #94a3b8; margin-top: 0.2rem; }
    .controls { display: flex; align-items: center; gap: 0.75rem; }
    .controls label { font-size: 0.85rem; color: #94a3b8; }
    .toggle { position: relative; width: 44px; height: 24px; cursor: pointer; }
    .toggle input { opacity: 0; width: 0; height: 0; }
    .toggle-track {
      position: absolute; inset: 0;
      background: #334155; border-radius: 9999px; transition: background 0.2s;
    }
    .toggle input:checked + .toggle-track { background: #6C63FF; }
    .toggle-thumb {
      position: absolute; top: 3px; left: 3px;
      width: 18px; height: 18px;
      background: white; border-radius: 50%; transition: transform 0.2s;
    }
    .toggle input:checked ~ .toggle-thumb { transform: translateX(20px); }
    .component-wrapper {
      max-width: 1200px; margin: 0 auto;
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 25px 50px rgba(0,0,0,0.4);
    }
    footer {
      max-width: 1200px; margin: 1.5rem auto 0;
      font-size: 0.75rem; color: #475569; text-align: center;
    }
    code {
      background: #1e293b; color: #7dd3fc;
      padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.8rem;
    }
  </style>
</head>
<body>

  <header>
    <div>
      <h1>sismar-vendas Web Component</h1>
      <p>Componente standalone com dados mockados — sem dependências externas</p>
    </div>
    <div class="controls">
      <label for="themeToggle">Dark mode</label>
      <label class="toggle">
        <input type="checkbox" id="themeToggle" checked />
        <div class="toggle-track"></div>
        <div class="toggle-thumb"></div>
      </label>
    </div>
  </header>

  <div class="component-wrapper">
    <sismar-vendas id="wc" theme="dark"></sismar-vendas>
  </div>

  <footer>
    Uso: <code>&lt;script src="sismar-vendas.js"&gt;&lt;/script&gt;</code>
    &nbsp;·&nbsp;
    <code>&lt;sismar-vendas theme="dark"&gt;&lt;/sismar-vendas&gt;</code>
  </footer>

  <script src="sismar-vendas.js"></script>
  <script>
    const toggle = document.getElementById('themeToggle');
    const wc     = document.getElementById('wc');
    toggle.addEventListener('change', () => {
      wc.setAttribute('theme', toggle.checked ? 'dark' : 'light');
    });
  </script>

</body>
</html>`;

  fs.writeFileSync(outHtml, html);
  console.log('Demo HTML: dist/vendas-wc/demo.html');

}).catch(e => { console.error(e.message); process.exit(1); });
