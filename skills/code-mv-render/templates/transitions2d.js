/* ============================================================
   code-mv-render / templates/transitions2d.js
   Canvas 2D 版入场转场库（上游 15 种 WebGL 转场的 2D 移植）

   用法（经典脚本，file:// 可直接打开）：
     <script src="transitions2d.js"></script>
     MVTransitions.paintTransition(ctx, {
       type:'scan', k:0.5, w:1920, h:1080, dir:0, edge:'#E2542C'
     }, drawA, drawB);

   drawA / drawB 各画一层，函数签名 (ctx)，坐标系为 w×h。
   k = 0 完全 A，k = 1 完全 B；建议只在转场重叠的 0.3–0.6s 内调用。
   类型：cut fade glitch scan circle diag grid zoom shatter dissolve
        winclose winpop push slices flashcut
   ============================================================ */
(function(global){
  const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  const easeInOut = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;
  const easeOut = t => 1 - Math.pow(1-t,3);
  const smoothstep = t => { t = clamp01(t); return t*t*(3-2*t); };
  function h21(x,y){
    let n = Math.sin(x*127.1 + y*311.7) * 43758.5453;
    return n - Math.floor(n);
  }

  const TYPES = ['cut','fade','glitch','scan','circle','diag','grid','zoom','shatter',
    'dissolve','winclose','winpop','push','slices','flashcut'];

  const layers = new Map();
  function getLayers(w,h){
    const key = w+'x'+h;
    if(!layers.has(key)){
      const a = document.createElement('canvas'); a.width = w; a.height = h;
      const b = document.createElement('canvas'); b.width = w; b.height = h;
      layers.set(key, { a, b, actx:a.getContext('2d'), bctx:b.getContext('2d') });
    }
    return layers.get(key);
  }

  function blit(ctx, layer, w, h, dx=0, dy=0, sx=1, sy=1, ax=w/2, ay=h/2){
    ctx.save();
    ctx.translate(ax+dx, ay+dy); ctx.scale(sx,sy);
    ctx.drawImage(layer, -ax, -ay, w, h);
    ctx.restore();
  }

  function edgeLine(ctx, type, k, o, w, h){
    const edge = o.edge || '#E2542C';
    ctx.save();
    ctx.strokeStyle = edge; ctx.fillStyle = edge;
    ctx.globalAlpha = (o.edgeAlpha ?? .85) * Math.sin(Math.PI*clamp01(k));
    ctx.shadowColor = edge; ctx.shadowBlur = 18;
    if(type === 'scan'){
      const dir = o.dir || 0;
      ctx.lineWidth = 2;
      ctx.beginPath();
      if(dir === 0){ ctx.moveTo(0,h*k); ctx.lineTo(w,h*k); }
      else if(dir === 1){ ctx.moveTo(0,h*(1-k)); ctx.lineTo(w,h*(1-k)); }
      else if(dir === 2){ ctx.moveTo(w*k,0); ctx.lineTo(w*k,h); }
      else { ctx.moveTo(w*(1-k),0); ctx.lineTo(w*(1-k),h); }
      ctx.stroke();
    } else if(type === 'circle'){
      const R = Math.max(w,h) * .62 * (o.inverse ? 1-k : k);
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc((o.x??.5)*w, (o.y??.5)*h, R, 0, 6.283); ctx.stroke();
    } else if(type === 'winpop' || type === 'winclose'){
      let cw, ch;
      if(type === 'winpop'){ const e = Math.max(smoothstep(k), .004); cw = w*e; ch = h*e; }
      else {
        const e = Math.max(1-smoothstep(clamp01(k/.55)), .006);
        const sy = Math.max(1-smoothstep(clamp01((k-.55)/.45)), .006);
        cw = w*e; ch = h*sy;
      }
      ctx.lineWidth = 2;
      ctx.strokeRect((w-cw)/2, (h-ch)/2, cw, ch);
    }
    ctx.restore();
  }

  function paintTransition(ctx, o, drawA, drawB){
    const w = o.w || ctx.canvas.width, h = o.h || ctx.canvas.height;
    const type = o.type || 'cut';
    const k = clamp01(o.k);
    if(type === 'cut' || !TYPES.includes(type)){
      (k < .5 ? drawA : drawB)(ctx);
      return;
    }

    const L = getLayers(w,h);
    L.actx.setTransform(1,0,0,1,0,0); L.actx.clearRect(0,0,w,h);
    L.bctx.setTransform(1,0,0,1,0,0); L.bctx.clearRect(0,0,w,h);
    drawA(L.actx); drawB(L.bctx);
    const A = L.a, B = L.b;

    ctx.save();
    ctx.setTransform(1,0,0,1,0,0);

    if(type === 'fade'){
      const e = easeInOut(k);
      ctx.drawImage(A,0,0);
      ctx.globalAlpha = e; ctx.drawImage(B,0,0);
    }

    else if(type === 'scan'){
      const dir = o.dir || 0;
      ctx.drawImage(A,0,0);
      ctx.save();
      ctx.beginPath();
      if(dir === 0) ctx.rect(0,0,w,h*k);
      else if(dir === 1) ctx.rect(0,h*(1-k),w,h*k);
      else if(dir === 2) ctx.rect(0,0,w*k,h);
      else ctx.rect(w*(1-k),0,w*k,h);
      ctx.clip(); ctx.drawImage(B,0,0); ctx.restore();
      edgeLine(ctx,'scan',k,o,w,h);
    }

    else if(type === 'circle'){
      const cx=(o.x??.5)*w, cy=(o.y??.5)*h;
      const R = Math.max(w,h) * .62;
      ctx.drawImage(o.inverse ? B : A, 0, 0);
      ctx.save();
      const r = (o.inverse ? 1-k : k) * R;
      ctx.beginPath(); ctx.arc(cx,cy,Math.max(r,.01),0,6.283); ctx.clip();
      ctx.drawImage(o.inverse ? A : B, 0, 0);
      ctx.restore();
      edgeLine(ctx,'circle',k,o,w,h);
    }

    else if(type === 'push'){
      const dir = o.dir || 0;
      const e = easeInOut(k);
      if(dir === 0){ blit(ctx,A,w,h,-w*e,0); blit(ctx,B,w,h,w*(1-e),0); }
      else if(dir === 1){ blit(ctx,A,w,h,w*e,0); blit(ctx,B,w,h,-w*(1-e),0); }
      else if(dir === 2){ blit(ctx,A,w,h,0,-h*e); blit(ctx,B,w,h,0,h*(1-e)); }
      else { blit(ctx,A,w,h,0,h*e); blit(ctx,B,w,h,0,-h*(1-e)); }
    }

    else if(type === 'slices'){
      const bands = o.bands || 10, bh = h/bands;
      ctx.drawImage(B,0,0);
      for(let i=0;i<bands;i++){
        const lk = easeOut(clamp01(k*1.5 - h21(i,1)*.5));
        const dirn = (i%2===0) ? -1 : 1;
        const off = dirn * lk*lk * w*1.15;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, i*bh, w, bh+.5); ctx.clip();
        ctx.drawImage(A, off, 0, w, h);
        ctx.restore();
      }
    }

    else if(type === 'diag'){
      const slats = 18, aw = w*1.78, total = aw + h*.8;
      ctx.drawImage(A,0,0);
      ctx.save(); ctx.beginPath();
      for(let i=0;i<slats;i++){
        const p0 = i/slats, p1 = (i+1)/slats;
        const th = p0*.72 + ((p0*16)%1)*.28;
        if(th > k*1.04-.02) continue;
        const x0 = p0*total, x1 = p1*total;
        ctx.moveTo(x0, 0); ctx.lineTo(x1, 0);
        ctx.lineTo(x1 - h*.8, h); ctx.lineTo(x0 - h*.8, h);
        ctx.closePath();
      }
      ctx.clip(); ctx.drawImage(B,0,0); ctx.restore();
      ctx.save(); ctx.strokeStyle=o.edge||'#E2542C'; ctx.globalAlpha=.35*Math.sin(Math.PI*k);
      ctx.lineWidth=2; ctx.beginPath();
      for(let i=0;i<slats;i+=2){
        const p0=i/slats, x=p0*total;
        ctx.moveTo(x,0); ctx.lineTo(x-h*.8,h);
      }
      ctx.stroke(); ctx.restore();
    }

    else if(type === 'grid'){
      const nx = 16, ny = 9, cw = w/nx, ch = h/ny;
      ctx.drawImage(A,0,0);
      for(let y=0;y<ny;y++) for(let x=0;x<nx;x++){
        const order = (x/nx + y/ny)*.325 + h21(x,y)*.35;
        const lk = easeOut(clamp01((k - order*.8)/.2));
        if(lk <= 0) continue;
        const cx = x*cw + cw/2, cy = y*ch + ch/2;
        const s = 1 + .14*(1-lk);
        ctx.save();
        ctx.beginPath(); ctx.rect(x*cw, y*ch, cw+.5, ch+.5); ctx.clip();
        ctx.translate(cx,cy); ctx.scale(s,s);
        ctx.drawImage(B, -cx, -cy, w, h);
        ctx.restore();
        ctx.save(); ctx.globalAlpha = (1-lk)*.5; ctx.strokeStyle = o.edge||'#E2542C';
        ctx.lineWidth = 1; ctx.strokeRect(x*cw+.5, y*ch+.5, cw-1, ch-1); ctx.restore();
      }
    }

    else if(type === 'dissolve'){
      const nx = 96, ny = 54, cw = w/nx, ch = h/ny;
      ctx.drawImage(A,0,0);
      for(let y=0;y<ny;y++) for(let x=0;x<nx;x++){
        if(h21(x,y) < k*1.1-.05){
          ctx.drawImage(B, x*cw, y*ch, cw+.6, ch+.6, x*cw, y*ch, cw+.6, ch+.6);
        }
      }
    }

    else if(type === 'winpop'){
      ctx.save(); ctx.globalAlpha = 1-.6*k; ctx.drawImage(A,0,0); ctx.restore();
      const e = Math.max(smoothstep(k), .004);
      const cw = w*e, ch = h*e;
      ctx.save();
      ctx.beginPath(); ctx.rect((w-cw)/2,(h-ch)/2,cw,ch); ctx.clip();
      ctx.drawImage(B,(w-cw)/2,(h-ch)/2,cw,ch);
      ctx.restore();
      edgeLine(ctx,'winpop',k,o,w,h);
    }

    else if(type === 'winclose'){
      ctx.drawImage(B,0,0);
      const k1 = smoothstep(clamp01(k/.55)), k2 = smoothstep(clamp01((k-.55)/.45));
      const e = Math.max(1-k1, .006), sy = Math.max(1-k2, .006);
      const cw = w*e, ch = h*sy;
      ctx.save();
      ctx.beginPath(); ctx.rect((w-cw)/2,(h-ch)/2,cw,ch); ctx.clip();
      ctx.drawImage(A,(w-cw)/2,(h-ch)/2,cw,ch);
      ctx.restore();
      edgeLine(ctx,'winclose',k,o,w,h);
    }

    else if(type === 'zoom'){
      const e = easeInOut(k);
      ctx.save(); ctx.globalAlpha = 1-e; blit(ctx,A,w,h,0,0,1+e*e*4,1+e*e*4); ctx.restore();
      ctx.save(); ctx.globalAlpha = e; blit(ctx,B,w,h,0,0,1.35-.35*easeOut(k),1.35-.35*easeOut(k)); ctx.restore();
      ctx.save(); ctx.globalAlpha = .06*Math.sin(Math.PI*k); ctx.fillStyle = o.edge||'#E2542C';
      ctx.fillRect(0,0,w,h); ctx.restore();
    }

    else if(type === 'glitch'){
      ctx.drawImage(B,0,0);
      const bands = 22, bh = h/bands;
      for(let i=0;i<bands;i++){
        const hb = h21(i, Math.floor(k*8));
        const on = h21(i,7) >= k*1.15-.05;
        if(!on) continue;
        const off = (h21(i,3)-.5)*w*.06*(1-k);
        ctx.save();
        ctx.beginPath(); ctx.rect(0,i*bh,w,bh+.5); ctx.clip();
        ctx.drawImage(A, off, 0, w, h);
        ctx.restore();
        if(hb > .86){
          ctx.save(); ctx.globalAlpha=.55; ctx.fillStyle=o.edge||'#E2542C';
          ctx.fillRect(0,i*bh,w,1); ctx.restore();
        }
      }
    }

    else if(type === 'shatter'){
      const nx = 9, ny = 5, cw = w/nx, ch = h/ny;
      ctx.drawImage(A,0,0);
      for(let y=0;y<ny;y++) for(let x=0;x<nx;x++) for(let t=0;t<2;t++){
        const id = x*37 + y*91 + t*13;
        const lk = clamp01(k*1.5 - h21(id,5)*.5);
        if(lk >= 1) continue;
        const ox = (h21(id,1)-.5)*.25*w*lk*lk;
        const oy = (h21(id,3)*.9+.1)*.35*h*lk*lk;
        const x0 = x*cw, y0 = y*ch;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.beginPath();
        if(t===0){ ctx.moveTo(x0,y0); ctx.lineTo(x0+cw,y0); ctx.lineTo(x0,y0+ch); }
        else { ctx.moveTo(x0+cw,y0); ctx.lineTo(x0+cw,y0+ch); ctx.lineTo(x0,y0+ch); }
        ctx.closePath(); ctx.clip();
        ctx.globalAlpha = 1-lk*.3;
        ctx.drawImage(B, x0, y0, cw, ch, x0, y0, cw, ch);
        ctx.restore();
      }
    }

    else if(type === 'flashcut'){
      ctx.drawImage(k < .5 ? A : B, 0, 0);
      const edge = o.edge || '#E9E1D0';
      ctx.save();
      ctx.globalAlpha = Math.pow(1 - Math.abs(2*k-1), 1.5) * (o.strength ?? .85);
      ctx.fillStyle = edge; ctx.fillRect(0,0,w,h);
      ctx.restore();
    }

    ctx.restore();
  }

  global.MVTransitions = { paintTransition, TYPES, easeInOut, easeOut };
})(window);
