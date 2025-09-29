import fs from "fs"; import path from "path";
const INPUT_DIR="inputs", OUT="public/puml"; if(!fs.existsSync(OUT))fs.mkdirSync(OUT,{recursive:true});
const files=fs.readdirSync(INPUT_DIR).filter(f=>f.endsWith(".puml"));
for(const f of files){const n=path.basename(f,".puml");const src=fs.readFileSync(path.join(INPUT_DIR,f),"utf8");
const html=`<!doctype html><html><head><meta charset="utf-8"><title>${n} (PUML)</title></head><body><h1>${n}.puml</h1><p>Reference: <code>puml:inputs/${n}.puml[]</code></p><pre>${src.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</pre></body></html>`;
fs.writeFileSync(path.join(OUT,`${n}.html`),html,"utf8")} console.log(`Prepared ${files.length} PUML references.`);