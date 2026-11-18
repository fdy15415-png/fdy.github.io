const canvas=document.querySelector('canvas'),g=canvas.getContext('2d'),button=document.querySelector('#act'),dialog=document.querySelector('dialog');
const names='薪有所涨 钱袋有底 开门迎财 荷包有余 小钱成串 闲里有钱 财路常通 准时到账 甜头在后 今朝有喜 慢慢也成 百搭不愁 耳根清净 电量满格 烦恼退潮 准点下课 喜讯先到 到点收工 好梦自来 福寿绵长 安心到家'.split(' ');
let phase,start,attempt,hits,lockedX,success,reward=-1;
function coin(x,y,r){
 g.save();g.translate(x,y);const path=new Path2D();path.arc(0,0,r,0,2*Math.PI);path.rect(-r*.23,-r*.23,r*.46,r*.46);
 const metal=g.createLinearGradient(-r,-r,r,r);metal.addColorStop(0,'#f1d58c');metal.addColorStop(.52,'#be8c42');metal.addColorStop(1,'#856031');g.fillStyle=metal;g.fill(path,'evenodd');g.strokeStyle='#594026';g.lineWidth=2;g.stroke(path);
 g.beginPath();g.arc(0,0,r*.87,0,Math.PI*2);g.stroke();
 g.fillStyle='#573e24';g.textAlign='center';g.textBaseline='middle';g.font='bold '+r*.43+'px KaiTi,serif';
 for(const [ch,dx,dy] of [['通',0,-.56],['宝',0,.58],['好',-.58,0],['彩',.58,0]])g.fillText(ch,r*dx,r*dy);
 g.restore();
}
function xAt(t){return 210+123*Math.sin((t-start)*(.00165+attempt*.00017)+1.1);}
function draw(t){
 const w=canvas.clientWidth,h=canvas.clientHeight,d=Math.min(devicePixelRatio,2);
 if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d)}
 const scale=Math.min(w/420,h/360)*d;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,canvas.width,canvas.height);g.setTransform(scale,0,0,scale,(canvas.width-420*scale)/2,(canvas.height-360*scale)/2);
 g.strokeStyle='#d9bd7a55';g.lineWidth=1;g.strokeRect(9,9,402,342);
 const progress=phase==='moving'?Math.min(1,(t-start)/650):0;
 const tip=198+(success&&phase==='moving'?56*Math.sin(progress*Math.PI):0);
 g.beginPath();g.moveTo(210,10);g.bezierCurveTo(207,50,213,87,210,tip);g.strokeStyle='#461f19';g.lineWidth=6;g.stroke();g.strokeStyle='#e05f43';g.lineWidth=3;g.stroke();
 for(let i=0;i<hits;i++)coin(210,50+i*51,34);
 if(phase==='aim')coin(xAt(t),250,52);
 if(phase==='moving'){
   const k=progress*progress*(3-2*progress);
   if(success)coin(lockedX+(210-lockedX)*k,250+(50+hits*51-250)*k,52-18*k);
   else{g.globalAlpha=1-k;coin(lockedX,250+100*k,52);g.globalAlpha=1}
   if(progress===1)settle(t);
 }
 requestAnimationFrame(draw);
}
function hud(){document.querySelector('#count').textContent='已穿 '+hits+' 枚 · 余 '+(3-attempt)+' 枚'}
function restart(){dialog.close();hits=attempt=0;phase='aim';start=performance.now();button.disabled=false;button.textContent='穿这一枚';document.querySelector('#note').textContent='看红绳尖和方孔的位置。';hud()}
function settle(t){if(success)hits++;attempt++;hud();button.disabled=false;const note=document.querySelector('#note');
 if(hits>=2){phase='won';reward=(reward+1+Math.floor(Math.random()*(reward<0?21:20)))%21;button.textContent='看我的甲马';note.textContent='两枚成串，好彩到手。';reveal()}
 else if(attempt===3){phase='lost';button.textContent='再试一把';note.textContent='手感慢慢来，下一串等着你。'}
 else{phase='aim';start=t;note.textContent=success?'穿中了！再接一枚。':'擦过孔边了，下一枚看准再穿。'}
}
function reveal(){const img=document.querySelector('#card'),save=document.querySelector('#save');img.src=newPrints[reward];img.alt=names[reward];save.href=img.src;save.download=names[reward]+'.webp';dialog.showModal()}
function shoot(){if(phase!=='aim')return;const t=performance.now();lockedX=xAt(t);success=Math.abs(lockedX-210)<=52*.23;phase='moving';start=t;button.disabled=true;}
button.onclick=()=>phase==='lost'?restart():phase==='won'?reveal():shoot();canvas.onclick=shoot;document.querySelector('#again').onclick=restart;
window.addEventListener('keydown',e=>{if(e.code==='Space'&&phase==='aim'&&!dialog.open){e.preventDefault();if(!e.repeat)shoot()}});
restart();requestAnimationFrame(draw);

document.querySelectorAll('.leave').forEach(btn => btn.onclick = () => {
  if (window.parent !== window) window.parent.postMessage('return-to-village', '*');
  else location.href = '../index.html';
});