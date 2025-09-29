import fs from "fs"; import path from "path";
const INPUT_DIR="inputs", OUTPUT_DIR="outputs";
function parse(y){const o={},l=y.split(/\r?\n/);let k=null,b="";for(const r of l){const t=r.trim();if(!t||t.startsWith("#"))continue;
if(/^[A-Za-z0-9_]+\s*:/.test(r)){if(k&&b){o[k]=b.trim();b=""}const [a,...c]=r.split(":");const v=c.join(":").trim().replace(/^"(.*)"$/,"$1");
if(v===""){k=a.trim();o[k]=""}else{o[a.trim()]=v;k=null}}else if(t.startsWith("- ")){const line=t.slice(2);
if(!Array.isArray(o[k]))o[k]=[];const mT=line.match(/text:\s*"(.*?)"|text:\s*([^"]\S.*)$/);const mU=line.match(/url:\s*"(.*?)"|url:\s*(\S+)/);
o[k].push({text:mT?(mT[1]||mT[2]||line):line,url:mU?(mU[1]||mU[2]||""):""})}else{if(k)b+=" "+t}}if(k&&b)o[k]=b.trim();return o}
function sCase(s){const t=(s||"").trim();return t? t[0].toUpperCase()+t.slice(1):t}
function limits(t,d){return{t:(t||"").slice(0,160).replace(/\.$/,""),d:(d||"").slice(0,2500)}}
function md(meta,body){return ["---",`product: "${meta.product||""}"`,`capability: "${meta.capability||""}"`,`version: "v${meta.version||""}"`,"---","",body].join("\n")}
function body(rec){const {t,d}=limits(sCase(rec.title),rec.description);const title=d?`**${t}**`:t;const val=d?"\n\nThe feature lets you enforce granular permissions with reduced operational risk.":"";
let links="";if(Array.isArray(rec.links)&&rec.links.length){links="\n\n"+rec.links.map(it=>`- [${it.text}](${it.url})`).join("\n")}return `${title}\n\n${d}${val}${links}\n`}
if(!fs.existsSync(OUTPUT_DIR))fs.mkdirSync(OUTPUT_DIR);const files=fs.readdirSync(INPUT_DIR).filter(f=>f.endsWith(".yaml")||f.endsWith(".yml"));
for(const f of files){const raw=fs.readFileSync(path.join(INPUT_DIR,f),"utf8");const rec=parse(raw);const out=md(rec,body(rec));
const name=`release-note-${(rec.version||"unknown").toString().replace(/\./g,"-")}.md`;fs.writeFileSync(path.join(OUTPUT_DIR,name),out,"utf8");console.log("Generated",name);}