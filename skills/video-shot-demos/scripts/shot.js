#!/usr/bin/env node
/* 分镜页无头截图质检：利用虚拟时钟"快进"到任意毫秒截取静态帧。
   原理：把 startReal 回拨 target，使所有 <=target 的 cue 在首帧一次性到位；
   再注入 0s transition 的 CSS 让过渡直接定格，用 2px 抖动块泵住 rAF 产出新帧。
   用法:
     node shot.js <页面.html> <目标毫秒> <输出.png> [fx fy scale | raw tx ty scale]
   示例:
     node shot.js shot-2-5.html 26000 _t26s.png                  # 26s 处
     node shot.js shot-2-5.html 26000 _t26s.png 960 540 1.2      # 26s + 相机锁定推近
     node shot.js shot-2-5.html 26000 _t26s.png raw 0 -80 1.3    # 26s + 相机原始 transform
   找不到浏览器时设环境变量 BROWSER_PATH 指定 chrome/edge 可执行文件。 */
const fs=require('fs'),path=require('path'),{execSync}=require('child_process');

const[, ,file,targetMs,out,fx,fy,sc]=process.argv;
if(!file||!targetMs||!out){console.error('用法: node shot.js <页面.html> <目标毫秒> <输出.png> [fx fy scale | raw tx ty scale]');process.exit(1)}
const target=+targetMs;

function findBrowser(){
  const cands=[];
  if(process.env.BROWSER_PATH)cands.push(process.env.BROWSER_PATH);
  if(process.platform==='win32'){
    cands.push(
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe');
  }else if(process.platform==='darwin'){
    cands.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      '/Applications/Chromium.app/Contents/MacOS/Chromium');
  }else{
    cands.push('/usr/bin/google-chrome','/usr/bin/chromium-browser','/usr/bin/chromium','/usr/bin/microsoft-edge');
  }
  for(const c of cands){try{if(c&&fs.existsSync(c))return c}catch(e){}}
  return null;
}
const browser=findBrowser();
if(!browser){console.error('✗ 未找到 Chrome/Edge，请设置环境变量 BROWSER_PATH');process.exit(1)}

let camCss='';
if(fx==='raw'){
  camCss=`var cam=document.getElementById('cam');if(cam){cam.style.transition='none';cam.style.transform='translate(${fy}px,${sc}px) scale(${process.argv[8]})';}`;
}else if(fx!==undefined){
  const s=+sc;let tx=960-(+fx)*s,ty=540-(+fy)*s;
  tx=Math.min(0,Math.max(1920-1920*s,tx));ty=Math.min(0,Math.max(1080-1080*s,ty));
  camCss=`var cam=document.getElementById('cam');if(cam){cam.style.transition='none';cam.style.transform='translate(${tx}px,${ty}px) scale(${s})';}`;
}

const dir=process.cwd();
const inject=`<script>addEventListener("load",function(){setTimeout(function(){
var z=document.getElementById('introZ');if(z)z.style.display='none';
var go=function(){
  var st=document.createElement('style');st.textContent='*{transition-duration:0s!important;transition-delay:0s!important;animation-duration:0s!important;animation-delay:0s!important}';
  document.head.appendChild(st);window.__startPlayback();
  /* 冻结时间轴后视觉静止会让无头浏览器停产帧：2px 隐形抖动块泵住 rAF，保证过渡定格后有新帧可截 */
  var dz=document.createElement('div');dz.style.cssText='position:fixed;left:0;top:0;width:2px;height:2px;background:rgba(0,0,0,.01);z-index:2147483647;pointer-events:none';
  document.body.appendChild(dz);var px=0;(function pump(){px=px?0:1;dz.style.left=px+'px';requestAnimationFrame(pump)})();
  setTimeout(function(){${camCss}},350)};
if(document.fonts&&document.fonts.ready){document.fonts.ready.then(go)}else{go()}
},30)});</`+'script>';

let src=fs.readFileSync(path.resolve(file),'utf8');
if(!src.includes('__startPlayback')){console.error('✗ 页面不含虚拟时钟底盘，无法快进');process.exit(1)}
src=src.replace('startReal=realPerf()','startReal=realPerf()-'+target);
src=src.replace('return started?(realPerf()-startReal):0','return started?'+target+':0');
const tmp=path.join(dir,'_shot_tmp_'+Date.now()+'.html');
fs.writeFileSync(tmp,src.replace('</body>',inject+'</body>'));

try{
  const budget=20000; /* 网络字体按真实耗时吞噬虚拟预算，留足余量等字体+泵帧走完 CSS 过渡 */
  execSync('"'+browser+'" --headless --disable-gpu --hide-scrollbars --screenshot="'+path.resolve(out)+'" --window-size=1920,1080 --virtual-time-budget='+budget+' "file:///'+tmp.replace(/\\/g,'/')+'"',{stdio:'pipe',timeout:120000});
  console.log('saved: '+out+(camCss?' (相机锁定 '+camCss.match(/translate\([^)]+\) scale\([^)]+\)/)[0]+')':' (时间轴快进 '+target+'ms)'));
}finally{try{fs.unlinkSync(tmp)}catch(e){}}
