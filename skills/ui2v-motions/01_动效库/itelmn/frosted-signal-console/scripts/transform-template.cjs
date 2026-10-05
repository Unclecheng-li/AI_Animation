const fs = require('fs');
const path = 'index.html';
let s = fs.readFileSync(path, 'utf8');
const factor = 0.5;
s = s.replace(/data-(start|duration)="([0-9]+(?:\.[0-9]+)?)"/g, (m, key, value) => {
  const v = (Math.round(Number(value) * factor * 1000) / 1000).toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  return `data-${key}="${v}"`;
});
const replacements = [
  ['UI2V / Scatterbrain', 'SIGNAL CONSOLE / TEMPLATE'],
  ['UI2V / ASSET VIEW', 'ASSET / PLACEHOLDER'],
  ['PROJECT SHARE / 08·16', 'PROJECT SHARE / YOUR DATE'],
  ['UI2V 是什么？', '你的内容是什么？'],
  ['UI2V', 'YOUR SYSTEM'],
  ['HyperFrames', '[工具 A]'],
  ['不是再交付一个孤零零的 demo，而是把它变成可以被找到、被使用的资产。', '不是交付一个孤零零的 demo，而是把它变成可以被找到、被使用的资产。'],
  ['从截图，变成动画资产', '从素材，变成可复用资产'],
  ['整理、展示、搜索、安装、更新。让动画流通起来。', '整理、展示、搜索、安装、更新。让内容流通起来。'],
  ['UI2V 补上 HyperFrames 工作流里缺的那一环。', '[工具 A] 补上 [工具 B] 工作流里缺的那一环。'],
  ['UI2V × HyperFrames', '[工具 A] × [工具 B]'],
  ['动画不止被交付，', '内容不止被交付，']
];
for (const [from, to] of replacements) s = s.split(from).join(to);
s = s.replace('<html lang="zh-CN">', '<html lang="zh-CN" data-composition-variables=\'[ {"id":"projectLabel","type":"string","label":"Project label","default":"PROJECT / YOUR DATE"} ]\'>');
fs.writeFileSync(path, s);
