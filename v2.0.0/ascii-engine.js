var AsciiEngine=function(e){"use strict";var t;e.Resolution=void 0,(t=e.Resolution||(e.Resolution={}))[t.Low=1]="Low",t[t.MediumLow=2]="MediumLow",t[t.Medium=3]="Medium",t[t.MediumHigh=4]="MediumHigh",t[t.High=5]="High",t[t.VeryHigh=6]="VeryHigh",t[t.Ultra=7]="Ultra",t[t.UltraHigh=8]="UltraHigh",t[t.Extreme=9]="Extreme",t[t.Maximum=10]="Maximum";const n=" ",o=()=>{const e=document.createElement("span");return e.style.display="block",e.style.fontFamily="monospace",e.style.userSelect="none",e.style.overflow="hidden",e.innerHTML=n,e},r=e=>{const{cellHeight:t}=e,r=o();return r.style.height=`${t}px`,r.style.fontSize=`${t}px`,r.style.lineHeight=`${t}px`,r.innerHTML=n,r},i=(e,t)=>{const{height:r,width:i}=e.getBoundingClientRect(),s=o();s.style.visibility="hidden",s.style.display="inline",s.innerHTML=n,e.appendChild(s);const{height:l}=s.getBoundingClientRect();e.removeChild(s);const c=.05*t,a=Math.floor(l/c),h=.6*a;return{rows:(r>0?Math.floor(r/a):0)+1,cols:(i>0?Math.floor(i/h):0)+1,cellHeight:a,cellWidth:h}},s=(e,t)=>{const n={x:0,y:0,col:0,row:0,pressed:!1};return((e,t,n)=>{const o=e.getBoundingClientRect();e.addEventListener("pointermove",(e=>{e instanceof PointerEvent&&(n.x=e.x-o.left,n.y=e.y-o.top,n.col=Math.floor(n.x/t.cellWidth),n.row=Math.floor(n.y/t.cellHeight))})),e.addEventListener("pointerdown",(e=>{e instanceof PointerEvent&&(n.pressed=!0)})),e.addEventListener("pointerup",(e=>{e instanceof PointerEvent&&(n.pressed=!1)}))})(e,t,n),n},l=(e,t)=>{e.innerHTML="";for(let n=0;n<t.rows;n++)e.appendChild(r(t))},c=(e,t)=>{const n=i(e,t.resolution),o={rows:n.rows,cols:n.cols,cellWidth:n.cellWidth,cellHeight:n.cellHeight,frame:0,deltaTime:0,elapsedTime:0,options:t};return((e,t,n)=>{window.addEventListener("resize",(()=>{const o=i(e,n.resolution);t.rows=o.rows,t.cols=o.cols,t.cellWidth=o.cellWidth,t.cellHeight=o.cellHeight,l(e,t)}))})(e,o,t),o},a=(e,t)=>e.children[t],h=(e,t,o,r)=>{let i=0;const s=[];requestAnimationFrame((function l(c){t.deltaTime=(c-i)/1e3,t.elapsedTime+=t.deltaTime,i=c;for(let e=0;e<t.rows;e++)s[e]||(s[e]=Array(t.cols).fill(null));for(let e=0;e<t.rows;e++)for(let i=0;i<t.cols;i++){const l=o({x:i,y:e},t,s,r);s[e][i]=l&&" "!==l?l:n}((e,t,n)=>{for(let o=0;o<t.rows;o++){const t=a(e,o);if(!t)continue;const r=[];n[o].forEach(((e,t)=>{r[t]=e})),t.innerHTML=r.join("")}})(e,t,[...s]),s.length=0,t.frame++,requestAnimationFrame(l)}))},y=[{x:-1,y:-1,z:-1},{x:1,y:-1,z:-1},{x:1,y:1,z:-1},{x:-1,y:1,z:-1},{x:-1,y:-1,z:1},{x:1,y:-1,z:1},{x:1,y:1,z:1},{x:-1,y:1,z:1}],d=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],u=[" ","░","▒","▓","█"],x=[{x:-1,y:-1,z:-1},{x:1,y:-1,z:-1},{x:1,y:1,z:-1},{x:-1,y:1,z:-1},{x:-1,y:-1,z:1},{x:1,y:-1,z:1},{x:1,y:1,z:1},{x:-1,y:1,z:1}],M=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];let m=0,g=0,z=0,f=0;return e.Cube=(e,t,n,o)=>{const r=.5*t.elapsedTime,i=y.map((e=>{const n=((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x,y:e.y*n-e.z*o,z:e.y*o+e.z*n}})(((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x*n+e.z*o,y:e.y,z:-e.x*o+e.z*n}})(e,r),r);return((e,t)=>{const n=300/(e.z+45);return{x:Math.round(e.x*n+t.cols/2),y:Math.round(e.y*n+t.rows/2)}})(n,t)}));return d.forEach((([e,t])=>{const{x:o,y:r}=i[e],{x:s,y:l}=i[t];((e,t,n,o,r)=>{const i=Math.abs(o-t),s=Math.abs(r-n),l=t<o?1:-1,c=n<r?1:-1;let a=i-s;for(;t>=0&&t<e[0].length&&n>=0&&n<e.length&&(e[n][t]="*"),t!==o||n!==r;){const e=2*a;e>-s&&(a-=s,t+=l),e<i&&(a+=i,n+=c)}})(n,o,r,s,l)})),n[e.y][e.x]||" "},e.CubeInput=(e,t,n,o)=>{if(o.pressed){const e=o.x-z,t=o.y-f;m+=.01*t,g+=.01*e}z=o.x,f=o.y;const r=x.map((e=>((e,t)=>{const n=300/(e.z+45);return{x:Math.round(e.x*n+t.cols/2),y:Math.round(e.y*n+t.rows/2)}})(((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x,y:e.y*n-e.z*o,z:e.y*o+e.z*n}})(((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x*n+e.z*o,y:e.y,z:-e.x*o+e.z*n}})(e,g),m),t)));return M.forEach((([e,t])=>{const{x:o,y:i}=r[e],{x:s,y:l}=r[t];((e,t,n,o,r)=>{const i=Math.abs(o-t),s=Math.abs(r-n),l=t<o?1:-1,c=n<r?1:-1;let a=i-s;for(;t>=0&&t<e[0].length&&n>=0&&n<e.length&&(e[n][t]="*"),t!==o||n!==r;){const e=2*a;e>-s&&(a-=s,t+=l),e<i&&(a+=i,n+=c)}})(n,o,i,s,l)})),n[e.y][e.x]||" "},e.Static=()=>u[Math.floor(Math.random()*u.length)],e.render=(t,n,o={resolution:e.Resolution.Maximum})=>{if(!t)throw new Error("Target element cannot be null");const r=c(t,o);l(t,r);const i=s(t,r);h(t,r,n,i)},e}({});