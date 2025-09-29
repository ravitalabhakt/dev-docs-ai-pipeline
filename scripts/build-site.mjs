import fs from "fs"; import path from "path";
const SRC="outputs", DEST="public"; if(!fs.existsSync(DEST))fs.mkdirSync(DEST,{recursive:true});
function md2html(md){let h=md.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");h=h.replace(/```([\s\S]*?)```/g,(m,c)=>`<pre><code>${c}</code></pre>`);
h=h.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");h=h.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
h=h.split(/\n{2,}/).map(p=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join("\n");
return `<!doctype html><html><head><meta charset="utf-8"><title>Docs</title><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:860px;margin:2rem auto;padding:0 1rem;line-height:1.6} code,pre{background:#f6f8fa;padding:.2rem .4rem;border-radius:4px} pre{padding:1rem;overflow:auto} a{color:#0366d6;text-decoration:none}</style></head><body><nav><a href="/index.html">Home</a></nav>`+h+`</body></html>`}
const files=fs.existsSync(SRC)?fs.readdirSync(SRC).filter(f=>f.endsWith(".md")):[];const links=[];
for(const f of files){const md=fs.readFileSync(path.join(SRC,f),"utf8");const html=md2html(md);const name=f.replace(/\.md$/,".html");fs.writeFileSync(path.join(DEST,name),html,"utf8");links.push(`<li><a href="${name}">${f}</a></li>`)}
const pumlLinks=fs.existsSync("public/puml")?fs.readdirSync("public/puml").map(f=>`<li><a href="/puml/${f}">${f}</a></li>`).join(""):"";
const index=`<!doctype html><html><head><meta charset="utf-8"><title>Backbase Docs AI Pipeline</title><meta name="viewport" content="width=device-width, initial-scale=1">
<style>body{font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:860px;margin:2rem auto;padding:0 1rem;line-height:1.6} a{color:#0366d6;text-decoration:none}</style></head><body>
<h1>Backbase Docs AI Pipeline</h1><p>This site is generated from inputs & prompts via CI/CD.</p><h2>Generated release notes</h2><ul>${links.join("")}</ul><h2>PUML references</h2><ul>${pumlLinks}</ul></body></html>`;
fs.writeFileSync(path.join(DEST,"index.html"),index,"utf8");console.log(`Built ${files.length} page(s).`);